function generateAlphabetTable(category) {
    let table = document.querySelector('#alphabetGroup');
    table.style.display = 'block';

    let tableBody = document.getElementById("letterTableBody");
    tableBody.innerHTML = '';

    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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

    let numRows = Math.ceil(letters.length / 6); // number of rows

    for (let i = 0; i < numRows; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < 6; j++) {
            let index = i * 6 + j;
            if (index < letters.length) {
                let cell = document.createElement("td");
                cell.textContent = letters[index];

                cell.addEventListener("click", function(event) {
                    let clickedCell = event.target;
                    let alphabet = clickedCell.textContent;

                    let allCells = document.querySelectorAll("td");
                    allCells.forEach(cell => {
                        cell.style.backgroundColor = '#FFFFFF';
                    });

                    processData(alphabet, 'category_selection');

                    clickedCell.style.backgroundColor = '#5be166';
                });

                row.appendChild(cell);
            }
        }

        tableBody.appendChild(row);
    }
}

function displayAlphabetTable() {
    let input_ingredient = document.getElementById('targetNode');
    let input_property = document.getElementById('propertyNode');
    let options = document.querySelector('.categorySelection input[type="radio"]:checked');

    if (options) {
        let category = options.value;

        input_ingredient.value = '';

        if (input_property) {
            input_property.value = '';
        }

        generateAlphabetTable(category);
    }
}

function addMoreInput() {
    let property = document.getElementById('propertyMenu').value;
    let query = document.querySelector('#targetNode');
    let propertyInputField = document.querySelector('#addedInputField');
    let categoryDropDown = document.querySelector('#categoryField');

    if (property !== 'all') {
        query.style.display = 'none';
        query.value = '';
        clearSuggestions();

        categoryDropDown.style.display = 'block';
        propertyInputField.style.display = 'block';
    } else {
        document.getElementById('propertyNode').value = '';

        clearSuggestions();

        query.style.display = 'block';
        categoryDropDown.style.display = 'none';
        propertyInputField.style.display = 'none';
    }
}

document.getElementById('categoryMenu').addEventListener('change', function() {
    document.getElementById('propertyNode').value = '';
});

///////////// Data Preparation /////////////
async function loadData() {
    try {
        const response = await fetch('/data');
        return await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}


function clearSuggestions() {
    const suggestionList = document.getElementById('suggestionList');
    suggestionList.innerHTML = '';
    suggestionList.style.display = 'none';
}

function clearViz() {
    let svg = d3.select("#visualization");
    svg.selectAll("*").remove();

    let radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radioButton => {
        radioButton.checked = false;
    });

    let table = document.querySelector('#alphabetGroup');
    table.style.display = 'none';
}

async function autoComplete() {
    let query_all = document.getElementById('targetNode').value;
    let query_prop = document.getElementById('propertyNode').value;
    let suggestionList = document.getElementById('suggestionList');

    suggestionList.innerHTML = '';

    try {
        const data = await loadData();

        if (query_all) {
            clearSuggestions();

            let groupedIngredients = groupIngredientsByCategory(data, query_all);
            if (query_all.length > 1) {
                for (let category in groupedIngredients) {
                    if (groupedIngredients.hasOwnProperty(category)) {
                        let categoryListItem = document.createElement('li');
                        categoryListItem.textContent = category;
                        categoryListItem.style.fontWeight = 'bold';
                        categoryListItem.style.borderBottom = '1px solid #dee2e6';
                        categoryListItem.style.pointerEvents = 'none';

                        suggestionList.appendChild(categoryListItem);

                        // Categorize ingredients
                        groupedIngredients[category].forEach(ingredient => {
                            let listItem = document.createElement('li');
                            listItem.textContent = ingredient.item;
                            listItem.addEventListener('click', () => {
                                document.getElementById('targetNode').value = ingredient.item;
                                handleSelection(ingredient);
                            });

                            suggestionList.appendChild(listItem);
                        });

                        suggestionList.style.display = 'block';
                        suggestionList.style.border = '1px solid #dee2e6';
                    }
                }
            } else {
                suggestionList.style.display = 'none';
            }
        } else if (query_prop) {
            if (query_prop.length > 1) {
                let property_option = document.getElementById('propertyMenu').value;
                let listOfProperties = getListOfProperties(property_option);

                listOfProperties.forEach(property => {
                    if (property.toLowerCase().includes(query_prop.toLowerCase())) {
                        let listItem = document.createElement('li');
                        listItem.textContent = property;
                        listItem.addEventListener('click', () => {
                            document.getElementById('propertyNode').value = property;
                            handleSelection(property);
                        });

                        suggestionList.appendChild(listItem);
                        suggestionList.style.display = 'block';
                        suggestionList.style.border = '1px solid #dee2e6';
                    }
                });
            } else {
                suggestionList.style.display = 'none';
            }
        } else if (query_all.length === 0 || query_prop.length === 0) {
            clearSuggestions();
        }
    } catch (e) {
        console.log(e);
    }
}

