class ChartIt {
    constructor(addr, title, ctx, type) {
        this.addr = addr;
        this.title = title;
        this.ctx = ctx;
        this.type = type;
        this.median = 0;
        this.ys = [];
        this.datasets = [];
    }

    createChart = async function () {
        let data = await getData(this.addr);
        this.setData(data.ys);
        this.datasets[0] = {
            label: this.title,
            data: data.ys,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            fill: false
        }

        let myChart = new Chart(this.ctx, {
            type: this.type,
            data: {
                labels: data.xs,
                datasets: this.datasets,
            },
        })
        this.setMedian(this.ys);
        return myChart;
    };

    setData(arr) {
        this.ys = arr;
    };

    setMedian(arr) {
        this.median = cal_median(arr);
    };

    getMedian() {
        return this.median;
    };
}

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

let cal_median = function (array) {
    array.sort((a, b) => a - b);
    let half = Math.floor(array.length / 2);
    if (array.length % 2 == 1) {
        return array[half];
    } else {
        return (array[half] + array[half - 1]) / 2;
    }
}