export let bodyContent = `
<main class="container flex-column">
    <div class="w-100">
        <div class="row">
            <div class="col-6"></div>
            <div class="col-2">
                <select class="form-control" id="chart_select">
                    <option disabled>Grafik auswählen</option>
                    <option value="line" selected>Linie</option>
                    <option value="bar">Bar</option>
                    <option value="pie">Kuchen</option>
                    <option value="doughnut">Donut</option>
                    <option value="radar">Radar</option>
                    <option value="polarArea">PolarArea</option>
                </select>
            </div>
            <div class="col-2">
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
            </div>
            <div class="col-2">
                <select class="form-control" id="data_select">
                    <option disabled>Daten</option>
                    <option value="incidence" data-name="Inzidenz" selected>Inzidenz</option>
                    <option value="cases" data-name="Infektionen">Infektionen</option>
                    <option value="recovered" data-name="Genesene">Genesene</option>
                    <option value="deaths" data-name="Tode">Tode</option>
                    <option value="vaccinations" data-name="Impfzahlen">Impfzahlen</option>
                </select>
            </div>
        
            <div class="col-12">
                <span id="currentInteractiveData" class="my-5 d-flex justify-content-center"></span>
            </div>
                   
            <div class="col-12">
                <canvas id="covidchart"></canvas>
            </div>
            
            <div class="text-center mt-5 mb-3 col-12">
            <span>Vergleich Impfzahlen & Fallzahlen</span>
            </div>
            
            <div class="col-12">
            <canvas id="vaccination_chart"></canvas>
            </div>
            
            <div class="col-12">
            <canvas id="overall_chart"></canvas>
            </div>
        </div>
        
    </div>
</main>`;