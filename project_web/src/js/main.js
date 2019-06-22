var width = 562 * 2 / 3,
  height = 1027 * 2 / 3;

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
  child_num = 250,
  time = 0

const provinceLocate = {
  // 'Bangkok': {
  //   x: 150,
  //   y: 315
  // },
  'Chon Buri': {
    x: 165,
    y: 350
  },
  'Kanchanaburi': {
    x: 60,
    y: 260
  },
  'Phra Nakhon Si Ayutthaya': {
    x: 145,
    y: 285
  },
  'Phetchaburi': {
    x: 95,
    y: 355
  },
  'Chiang Mai': {
    x: 65,
    y: 75
  },
  'Phitsanulok': {
    x: 145,
    y: 160
  },
  'Nakhon Ratchasima': {
    x: 215,
    y: 255
  },
  'Khon Kaen': {
    x: 240,
    y: 190
  },
  'Krabi': {
    x: 75,
    y: 565
  },
  'Songkhla': {
    x: 150,
    y: 635
  }
}

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
  mapTypeToProvince = Object.keys(data[0]).filter(province => province !== 'year' && province !== 'Bangkok')
  main_num = mapTypeToProvince.length

  ratioProvince = data.map(item => {
    timing_label.push(item['year'])
    const total = mapTypeToProvince.map(key => +item[key]).reduce((a, b) => a + b)
    return mapTypeToProvince.map(key => +item[key] / total)
  })

  timing_data = ratioProvince.map(ratio => {
    let timing = [].concat(...ratio.map((r, type) => d3.range(Math.round(child_num * r)).map(i => type)))
    return checkTimingData(timing, child_num)
  })

  main_data = d3.range(main_num).map(function (i, index, arr) {
    console.log(i, mapTypeToProvince[i], provinceLocate[mapTypeToProvince[i]])
    const { x, y } = provinceLocate[mapTypeToProvince[i]]
    return {
      radius: 0,
      fixed: true,
      type: i,
      x, //: (i + 1) * (width / (arr.length + 1)),
      y, //: i % 2 == 0 ? center.y + 150 : center.y - 150,
      class: 'main'
    }
  });

  childs_data = d3.range(child_num).map((i, index, arr) => ({
    radius: 3,
    type: -1, // defualt
    x: (i + 1) * (width / (arr.length + 1)),
    y: center.y,
    px: (i + 1) * (width / (arr.length + 1)),
    py: center.y,
    class: 'child'
  }))

  nodes_data = main_data.concat(childs_data)

  console.log(ratioProvince)
  console.log(timing_data)

  const props_data = {
    nodes_data,
    timing_data
  }

  initialize(svg, props_data)
});

d3.select('#start').on('click', () => animetion(time))
d3.select('#next').on('click', () => animetion(++time))
