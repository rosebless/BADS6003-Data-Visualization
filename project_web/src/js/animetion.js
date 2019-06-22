var force = null,
    nodes = null,
    nodes_data = [],
    timing_data = []

var color = d3.scale.category10();

const initialize = (svg, data) => {
    nodes_data = data.nodes_data
    timing_data = data.timing_data

    svg.selectAll('*').remove();

    force = d3.layout.force()
        .size([width, height])
        .nodes(nodes_data)
        .gravity(0)
        .charge(0)

    nodes = svg.selectAll('.node')
        .data(nodes_data)
        .enter().append('circle')
        .attr('class', function (d) { return d.class; })
        .attr('r', function (d) { return d.radius; })
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; })
        .style("fill", 'white');
}

const animetion = (time) => {
    timing_data[time].forEach((type, i) => {
        nodes_data[main_num + i]['type'] = type
    });

    nodes.data(nodes_data).style("fill", function (d) { return color(d.type); });

    if (force) force.stop()

    force.nodes(nodes_data).on('tick', (e) => ticked(e, svg, nodes_data))
    force.start();
}

function ticked(e, svg, nodes_data) {
    let q = d3.geom.quadtree(nodes_data),
        k = e.alpha * 0.1,
        i = 0,
        n = nodes_data.length,
        o;

    while (++i < n) {
        o = nodes_data[i];
        if (o.fixed) continue;
        c = nodes_data[o.type];
        o.x += (c.x - o.x) * k;
        o.y += (c.y - o.y) * k;
        q.visit(collide(o));
    }

    svg.selectAll("circle")
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; });
}

const euclidean_distance = (x1, x2, y1, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)

function collide(node) {
    var r = node.radius + 16,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function (quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
            var x = node.x - quad.point.x,
                y = node.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = node.radius + quad.point.radius;
            if (l < r) {
                l = (l - r) / l * .5;
                node.px += x * l;
                node.py += y * l;
            }
        }
        return x1 > nx2
            || x2 < nx1
            || y1 > ny2
            || y2 < ny1;
    };
}
