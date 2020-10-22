class Visual {
    constructor(addr, title, canvas, type) {
        this.addr = addr;
        this.title = title;
        this.canvas = canvas;
        this.type = type;
        this.stat_props = {};
        this.ys = [];
        this.xs = [];
        this.datasets = [];
        this.chart;
        this.add_median = false;
        this.add_mean = false;
        this.drawn = new Drawn();

    }

    async createChart() {
        await this.initialize();
        let chart = new Chart(this.canvas, {
            type: this.type,
            data: {
                labels: this.xs,
                datasets: this.datasets,
            },
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
        });

        let result = { xs, ys };
        let copy_result = { ...result };

        this.ys = ys;
        this.xs = xs;
        this.stat_props.median = ss.median(ys);
        this.stat_props.mean = ss.mean(ys);

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

    async drawStatistics(stat) {
        let stat_val = 0;
        switch (stat) {
            case 'median':
                stat_val = this.stat_props.median;
                if (!this.drawn.median) {
                    await this.setStatDataset(stat, stat_val);
                    this.drawn.median = true;
                }
                break;
            case 'mean':
                stat_val = this.stat_props.mean;
                if (!this.drawn.mean) {
                    await this.setStatDataset(stat, stat_val);
                    this.drawn.mean = true;
                }
                break;
        }
    }

    async setStatDataset(stat, stat_val) {
        let arr = [];
        for (let i = 0; i < this.xs.length; i++) {
            arr.push(stat_val);
        }
        this.chart.data.datasets.push({
            label: stat.charAt(0).toUpperCase() + stat.slice(1),
            data: arr,
            backgroundColor: "brown",
            borderColor: "brown",
            borderWidth: 1,
            fill: false
        });
        this.chart.update();
    }
}

class Drawn {
    constructor() {
        this.median = false;
        this.mean = false;
    }
}