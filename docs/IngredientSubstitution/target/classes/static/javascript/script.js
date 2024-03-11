// let clickedCell;

function generateAlphabetTable(category) {
    var tableBody = document.getElementById("letterTableBody");
    tableBody.innerHTML = '';

    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    if (category === 'Cereal') {
        letters = letters.replace(/[AEIKQTXZ]/g, '');
    } else if (category === 'Egg') {
        letters = letters.replace(/[ABEFIJKLNOPTUVXYZ]/g, '');
    } else if (category === 'Fruit') {
        letters = letters.replace(/[EQVXZ]/g, '');
    } else if (category === 'Insect') {
        letters = letters.replace(/[ABCDEGHIJKLNOPQSUVWXYZ]/g, '');
    } else if (category === 'Milk') {
        letters = letters.replace(/[ABDEFIJKLNOQRTVWXYZ]/g, '');
    } else if (category === 'Meat_Poultry') {
        letters = letters.replace(/[AEHIKLMNOUVWXYZ]/g, '');
    } else if (category === 'Pulse_Seed_Nut') {
        letters = letters.replace(/[AHIKNOQUVXYZ]/g, '');
    } else if (category === 'Shellfish') {
        letters = letters.replace(/[QUVXZ]/g, '');
    } else if (category === 'Spice_Condiment') {
        letters = letters.replace(/[AEFHIJNOPQRTUVXYZ]/g, '');
    } else if (category === 'StarchyRoot_Tuber') {
        letters = letters.replace(/[ADEFGHIJKLMNOPQTUVWXYZ]/g, '');
    }  else if (category === 'Vegetable') {
        letters = letters.replace(/[VXZ]/g, '');
    }

    var numRows = Math.ceil(letters.length / 6); // number of rows

    for (let i = 0; i < numRows; i++) {
        var row = document.createElement("tr");

        for (let j = 0; j < 6; j++) {
            var index = i * 6 + j;
            if (index < letters.length) {
                var cell = document.createElement("td");
                cell.textContent = letters[index];

                cell.addEventListener("click", function(event) {
                    let clickedCell = event.target;
                    let alphabet = clickedCell.textContent;

                    var allCells = document.querySelectorAll("td");
                    allCells.forEach(cell => {
                        cell.style.backgroundColor = '#FFFFFF';
                    });

                    processData(alphabet);

                    clickedCell.style.backgroundColor = '#5be166';
                });

                row.appendChild(cell);
            }
        }

        tableBody.appendChild(row);
    }
}

function displayAlphabetTable() {
    let options = document.querySelector('.categorySelection input[type="radio"]:checked');

    if (options) {
        let category = options.value;

        generateAlphabetTable(category);
    }
}

///////////// D3.js Visualization /////////////
let root;
var zoom = d3.zoom()
    .scaleExtent([1 / 2, 8])
    .on('zoom', zoomed);

let i = 0;
let node, link;

const transform = d3.zoomIdentity;

const svg = d3.select('svg')
    .call(zoom)
    .append('g')

const svgElement = document.querySelector('svg');
const svgWidth = svgElement.getBoundingClientRect().width;
const svgHeight = svgElement.getBoundingClientRect().height;

const centerX = svgWidth / 2;
const centerY = svgHeight / 2;

svg.attr('transform', `translate(${centerX}, ${centerY})`);

const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(function (d) {
        return d.id;
    }).distance(350))
    .force('charge', d3.forceManyBody().strength(-650).distanceMax(300))
    .force('center', d3.forceCenter(0, 0))

