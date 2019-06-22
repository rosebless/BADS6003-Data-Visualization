var width = 960,
  height = 500;

const center = {
  x: width / 2,
  y: height / 2
}

var timing_label = [],
  mapTypeToProvince = [],
  ratioProvince = [],
  main_data = [],
  childs_data = [],
  main_num = 0,
  child_num = 200,
  time = 0

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)

const checkTimingData = (checkData = [], num = 0) => {
  if (checkData.length > num) {
    const randomIndex = Math.round(checkData.length * Math.random())
    checkData.splice(randomIndex, 1)
    return checkTimingData(checkData, num)
  } else if (checkData.length < num) {
    const randomIndex = Math.round(checkData.length * Math.random())
    let newData = checkData.slice(0, randomIndex)
    newData.push(checkData[randomIndex])
    newData = newData.concat(checkData.slice(randomIndex))
    return checkTimingData(newData, num)
  } else { // checkData.lenght = num
    return checkData
  }
}

d3.csv("https://raw.githubusercontent.com/rosebless/BADS6003-Data-Visualization/master/project_web/data_src/data.csv", function (data) {
  mapTypeToProvince = Object.keys(data[0])
  main_num = mapTypeToProvince.length

  ratioProvince = data.map(item => {
    timing_label.push(item['year'])
    delete item["Cow"]
    const total = mapTypeToProvince.map(key => +item[key]).reduce((a, b) => a + b)
    return mapTypeToProvince.map(key => +item[key] / total)
  })

  timing_data = ratioProvince.map(ratio => {
    let timing = [].concat(...ratio.map((r, type) => d3.range(Math.round(child_num * r)).map(i => type)))
    return checkTimingData(timing, child_num)
  })

  main_data = d3.range(main_num).map(function (i, index, arr) {
    return {
      radius: 0,
      fixed: true,
      type: i,
      x: (i + 1) * (width / (arr.length + 1)),
      y: i % 2 == 0 ? center.y + 150 : center.y - 150,
      class: 'main'
    }
  });

  childs_data = d3.range(child_num).map((i, index, arr) => ({
    radius: 6,
    type: -1, // defualt
    x: (i + 1) * (width / (arr.length + 1)),
    y: center.y,
    px: (i + 1) * (width / (arr.length + 1)),
    py: center.y,
    class: 'child'
  }))

  nodes_data = main_data.concat(childs_data)

  const props_data = {
    nodes_data,
    timing_data
  }

  initialize(svg, props_data)
});

d3.select('#start').on('click', () => animetion(time))
d3.select('#next').on('click', () => animetion(++time))
