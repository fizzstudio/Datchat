async function createChart(addr, title, ctx) {
    let data = await getData(addr);
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.xs,
            datasets: [{
                label: title,
                data: data.ys,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
                fill: false
            }]
        },
    })
    return myChart;
};

async function getData(addr) {
    let xs = [];
    let ys = [];
    let response = await fetch(addr);
    let data = await response.text();

    let table = data.split('\n').slice(1);
    table.forEach(elt => {
        let cols = elt.split(',');
        let year = cols[0];
        xs.push(year);
        let temp = cols[1];
        ys.push(parseFloat(temp) + 14);
        console.log(year, temp);
    });
    return { xs, ys };
}

let getMedian = function (array) {
    array.sort((a, b) => a - b);
    let half = Math.floor(array.length / 2);
    if (array.length % 2 == 1) {
        return array[half];
    } else {
        return (array[half] + array[half - 1]) / 2;
    }
}