function getListOfProperties(property_option) {
    let listOfProperties = [];
    let properties = [];

    if (property_option === 'hasBenefit') {
        let benefits = ['Culinary', 'Health Potential'];
        properties.push(...benefits);
    } else if (property_option === 'canCook') {
        let cookingMethods = [
            'Al_Dente', 'Assembled', 'Baked', 'Blanched', 'Blended', 'Boiled',
            'Braised', 'Buttered', 'Chopped', 'Cracked', 'Crushed', 'Diced', 'Dipped',
            'Dried', 'Drizzled', 'Flavored', 'Fresh', 'Fried',
            'Garnished', 'Glazed', 'Grated', 'Grilled', 'Grounded', 'Infused',
            'Marinated', 'Mashed', 'Minced', 'Mixed', 'Pan-Fried', 'Peeled',
            'Pickled', 'Poached', 'Pounded', 'Powdered', 'Raw', 'Reconstituted', 'Rehydrated',
            'Roasted', 'Rubbed', 'Sauteed', 'Scrambled', 'Seasoned', 'Shreded',
            'Simmered', 'Sliced', 'Soaked', 'Spread', 'Sprinkled', 'Steamed', 'Stewed',
            'Stir-Fried', 'Terpenoid', 'Thickened', 'Toasted', 'Torn', 'Wrapped', 'Zested'
        ];
        properties.push(...cookingMethods);
    } else if (property_option === 'hasColor') {
        let colors = [
            'Beige', 'Black', 'Blue', 'Brown', 'Colorful', 'Cream', 'Gold', 'Golden', 'Gray',
            'Green', 'Pink', 'Purple', 'Red', 'RedBrown', 'Silver', 'Tan', 'Transparent', 'White', 'Yellow'
        ];
        properties.push(...colors);
    } else if (property_option === 'hasFlavor') {
        let flavors = [
            'Acidic', 'Astringent', 'Bitter', 'Citrus', 'Cooling', 'Estery', 'Floral', 'Lactonic',
            'Pungent', 'Salty', 'Sour', 'Spicy', 'Sulfury', 'Sweet', 'Tropical', 'Umami'
        ];
        properties.push(...flavors);
    } else if (property_option === 'hasMineral') {
        let minerals = [
            'Calcium', 'Copper', 'Iodine', 'Iron', 'Magnesium', 'Phosphorus', 'Potassium', 'Sodium', 'Zinc'
        ];
        properties.push(...minerals);
    } else if (property_option === 'hasNutrient') {
        let nutrients = [
            'Ash', 'Carbohydrate', 'DietaryFibre', 'Energy', 'Fat', 'Protein', 'Water'
        ];
        properties.push(...nutrients);
    } else if (property_option === 'hasSugar') {
        let sugar = [
            'Sugar'
        ];
        properties.push(...sugar);
    } else if (property_option === 'hasVitamin') {
        let vitamins = [
            'Betacarotene', 'Cholesterol', 'Niacin', 'Retinol', 'Riboflavin', 'Thiamin', 'VitaminA', 'VitaminC', 'VitaminE'
        ];
        properties.push(...vitamins);
    } else if (property_option === 'hasShape') {
        let shapes = [
            'Broad', 'Bundle', 'Canopy', 'Cluster', 'Conical', 'Cubed', 'Curled', 'Curved',
            'Cylindrical', 'EarShaped', 'Feathery', 'Flakes', 'Flat', 'HeartShaped', 'Irregular',
            'LanceShaped', 'Lanceolate', 'Large', 'Line', 'Lobed', 'Long', 'Narrow', 'Oblong',
            'Oval', 'OvateShaped', 'PearShaped', 'PodShaped', 'Pointed', 'Rectangular', 'Round',
            'Segmented', 'Serrated', 'Short', 'Slender', 'SlicedSips', 'Slices', 'SlicesAndCarvings',
            'Small', 'Spherical', 'Sprouted', 'Square', 'StarShaped', 'Starchy', 'Tall', 'Tapered',
            'Tapering', 'Thin', 'Thread', 'Tubular', 'Wavy', 'Wide'
        ];
        properties.push(...shapes);
    } else if (property_option === 'hasTexture') {
        let textures = [
            'Brittle', 'Butter-like', 'Chewy', 'Creamy', 'Crisp', 'Crispy', 'Crunchy', 'Delicate',
            'Dense', 'Fibrous', 'Firm', 'Flaky', 'Fluffy', 'Gelatinous', 'Grainy', 'Gritty', 'Juicy',
            'Leafy', 'Liquid', 'Melting', 'Mild', 'Nutty', 'Powdery', 'Silky', 'Singy', 'Slimy',
            'Slippery', 'Smooth', 'Soft', 'Solid', 'Sticky', 'Tender', 'Tougher', 'Velvety', 'Watery', 'Woody'
        ];
        properties.push(...textures);
    }

    listOfProperties.push(...properties);
    return listOfProperties;
}