///////////// Data Preparation /////////////
async function loadData() {
    try {
        const response = await fetch('/data');
        return await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function retrieveIngredients(data, alphabet) {
    let options = document.querySelector('.categorySelection input[type="radio"]:checked');
    let category_selected, foodGroupNode;

    if (options) {
        category_selected = options.value;
    }

    if (category_selected in data) {
        foodGroupNode = {
            name: "Food Group",
            children: [
                {
                    name: category_selected,
                    children: Object.keys(data[category_selected])
                        .filter(key => key.startsWith(alphabet)) // filter with alphabet
                        .map(key => {
                            const categoryItem = data[category_selected][key];
                            if ("hasBenefit" in categoryItem && categoryItem["hasBenefit"].length > 0) {
                                return {
                                    name: key,
                                    children: Object.keys(categoryItem).map(property => ({
                                        name: property,
                                        children: Array.isArray(categoryItem[property]) ? categoryItem[property].map(value => ({name: value})) : null
                                    })).filter(Boolean)
                                };
                            } else {
                                return null;
                            }
                    }).filter(Boolean)
                }
            ]
        };
    }

    return foodGroupNode;
}

async function processData(alphabet) {
    try {
        const data = await loadData(); // Wait for the promise to resolve
        const foodGroupNode = retrieveIngredients(data, alphabet);

        root = d3.hierarchy(foodGroupNode);

        update(root);

        var nodes = d3.selectAll(".node");
        var links = d3.selectAll(".link");

        nodes.style('opacity', function (node) {
            return node.depth > 2 ? '0' : '1';
        })
            .style('pointer-events', function (node) {
                return node.depth > 2 ? 'none' : 'all';
            })

        links.style('opacity', function (link) {
            if (link.source.depth > 2 || link.target.depth > 2) {
                return '0';
            } else {
                return '1';
            }
        })
            .style('pointer-events', function (link) {
                return (link.source.depth > 2 || link.target.depth > 2) ? 'none' : 'all';
            });

    } catch (error) {
        console.error('Error processing data:', error);
    }
}


///////////// Data Preparation /////////////

function update(root) {
    const nodes = flatten(root);
    const links = root.links();
    const shape = function (d) {
        return d.depth === 3 ? 'line' : 'circle';
    };
    const dashDottedLine = function (d) {
        // Display relationship between the ingredient and its properties
        if ((d.source.depth === 2 && d.target.depth === 3) || (d.source.depth === 3 && d.target.depth === 2) ||
            (d.source.depth === 3 && d.target.depth === 4) || (d.source.depth === 4 && d.target.depth === 3)) {
            return '5,3';
        } else {
            return '0';
        }
    };
    const nodePointer = function (d) {
        if (d.depth > 2) {
            return 'none';
        } else {
            return 'all';
        }
    }

    const distanceCustomization = function (d) {
        if ((d.source.depth === 3 && d.target.depth === 4) || (d.source.depth === 4 && d.target.depth === 3)) {
            return 150;
        } else {
            return 200;
        }
    };

    simulation.on('tick', ticked);

    // Update links
    link = svg.selectAll('.link')
        .data(links, function (d) {
            return d.target.id
        });

    link.exit().remove();

    const linkEnter = link.enter()
        .append('line')
        .attr('class', 'link')
        .style('stroke', '#b4b4b4')
        .style('opacity', '1')
        .style('stroke-width', 3)
        .style('stroke-dasharray', dashDottedLine);

    link = linkEnter.merge(link);

    // Update nodes
    node = svg.selectAll('.node')
        .data(nodes, function (d) {
            return d.id
        });

    node.exit().remove();

    const nodeEnter = node.enter()
        .append('g')
        .attr('class', 'node')
        .style('fill', color)
        .style('opacity', 1)
        .style('pointer-events', nodePointer)
        .on('click', clicked)
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))

    nodeEnter.append(function (d) {
        return document.createElementNS('http://www.w3.org/2000/svg', shape(d));
    })
        .attr('r', 20)
        .style('fill', color);

    node = nodeEnter.merge(node);

    nodeEnter.append('text')
        .attr('dy', 35)
        .attr('dx', 0)
        .style('fill', 'black')
        .style('text-anchor', 'middle')
        .text(function (d) {
            return d.data.name;
        });

    svg.selectAll('.node').raise();

    // Update simulation with new nodes and links
    simulation.nodes(nodes);
    simulation.force('link').links(links);
    simulation.force('link', d3.forceLink(links).id(d => d.id).distance(distanceCustomization));
    simulation.on('tick', ticked);
    simulation.alpha(1).restart();
}


function ticked() {
    link
        .attr('x1', function (d) {
            return d.source.x;
        })
        .attr('y1', function (d) {
            return d.source.y;
        })
        .attr('x2', function (d) {
            return d.target.x;
        })
        .attr('y2', function (d) {
            return d.target.y;
        })

    node
        .attr('transform', function (d) {
            return `translate(${d.x}, ${d.y})`
        })
}

function focusNode(node) {
    d3.selectAll('.node').classed('focused', false);
    d3.select(node).classed('focused', true);
}

function zoomToFocused() {
    var focusedNode = d3.select('.focused').node();

    if (focusedNode) {
        var rect = focusedNode.getBoundingClientRect();

        var translateX = svgWidth - (rect.x + rect.width / 2);
        var translateY = svgHeight - (rect.y + rect.height / 2);

        var svg = d3.select('svg');
        var zoomScale = 1.1;

        svg.transition()
            .duration(600)
            .call(zoom.transform, d3.zoomIdentity
                .translate(translateX, translateY)
                .scale(zoomScale));
    }
}

