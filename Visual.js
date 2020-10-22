class Visual {
    constructor(addr, title, canvas, type) {
        this.addr = addr;
        this.title = title;
        this.canvas = canvas;
        this.type = type;
        this.median = 0;
        this.mean = 0;
        this.ys = [];
        this.xs = [];
        this.datasets = [];
        this.chart;
        this.add_median = false;
        this.add_mean = false;

    }

    async createChart() {
        await this.initialize();
        let chart = new Chart(this.canvas, {
            type: this.type,
            data: {
                labels: this.xs,
                datasets: this.datasets,
            },
            // options: {
            //     animation: {
            //         duration: 0
            //     }
            // }
        })
        chart.update();
        this.chart = chart;
        return chart;
    };

    async initialize() {
        let xs = [];
        let ys = [];
        let response = await fetch(this.addr);
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

        let result = { xs, ys };
        let copy_result = { ...result };

        this.data = copy_result;
        this.ys = ys;
        this.xs = xs;
        this.median = cal_median(ys);
        this.mean = cal_mean(ys);

        let defaultDatasets = {
            label: this.title,
            data: this.ys,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            fill: false
        }
        this.addDatasets(defaultDatasets);
    }

    addDatasets(datasets) { this.datasets.push(datasets); }

    async drawMedian(data) { await this.setMedianDataset(data); }

    async drawMean(data) { await this.setMeanDataset(data); }

    async setMedianDataset(data) {

        let arr = [];
        for (let i = 0; i < 200; i++) {
            arr.push(data);
        }

        if (!this.add_median) {
            this.chart.data.datasets.push({
                label: 'Median',
                data: arr,
                backgroundColor: "brown",
                borderColor: "brown",
                borderWidth: 1,
                fill: false
            });
            this.chart.update();
            this.add_median = true;
        }
    }

    async setMeanDataset(data) {
        let arr = [];
        for (let i = 0; i < 200; i++) {
            arr.push(data);
        }
        if (!this.add_mean) {
            this.chart.data.datasets.push({
                label: 'Mean',
                data: arr,
                backgroundColor: "rice",
                borderColor: "rice",
                borderWidth: 1,
                fill: false
            });
            this.chart.update();
            this.add_mean = true;
        }
    }

}

let cal_median = function (arr) {
    let array = [...arr];
    array.sort((a, b) => a - b);
    let half = Math.floor(array.length / 2);
    if (array.length % 2 == 1) {
        return array[half];
    } else {
        return (array[half] + array[half - 1]) / 2;
    }
}

let cal_mean = function (array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum / array.length;
}