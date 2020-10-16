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
        this.myChart;
        this.drawn = false;
        this.add_median = false;
        this.add_mean = false;

    }

    async createChart() {
        await this.initialize();
        console.log("createChart median: ", this.median);
        this.myChart = new Chart(this.canvas, {
            type: this.type,
            data: {
                labels: this.xs,
                datasets: this.datasets,
            },
        })
        this.myChart.update();
        // this.setChart(myChart);
        console.log("createChart myChart: ", this.myChart);
        // return mychart;
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
        this.setData(copy_result);
        this.setY(ys);
        this.setX(xs);
        this.setMedian(this.ys);
        this.setMean(this.ys);

        let defaultDatasets = {
            label: this.title,
            data: this.ys,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            fill: false
        }
        this.datasets[0] = (defaultDatasets);
    }

    setChart(myChart) {
        this.myChart = myChart;
    }

    getChart() {
        return this.myChart;
    }

    setData(data) {
        this.data = data;
    }

    setDatasets(datasets) {
        this.datasets = datasets;
    }

    setY(arr) {
        this.ys = arr;
    };

    setX(arr) {
        this.xs = arr;
    };

    setMedian(arr) {
        this.median = cal_median(arr);
    };

    setMean(arr) {
        this.mean = cal_mean(arr);
    }

    getMedian() {
        return this.median;
    };

    getTitle() {
        return this.title;
    }

    async drawMedian(data) {
        await this.initialize();
        await this.setMedianDataset(data);
    }

    async drawMean(data) {
        await this.initialize();
        await this.setMeanDataset(data);
    }

    async setMedianDataset(data) {
        
        let arr = [];
        for (let i = 0; i < 200; i++) {
            arr.push(data);
        }

        if (!this.add_median) {
            this.myChart.data.datasets.push({
                label: 'Median',
                data: arr,
                backgroundColor: "brown",
                borderColor: "brown",
                borderWidth: 1,
                fill: false
            });
            this.myChart.update();

            console.log("setmediandata: ", this.myChart);
            this.add_median = true;

            // await this.createChart();
        }
    }

    async setMeanDataset(data) {
        let arr = [];
        for (let i = 0; i < 200; i++) {
            arr.push(data);
        }
        if (!this.add_mean) {
            this.myChart.data.datasets.push({
                label: 'Mean',
                data: arr,
                backgroundColor: "rice",
                borderColor: "rice",
                borderWidth: 1,
                fill: false
            });
            this.myChart.update();
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