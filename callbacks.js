function makeTable() {
    let option;
    let text = '';
    let canvas = document.getElementById('myChart');
    let type = 'line';

    chartIt = new ChartIt('test.csv', 'Global Average Temperature', canvas, type);
    chart = chartIt.createChart();
    drawn = true;
    text = 'Below is the chart you want.';
    option = updateState("chart");
    speakResponse(text);
}

function makeAvg() {
    let text = "average";
    speakResponse(text);
}

function makeMedian() {
    let text = "median";
    speakResponse(text);
}

const states = {
    UNASKED: 0,
    ASKED: 1
}