class ViewRenderer
{
  static createMultiBarChart(vals, bind_to_id) {
    let cols = [];
    for (let i=0; i < vals.length; i++) {
      let val = vals[i];
      cols.push([`data${i}`, val]);
    }
    return c3.generate(
      {
        bindto: "#" + bind_to_id,
        data: {
          columns: cols,
          type: 'bar'
        },
        axis : {
          y : {
              tick: { format: d3.format('d') },
          }
        },
        size: {
          height: 200-70,
          width: .28*200
        },
        legend: { show: false }
      });
  }

  static createBarChart(val, bind_to_id) {
    return c3.generate(
      {
        bindto: "#" + bind_to_id,
        data: {
          columns: [
            ['data1', val]
          ],
          type: 'bar'
        },
        axis : {
          y : {
              tick: { format: d3.format('d') },
          }
        },
        size: {
          height: 200-70,
          width: .28*200
        },
        legend: { show: false }
      });
  }

  static createGaugeChart(val, bind_to_id, reverse_color) {
    return c3.generate(
      {
        bindto: "#" + bind_to_id,
        data: {
          columns: [
            ['data1', val]
          ],
          type: 'gauge'
        },
        color: {
          pattern: reverse_color ? ['green', 'yellow', 'orange', 'red'] : ['red', 'orange', 'yellow', 'green'], // the three color levels for the percentage values.
          threshold: {
              values: reverse_color ? [50, 80, 90, 100] : [10, 20, 50, 100]
          }
        },
        size: {
          height: 200-140,
          width: .28*200
        }
      });
  }
}