const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');

const client = redis.createClient({
   url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});

client.on('error', (err) => {
   console.log("Redis Fehler: ", err);
})

client.connect().catch(console.error);

const app = express();

app.get('/api/data', async (req, res) => {
   try {
      const cacheData = await client.get('covid-data');

      if (cacheData) {
         console.log("Redis cache daten zurückgegeben");
         return res.json(JSON.parse(cacheData));
      }

      const casesResponse = await fetch('https://api.corona-zahlen.org/germany/history/cases');
      const casesData = await casesResponse.json();

      const incidenceResponse = await fetch('https://api.corona-zahlen.org/germany/history/incidence');
      const incidenceData = await incidenceResponse.json();

      const deathsResponse = await fetch('https://api.corona-zahlen.org/germany/history/deaths');
      const deathsData = await deathsResponse.json();

      const finalData = formatData(casesData.data, incidenceData.data, deathsData.data);

      await client.set('covid-data', JSON.stringify(finalData),  { EX: 3600 }); // Cache für 3 Stunden
      console.log("Daten abgerufen von API");
      res.json(finalData);
   } catch (error) {
      console.log("Fehler: ", error);
      res.status(500).send("Interner Serverfehler");
   }
});
app.listen(3000,  () => {
   console.log("Server läuft")
});

function formatData(caseData, incidenceData, deathData) {
   const map = new Map();

   /* Cases */
   caseData.forEach(entries => {
      if(!map.has(entries.date)) {
         map.set(entries.date, { date: entries.date, cases: null, deaths: null, incidence: 0});
      }
      console.log(entries);
      map.get(entries.date).cases = entries.cases;
   });

   /* incidences */
   incidenceData.forEach(entries => {
      if(!map.has(entries.date)) {
         map.set(entries.date, { date: entries.date, cases: null, deaths: null, incidence: 0});
      }
      map.get(entries.date).incidence = entries.weekIncidence;
   });

   /* Deaths */
   deathData.forEach(entries => {
      if(!map.has(entries.date)) {
         map.set(entries.date, { date: entries.date, cases: null, deaths: null, incidence: 0});
      }
      map.get(entries.date).deaths = entries.deaths;
   });

   return Array.from(map.values());
}