const conceptList = [
    "Cereal", "Egg", "Fruit", "Insect", "Milk",
    "Meat/Poultry", "Pulse/Seed/Nut", "Shellfish",
    "Spice", "Starchy Root/Tuber", "Vegetable"
];

const svg = d3.select("svg");

const nodes = conceptList.map(concept => ({ name: concept }));
const centralNode = { name: "FoodGroup" };

const allNodes = [...nodes, centralNode];

// Each link is an object with a source
const links = nodes.map(node => ({ source: centralNode, target: node }));

const simulation = d3.forceSimulation(allNodes)
    .force("link", d3.forceLink(links).id(d => d.name).distance(100))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(400, 300))
    .on("tick", ticked);

const link = svg.selectAll(".link")
    .data(links)
    .enter().append("line")
    .attr("class", "link")
    .attr("stroke", "yellow");

const node = svg.selectAll(".node")
    .data(allNodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", d => d.name === "FoodGroup" ? 20 : 10)
    .attr("fill", d => d.name === "FoodGroup" ? "green" : "steelblue")
    .on('click', function (d) {
        const data = d3.select(this).datum(); // Retrieves clicked element

        var foodGroup = document.getElementById('foodGroup-title').textContent;
        var conList = document.getElementById('concepts').value;
        var concepts = conList.split(',');

        console.log(foodGroup);
        console.log(concepts.toString());

        if (data.name === "Starchy Root/Tuber") {
            d3.select(this).attr("fill", "Orange"); // Highlights color to the clicked node

            // Expands the clicked node
            expandNodes(concepts);
        }
    });

const label = svg.selectAll(".label")
    .data(allNodes)
    .enter().append("text")
    .attr("class", "label")
    .text(d => d.name)
    .attr("text-anchor", "middle")
    .attr("font-size", "15px")
    .attr("fill", "black");

function expandNodes(concepts) {

}

function updateVisualization() {
    const expandedNodes = allNodes.filter(node => node.expanded);

    const updatedLinks = [];

    // Iterate over the nodes and check if they are expanded
    expandedNodes.forEach(expandedNode => {
        links.forEach(link => {
            if (link.target === expandedNode) {
                updatedLinks.push({ source: centralNode, target: expandedNode });
            }
        });
    });

    // Update the link selection
    const linkUpdate = svg.selectAll(".link")
        .data(updatedLinks, d => `${d.source.name}-${d.target.name}`);

    // Remove any links that are no longer needed
    linkUpdate.exit().remove();

    // Add new links
    linkUpdate.enter().append("line")
        .attr("class", "link")
        .attr("stroke", "yellow");

    // Update the positions of the links
    linkUpdate.merge(link)
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
}

// Updates the positions of the nodes and links based on the forces applied
function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    label
        .attr("x", d => d.x)
        .attr("y", d => d.y + 20);
}

// Event listener for mouseover
node.on('mouseover', function (d) {
    d3.select(this)
        .transition()
        .duration(300)
        .attr('r', 15);
    simulation.force('charge', d3.forceManyBody().strength(-200)); // Increase charge force on hover
    simulation.alpha(0.8).restart();
});

// Event listener for mouseout
node.on('mouseout', function (d) {
    d3.select(this)
        .transition()
        .duration(300)
        .attr('r', 10);
    simulation.force('charge', d3.forceManyBody().strength(-100)); // Restore charge force after hover
    simulation.alpha(0.3).restart();
});