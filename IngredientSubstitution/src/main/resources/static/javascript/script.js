am4core.useTheme(am4themes_animated);

var chart = am4core.create("chartdiv", am4plugins_forceDirected.ForceDirectedTree);
var title = chart.titles.create();

title.text = "Thai Ingredients Visualization";
title.fontSize = 25;
title.marginBottom = -30;
title.fontWeight = 600;

chart.legend = new am4charts.Legend();
chart.logo.disabled = true;
chart.zoomable = true;

var series = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries());


// TODO: square represents properties

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
        "name": "Starchy Root, Tuber", "value": 150,
        "children": [
            {name: "Tester1"}
        ]
    }, {
        "name": "Vegetable", "value": 150,
        "children": [
            {
                name: "White Holy Basil",
                value: 120,
                children: [{
                    name: "can cook",
                    image: "https://img5.pic.in.th/file/secure-sv1/image735564af716a4b6e.md.png",
                    value: 100,
                    children: [
                        {name: "Fried", relationship: "forSome"},
                        {name: "Stir-Fried", relationship: "forSome"}]
                },{
                    name: "has benefit",
                    value: 100,
                    children: [
                        {name: "Culinary", relationship: "forSome"},
                        {name: "Health\nPotential", relationship: "forSome"}]
                }, {
                    name: "has color",
                    value: 100,
                    children: [
                        {name: "Green", relationship: "forSome"},
                    ]
                }, {
                    name: "has flavor",
                    value: 100,
                    children: [
                        {name: "Sweet", relationship: "forSome"},
                        {name: "Astringent", relationship: "forSome"}
                    ]
                }, {
                    name: "has shape",
                    value: 100,
                    children: [
                        {name: "Broad", relationship: "forSome"},
                        {name: "Oval", relationship: "forSome"}
                    ]
                }, {
                    name: "has texture",
                    value: 100,
                    children: [
                        {name: "Tender", relationship: "forSome"}]
                }, {
                    name: "has nutrient",
                    value: 100,
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
}];

// Set up data fields
series.dataFields.value = "value";
series.dataFields.name = "name";
series.dataFields.children = "children";
series.dataFields.fixed = "fixed";

// Only top and second level nodes are shown
series.maxLevels = 2;

// Label customization
series.nodes.template.label.text = "[bold]{name}[/]";
series.nodes.template.label.truncate = true;

series.nodes.template.expandAll = false; // 1 level at a time
series.nodes.template.outerCircle.filters.push(new am4core.DropShadowFilter());
series.nodes.template.fillOpacity = 1;

// Configure icons
var icon = series.nodes.template.createChild(am4core.Image);

icon.propertyFields.href = "image";
icon.horizontalCenter = "middle";
icon.verticalCenter = "middle";
icon.width = 80;
icon.height = 50;

// series.nodes.template.circle.disabled = true;
// series.nodes.template.outerCircle.disabled = true;

series.nodes.template.adapter.add("", function (event) {
    series.nodes.template.label.valign = "bottom";
    series.nodes.template.label.dy = 10;
    series.nodes.template.label.fill = am4core.color("#000");

    var icon = series.nodes.template.createChild(am4core.Image);
    icon.propertyFields.href = "image";
    icon.horizontalCenter = "middle";
    icon.verticalCenter = "middle";
    icon.width = 40;
    icon.height = 40;

    series.nodes.template.circle.disabled = true;
    series.nodes.template.outerCircle.disabled = true;
})

// Customize tooltip style for each level
series.nodes.template.adapter.add("tooltipText", function(text, target) {
    if (target.dataItem) {
        switch(target.dataItem.level) {
            case 0:
                return "";
            case 1: // Category
                return "{name}";
            case 2: // Ingredient
                return "{name}";
            case 4: // Property
                return "{parent.parent.name} {parent.name} as {name}.";
        }
    }
    return text;
});

/* Customize links to illustrate the relationship between concepts.
Dash-dotted line represents "existential quantification".*/
series.links.template.adapter.add("strokeDasharray", function(dashArray, target) {
    switch (target.dataItem.dataContext.relationship) {
        case "forSome":
            return "5,5";
    }
    return dashArray;
});

// Customize links
series.links.template.distance = 2.0;
series.links.template.strokeWidth = 8;
series.links.template.strokeOpacity = 1.0

series.fontSize = 12;
series.minRadius = 30;
series.maxRadius = 70;
series.centerStrength = 0.2;

series.nodes.template.events.on("inited", function(event) {
    var targetNode = event.target;
    var targetLevel = targetNode.dataItem.level;

    if (targetLevel === 3) {
        console.log
    }
});

series.nodes.template.events.on("hit", function(event) {
    var targetNode = event.target;
    var targetLevel = targetNode.dataItem.level;

    if (targetNode.isActive) {

        if (targetLevel === 0) { // root node
            series.nodes.template.expandAll = false;
        }

        else {
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

            series.fontSize = 14;

            chart.zoomToDataItem(targetNode.dataItem, 2, true) // zoom in
        }
    }
    else {
        series.fontSize = 12;

        chart.zoomOut();
    }

});



// Function to find a node by its name recursively
// function findNodeByName(nodes, name) {
//     for (let i = 0; i < nodes.length; i++) {
//         if (nodes[i].name === name) {
//             return nodes[i];
//         } else if (nodes[i].children) {
//             let foundNode = findNodeByName(nodes[i].children, name);
//             if (foundNode) {
//                 return foundNode;
//             }
//         }
//     }
//     return null;
// }

// // Recursively revert color for all nodes in the hierarchy
// function revertColorInHierarchy(node) {
//     if (node) {
//         revertColor(node, node.fill);
//         revertColorInHierarchy(node.parent);
//     }
// }
//
// // Revert the color of a node to its original color
// function revertColor(node, color) {
//     if (node && color) {
//         node.fill = color;
//     }
// }

// function appendChildNode(nodeName, childNode) {
//     // Find the node in the data structure by name
//     let nodes = series.data[0].children;
//     let targetNode = findNodeByName(nodes, nodeName);
//
//     // If the target node is found, append the child node
//     if (targetNode) {
//         // Create a child array for the target node if it does not exist
//         if (!targetNode.children) {
//             targetNode.children = [];
//         }
//         targetNode.children.push(childNode);
//         console.log("Successfully append the child node to ", targetNode.name);
//     }
// }
//
// function generateNewChildNode() {
//     let newChildNode;
//
//     return newChildNode;
// }

// let newChildNode = { name: "New", value: 120 };
// appendChildNode("Vegetable", newChildNode);
