const data = {
    "name": "Food Group",
    "children": [{
        "name": "Cereal"
    }, {
        "name": "Egg"
    }, {
        "name": "Fruit"
    }, {
        "name": "Insect"
    }, {
        "name": "Milk"
    }, {
        "name": "Meat, Poultry"
    }, {
        "name": "Pulse, Seed, Nut"
    }, {
        "name": "Shellfish"
    }, {
        "name": "Spice, Condiment"
    }, {
        "name": "Starchy Root, Tuber",
        "children": [
            {name: "Tester1"}
        ]
    }, {
        "name": "Vegetable",
        "children": [
            {
                name: "White Holy Basil",
                children: [{
                    name: "can cook",
                    image: "https://img5.pic.in.th/file/secure-sv1/image735564af716a4b6e.md.png",
                    children: [
                        {name: "Fried", relationship: "forSome"},
                        {name: "Stir-Fried", relationship: "forSome"}]
                },{
                    name: "has benefit",
                    children: [
                        {name: "Culinary", relationship: "forSome"},
                        {name: "Health\nPotential", relationship: "forSome"}]
                }, {
                    name: "has color",
                    children: [
                        {name: "Green", relationship: "forSome"},
                    ]
                }, {
                    name: "has flavor",
                    children: [
                        {name: "Sweet", relationship: "forSome"},
                        {name: "Astringent", relationship: "forSome"}
                    ]
                }, {
                    name: "has shape",
                    children: [
                        {name: "Broad", relationship: "forSome"},
                        {name: "Oval", relationship: "forSome"}
                    ]
                }, {
                    name: "has texture",
                    children: [
                        {name: "Tender", relationship: "forSome"}]
                }, {
                    name: "has nutrient",
                    children: [
                        {name: "Energy", relationship: "forSome"},
                        {name: "Water", relationship: "forSome"}]
                }]
            }, {
                name: "Pepper"
            }
        ]
    }
    ]
}

let i = 0;

const root = d3.hierarchy(data);
const transform = d3.zoomIdentity;
let node, link;

const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;

const svg = d3.select('svg')
    .call(d3.zoom().scaleExtent([1 / 2, 8]).on('zoom', zoomed))
    .append('g')
    .attr('transform', 'translate(40,0)');

const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(function (d) { return d.id; }).distance(400))
    .force('charge', d3.forceManyBody().strength(-500).distanceMax(300))
    .force('center', d3.forceCenter(viewportWidth / 2, viewportHeight / 2))
    .on('tick', ticked)

function update() {
    const nodes = flatten(root)
    const links = root.links()

    link = svg
        .selectAll('.link')
        .data(links, function (d) { return d.target.id })

    link.exit().remove()

    const linkEnter = link
        .enter()
        .append('line')
        .attr('class', 'link')
        .style('stroke', '#000')
        .style('opacity', '0.5')
        .style('stroke-width', 2)

    link = linkEnter.merge(link)

    node = svg
        .selectAll('.node')
        .data(nodes, function (d) { return d.id })

    node.exit().remove()

    const shape = function(d) {
        if (d.depth === 3) { // Relationship
            return "rect";
        } else {
            return "circle"
        }
    }

    const nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('stroke', '#0000')
        .attr('stroke-width', 2)
        .style("fill", color)
        .style('opacity', 1)
        .on('click', clicked)
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))


    nodeEnter.append(function(d) {
        return document.createElementNS('http://www.w3.org/2000/svg', shape(d))})
        .attr("r", 50)
        .attr("width", 50)
        .attr("height", 30)
        .style('fill', color);

    node = nodeEnter.merge(node)
    simulation.nodes(nodes)
    simulation.force('link').links(links)

    nodeEnter.append('text')
        .attr('dy', 25)
        .style("fill", "black")
        .style('text-anchor', 'middle')
        .text(function (d) { return d.data.name; });

}

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

function color(d) {
    return colorScale(d.depth);
}

// function color(d) {
//   return d._children ? "#51A1DC" // collapsed package
//     : d.children ? "#51A1DC" // expanded package
//       : "#F94B4C"; // leaf node
// }

function radius(d) {
    return d._children ? 8
        : d.children ? 8
            : 4
}

function ticked() {
    link
        .attr('x1', function (d) { return d.source.x; })
        .attr('y1', function (d) { return d.source.y; })
        .attr('x2', function (d) { return d.target.x; })
        .attr('y2', function (d) { return d.target.y; })

    node
        .attr('transform', function (d) { return `translate(${d.x}, ${d.y})` })
}

function clicked(d) {
    if (!d3.event.defaultPrevented) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update()
    }
}

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
}

function dragged(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
}

function flatten(root) {
    const nodes = []
    function recurse(node) {
        if (node.children) node.children.forEach(recurse)
        if (!node.id) node.id = ++i;
        else ++i;
        nodes.push(node)
    }
    recurse(root)
    return nodes
}

function zoomed() {
    svg.attr('transform', d3.event.transform)
}

function levenshteinDistance(s1, s2) {
    if (s1.length === 0) return s2.length;
    if (s2.length === 0) return s1.length;

    var matrix = [];

    var i;
    for (i = 0; i <= s2.length; i++) {
        matrix[i] = [i];
    }

    var j;
    for (j = 0; j <= s1.length; j++) {
        matrix[0][j] = j;
    }

    for (i = 1; i <= s2.length; i++) {
        for (j = 1; j <= s1.length; j++) {
            if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1
                    )
                ); // deletion
            }
        }
    }
    return matrix[s2.length][s1.length];
}


function findNode() {
    var itemName = document.getElementById("targetNode").value.toLowerCase();
    var nodes = d3.selectAll(".node");

    nodes.style("opacity", function (d) {
        var distance = levenshteinDistance(d.data.name.toLowerCase(), itemName);
        var threshold = 2;
        if (distance <= threshold) {
            return "1"; // Searched node
        } else {
            return "0";
        }
    });

    d3.selectAll(".link").style("opacity", "0");
}


update() 