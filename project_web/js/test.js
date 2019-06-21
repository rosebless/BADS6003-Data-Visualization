var width = 960,
    height = 500;

nodes_data = [{
    x: width / 2 - 25,
    y: height / 2,
    r: 20
}, {
    x: width / 2 + 25,
    y: height / 2,
    r: 20
}]

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)

svg.selectAll('*').remove();

force = d3.layout.force()
    .size([width, height])
    .nodes(nodes_data)
    .gravity(0.3)

nodes = svg.selectAll('.node')
    .data(nodes_data)
    .enter().append('circle')
    .attr('class', 'node')
    .attr('r', function (d) { return d.r; })
    .attr('cx', function (d) { return d.x; })
    .attr('cy', function (d) { return d.y; });

force.start()

let i = 0
alert(++i) // 1
alert(i++) // 1
alert(i) // 2
