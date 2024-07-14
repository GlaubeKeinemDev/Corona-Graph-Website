{@html headerContent}
{@html bodyContent}
{@html footerContent}

<script>
    import { onMount } from 'svelte';
    import { createChart } from '$lib';
    import {headerContent} from "$lib/header.js";
    import {bodyContent} from "$lib/body.js";
    import {footerContent} from "$lib/footer.js";

    let chart;
    let selectedData = 'incidence';
    let selectedTime = '0';
    let selectedTimeValue = 'Komplett';
    let selectedName = 'Inzidenz'
    let selectedChartType = 'line'

    async function fetchData() {
        const response = await fetch('http://localhost:3000/api/data/' + selectedTime); // Ersetze durch deine API-URL
        return response.json();
    }

    async function fetchAllData() {
        const response = await fetch('http://localhost:3000/api/overall');
        return response.json();
    }

    async function generateCurrentChart() {
        if(chart !== undefined) {
            chart.destroy();
        }

        document.getElementById('currentInteractiveData').innerText = 'Aktuell: ' + selectedName + " - " + selectedTimeValue;

        const data = await fetchData();

        let point = 0;

        if(selectedTime > 0 && selectedTime < 90)
            point = 2;

        chart = await createChart('covidchart', selectedChartType, false, false, 'top', true, true, data.map(row => row.date), [
            {
                label: selectedName,
                data: data.map(row => row[selectedData]),
                borderColor: 'rgba(75, 192, 192, 0.7)',
                borderWidth: 2,
                pointRadius: point, // Disable points
                pointHoverRadius: 2, // Disable hover effect on points
            }
        ]);
    }

    onMount(async () => {
        const data = await fetchData();
        await createChart('vaccination_chart', 'line', false, true, 'right', true, true, data.map(row => row.date), [
            {
                label: 'Fallzahlen',
                data: data.map(row => row.cases),
                borderColor: 'rgba(0,119,119,0.7)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
            },
            {
                label: 'Impfzahlen',
                data: data.map(row => row.vaccinations),
                borderColor: 'rgba(255,0,0,0.7)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
            }
        ]);

        await generateCurrentChart();

        const overallData = await fetchAllData();
        await createChart('overall_chart', 'pie', false, true, 'top', false, false, ["Fälle", "Tode", "Genesen", "Impfungen"], [
            {
                label: 'Zahlen',
                data: [overallData.cases, overallData.deaths, overallData.recovered, overallData.vaccinations],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',  // Fälle
                    'rgba(54, 162, 235, 0.4)',  // Todesfälle
                    'rgba(75, 192, 192, 0.2)',  // Genesungen
                    'rgba(255, 206, 86, 0.2)'   // Geimpft
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',    // Fälle
                    'rgba(54, 162, 235, 1)',    // Todesfälle
                    'rgba(75, 192, 192, 1)',    // Genesungen
                    'rgba(255, 206, 86, 1)'     // Geimpft
                ],
                borderWidth: 1,
                hoverOffset: 4
            }
        ]);


        document.getElementById('data_select').addEventListener('change', function (e) {
            const selectedOption = this.options[this.selectedIndex];
            Array.from(this.options).forEach(option => {
                option.removeAttribute('selected');
            });
            selectedOption.setAttribute('selected', 'selected');
            selectedData = selectedOption.value;
            selectedName = selectedOption.getAttribute('data-name');
            generateCurrentChart();
            this.blur();
        });

        document.getElementById('timestamp_select').addEventListener('change', function (e) {
            const selectedOption = this.options[this.selectedIndex];
            Array.from(this.options).forEach(option => {
                option.removeAttribute('selected');
            });
            selectedOption.setAttribute('selected', 'selected');
            selectedTime = selectedOption.value;
            selectedTimeValue = selectedOption.innerText;
            generateCurrentChart();
            this.blur();
        });

        document.getElementById('chart_select').addEventListener('change', function (e) {
            const selectedOption = this.options[this.selectedIndex];
            Array.from(this.options).forEach(option => {
                option.removeAttribute('selected');
            });
            selectedOption.setAttribute('selected', 'selected');
            selectedChartType = selectedOption.value;
            generateCurrentChart();
            this.blur();
        });
    });
</script>