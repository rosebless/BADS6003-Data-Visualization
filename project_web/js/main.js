var width = 960,
  height = 500;

const center = {
  x: width / 2,
  y: height / 2
}

main_num = 10
const child_num = 200

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)

const main_data = d3.range(main_num).map(function (i, index, arr) {
  return {
    radius: 0,
    fixed: true,
    type: i,
    x: (i + 1) * (width / (arr.length + 1)),
    y: i % 2 == 0 ? center.y + 150 : center.y - 150,
    class: 'main'
  }
});

const childs_data = d3.range(child_num).map((i, index, arr) => ({
  radius: 6, 
  type: -1, // defualt
  x: (i + 1) * (width / (arr.length + 1)),
  y: center.y,
  px: (i + 1) * (width / (arr.length + 1)),
  py: center.y,
  class: 'child'
}))

timing_data = [
  d3.range(child_num).map(i => Math.random() * main_num | 0),
  d3.range(child_num).map(i => Math.random() * main_num | 0),
  d3.range(child_num).map(i => Math.random() * main_num | 0),
  d3.range(child_num).map(i => Math.random() * main_num | 0),
  d3.range(child_num).map(i => Math.random() * main_num | 0),
  d3.range(child_num).map(i => Math.random() * main_num | 0)
]

nodes_data = main_data.concat(childs_data)

const props_data = {
  nodes_data,
  timing_data
}

initialize(svg, props_data)

var time = 0

onClickBtnStart = () => {
  animetion(time)
}

onClickBtnNext = () => {
  animetion(++time)
}

