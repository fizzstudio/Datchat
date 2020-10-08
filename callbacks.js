function makeTable() {
    let response = '';
    let canvas = document.getElementById('myChart');
    let type = 'line';

    chartIt = new ChartIt('test.csv', 'Global Average Temperature', canvas, type);
    chart = chartIt.createChart();
    drawn = true;
    response = 'below is the chart you want.';
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
    let canvas = document.getElementById('myChart');
    canvas.style.visibility = "hidden";
    // let conresponse = canvas.getConresponse("2d");
    // conresponse.clearRect(0, 0, canvas.width, canvas.height);

    options.forEach((option) => {
        if (option.getState() != states.UNIFORM){
            option.resetState();
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