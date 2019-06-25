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

var svg = d3.select("#top-box").append("svg")
  .attr("id", "background-map")
  .attr("width", width)
  .attr("height", height)

d3.select("#left-box")
  .attr("width", width)

var table = d3.select("#table")

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

d3.csv("../data/data.csv", function (data) { // https://raw.githubusercontent.com/rosebless/BADS6003-Data-Visualization/master/final-project/public/src/data/data.csv
  allData = data
  mapTypeToProvince = Object.keys(data[0]).filter(province => province !== 'month' && province !== 'Bangkok')
  main_num = mapTypeToProvince.length

  ratioProvince = data.map(item => {
    timing_label.push(item['month'])
    const total = mapTypeToProvince.map(key => +item[key]).reduce((a, b) => a + b)
    return mapTypeToProvince.map(key => +item[key] / total)
  })

  timing_data = ratioProvince.map(ratio => {
    let timing = [].concat(...ratio.map((r, type) => d3.range(Math.round(child_num * r)).map(i => type)))
    return checkTimingData(timing, child_num)
  })

  main_data = d3.range(main_num).map(function (i, index, arr) {
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

  childs_data = d3.range(child_num).map((i, index, arr) => {
    const r = center.x
    const h = center.x
    const k = center.y
    const x = (i + 1) * (width / (arr.length + 1))
    const y = i % 2 == 0
      ? Math.sqrt(r ** 2 - (x - h) ** 2) + k
      : -Math.sqrt(r ** 2 - (x - h) ** 2) + k
    return {
      radius: 3,
      type: -1, // defualt
      x,
      y, // (i + 1) * (height / (arr.length + 1)), //center.y / 2,
      px: x,
      py: y, //  (i + 1) * (height / (arr.length + 1)), //center.y / 2,
      class: 'child'
    }
  })

  nodes_data = main_data.concat(childs_data)

  const props_data = {
    nodes_data,
    timing_data
  }

  initialize(svg, props_data)
});

var player = null
var timeOuter = null

const timeInverval = 2000

d3.select('#btn-play').on('click', () => onClickPlay())

const onClickPlay = () => {
  d3.select('#btn-play').attr('disabled', true)
  if (d3.select('#icon-play').text() === 'play_arrow') {
    d3.select('#icon-play').text('pause')
    clearInterval(player)
    // clearInterval(tempInterval)

    // const { tempTimeInterval } = calculateTimeInterval(time)
    play()
    player = setInterval(play, timeInverval)
    // timeOuter = setTimeout(() => {
    //   play()
    //   player = setInterval(play, timeInverval)
    // }, tempTimeInterval)
  } else {
    d3.select('#icon-play').text('play_arrow')
    if (force) force.stop()
    clearInterval(player)
    // clearInterval(tempInterval)
    // clearTimeout(timeOuter)
  }
  d3.select('#btn-play').attr('disabled', null)
}

d3.select('#btn-reset').on('click', () => {
  d3.select('#icon-play').text('play_arrow')
  time = 0
  // day = 0
  // days = 0
  if (force) force.stop()
  // clearTimeout(timeOuter)
  clearInterval(player)
  // clearInterval(tempInterval)
  // const props_data = {
  //   nodes_data,
  //   timing_data
  // }
  // initialize(svg, props_data)
  play(0)
})

d3.select('#btn-previous').on('click', () => onClickPrevious())
d3.select('#btn-next').on('click', () => onClickNext())

const onClickPrevious = () => {
  d3.select('#icon-play').text('play_arrow')
  if (force) force.stop()
  // clearTimeout(timeOuter)
  clearInterval(player)
  // clearInterval(tempInterval)
  if (time !== 0) play(time - 1)
  else play(timing_label.length - 1)
}

const onClickNext = () => {
  d3.select('#icon-play').text('play_arrow')
  if (force) force.stop()
  // clearTimeout(timeOuter)
  clearInterval(player)
  // clearInterval(tempInterval)
  play(++time)
}

const play = (props_time = undefined) => {
  if (props_time !== undefined) time = props_time
  else time++
  if (time < timing_label.length) {
    // if (mustContinue) time--
    animetion(time)
  }
  else {
    time = 0
    animetion(time)
  }
}

d3.select("body")
  .on("keydown", function () { // <-: 37, <-: 39 
    // svg.append("text")
    //     .attr("x","5")
    //     .attr("y","130")
    //     .style("font-size","20px")
    // .text("keyCode: " + d3.event.keyCode + " applied to : " + (currentObject===null ? "nothing!" : currentObject.id))  
    //   .transition().duration(2000)
    //     .style("fill-opacity",".1")
    //   .remove();
    if (d3.event.keyCode === 32) onClickPlay()
    if (d3.event.keyCode === 37) onClickPrevious() // d3.select('#btn-previous').on("click")()
    if (d3.event.keyCode === 39) onClickNext()
  });