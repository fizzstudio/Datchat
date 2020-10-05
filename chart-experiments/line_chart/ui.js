import { LineChart } from "./line_chart_segmented.js";

const dataset = {
  'label': ['nft0db9tau','40dbtlu77d','8fnfl9il3y','reg12v6vrm','fa0d98wo4u','bzildiwajl','y28q950bzg','geoo503s2l','zx99wiofpe','4biz733von','w2iokw0pu6','4uijq1qtiz','dttrqa4nmn','m3uso56ysh','6976a9xodo'],
  'f71s81dhj5': ['10','7','13','16','7','7','7','19','12','4','3','7','19','8','17'],
  'zidgibxa6d': ['14','3','dfdf','10','3','6','5','18','13','4','11','3','13','9','12'],
  'bw0eck4nmb': ['12','4','cbc','11','15','10','14','16','17','3','12','6','4','8','15'],
  'qzbag4icbq': ['10','16','$fjd','18','7','9','11','13','12','19','15','11','10','12','11'],
  'vrcw3nu8rr': ['15','11','16','8','19','7','7','19','9','12','19','7','5','4','16'],
  'dq1wa43m7b': ['3','16','4','14','8','12','13','12','5','14','8','10','7','11','11']
  // '1kjluacxrk': ['8','10','11','6','3','15','7','8','18','10','18','18','9','13','11'],
  // 'qjr0b62cjc': ['12','18','12','11','7','11','12','','16','15','11','18','12','5','8'],
  // 'vuv7qbcwvw': ['7','16','14','11','7','17','11','11','5','15','5','3','5','8','12'],
  // 'k0m1081kkb': ['6','19','6','18','12','5','12','17','12','14','15','19','10','3','6'],
  // 'b0to441qow': ['11','9','16','10','19','6','10','11','18','','9','3','12','10','4'],
  // 'q5tr9siw03': ['7','10','4','10','3','15','15','19','8','14','','7','9','3','8'],
  // 'uax7jtwpmi': ['18','15','9','12','4','16','16','19','12','14','10','17','5','6','6'],
  // '34mufuk6k5': ['8','19','13','17','8','12','12','18','17','12','15','19','14','9','6'],
  // 'yh2htao507': ['15','19','9','8','16','15','11','4','12','5','11','3','17','4','6'],
  // 'i0gwt4ih07': ['19','3','3','12','4','17','5','7','3','9','15','8','18','3','12'],
  // 'o1o070i0ey': ['16','12','5','18','14','19','5','15','3','3','19','6','12','18','17'],
  // 'gh0ozay8mg': ['9','18','13','18','9','14','17','12','12','6','8','14','18','7','13'],
  // 'z3nb5ez66j': ['14','15','8','15','13','3','8','4','11','18','15','13','16','8','10'],
  // '2pymm5y8cm': ['17','13','15','4','7','7','12','6','17','12','12','8','10','17','4'],
  // 'oxulwixo1u': ['6','6','17','12','18','8','8','11','18','17','6','10','10','9','10'],
  // 'ktkjz9oc74': ['16','17','14','4','11','18','19','16','19','6','8','12','7','3','5'],
  // 'awco6lqboq': ['3','19','10','16','4','30','9','14','13','7','3','13','5','12','19'],
  // 'tcml1u26wn': ['14','19','7','10','12','8','18','4','12','11','12','9','6','18','10'],
  // 'yr91oinfz3': ['6','10','10','3','12','4','19','19','19','5','8','19','18','16','18'],
  // 'qo752vzksn': ['19','9','10','4','19','8','3','12','12','7','15','11','7','18','14'],
  // 'b63kkf8xii': ['16','14','14','16','15','13','3','14','10','17','18','9','11','9','19']
};

let chart = null;
window.onload = function init() {
  const chart_container = document.querySelector(`section#chart`);
  chart = new LineChart(dataset, chart_container, 1800, 300);

  // highlighting
  const list_container = document.querySelector(`section#controls`);
  list_keys(dataset, list_container);
  // chart.hilite_by_id([`dq1wa43m7b`]);
  // chart.hilite_by_id([`zidgibxa6d`]);

  // chart.hilite_by_id([`zidgibxa6d`], true );
  // chart.hilite_by_id([`zidgibxa6d`,`bw0eck4nmb`] );
  // chart.hilite_by_id([`f71s81dhj5`] );
  // chart.hilite_by_id();
}

function list_keys (data, container) {
  // TODO: find longest string in labels, set line_label_width and x_label_font_size accordingly
  // const longest_string = this.record_labels.reduce((a, b) => { return a.length > b.length ? a : b; });
  let fieldset = document.createElement(`fieldset`);
  fieldset.id = `dataline_selector`;
  fieldset.addEventListener(`click`, show_selected_datalines, true);

  let legend = document.createElement(`legend`);
  legend.appendChild(document.createTextNode(`Select data lines to highlight:`));
  fieldset.appendChild(legend);

  for (const series in dataset) {
    if (`label` !== series) { 
      let series_checkbox = create_checkbox(`checkbox-${series}`, series, series);
      // fieldset.appendChild(checkbox);

      let series_fieldset = document.createElement(`fieldset`);
      series_fieldset.classList.add(`series_fieldset`);
      let series_legend = document.createElement(`legend`);
      series_legend.appendChild(series_checkbox);
      series_fieldset.appendChild(series_legend);

      for (let s = 1, s_len = dataset[series].length; s_len > s; ++s) {
        let seg_id = `${series}-segment_${s}`;
        let index_checkbox = create_checkbox(`checkbox-${seg_id}`, seg_id, s);
        series_fieldset.appendChild(index_checkbox);
      }    
      fieldset.appendChild(series_fieldset);
    }
  }

  container.appendChild(fieldset);

  const hide_checkbox = create_checkbox(`checkbox-hide_datalines`, `hide_datalines`, `hide unselected datalines`);
  hide_checkbox.addEventListener(`click`, show_selected_datalines, true);

  container.appendChild(hide_checkbox);
}

function create_checkbox (id, value, label_text) {
  let checkbox = document.createElement(`input`);
  checkbox.type = `checkbox`;
  checkbox.name = label_text;
  checkbox.value = value;
  checkbox.id = id;

  let label = document.createElement(`label`)
  label.htmlFor = id;
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(label_text));

  return label;
}

function show_selected_datalines (event) {
  // const fieldset = event.currentTarget;
  const fieldset = document.getElementById(`dataline_selector`);
  var checked_list = fieldset.querySelectorAll(`input:checked`);

  let selected_ids = [];
  for (let input of checked_list) {
    selected_ids.push(input.value);
  }

  const hide_checkbox = document.getElementById(`checkbox-hide_datalines`);

  chart.hilite_by_id(selected_ids, hide_checkbox.checked);

  chart.hilite_segments_by_id(selected_ids);
}
