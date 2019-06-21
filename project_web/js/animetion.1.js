
const animetion = (svg, nodes = [], newType) => {

    if (newType) {
        svg.selectAll(".child")
            .exit()
            .remove()
            
        nodes = nodes.map((node, index) => (
            index < 5
                ? node
                : {
                    ...node,
                    type: newType
                }
        ))
    }

    var force = d3.layout.force()
        .gravity(0)
        .charge(0)
        .nodes(nodes)
        .size([width, height])
        .on("tick", (e) => ticked(e, svg, nodes));

    if (newType) {
        svg.selectAll(".child")
            .transition()
            .duration(3000)
            .style("fill", color(newType))
    }

    force.start();
    // setTimeout(() => {
    //     force.stop();
    //     console.log('stop')
    // }, 3000)

    function ticked(e, svg, nodes) {
        // force.resume() // if not have point not move
        let q = d3.geom.quadtree(nodes),
            k = e.alpha * 0.1,
            i = 0,
            n = nodes.length,
            o;

        console.log(nodes)

        while (++i < n) {
            o = nodes[i];
            if (o.fixed) continue;
            c = nodes[o.type];
            o.x += (c.x - o.x) * k;
            o.y += (c.y - o.y) * k;
            q.visit(collide(o));
        }

        svg.selectAll("circle")
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
    }

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
            return false // x1 > nx2
            // || x2 < nx1
            // || y1 > ny2
            // || y2 < ny1;
        };
    }
}
