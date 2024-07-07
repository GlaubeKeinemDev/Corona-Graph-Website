<select class="form-control" id="timestamp_select">
    <option disabled>Zeitraum</option>
    <option value="0" selected>Komplett</option>
    <option value="7">7 Tage</option>
    <option value="30">30 Tage</option>
    <option value="90">90 Tage</option>
    <option value="2024">2024</option>
    <option value="2023">2023</option>
    <option value="2022">2022</option>
    <option value="2021">2021</option>
    <option value="2020">2020</option>
</select>

<select class="form-control" id="data_select">
    <option disabled>Daten</option>
    <option value="incidence" data-name="Inzidenz" selected>Inzidenz</option>
    <option value="cases" data-name="Infektionen">Infektionen</option>
    <option value="recovered" data-name="Genesene">Genesene</option>
    <option value="deaths" data-name="Tode">Tode</option>
</select>

<script>
    import { onMount } from 'svelte';
    import { createChart } from '$lib';

    let chart;
    let selectedData = 'incidence';
    let selectedTime = '0';
    let selectedName = 'Inzidenz'

    async function fetchData() {
        console.log("1")
        const response = await fetch('http://localhost:3000/api/data'); // Ersetze durch deine API-URL
        return response.json();
    }

    async function generateCurrentChart() {
        if(chart !== undefined) {
            chart.remove();
        }

        const data = await fetchData();

        const formattedTimeData = [];

        chart = await createChart('covidchart', data.map(row => row.date), [
            {
                label: selectedName,
                data: formattedTimeData.map(row => row.selectedData),
                borderColor: 'rgba(75, 192, 192, 0.7)',
                borderWidth: 2,
                pointRadius: 0, // Disable points
                pointHoverRadius: 0 // Disable hover effect on points
            }
        ]);
    }

    onMount(async () => {
        console.log("2")
        generateCurrentChart();

        document.getElementById('data_select').addEventListener('change', function (e) {
            const selectedOption = this.options[this.selectedIndex];
            Array.from(this.options).forEach(option => {
                option.removeAttribute('selected');
            });
            selectedOption.setAttribute('selected', 'selected');
            selectedData = selectedOption.value;
            selectedName = selectedOption.getAttribute('data-name');
            generateCurrentChart();
        });
    });


</script>