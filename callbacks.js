
async function makeTable() {
    refreshCanvas();
    let response = '';
    let canvas = document.getElementById('myChart').getContext('2d');
    let type = 'line';

    visual = new Visual('test.csv', 'Global Average Temperature from 1880', canvas, type);
    chart = await visual.createChart();

    console.log('makeTable visual: ', visual.chart.data);

    drawn = true;
    response = 'below is '//the data of' + visual.title;
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
        // console.log('makeMedian: ', visual.stat_props.median);
        await visual.drawStatistics('median', median);
    }
    return response;
}

async function reportTrend() {
    let response = "";
    if (!drawn) {
        response = 'you need first to have a chart.';
    } else {
        response = 'the median of the data is ' + visual.stat_props.median.toFixed(2);
        console.log('makeMedian: ', visual.stat_props.median);
        await visual.drawStatistics('median');
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