function groupIngredientsByCategory(data, query) {
    let matchedIngredients = matchIngredient(data, query);
    let groupedIngredients = {};

    matchedIngredients.forEach(ingredient => {
        if (!groupedIngredients[ingredient.category]) {
            groupedIngredients[ingredient.category] = [];
        }
        groupedIngredients[ingredient.category].push(ingredient);
    });

    return groupedIngredients;
}


function handleSelection(selectedOption) {
    let query_all = document.getElementById('targetNode').value;
    let query_prop = document.getElementById('propertyNode').value;

    clearSuggestions();

    if (query_all) {
        processData(selectedOption, "normal_search", 'all');
    } else if (query_prop) {
        let property_option = document.getElementById('propertyMenu').value;

        processData(selectedOption, 'normal_search', property_option);
    }

}


/**
 * Find a category and a list of possible ingredient of the query.
 * @param data
 * @param query
 * @returns {*[]}
 */
function matchIngredient(data, query) {
    let listOfIngredients = [];

    for (const category in data) {
        for (const item in data[category]) {
            if (item.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(item.toLowerCase())) {
                listOfIngredients.push({item, category}); // Store item along with its category
            }
        }
    }

    return listOfIngredients;
}

function matchProperties(data, query, property) {
    let listOfIngredients = [];
    let category = document.getElementById('categoryMenu').value;

    for (let item in data[category]) {
        let currentItem = data[category][item];
        let propertyValue = currentItem[property];

        if (Array.isArray(propertyValue)) {
            for (let i = 0; i < propertyValue.length; i++) {
                let prop = propertyValue[i];
                if (prop.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(prop.toLowerCase())) {
                        listOfIngredients.push(item); // Store item along with its category
                }
            }
        }

    }

    return listOfIngredients;
}

