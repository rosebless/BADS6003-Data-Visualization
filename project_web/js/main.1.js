var width = 960,
  height = 500;

const center = {
  x: width / 2,
  y: height / 2
}

const main = d3.range(5).map(function (i, index, arr) {
  return {
    radius: 30,
    fixed: true,
    type: i,
    x: (i + 1) * (width / (arr.length + 1)),
    y: i % 2 == 0 ? center.y + 150 : center.y - 150
  }
});

const childs = d3.range(20).map((i, index, arr) => ({
  radius: 6, // Math.random() * 12 + 4,
  type: Math.random() * 5 | 0,
  x: (i + 1) * (width / (arr.length + 1)),
  y: center.y,
  px: (i + 1) * (width / (arr.length + 1)),
  py: center.y
}))

const nodes = main.concat(childs)

var color = d3.scale.category10();

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)

svg.append("rect")
  .attr("width", width)
  .attr("height", height);

svg.selectAll("circle")
  .data(main)
  .enter().append("circle")
  .attr("r", function (d) { return d.radius - 2; })
  .style("fill", function (d) { return color(d.type); });

svg.selectAll("rect")
  .data(childs)
  .enter().append("circle")
  .attr("class", "child")
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
  .attr("r", d => d.radius - 2)
  .style("fill", d => color(d.type))

onClickBtnStart = () => {
  animetion(svg, nodes)
}

onClickBtn = () => {
  animetion(svg, nodes, 1)
}

