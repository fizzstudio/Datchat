
async function makeTable() {
    let response = '';
    let canvas = document.getElementById('myChart').getContext('2d');
    let type = 'line';

    visual = new Visual('test.csv', 'Global Average Temperature from 1880', canvas, type);
    chart = await visual.createChart();

    console.log('makeTable visual: ', visual.chart.data);

    drawn = true;
    response = 'below is the table'//the data of' + visual.title;
    return response;
}

async function reportAvg() {
    let response = "";
    if (!drawn) {
        response = 'you need first to have a chart.';
    } else {
        let mean = ss.mean(visual.ys);
        response = 'the average of the data is ' + mean.toFixed(2);
        await visual.drawStatistics('mean', mean);
    }
    return response;
}

async function reportMedian() {
    let response = "";
    if (!drawn) {
        response = 'you need first to have a chart.';
    } else {
        let median = ss.median(visual.ys);
        response = 'the median of the data is ' + median.toFixed(2);
        await visual.drawStatistics('median', median);
    }
    return response;
}

async function reportStd() {
    let response = "";
    if (!drawn) {
        response = 'you need first to have a chart.';
    } else {
        let std = ss.standardDeviation(visual.ys);
        response = 'the standard deviation of the data is ' + std.toFixed(2);
    }
    return response;
}

async function reportMax() {
    let response = "";
    if (!drawn) {
        response = 'you need first to have a chart.';
    } else {
        let max = ss.extent(visual.ys)[1];
        response = 'the maximum of the data is ' + max.toFixed(2);
    }
    return response;
}

async function reportMin() {

    let response = "";
    if (!drawn) {
        response = 'you need first to have a chart.';
    } else {
        let min = ss.extent(visual.ys)[0];
        response = 'the minimum of the data is ' + min.toFixed(2);
    }
    return response;
}

async function reportGlobalTrend() {
    let response = "";
    if (!drawn) {
        response = 'you need first to have a chart.';
    } else {
        let lg = ss.linearRegression(visual.pairs);
        if (lg.m > 0) {
            response = 'this data set has an overall increasing trend';
        } else if (lg.m = 0) {
            response = 'this data set remains stable';
        } else {
            response = 'this data set has an overall decreasing trend';
        }
    }
    return response;
}

function startover() {
    refreshCanvas();
    refreshState();
    response = 'Ok, I just restarted myself';
    drawn = false;
    return response;
}

function refreshCanvas() {
    let wrapper = document.getElementById('wrapper');
    let old_myChart = document.getElementById('myChart');
    let new_myChart = document.createElement('canvas');
    new_myChart.id = "myChart";

    wrapper.replaceChild(new_myChart, old_myChart);
}

function refreshState() {
    let date = new Date();
    let timestamp = date.getTime()
    options.forEach((option) => {
        if (option.getState() != states.UNIFORM) {
            option.resetState();
            option.addAnswerRecord("Data has been restarted", timestamp);
        }
    });
}

const states = {
    UNASKED: 0,
    ASKED: 1,
    UNIFORM: 2
}