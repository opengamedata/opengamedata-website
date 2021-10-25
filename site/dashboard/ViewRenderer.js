class ViewRenderer
{
  static formatValue(val, format)
  {
      let ret_val;
      if (format === "int")
      {
        ret_val = parseInt(val)
      }
      else if (format === "multiint")
      {
        ret_val = [];
        let vals = JSON.parse(val);
        for (let i = 0; i < vals.length; i++) {
          ret_val.push(ViewRenderer.formatValue(vals[i], "int"));
        }
      }
      else if (format === "float")
      {
        ret_val = parseFloat(val);
      }
      else if (format === "multifloat")
      {
        ret_val = [];
        let vals = JSON.parse(val);
        for (let i = 0; i < vals.length; i++) {
          ret_val.push(ViewRenderer.formatValue(vals[i], "float"));
        }
      }
      else if (format === "pct")
      {
        ret_val = (parseFloat(val)*100).toFixed(0);
      }
      else if (format === "grid")
      {
        return JSON.parse(val);
      }
      else if (format === "dict")
      {
        let toparse = val.replace(/'/g, '"');
        return JSON.parse(toparse);
      }
      else if (format === "raw")
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

  static ArrayToImData(input, color_map, scale=1) {
    let width
    try {
      width = input[0].length;
    }
    catch (error) {
      console.log(`ERROR: ${error}`);
      console.log(`Tried to check input[0].length, input is ${JSON.stringify(input)}`);
    }
    let height = input.length;
    let im_data_array = new Uint8ClampedArray(4*width*height*scale*scale);
    let next_index = 0;
    try {
      for (let row=0; row < height; row++) {
        for (let scale_v=0; scale_v < scale; scale_v++) {
          for (let col=0; col < width; col++) {
            let next_point;
            try {
              next_point = input[row][col];
            }
            catch (error) {
              console.log(`ERROR: ${error}`);
              console.log(`Tried to do index on input of [${row}][${col}], input has width=${width} and height=${height}`);
            }
            let next_color;
            try {
              next_color = color_map[next_point];
            }
            catch (error) {
              console.log(`ERROR: ${error}`);
              console.log(`Tried to do color_map[${next_point}, color_map has length=${color_map.length}]`)
            }
            for (let scale_h = 0; scale_h < scale; scale_h++)
            {
              for (let i=0; i < next_color.length; i++) {
                let real_rows = (row*scale)+scale_v;
                let real_cols = (col*scale)+scale_h;
                let real_height = height*scale;
                let real_width = width*scale;
                let row_skips = real_rows * real_width * 4;
                let col_skips = real_cols * 4;
                let calc_index = row_skips + col_skips + i;
                try {
                  // im_data_array[row_skips + col_skips + i] = next_color[i];
                  im_data_array[next_index] = next_color[i];
                  next_index++;
                }
                catch (error) {
                  console.log(`ERROR: ${error}`);
                  console.log(`Index was ${next_index}, alternate is ${calc_index}, counters are row=${row}, scale_v=${scale_v}, col=${col}, scale_h=${scale_h}, i=${i}, max is 4*${width}*${height}*${scale}*${scale} = ${im_data_array.length}`);
                  if (PRINT_TRACE) {
                    console.trace();
                  }
                  return new ImageData(im_data_array, width, height);
                }
              }
            }
          }
        }
      } // end loops
    }
    catch (err) {
      console.log(`ERROR: ${error}`);
      console.log(`All else failed, I dunno what index blew up.`);
      if (PRINT_TRACE) {
        console.trace();
      }
    }
    return new ImageData(im_data_array, width*scale, height*scale);
  } // end function
}