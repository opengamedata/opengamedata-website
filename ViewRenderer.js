class ViewRenderer
{
  static formatValue(val, format)
  {
      let ret_val;
      if (format == "int")
      {
        ret_val = parseFloat(val).toFixed(0);
      }
      else if (format == "multiint")
      {
        ret_val = [];
        let vals = JSON.parse(val);
        for (let i = 0; i < vals.length; i++) {
          ret_val.push(ViewRenderer.formatValue(vals[i], "int"));
        }
      }
      else if (format == "float")
      {
        ret_val = parseFloat(val).toFixed(2);
      }
      else if (format == "multifloat")
      {
        ret_val = [];
        let vals = JSON.parse(val);
        for (let i = 0; i < vals.length; i++) {
          ret_val.push(ViewRenderer.formatValue(vals[i], "float"));
        }
      }
      else if (format == "pct")
      {
        ret_val = (parseFloat(val)*100).toFixed(0);
      }
      else if (format == "raw")
      {
        ret_val = val;
      }
      else
      {
        console.log(`Display value had unrecognized format ${format}. Using raw value ${val}`);
        ret_val = val;
      }
      return ret_val;
  }

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