/**
 * Retrieve ingredients from a specific category with alphabet initialization selection
 * @param data
 * @param alphabet
 * @returns {{children: [{children: ({children: {children: *|null, name: *}[], name: *}|null)[], name}], name: string}}
 */
function retrieveAllIngredients(data, alphabet) {
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

function retrieveIngredientBySearch(data, name) {
    let foodGroupNode;
    let category = name.category;
    let ingredient = name.item;
    let search_ingredient = data[category][ingredient];

    if (search_ingredient["hasBenefit"] === undefined) {
        for (let ingd in data[category]) {
            let curr_item = data[category][ingd];
            if (curr_item["hasBenefit"] && curr_item["hasOtherNames"] && curr_item["hasOtherNames"].includes(ingredient)) {
                search_ingredient = curr_item;
            }
        }
    }

    foodGroupNode = {
        name: "Food Group",
        children: [
            {
                name: category,
                children: [
                    {
                    name: ingredient,
                    children: Object.keys(search_ingredient)
                        .map(property => {
                            if (property === "hasOtherNames") {
                                return {
                                    name: property,
                                    children: data[category][ingredient][property].map(value => ({ name: value }))
                                };
                            } else {
                                return {
                                    name: property,
                                    children: Array.isArray(search_ingredient[property]) ? search_ingredient[property].map(value => ({ name: value })) : null
                                };
                            }
                    })}
                ].filter(Boolean)
            }
        ]
    }
    return foodGroupNode;
}

function retrieveIngredientByProperties(data, query_prop, property_option) {
    let category = document.getElementById('categoryMenu').value;
    let listOfIngredients = matchProperties(data, query_prop, property_option);
    let ingredientChildren = [];
    let foodGroupNode;

    if (Array.isArray(listOfIngredients)) {
            for (let i = 0; i < listOfIngredients.length; i++) {
                let ingredient = listOfIngredients[i];
                let search_ingredient = data[category][ingredient]

                let properties = Object.keys(search_ingredient).map(property => {
                    if (property === "hasOtherNames") {
                        return {
                            name: property,
                            children: search_ingredient[property].map(value => ({ name: value }))
                        };
                    } else {
                        return {
                            name: property,
                            children: Array.isArray(search_ingredient[property]) ? search_ingredient[property].map(value => ({ name: value })) : null
                        };
                    }
                });

                ingredientChildren.push({
                    name: ingredient,
                    children: properties
                });

            }
    }

    if (ingredientChildren.length > 0) {
        foodGroupNode = {
            name: "Food Group",
            children: [{
                name: category,
                children: ingredientChildren
            }]
        }
    }
    return foodGroupNode;
}
async function processData(name, type, property_option) {
    try {
        const data = await loadData();
        let foodGroupNode;

        if (type === 'category_selection') { // Select from category and alphabet
            foodGroupNode = retrieveAllIngredients(data, name);
        } else if (type === 'normal_search') {
            if (property_option === 'all') { // From a search bar
                foodGroupNode = retrieveIngredientBySearch(data, name);
            } else {
                foodGroupNode = retrieveIngredientByProperties(data, name, property_option);
            }
        }

        if (foodGroupNode !== undefined) {
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
        } else {
            alert("No results found for your query.");
        }

    } catch (error) {
        console.error('Error processing data:', error);
    }
}

///////////// Data Preparation /////////////

///////////// D3.js Visualization /////////////
let root;
let zoom = d3.zoom()
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

const centerX = (svgWidth - 500) / 2;
const centerY = (svgHeight + 100) / 2;

svg.attr('transform', `translate(${centerX}, ${centerY})`);

const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().distance(50))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(0, 0))
    .force('collide',d3.forceCollide().radius(30).iterations(2));

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

    if (clickedNode.data.name === 'Food Group') {
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
        } else if (d.data.name === "White" || d.data.name == "Transparent") {
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

