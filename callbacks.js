function makeTable() {
    let text = '';
    let canvas = document.getElementById('myChart');
    let type = 'line';

    chartIt = new ChartIt('test.csv', 'Global Average Temperature', canvas, type);
    chart = chartIt.createChart();
    drawn = true;
    text = 'Below is the chart you want.';
    return text;
    
}

function makeAvg() {
    let text = "average";
    return text;
}

function makeMedian() {
    let text = "median";
    return text;
}

const states = {
    UNASKED: 0,
    ASKED: 1
}