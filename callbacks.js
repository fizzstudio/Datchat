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
        // const average = arr => arr.reduce((sume, el) => sume + el, 0) / arr.length;
        // hist_responses = option.getAnswers();
        // if (hist_responses.length > 0) {
        //     if (answers[answers.length - 1].includes(chartIt.mean.toFixed(2))) {
        //         response = 'The average of the data is still ' + chartIt.mean.toFixed(2);
        //     };
        // } else {
        response = 'the average of the data is ' + chartIt.mean.toFixed(2);
        // }
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
        // answers = option.getAnswers();
        // if (answers.length > 0) {
        //     if (answers[answers.length - 1].includes(chartIt.median.toFixed(2).toString())) {
        //         speech.response = 'The median of the data is still ' + chartIt.median.toFixed(2);
        //     }
        // } else {
        response = 'the median of the data is ' + chartIt.median.toFixed(2);
        // }
        chartIt.setMedianDataset(chartIt.median);
        let chart_median = chartIt.createChart();
    }

    return response;
}

const states = {
    UNASKED: 0,
    ASKED: 1
}