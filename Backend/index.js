const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');
const cors = require('cors');

const client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
    socket: {
        connectTimeout: 10000
    }
});

client.on('error', (err) => {
    console.log("Redis Fehler: ", err);
})

client.connect().then(() => {
   console.log("Verbindung zum Redis Server aufgebaut!");
});

const app = express();
app.use(cors());

app.get('/api/data', async (req, res) => {
    try {
        console.log("Abfrage eingegangen! (/api/data)");
        const finalData = await getGeneralCovidData();
        res.json(finalData);
    } catch (error) {
        console.log("Fehler: ", error);
        res.status(500).send("Interner Serverfehler");
    }
});

app.get('/api/data/:limit', async (req, res) => {
    try {
        console.log("Abfrage eingegangen! (/api/data/:limit)");
        let limit = parseInt(req.params.limit);

        const generalData = await getGeneralCovidData();

        if(isNaN(limit) || limit <= 0 || (limit !== 7 && limit !== 30
            && limit !== 90 && limit !== 2020 && limit !== 2021 && limit !== 2022 && limit !== 2023 && limit !== 2024)) {
            res.json(generalData);
            return;
        }

        const filteredData = await filterData(generalData, limit);
        res.json(filteredData);
    } catch (error) {
        console.log("Fehler: ", error);
        res.status(500).send("Interner Serverfehler");
    }
});

app.get('/api/overall', async (req, res) => {
    try {
        console.log("Abfrage eingegangen! (/api/overall)");
        const cacheData = await client.get('data:overall');

        if (cacheData) {
            console.log("Daten von Redis Cache zurückgegeben! (api/overall)");
            res.json(JSON.parse(cacheData));
            return;
        }

        const generalDataResponse = await fetch('https://api.corona-zahlen.org/germany');
        const generalData = await generalDataResponse.json();

        const vaccinationResponse = await fetch('https://api.corona-zahlen.org/vaccinations/');
        const vaccinationData = await vaccinationResponse.json();

        const finalData =
            {cases: generalData.cases, deaths: generalData.deaths, recovered: generalData.recovered, vaccinations: vaccinationData.data.vaccinated}

        await client.set('data:overall', JSON.stringify(finalData), {EX: 3600 * 3});
        res.json(finalData);
        console.log("Anfrage ohne Cache verarbeitet! (api/overall)");
    } catch (error) {
        console.log("Fehler: ", error);
        res.status(500).send("Interner Serverfehler");
    }
});

app.listen(3000, () => {
    console.log("Server läuft");
});

async function getGeneralCovidData() {
    const cacheData = await client.get('data:all');

    if (cacheData) {
        console.log("Redis cache daten zurückgegeben");
        return JSON.parse(cacheData);
    }

    const casesResponse = await fetch('https://api.corona-zahlen.org/germany/history/cases');
    const casesData = await casesResponse.json();

    const incidenceResponse = await fetch('https://api.corona-zahlen.org/germany/history/incidence');
    const incidenceData = await incidenceResponse.json();

    const deathsResponse = await fetch('https://api.corona-zahlen.org/germany/history/deaths');
    const deathsData = await deathsResponse.json();

    const recoveredResponse = await fetch('https://api.corona-zahlen.org/germany/history/recovered');
    const recoveredData = await recoveredResponse.json();

    const vaccinationResponse = await fetch('https://api.corona-zahlen.org/vaccinations/history');
    const vaccinationData = await vaccinationResponse.json();

    const rValueResponse = await fetch('https://api.corona-zahlen.org/germany/history/rValue/');
    const rValueData = await rValueResponse.json();

    const finalData = formatData(casesData.data, incidenceData.data, deathsData.data, recoveredData.data, vaccinationData.data.history, rValueData.data);

    await client.set('data:all', JSON.stringify(finalData), {EX: 3600 * 3});

    return finalData;
}

function parseDateString(dateString) {
    const [day, month, year] = dateString.split('.');
    return new Date(`${year}-${month}-${day}T00:00:00Z`);
}

async function filterData(data, limit) {
    const cacheData = await client.get('data:' + limit);

    if (cacheData) {
        console.log("Redis cache daten zurückgegeben");
        return JSON.parse(cacheData);
    }

    let filteredData = [];

    if(limit === 7 || limit === 30 || limit === 90) {
        const currentDate = new Date();
        let targetDate = new Date();
        targetDate.setDate(currentDate.getDate() - limit);

        filteredData = data.filter(item => {
            const itemDate = parseDateString(item.date);
            return itemDate >= targetDate;
        });
    } else {
        filteredData = data.filter(item => {
           const itemDate = parseDateString(item.date);
           return itemDate.getFullYear() === limit;
        });
    }

    await client.set('data:' + limit, JSON.stringify(filteredData), {EX: 3600 * 3});

    return filteredData;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function getPlainObject(date) {
    return {date: date, cases: null, deaths: null, incidence: 0, recovered: null, vaccinations: 0, rvalue: 0.00};
}

function formatData(caseData, incidenceData, deathData, recoveredData, vaccinationData, rValueData) {
    const map = new Map();

    /* Cases */
    caseData.forEach(entries => {
        if (!map.has(entries.date)) {
            map.set(entries.date, getPlainObject(entries.date));
        }
        map.get(entries.date).cases = entries.cases;
    });

    /* incidences */
    incidenceData.forEach(entries => {
        if (!map.has(entries.date)) {
            map.set(entries.date, getPlainObject(entries.date));
        }
        map.get(entries.date).incidence = entries.weekIncidence;
    });

    /* Deaths */
    deathData.forEach(entries => {
        if (!map.has(entries.date)) {
            map.set(entries.date, getPlainObject(entries.date));
        }
        map.get(entries.date).deaths = entries.deaths;
    });

    /* Recovered */
    recoveredData.forEach(entries => {
        if (!map.has(entries.date)) {
            map.set(entries.date, getPlainObject(entries.date));
        }
        map.get(entries.date).recovered = entries.recovered;
    });

    /* Vaccinations */
    vaccinationData.forEach(entries => {
        if (!map.has(entries.date)) {
            map.set(entries.date, getPlainObject(entries.date));
        }
        //map.get(entries.date).vaccinations = entries.totalVacciantionOfTheDay;
        map.get(entries.date).vaccinations = entries.vaccinated;
    });

    /* rValue */
    rValueData.forEach(entries => {
        if (!map.has(entries.date)) {
            map.set(entries.date, getPlainObject(entries.date));
        }
        map.get(entries.date).rvalue = entries.rValue7Days;
    });

    /* Change date format */
    map.forEach((value, key) => {
        value.date = formatDate(value.date);
    });

    return Array.from(map.values());
}