class Visual {
    constructor(addr, title, canvas, type) {
        this.addr = addr;
        this.title = title;
        this.canvas = canvas;
        this.type = type;
        this.ys = [];
        this.xs = [];
        this.pairs = [];
        this.datasets = [];
        this.chart;
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
        let pairs = [];
        let response = await fetch(this.addr);
        let data = await response.text();

        let table = data.split('\n').slice(1);
        let x = 0;
        table.forEach(elt => {
            let cols = elt.split(',');
            let year = cols[0];
            xs.push(year);
            let temp = cols[1];
            ys.push(parseFloat(temp) + 14);
            pairs.push([x, parseFloat(temp) + 14]);
            x++;
        });

        this.ys = ys;
        this.xs = xs;
        this.pairs = pairs;

        let defaultDatasets = {
            label: this.title,
            data: this.ys,
            backgroundColor: "#133f87",
            borderColor: "#133f87",
            borderWidth: 1,
            fill: false
        }
        this.datasets.push(defaultDatasets);
    }

    async drawStatistics(stat, stat_val) {
        switch (stat) {
            case 'median':
                if (!this.drawn.median) {
                    await this.setStatDataset(stat, stat_val);
                    this.drawn.median = true;
                }
                break;
            case 'mean':
                if (!this.drawn.mean) {
                    await this.setStatDataset(stat, stat_val);
                    this.drawn.mean = true;
                }
                break;
        }
    }

    async setStatDataset(stat, stat_val) {
        let arr = [];
        let color = random_rgba();
        for (let i = 0; i < this.xs.length; i++) {
            arr.push(stat_val);
        }
        this.chart.data.datasets.push({
            label: stat.charAt(0).toUpperCase() + stat.slice(1),
            data: arr,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            fill: false
        });
        this.chart.update();
    }
}

function random_rgba() {
    var o = Math.round, r = Math.random, t = 20, s = 200;
    return 'rgba(' + o(r() * t) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
}

class Drawn {
    constructor() {
        this.median = false;
        this.mean = false;
    }
}
