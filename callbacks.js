function makeTable() {
    let response = '';
    let canvas = document.getElementById('myChart');
    let type = 'line';

    chartIt = new ChartIt('test.csv', 'Global Average Temperature', canvas, type);
    chart = chartIt.createChart();
    drawn = true;
    response = 'Below is the chart you want.';
    return response;

}

function makeAvg() {
    let response = "average";
    if (!drawn) {
        response = 'You need first to have a chart.';
    } else {
        // const average = arr => arr.reduce((sume, el) => sume + el, 0) / arr.length;
        // hist_responses = option.getAnswers();
        // if (hist_responses.length > 0) {
        //     if (answers[answers.length - 1].includes(chartIt.mean.toFixed(2))) {
        //         response = 'The average of the data is still ' + chartIt.mean.toFixed(2);
        //     };
        // } else {
        response = 'The average of the data is ' + chartIt.mean.toFixed(2);
        // }
        chartIt.setMeanDataset(chartIt.mean);
        let chart_mean = chartIt.createChart();
    }
    return response;
}

function makeMedian() {
    let text = "median";
    return text;
}

const states = {
    UNASKED: 0,
    ASKED: 1
}