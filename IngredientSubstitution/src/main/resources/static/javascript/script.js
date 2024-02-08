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
                        {name: "Sweet"},
                        {name: "Astringent"}
                    ]
                }, {
                    name: "has shape",
                    children: [
                        {name: "Broad"},
                        {name: "Oval"}
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
    .force('link', d3.forceLink().id(function (d) { return d.id; }).distance(150))
    .force('charge', d3.forceManyBody().strength(-600).distanceMax(300))
    .force('center', d3.forceCenter(viewportWidth / 2, viewportHeight / 2))
    .on('tick', ticked)

function update() {
    const nodes = flatten(root);
    const links = root.links();

    // Update links
    link = svg.selectAll('.link')
        .data(links, function (d) { return d.target.id });

    link.exit().remove();

    const linkEnter = link.enter()
        .append('line')
        .attr('class', 'link')
        .style('stroke', '#b4b4b4')
        .style('opacity', '1')
        .style('stroke-width', 3);

    link = linkEnter.merge(link);

    // Update nodes
    node = svg.selectAll('.node')
        .data(nodes, function (d) { return d.id });

    node.exit().remove();

    const shape = function(d) {
        return d.depth === 3 ? 'rect' : 'circle';
    };

    const nodeEnter = node.enter()
        .append('g')
        .attr('class', 'node')
        .style('fill', color)
        .style('opacity', 1)
        .on('click', clicked)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .style("fill", "orange");
        })
        .on("mouseout", function(event, d) {
            // Restore circle fill color on mouseout
            d3.select(this)
                .style("fill", color);
        })
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))

    nodeEnter.append(function(d) {
        return document.createElementNS('http://www.w3.org/2000/svg', shape(d));
    })
        .attr('r', 15)
        .attr('width', 100)
        .attr('height', 50)
        .style('fill', color);

    node = nodeEnter.merge(node);

    nodeEnter.append('text')
        .attr('dy', 30)
        .attr('dx', 0)
        .style('fill', 'black')
        .style('text-anchor', 'middle')
        .text(function (d) { return d.data.name; });

    svg.selectAll('.node').raise();

    // Update simulation with new nodes and links
    simulation.nodes(nodes);
    simulation.force('link').links(links);

    // simulation.alpha(1).restart();
}

const customColors = ['#9062dd', '#4eb9f2', '#de67b1', '#f9e261', '#7800E1'];
const customColors_Blinders = ['#0077BB', '#33BBEE', '#009988', '#ec7633', '#Cc3311'];

const customColorScale = d3.scaleOrdinal().range(customColors);

function color(d) {
    if (d.depth == 4) {
        if (d.data.name == "Green") {
            return '#49d354';
        } else if (d.data.name == "Red") {
            return '#a90e24';
        } else if (d.data.name == "Beige") {
            return '#dedec3';
        }else if (d.data.name == "Black") {
            return '#000000';
        }else if (d.data.name == "Brown") {
            return '#56350e';
        }else if (d.data.name == "Cream") {
            return '#ded4c3';
        }
        else if (d.data.name == "Gold") {
            return '#b28d1d';
        }
        else if (d.data.name == "Gray") {
            return '#808080';
        }
        else if (d.data.name == "Pink") {
            return '#FFB6C1';
        }
        else if (d.data.name == "Purple") {
            return '#800080';
        }
        else if (d.data.name == "RedBrown") {
            return '#A52A2A';
        }
        else if (d.data.name == "Silver") {
            return '#C0C0C0';
        }
        else if (d.data.name == "Silver") {
            return '#D2B48C';
        }
        else if (d.data.name == "White" || d.data.name == "Transparent") {
            return '#FFFFFF';
        }
        else if (d.data.name == "Yellow") {
            return '#FFFF00';
        }


    }
    return customColorScale(d.depth);
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

        // highlightNode()
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

    if (itemName != '') {
    nodes.style("opacity", function (d) {
        var nodeName = d.data.name.toLowerCase();
        var distance = levenshteinDistance(nodeName, itemName);
        var threshold = 2;

        if (distance <= threshold || nodeName.includes(itemName)) {
            return "1"; // Searched node
        } else {
            return "0";
        }
    });
        d3.selectAll(".link").style("opacity", "0");
    } else {
        nodes.style("opacity", "1");

        d3.selectAll(".link").style("opacity", "1");
    }

}


update()

function highlightNode() {
    const nodes = document.querySelectorAll('.node');

    nodes.forEach(node => {
        node.addEventListener('click', function(event) {
            node.style('opacity', '0');
        });
    });
}