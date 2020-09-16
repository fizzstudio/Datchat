class LineChart {
  constructor(data, container, width, height) {
    this.svgns = `http://www.w3.org/2000/svg`;
    this.data = data;
    this.root = null;
    this.container = container;
    this.min = null;
    this.max = null;
    this.record_count = null;
    this.record_labels = null;
    this.width = width || document.documentElement.clientWidth;
    this.height = height || 400; //document.documentElement.clientHeight;
    this.font_size = 15;
    this.x_label_font_size = 15;
    this.margin = 15;
    this.ticklength = 10;
    this.line_label_width = 80;
    this.axis_label_bbox = {
      x: this.ticklength + (this.font_size * 1.5),
      y: this.font_size
    }
    this.dataspace = {
      x: this.margin + this.axis_label_bbox.x,
      y: this.margin,
      width: this.width - (this.margin * 2) - this.axis_label_bbox.x - this.line_label_width,
      height: this.height - (this.margin * 2) - this.axis_label_bbox.y
    }

    this.init()
  }

  init () {
    this.find_min_max_values(this.data);
    this.create_chart();
    this.create_axes();

    let idnum = 0;
    for (const series in this.data) {
      if (`label` === series) {
        this.record_count = this.data[series].length;
      } else {
        let series_data = this.data[series];
        this.create_dataline(series_data, series, idnum++);
      }
    }
  }

  find_min_max_values() {
    // TODO: find longest string in labels, set line_label_width and x_label_font_size accordingly
    // const longest_string = this.record_labels.reduce((a, b) => { return a.length > b.length ? a : b; });

    for (const series in dataset) {
      if (`label` === series) {
        this.record_labels = dataset[series];
        this.record_count = this.record_labels.length;
      } else {
        let row = dataset[series];
        for (let record of row) {
          let val = parseFloat(record);

          if (!this.max || !this.min) {
            this.max = !this.max ? val : this.max;
            this.min = !this.min ? val : this.min;
          }

          if (`` !== val && !isNaN(val)) {
            this.max = this.max < val ? val : this.max;
            this.min = this.min > val ? val : this.min;
          }
        }
      }
    }
  }

  single_precision ( float ) {
    return Math.round(float * 10) / 10;
  }

  create_chart() {
    this.root = document.createElementNS(this.svgns, `svg`);
    this.root.setAttribute(`xmlns`, this.svgns);
    this.root.setAttribute(`viewBox`, `0 0 ${this.width} ${this.height}`);

    let bg = document.createElementNS(this.svgns, `rect`);
    bg.setAttribute(`width`, this.width);
    bg.setAttribute(`height`, this.height);
    bg.setAttribute(`fill`, `white`);
    bg.setAttribute(`stroke`, `gainsboro`);
    this.root.appendChild(bg);

    this.container.appendChild(this.root);
  }

  create_axes() {
    //  create x axis
    let x_axis = document.createElementNS(this.svgns, `g`);
    x_axis.id = `x_axis`;
    x_axis.classList.add(`axis`, `x`);

    // create line
    let x_line = document.createElementNS(this.svgns, `path`);
    x_line.setAttribute(`d`, `M${this.dataspace.x},${this.dataspace.y + this.dataspace.height} H${this.dataspace.x + this.dataspace.width}`);
    x_line.classList.add(`axis`);
    x_axis.appendChild(x_line);

    // create tickmarks
    const t_len = this.record_count;
    const x_tick_distance = this.single_precision(this.dataspace.width / (t_len - 1));
    for (let t = 0; t_len > t; ++t) {
      let tick = document.createElementNS(this.svgns, `g`);

      let tick_line = document.createElementNS(this.svgns, `path`);
      tick_line.setAttribute(`d`, `M${this.dataspace.x + (x_tick_distance * t)},${this.dataspace.y + this.dataspace.height} V${this.dataspace.y + this.dataspace.height + this.ticklength}`);
      tick_line.classList.add(`axis`);
      tick.appendChild(tick_line);

      let tick_label = document.createElementNS(this.svgns, `text`);
      tick_label.setAttribute(`x`, this.dataspace.x + (x_tick_distance * t) );
      tick_label.setAttribute(`y`, this.dataspace.y + this.dataspace.height + this.ticklength + this.font_size);
      tick_label.classList.add(`tick_label`);
      tick_label.textContent = this.record_labels[t];
      tick.appendChild(tick_label);

      x_axis.appendChild(tick);
    }
    this.root.appendChild(x_axis);

    //  create y axis
    let y_axis = document.createElementNS(this.svgns, `g`);
    y_axis.id = `y_axis`;
    y_axis.classList.add(`axis`, `y`);

    // create line
    let y_line = document.createElementNS(this.svgns, `path`);
    y_line.setAttribute(`d`, `M${this.dataspace.x},${this.dataspace.y} V${this.dataspace.y + this.dataspace.height}`);
    y_line.classList.add(`axis`);
    y_axis.appendChild(y_line);

    // create tickmarks
    const y_tick_values = [0, (this.max / 2), (this.max)];
    const y_t_len = 3;
    const y_tick_distance = this.single_precision(this.dataspace.height / (y_t_len - 1));
    for (let t = 0; y_t_len > t; ++t) {
      let tick = document.createElementNS(this.svgns, `g`);

      let tick_line = document.createElementNS(this.svgns, `path`);
      tick_line.setAttribute(`d`, `M${this.dataspace.x},${(this.dataspace.y + this.dataspace.height) - (y_tick_distance * t)} H${this.dataspace.x - this.ticklength}`);
      tick_line.classList.add(`axis`);
      tick.appendChild(tick_line);

      let tick_label = document.createElementNS(this.svgns, `text`);
      tick_label.setAttribute(`x`, (this.dataspace.x - this.ticklength) - (this.font_size/4) );
      tick_label.setAttribute(`y`, (this.dataspace.y + this.dataspace.height) - (y_tick_distance * t) + (this.font_size * 0.3));
      tick_label.classList.add(`tick_label`);
      tick_label.textContent = y_tick_values[t];
      tick.appendChild(tick_label);

      y_axis.appendChild(tick);
    }

    this.root.appendChild(y_axis);
  }

  create_dataline(series, label, series_id) {
    //  create dataline group
    let dataline_group = document.createElementNS(this.svgns, `g`);
    dataline_group.id = label;
    dataline_group.classList.add(`dataline`, `series_${series_id}`);

    // create line
    const l_len = this.record_count;
    const x_tick_distance = this.single_precision(this.dataspace.width / (l_len - 1));

    let dataline = document.createElementNS(this.svgns, `path`);
    let moveto = true;
    let d = ``;
    let y_pos = 0;
    for (let l = 0; l_len > l; ++l) {
      let val = series[l];
      if (`` === val || isNaN(val)) {
        moveto = true;
      } else {
        y_pos = (this.dataspace.y + this.dataspace.height) - (this.single_precision(this.dataspace.height / (this.max / val)));
        let command = moveto ? `M` : `L`;
        d += `${command}${this.dataspace.x + (x_tick_distance * l)},${y_pos}`;
        moveto = false;
      }

    }
    dataline.setAttribute(`d`, d);
    dataline_group.appendChild(dataline);

    let dataline_label = document.createElementNS(this.svgns, `text`);
    dataline_label.setAttribute(`x`, (this.dataspace.x + this.dataspace.width) + 5 );
    dataline_label.setAttribute(`y`, y_pos + (this.font_size * 0.3));
    dataline_label.textContent = label;
    dataline_group.appendChild(dataline_label);

    this.root.appendChild(dataline_group);
  }

  hilite_by_id( id_arr, is_hide ) {
    let classname = is_hide ? `hide` : `lowlite`;

    const datalines = document.querySelectorAll(`.dataline`);
    if (!id_arr || !id_arr.length) {
      for (const dataline of datalines) {
        dataline.classList.remove(`hide`, `lowlite`);
      }
    } else {
      for (const dataline of datalines) {
        dataline.classList.remove(`hide`, `lowlite`);
        dataline.classList.add(classname);
      }

      for (const id of id_arr) {
        const dataline = document.getElementById(id);
        dataline.classList.remove(`hide`, `lowlite`);
      }
    }
  }
}
