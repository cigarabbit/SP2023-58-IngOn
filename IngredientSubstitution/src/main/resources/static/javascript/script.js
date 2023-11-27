am4core.useTheme(am4themes_animated);

// Create chart
var chart = am4core.create("chartdiv", am4plugins_forceDirected.ForceDirectedTree);

chart.logo.disabled = true;
chart.zoomable = true;

// Create series
var series = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())

series.nodes.template.events.on("hit", function(event) {
    if (event.target.isActive) {
        chart.zoomToDataItem(event.target.dataItem, 2, true) // zoom in
    }
    else {
        chart.zoomOut();
    }});

// Set data
series.data = [{
    "name": "Food Group",
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
        "name": "Meat_Poultry", "value": 150
    }, {
        "name": "Pulse_Seed_Nut", "value": 150
    }, {
        "name": "Shellfish", "value": 150
    }, {
        "name": "Spice_Condiment", "value": 150
    }, {
        "name": "StarchyRoot_Tuber", "value": 150
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
            },{
                name:"A2"
            }
        ]
    }
    ]
}];


// Set up data fields
series.dataFields.value = "value";
series.dataFields.name = "name";
series.dataFields.children = "children";

// Only top and second level nodes are show
series.maxLevels = 2;

// Add labels
series.nodes.template.label.text = "{name}";
series.nodes.template.outerCircle.filters.push(new am4core.DropShadowFilter());

// Customize links
series.links.template.distance = 2;
series.links.template.strokeWidth = 3;

series.fontSize = 12;
series.minRadius = 30;
series.maxRadius = am4core.percent(6);
series.centerStrength = 0.5;


