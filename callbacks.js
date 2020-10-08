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
    // option = updateState("average");
    if (!drawn) {
        text = 'You need first to have a chart.';
        // option.resetState(states.UNASKED);
    } else {
        // const average = arr => arr.reduce((sume, el) => sume + el, 0) / arr.length;
        answers = option.getAnswers();
        if (answers.length > 0) {
            if (answers[answers.length - 1].includes(chartIt.mean.toFixed(2))) {
                speech.text = 'The average of the data is still ' + chartIt.mean.toFixed(2);
            };
        } else {
            speech.text = 'The average of the data is ' + chartIt.mean.toFixed(2);
        }
        chartIt.setMeanDataset(chartIt.mean);
        let chart_mean = chartIt.createChart();
    }
    // console.log(option);
    // option.setAnswers(speech.text);
    speakResponse(text);
}

function makeMedian() {
    let text = "median";
    speakResponse(text);
}