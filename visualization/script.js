const data = {
    "id": "Food Group",
    "children": [
        { "id": "Cereal" },
        { "id": "Egg" },
        { "id": "Insect" },
        { "id": "Vegetable", "children": [{ "id": "White Holy Basil" }] },
        { "id": "Milk" },
        { "id": "Meat, Poultry" },
        { "id": "Pulse, Seed, Nut" },
        { "id": "Shellfish" },
        { "id": "Spice, Condiment" },
        { "id": "Starchy Root, Tuber" }
    ]
};

// Set up the dimensions of the SVG container
const width = window.innerWidth, height = window.innerHeight;

// Create an SVG container
const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

// Create a force simulation
const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2));

// Create links and nodes
const links = [];
const nodes = [data];

data.children.forEach(child => {
    links.push({ source: data.id, target: child.id });
    if (child.children) {
        child.children.forEach(grandchild => {
            links.push({ source: child.id, target: grandchild.id });
            nodes.push(grandchild);
        });
    }
    nodes.push(child);
});

// Add links
const link = svg.selectAll(".link")
    .data(links)
    .enter().append("line")
    .attr("class", "link");

// Color scale
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Add nodes
const node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 15)
    .style("fill", (d, i) => colorScale(i))
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

// Add node labels
const labels = svg.selectAll(".label")
    .data(nodes)
    .enter().append("text")
    .attr("class", "label")
    .attr("dy", 4)
    .text(d => d.id);

// Update simulation with nodes and links
simulation
    .nodes(nodes)
    .on("tick", ticked);

simulation.force("link")
    .links(links);

    function collapse(d) {
        console.log("click ", d);
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

// Function to update node and link positions
function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    labels
        .attr("x", d => d.x)
        .attr("y", d => d.y + 35)
        .attr("text-anchor", "middle") // Center the text horizontally
}

// Reheat the simulation when drag starts, and fix the subject position.
function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }