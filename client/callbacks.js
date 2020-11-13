
async function statAction(stat) {
    let response = '';

    if (stat == 'chart') {
        let canvas = document.getElementById('myChart').getContext('2d');
        let type = 'line';
        visual = new Visual('test.csv', 'Global Average Temperature from 1880', canvas, type);
        chart = await visual.createChart();
        drawn = true;
        response = 'below is the chart'//the data of' + visual.title;
    } else {
        if (!drawn) {
            response = 'you need first to have a chart.';
        } else {
            switch (stat) {
                case 'median':
                    let median = ss.median(visual.ys);
                    response = 'the median of the data is ' + median.toFixed(2);
                    await visual.drawStatistics('median', median);
                    break;
                case 'average':
                    let mean = ss.mean(visual.ys);
                    response = 'the average of the data is ' + mean.toFixed(2);
                    await visual.drawStatistics('mean', mean);
                    break;
                case 'std':
                    let std = ss.standardDeviation(visual.ys);
                    response = 'the standard deviation of the data is ' + std.toFixed(2);
                    break;
                case 'variance':
                    let variance = ss.variance(visual.ys);
                    response = 'the variance of the data is ' + variance.toFixed(2);
                    break;
                case 'max':
                    let max = ss.extent(visual.ys)[1];
                    response = 'the maximum of the data is ' + max.toFixed(2);
                    break;
                case 'min':
                    let min = ss.extent(visual.ys)[0];
                    response = 'the minimum of the data is ' + min.toFixed(2);
                    break;
                case 'range':
                    let range = ss.extent(visual.ys)[1] - ss.extent(visual.ys)[0];
                    response = 'the range of the data is ' + range.toFixed(2);
                    break;
                case 'trend':
                    let lg = ss.linearRegression(visual.pairs);
                    if (lg.m > 0) {
                        response = 'this data set has an overall increasing trend';
                    } else if (lg.m = 0) {
                        response = 'this data set remains stable';
                    } else {
                        response = 'this data set has an overall decreasing trend';
                    }
                    break;
                case 'restart':
                    refreshCanvas();
                    refreshState();
                    response = 'Ok, I just restarted myself';
                    drawn = false;
                    break;
            }
        }
    }
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