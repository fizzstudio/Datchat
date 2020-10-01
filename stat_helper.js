class ChartIt {
    constructor(addr, title, ctx, type) {
        this.addr = addr;
        this.title = title;
        this.ctx = ctx;
        this.type = type;
        this.median = 0;
        this.mean = 0;
        this.ys = [];
        this.datasets = [];
    }

    createChart = async function () {
        let data = await getData(this.addr);
        this.setData(data.ys);
        this.datasets[0] = {
            label: this.title,
            data: this.ys,
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
        this.setMean(this.ys);
        return myChart;
    };

    setData(arr) {
        this.ys = arr;
    };

    setMedian(arr) {
        this.median = cal_median(arr);
    };

    setMean(arr){
        this.mean = cal_mean(arr);
    }

    getMedian() {
        return this.median;
    };

    setMedianDataset(data) {
        let arr = [];
        for (let i = 0; i < 200; i++) {
            arr.push(data);
        }
        this.datasets[1] = {
            label: 'Median',
            data: arr,
            backgroundColor: "black",
            borderColor: "black",
            borderWidth: 1,
            fill: false
        };
    }

    setMeanDataset(data) {
        let arr = [];
        for (let i = 0; i < 200; i++) {
            arr.push(data);
        }
        this.datasets[1] = {
            label: 'Mean',
            data: arr,
            backgroundColor: "black",
            borderColor: "black",
            borderWidth: 1,
            fill: false
        };
    }
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
        // console.log(year, temp);
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

let cal_mean = function(array){
    let sum = 0;
    for (let i = 0; i < array.length; i++){
        sum += array[i];
    }
    return sum/array.length;
}

