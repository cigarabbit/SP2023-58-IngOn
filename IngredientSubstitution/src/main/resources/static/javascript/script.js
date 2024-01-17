am4core.useTheme(am4themes_animated);

var chart = am4core.create("chartdiv", am4plugins_forceDirected.ForceDirectedTree);
chart.legend = new am4charts.Legend();
chart.logo.disabled = true;
chart.zoomable = true;

var series = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries());

// Store a reference to the last clicked node and its previous color
var lastClickedNode = null;
var lastClickedNodeColor = null;

// Set data
series.data = [{
    "name": "Food Group",
    "fixed": true,
    "value": 300,
    "children": [{
        "name": "Cereal", "value": 150
    }, {
        "name": "Egg", "value": 150
    }, {
        "name": "Fruit", "value": 150
    }, {
        "name": "Insect", "value": 150
    }, {
        "name": "Milk", "value": 150
    }, {
        "name": "Meat, Poultry", "value": 150
    }, {
        "name": "Pulse, Seed, Nut", "value": 150
    }, {
        "name": "Shellfish", "value": 150
    }, {
        "name": "Spice, Condiment", "value": 150
    }, {
        "name": "StarchyRoot, Tuber", "value": 150,
        "children": [
            {name: "Tester1"}
        ]
    }, {
        "name": "Vegetable", "value": 150,
        "children": [
            {
                name: "White\nHoly Basil",
                value: 120,
                children: [{
                    name: "canCook",
                    value: 100,
                    children: [
                        {name: "Fried"},
                        {name: "Stir-Fried"}]
                },{
                    name: "hasBenefit",
                    value: 100,
                    children: [
                        {name: "Culinary"},
                        {name: "Health\nPotential"}]
                }, {
                    name: "hasColor",
                    value: 100,
                    children: [
                        {name: "Green"},
                    ]
                }, {
                    name: "hasFlavor",
                    value: 100,
                    children: [
                        {name: "Sweet"},
                        {name: "Astringent"}
                    ]
                }, {
                    name: "hasShape",
                    value: 100,
                    children: [
                        {name: "Broad"},
                        {name: "Oval"}
                    ]
                }, {
                    name: "hasTexture",
                    value: 100,
                    children: [
                        {name: "Tender"}]
                }, {
                    name: "hasNutrient",
                    value: 100,
                    children: [
                        {name: "Energy "},
                        {name: "Water"}]
                }
                ]
            }
        ]
    }
    ]
}];

// Set up data fields
series.dataFields.value = "value";
series.dataFields.name = "name";
series.dataFields.children = "children";
series.dataFields.fixed = "fixed";

// Only top and second level nodes are shown
series.maxLevels = 2;

// Add labels
series.nodes.template.label.text = "{name}";
series.nodes.template.tooltipText = "{name}";
series.nodes.template.expandAll = false; // 1 level at a time
series.nodes.template.outerCircle.filters.push(new am4core.DropShadowFilter());

// Customize links
series.links.template.distance = 1.5;
series.links.template.strokeWidth = 5;
series.links.template.strokeOpacity = 1;

series.fontSize = 12;
series.minRadius = 30;
series.maxRadius = 70;
series.centerStrength = 0.1;

series.nodes.template.events.on("hit", function(event) {
    var targetNode = event.target;

    // revertColor(lastClickedNode, lastClickedNodeColor);
    //
    // lastClickedNode = targetNode;
    // lastClickedNodeColor = targetNode.fill;

    if (targetNode.isActive) {
        var targetLevel = targetNode.dataItem.level;

        if (targetLevel == 0) {
            series.nodes.template.expandAll = false;
        }

        series.nodes.each(function(node) {
            if (targetNode !== node) {
                if (targetNode !== node && node.isActive && targetLevel === node.dataItem.level) {
                    node.isActive = false;
                }
                if (targetLevel == 1 && targetLevel === node.dataItem.level) {
                    node.hide();
                }

            }
        });

        chart.zoomToDataItem(event.target.dataItem, 2, true) // zoom in

    }
    else {
        targetNode.show();
        chart.zoomOut();
    }

});

// Function to find a node by its name recursively
function findNodeByName(nodes, name) {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].name === name) {
            return nodes[i];
        } else if (nodes[i].children) {
            let foundNode = findNodeByName(nodes[i].children, name);
            if (foundNode) {
                return foundNode;
            }
        }
    }
    return null;
}

// Recursively revert color for all nodes in the hierarchy
function revertColorInHierarchy(node) {
    if (node) {
        revertColor(node, node.fill);
        revertColorInHierarchy(node.parent);
    }
}

// Revert the color of a node to its original color
function revertColor(node, color) {
    if (node && color) {
        node.fill = color;
    }
}

function appendChildNode(nodeName, childNode) {
    // Find the node in the data structure by name
    let nodes = series.data[0].children;
    let targetNode = findNodeByName(nodes, nodeName);

    // If the target node is found, append the child node
    if (targetNode) {
        // Create a child array for the target node if it does not exist
        if (!targetNode.children) {
            targetNode.children = [];
        }
        targetNode.children.push(childNode);
        console.log("Successfully append the child node to ", targetNode.name);
    }
}

function generateNewChildNode() {
    let newChildNode;

    return newChildNode;
}

let newChildNode = { name: "New", value: 120 };
// appendChildNode("Vegetable", newChildNode);
