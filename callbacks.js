function makeTable() {
    let response = '';
    let canvas = document.getElementById('myChart');
    let type = 'line';

    chartIt = new ChartIt('test.csv', 'Global Average Temperature from 1880', canvas, type);
    chart = chartIt.createChart();
    drawn = true;
    response = 'below is the data of ' + chartIt.getTitle();
    return response;
}

function makeAvg() {
    let response = "average";
    if (!drawn) {
        response = 'you need first to have a chart.';
    } else {
        response = 'the average of the data is ' + chartIt.mean.toFixed(2);
        chartIt.setMeanDataset(chartIt.mean);
        let chart_mean = chartIt.createChart();
    }
    return response;
}

function makeMedian() {
    let response = "median";
    if (!drawn) {
        response = 'you need first to have a chart.';
    } else {
        response = 'the median of the data is ' + chartIt.median.toFixed(2);
        chartIt.setMedianDataset(chartIt.median);
        let chart_median = chartIt.createChart();
    }

    return response;
}

function startover() {
    let wrapper = document.getElementById('wrapper');    
    let old_myChart = document.getElementById('myChart');
    let new_myChart = document.createElement('canvas');
    new_myChart.id = "myChart";

    wrapper.replaceChild(new_myChart, old_myChart);

    options.forEach((option) => {
        if (option.getState() != states.UNIFORM){
            option.resetState();
            option.addAnswer("Data has been restarted");
        }
    });
    response = 'Ok, I just restarted myself';
    drawn = false;
    return response;
}

const states = {
    UNASKED: 0,
    ASKED: 1,
    UNIFORM: 2
}