function clicked(clickedNode) {

    var nodes = d3.selectAll(".node");
    var links = d3.selectAll(".link");

    console.log(clickedNode.data.name);

    if (clickedNode.data.name == 'Food Group') {
        window.location.reload();
        return;
    }

    var clickedNodeId = clickedNode.data.id; // Store the ID of the clicked node
    var rootNode = d3.select(this).datum();
    var childrenNodes = rootNode.descendants().filter(function (d) {
        return d.depth > clickedNode.depth && d.parent && d.parent.data.id === clickedNodeId; // Filter children nodes of the clicked node
    });

    if (!clickedNode.children) {
        clickedNode._children = clickedNode.children;
        clickedNode.children = null;
    } else {
        clickedNode.children = clickedNode._children;
        clickedNode._children = null;
    }

    focusNode(this);
    zoomToFocused();

    nodes.style('opacity', function (node) {
        if (node.depth === 0 || node === clickedNode ||
            node.parent === clickedNode || clickedNode.parent === node) {
            return '1';
        } else if (clickedNode.depth === 2 && childrenNodes.includes(node)) {
            if (node.depth === 3 || node.depth === 4) {
                return '1';
            }
        }
        return '0';
    })
        .style('pointer-events', function (node) {
            if (node.depth < 3) {
                return 'all';
            } else return 'none';
        });

    links.style('opacity', function (link) {
        if (link.source === clickedNode || link.target === clickedNode) {
            return '1';
        } else if (clickedNode.depth === 1) { // Category selected
            if (childrenNodes.includes(link.source)) {
                if (link.source.depth === 1 || link.target.depth === 2) {
                    return '1';
                }
            }
        } else if (clickedNode.depth === 2) { // Ingredient selected
            if (link.source.depth === 0 && (link.target.depth === 1 && link.target === clickedNode.parent)) {
                return '1'; // Display category
            }
            if ((link.source.depth === 3 && link.target.depth === 4) &&
                (link.source.parent === clickedNode || link.target.parent === clickedNode)) {
                return '1'; // Every property within an ingredient
            }
        }
        return '0';
    });

    simulation.alpha(1).restart();
}

const customColors = ['#4eb9f2', '#de67b1', '#f9e261', '#7800E1'];
const colors = ['#00376b', '#42768a', '#009E9A', '#E08353', '#D8553A', '#A11D33FF', '#FB6F92FF', '#c1a3de', '#BFA13D', '#00994D', '#86378f'];

const customColorScale = d3.scaleOrdinal().range(customColors);

function color(d) {
    if (d.depth === 0) {
        return '#9062dd';
    }
    if (d.depth === 1) {
        return colors[d.parent.children.indexOf(d)];
    } else if (d.depth === 4) {
        if (d.data.name == "Green") {
            return '#49d354';
        } else if (d.data.name == "Red") {
            return '#a90e24';
        } else if (d.data.name == "Beige") {
            return '#dedec3';
        } else if (d.data.name == "Black") {
            return '#000000';
        } else if (d.data.name == "Brown") {
            return '#56350e';
        } else if (d.data.name == "Cream") {
            return '#ded4c3';
        } else if (d.data.name == "Gold") {
            return '#b28d1d';
        } else if (d.data.name == "Gray") {
            return '#808080';
        } else if (d.data.name == "Pink") {
            return '#FFB6C1';
        } else if (d.data.name == "Purple") {
            return '#800080';
        } else if (d.data.name == "RedBrown") {
            return '#A52A2A';
        } else if (d.data.name == "Silver") {
            return '#C0C0C0';
        } else if (d.data.name == "Silver") {
            return '#D2B48C';
        } else if (d.data.name == "White" || d.data.name == "Transparent") {
            return '#FFFFFF';
        } else if (d.data.name == "Yellow") {
            return '#FFFF00';
        }
    }
    return customColorScale(d.depth);
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
    var links = d3.selectAll(".link");
    var relationshipList = ['can cook', 'has benefit', 'has shape', 'has flavor',
        'has nutrient', 'has vitamin', 'has mineral', 'has sugar', 'has texture', 'has color']
    var isNotInRelationshipList = true;

    let parentNode, rootNode;

    for (var i = 0; i < relationshipList.length; i++) {
        if (relationshipList[i].includes(itemName)) {
            isNotInRelationshipList = false;
            break;
        }
    }

    if (itemName != '' && isNotInRelationshipList) {
        nodes.style("opacity", function (d) {
            var nodeName = d.data.name.toLowerCase();
            var distance = levenshteinDistance(nodeName, itemName);
            var threshold = 2;

            if (distance <= threshold || nodeName.includes(itemName) || d === parentNode || d === rootNode) {
                if (d.depth === 4) { // Properties
                    parentNode = d.parent;
                    rootNode = parentNode.parent;
                }

                focusNode(this);
                zoomToFocused();

                return "1"; // Searched node
            } else {
                return "0";
            }
        });

        links.style("opacity", function (d) {
            if (d.source === rootNode && d.target === parentNode || d.source.data.name.toLowerCase() === itemName ||
                d.target.data.name.toLowerCase() === itemName) {
                return "1";
            } else {
                return "0";
            }
        });
    } else if (itemName == '') {
        window.location.reload();
    }

}

