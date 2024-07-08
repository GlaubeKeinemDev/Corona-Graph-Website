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

    async function fetchData() {
        const response = await fetch('http://localhost:3000/api/data/' + selectedTime); // Ersetze durch deine API-URL
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

        chart = await createChart('covidchart', data.map(row => row.date), [
            {
                label: selectedName,
                data: data.map(row => row[selectedData]),
                borderColor: 'rgba(75, 192, 192, 0.7)',
                borderWidth: 2,
                pointRadius: point, // Disable points
                pointHoverRadius: point, // Disable hover effect on points
            }
        ]);
    }

    onMount(async () => {
        await generateCurrentChart();

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
    });
</script>