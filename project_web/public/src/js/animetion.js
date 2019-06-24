var force = null,
    nodes = null,
    allData = [],
    nodes_data = [],
    timing_data = [],
    previousDataTable = [],
    tempInterval = null,
    mustContinue = false

var color = type => ([ // d3.scale.category10()
    '#6d953a', // ชลบุรี
    '#3476ae', // กาญจนบุรี
    '#f36e31', // อยุธยา
    '#072f4f', // เพชรบุรี
    '#702c7d', // เชียงใหม่
    '#ffde2c', // พิษณุโลก
    '#f27091', // นครราชสีมา
    '#ca3a3d', // ขอนแก่น
    '#522e1a', // กระบี่
    '#165d5a'  // สงขลา
][type])


const provinceThai = {
    'Chon Buri': 'ชลบุรี',
    'Kanchanaburi': 'กาญจนบุรี',
    'Phra Nakhon Si Ayutthaya': 'อยุธยา',
    'Phetchaburi': 'เพชรบุรี',
    'Chiang Mai': 'เชียงใหม่',
    'Phitsanulok': 'พิษณุโลก',
    'Nakhon Ratchasima': 'นครราชสีมา',
    'Khon Kaen': 'ขอนแก่น',
    'Krabi': 'กระบี่',
    'Songkhla': 'สงขลา'
}

const dayOfMonth = (date) => {
    const month = date.split(' ')[0]
    const year = date.split(' ')[1]
    return {
        'jan': 31,
        'feb': year == "16" ? 29 : 28,
        'mar': 31,
        'apr': 30,
        'may': 31,
        'jun': 30,
        'jul': 31,
        'aug': 31,
        'sep': 30,
        'oct': 31,
        'nov': 30,
        'dec': 31
    }[month]
}

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

    d3.range(timing_label.length).forEach(i => {
        table.append('div')
    })

    timing_data[0].forEach((type, i) => {
        nodes_data[main_num + i]['type'] = type
    });

    showSmallDate(0)
    showTable(0)

    nodes.data(nodes_data).style("fill", function (d) { return color(d.type); });
    if (force) force.stop()
    force.nodes(nodes_data).on('tick', (e) => ticked(e, svg, nodes_data))
    force.start();
    d3.select('#btn-previous').attr('disabled', null)
    d3.select('#btn-reset').attr('disabled', null)
    d3.select('#btn-play').attr('disabled', null)
    d3.select('#btn-next').attr('disabled', null)
}

const animetion = (time) => {
    timing_data[time].forEach((type, i) => {
        nodes_data[main_num + i]['type'] = type
    });

    showSmallDate(time)
    showTable(time)

    nodes.data(nodes_data).style("fill", function (d) { return color(d.type); });

    if (force) force.stop()

    force.nodes(nodes_data).on('tick', (e) => ticked(e, svg, nodes_data))
    force.start();
}

const showSmallDate = (time) => {
    const [month, year] = timing_label[time].split(' ')
    d3.select('#timer').text(month.toUpperCase() + ' 20' + year)
}

const calculateTimeInterval = (time, from = 'onclick') => {
    const date = timing_label[time]
    const days = dayOfMonth(date)
    let daysPrevious = 0
    if (time !== 0) daysPrevious = dayOfMonth(timing_label[time - 1])

    let day = +d3.select('#timer').text().split(" ")[0]
    if (time !== 0 && day === daysPrevious) day = 1
    const days_list = d3.range(day, days + 1)

    const tempTimeInterval = from === 'onclick' ? (timeInverval - 10) * (days_list.length / days)
        : (timeInverval - 10) / days
    return { date, days_list, tempTimeInterval }
}

const showDate = (time) => {
    const { date, days_list, tempTimeInterval } = calculateTimeInterval(time, 'showDate')

    clearInterval(tempInterval)
    let indexInterval = 0
    d3.select('#timer').text(days_list[indexInterval] + " " + date.toUpperCase())
    indexInterval++
    mustContinue = true
    tempInterval = setInterval(() => {
        if (indexInterval < days_list.length) {
            d3.select('#timer').text(days_list[indexInterval] + " " + date.toUpperCase())
            indexInterval++
        }
        else {
            mustContinue = false
            clearInterval(tempInterval)
        }
    }, tempTimeInterval)
}

const getDataTable = (time) => {
    const previous = allData[time - 1]
    const now = allData[time]
    const dataTable = mapTypeToProvince.map(province => ({
        'key': province,
        'name': provinceThai[province],
        'count': now[province],
        'earning': time !== 0 && (now[province] - previous[province]) / previous[province] * 100
    })).sort((a, b) => b['earning'] - a['earning'])
    return dataTable
}

const showTable = (time) => {
    const nowDataTable = getDataTable(time)
    if (time !== 0) {
        const previousDataTable = getDataTable(time - 1)
        mapTypeToProvince.forEach(province => {
            const indexOfNow = nowDataTable.map(d => d.name).indexOf(provinceThai[province])
            const indexOfPrevious = previousDataTable.map(d => d.name).indexOf(provinceThai[province])
            const diffIndex = indexOfPrevious - indexOfNow
            let icon = diffIndex > 0 ? 'expand_less'
                : diffIndex < 0 ? 'expand_more'
                    : 'remove'
            nowDataTable[indexOfNow]['icon-rank'] = icon
            nowDataTable[indexOfNow]['diffRank'] = diffIndex
            const diffEarning = nowDataTable[indexOfNow]['earning'] - previousDataTable[indexOfPrevious]['earning']
            const iconRatio = diffEarning > 0 ? 'expand_less'
                : diffEarning < 0 ? 'expand_more'
                    : 'remove'
            nowDataTable[indexOfNow]['icon-ratio'] = iconRatio
        })
    }
    nowDataTable.forEach((row, index) => {
        const rowTable = d3.select(`#row-${index + 1}`)
        rowTable.select('.circle-province').attr('fill', color(mapTypeToProvince.indexOf(row['key'])))
        rowTable.select('.txt-province').text(row['name'])
        rowTable.select('.column-2').text(fixSting(commaNumber(row['count']), 10))
        if (time !== 0) {
            const strRatio = `${fixSting(Math.round(row['earning'] * 100) / 100, 8)} %`
            rankPaint(rowTable, '.icon-earning', row['icon-ratio'], row['icon-ratio'])
            rowTable.select('.earning-ratio').text(strRatio)
            rankPaint(rowTable, '.icon-rank', row['icon-rank'], row['icon-rank'])
            rankPaint(rowTable, '.diff-rank', row['icon-rank'], row['diffRank'] === 0 ? ' ' : Math.abs(row['diffRank']))
        }
    })
}

const fixSting = (str, num) => {
    const blankLen = num - str.length
    const prefix = d3.range(blankLen).map(i => ' ').join('')
    return prefix + str
}

const commaNumber = (number) => {
    let str = ''
    const numberLen = number.length
    d3.range(numberLen).forEach(i => {
        str = number[numberLen - i - 1] + str
        if (i % 3 === 2 && i !== numberLen - 1) str = ',' + str
    })
    return str
}

const rankPaint = (rowTable, classTarget, iconText, value) => {
    const tempRank = rowTable.select(classTarget)
    tempRank
        .classed('expand_less', false)
        .classed('expand_more', false)
        .classed('remove', false)
        .classed(iconText, true)
    tempRank.text(value)
}

function ticked(e, svg, nodes_data) {
    let q = d3.geom.quadtree(nodes_data),
        k = e.alpha * 0.075,
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
