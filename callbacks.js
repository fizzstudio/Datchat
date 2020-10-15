function makeTable() {
    let response = '';
    let canvas = document.getElementById('myChart');
    let type = 'line';

    visual = new Visual('test.csv', 'Global Average Temperature from 1880', canvas, type);
    visual.createChart();

    drawn = true;
    response = 'below is'// the data of ' + visual.getTitle();
    return response;
}

function makeAvg() {
    let response = "average";
    if (!drawn) {
        response = 'you need first to have a chart.';
    } else {
        response = 'the average of the data is ' + visual.mean.toFixed(2);
        visual.setMeanDataset(visual.mean);
        // visual.createChart();
    }
    return response;
}

function makeMedian() {
    let response = "median";
    if (!drawn) {
        response = 'you need first to have a chart.';
    } else {
        response = 'the median of the data is ' + visual.median.toFixed(2);
        visual.setMedianDataset(visual.median);
        // visual.createChart();
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