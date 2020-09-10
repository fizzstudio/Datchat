let createChart = function (datasets, labels, title, ctx) {

    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: datasets,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
                fill: false
            }]
        },
    })
    return myChart;
};

let getMedian = function (array) {
    array.sort((a, b) => a - b);
    let half = Math.floor(array.length / 2);
    if (array.length % 2 == 1) {
        return array[half];
    } else {
        return (array[half] + array[half - 1]) / 2;
    }
}