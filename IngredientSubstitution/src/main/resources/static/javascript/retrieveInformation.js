window.addEventListener('load', function () {
    setThaiName();
    retrieveData();
    changeColor();
});

async function loadData() {
    try {
        const response = await fetch('/data');
        return await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

async function setThaiName() {
    let sidebarTopics = document.querySelectorAll('#sidebar-ingredient ul li a');
    let ingredientTopic = document.getElementById('resultHeaderSpan');

    if (sidebarTopics.length > 0) {
        sidebarTopics.forEach(function(topicElement) {
            let synNames = otherNames[topicElement.textContent];

            if (synNames !== undefined) {
                for (const index in synNames) {
                    const name = synNames[index];

                    if (containsThai(name)) {
                        topicElement.textContent += ' (' + name + ')';
                    }
                }

            }
        });


        if (ingredientTopic) {
            try {
                const data = await loadData();
                let thaiTopic = findThaiNameByEnglishName(data, ingredientTopic.textContent);

                if (thaiTopic !== undefined) {
                    ingredientTopic.textContent += ' (' + thaiTopic + ')';
                }
            } catch (e) {
                console.log(e)
            }
        }
    } else {
        try {
            const data = await loadData();

            let possibleIngredient = document.querySelectorAll('.ingredientButton');
            let ingredientList = document.querySelectorAll('.substitution-key');

            if (possibleIngredient) {
                possibleIngredient.forEach(button => {
                    let englishName = button.textContent;
                    let thaiName = findThaiNameByEnglishName(data, englishName);

                    if (thaiName !== undefined && !button.nextElementSibling.classList.contains('thai-name')) {
                        button.setAttribute('data-thai-name', thaiName);
                        button.insertAdjacentHTML('afterend', '<span class="thai-name"> (' + thaiName + ')</span>');
                    }
                });
            }

            if (ingredientTopic) {
                ingredientList.forEach(substitution => {
                    let englishName = substitution.textContent;
                    let thaiName = findThaiNameByEnglishName(data, englishName);

                    if (thaiName !== undefined) {
                        substitution.textContent += ' (' + thaiName + ')';

                    }
                });
            }

        } catch (e) {
            console.log(e);
        }
    }
}

function findThaiNameByEnglishName(data, englishName) {
    for (let category in data) {
        for (let ingredient in data[category]) {
            if (ingredient === englishName) {
                let curr_ingredient = data[category][ingredient];
                if ('hasOtherNames' in curr_ingredient) {
                    let synName = curr_ingredient['hasOtherNames'];
                    for (let eachName of synName) {
                        if (containsThai(eachName)) {
                            return eachName;
                        }
                    }
                }
            }

        }
    }
}


function setConceptList(group, colors, flavors, minerals, nutris, sugar, vitas, shapes, textures, benes, cooks, names, types) {
    foodGroup = group;
    colorProp = colors;
    flavorProp = flavors;
    mineralProp = minerals;
    nutriProp = nutris;
    vitaProp = vitas;
    sugarProp = sugar;
    shapeProp = shapes;
    textureProp = textures;
    beneProp = benes;
    cookProp = cooks;
    otherNames = names;
    typeProp = types;
}

let clickedTopic;

function retrieveData () {
    let sidebarTopics = document.querySelectorAll('#sidebar-ingredient ul li a');
    let contentHeader = document.querySelector('#ingredient-title');

    var DL_Display = document.querySelector('#DL_Syntax span');
    var colorPropLi = document.querySelector('#propertyColor span');
    var flavorPropLi = document.querySelector('#propertyFlavor span');
    var shapePropLi = document.querySelector('#propertyShape span');
    var texturePropLi = document.querySelector('#propertyTexture span');
    var typePropLi = document.querySelector('#propertyType span');


    var mineralPropLi = document.querySelector('#propMineral div');
    var nutriPropLi = document.querySelector('#propNutrient div');
    var sugarPropLi = document.querySelector('#propSugar div');
    var vitaPropLi = document.querySelector('#propVitamin div');

    var benePropLi = document.querySelector('#benefits');
    var cookPropLi = document.querySelector('#cooking-types');

    function handleTopicClick(event) {
        sidebarTopics.forEach(topic => {
            topic.classList.remove('active-topic');
        });

        event.target.classList.add('active-topic');

        let prev_clickedTopic = event.target.textContent;
        contentHeader.textContent = prev_clickedTopic;

        clickedTopic = prev_clickedTopic.replace(/\(.*?\)/g, '').trim();
        let DL_Concept = clickedTopic;

        let synName;
        let category = document.getElementById('foodGroupTitle');
        let vizButton = document.querySelector('#vizButton');

        for (let ingredient in group) {
            if (ingredient === clickedTopic) {
                category.innerHTML = group[clickedTopic];
                foodGroup = group[clickedTopic];
                changeColor();
                break;
            }
        }

        // Visualize a clicked ingredient
        vizButton.addEventListener('click', function () {
            visualize(clickedTopic, category.innerHTML);
        })

        if (otherNames[clickedTopic] != undefined) {
            synName = otherNames[clickedTopic];

            for (const index in synName) {
                const name = synName[index];

                if (!containsThai(name) && beneProp[name] === undefined) { // Other names
                    contentHeader.append(', ');
                    contentHeader.append(name);

                    DL_Concept += ' ≡ '; // Display in a DL syntax
                    DL_Concept += name;
                }
            }
        }

        DL_Concept += ' ⊑ ' + foodGroup;

        var colors = colorProp[clickedTopic].join(', ');
        var flavors = flavorProp[clickedTopic].join(', ');

        var shapes;
        if (shapeProp[clickedTopic] !== undefined) {
            shapes = shapeProp[clickedTopic].join(', ');
        } else {
            shapes = "No shapes available because it lacks standard recording methods.";
        }

        var textures;
        if (textureProp[clickedTopic] !== undefined) {
            textures = textureProp[clickedTopic].join(', ');
        } else {
            textures = "No textures defined."
        }

        var types;
        if (typeProp[clickedTopic] !== undefined) {
            types = typeProp[clickedTopic].join(', ');
        } else {
            types = "No types defined."
        }

        var minerals;
        if (mineralProp[clickedTopic] !== undefined) {
            minerals = mineralProp[clickedTopic].join(', ');
        } else {
            minerals = "It does not have any minerals.";
        }

        var nutris;
        if (nutriProp[clickedTopic] !== undefined) {
            nutris = nutriProp[clickedTopic].join(', ');
        } else {
            nutris = "It does not have any nutrients.";
        }

        var sugar;
        if (sugarProp[clickedTopic] !== undefined) {
            sugar = sugarProp[clickedTopic].join(', ');
        } else {
            sugar = "It does not have any sugars.";
        }

        var vitas;
        if (vitaProp[clickedTopic] !== undefined) {
            vitas = vitaProp[clickedTopic].join(', ');
        } else {
            vitas = "It does not have any vitamins.";
        }

        var benes = beneProp[clickedTopic].join(', ');

        var cooks;
        if (cookProp[clickedTopic] !== undefined) {
            cooks = cookProp[clickedTopic].join(', ');
        } else {
            cooks = "It does not have any cooking types.";
        }

        var DLSyntax = getDLSyntax(DL_Concept, cooks, colors, flavors, shapes, textures, minerals, nutris, sugar, vitas, benes, types);

        DL_Display.innerHTML = '';
        colorPropLi.innerHTML = '';
        flavorPropLi.innerHTML = '';
        shapePropLi.innerHTML = '';
        texturePropLi.innerHTML = '';
        typePropLi.innerHTML = '';

        mineralPropLi.innerHTML = '';
        nutriPropLi.innerHTML = '';
        sugarPropLi.innerHTML = '';
        vitaPropLi.innerHTML = '';
        benePropLi.innerHTML = '';
        cookPropLi.innerHTML = '';

        if (mineralProp[clickedTopic] !== undefined) {
            mineralProp[clickedTopic].forEach(function(mineral) {
                var span = document.createElement('span');
                span.textContent = mineral;
                span.classList.add('nutrient-item');

                mineralPropLi.appendChild(span);
            });
        } else {
            var span = document.createElement('span');
            span.textContent = minerals;
            span.classList.add('nutrient-item');

            mineralPropLi.appendChild(span);
        }

        if (nutriProp[clickedTopic] !== undefined) {
            nutriProp[clickedTopic].forEach(function(nutri) {
                var span = document.createElement('span');
                span.textContent = nutri;
                span.classList.add('nutrient-item');

                nutriPropLi.appendChild(span);
            });
        } else {
            var span = document.createElement('span');
            span.textContent = nutris;
            span.classList.add('nutrient-item');

            nutriPropLi.appendChild(span);
        }

        if (sugarProp[clickedTopic] !== undefined) {
            sugarProp[clickedTopic].forEach(function(mineral) {
                var span = document.createElement('span');
                span.textContent = sugar;
                span.classList.add('nutrient-item');

                sugarPropLi.appendChild(span);
            });
        } else {
            var span = document.createElement('span');
            span.textContent = sugar;
            span.classList.add('nutrient-item');

            sugarPropLi.appendChild(span);
        }

        if (vitaProp[clickedTopic] !== undefined) {
            vitaProp[clickedTopic].forEach(function(vita) {
                var span = document.createElement('span');
                span.textContent = vita;
                span.classList.add('nutrient-item');

                vitaPropLi.appendChild(span);
            });
        } else {
            var span = document.createElement('span');
            span.textContent = vitas;
            span.classList.add('nutrient-item');

            vitaPropLi.appendChild(span);
        }

        DL_Display.append(DLSyntax);
        colorPropLi.append(colors);
        flavorPropLi.append(flavors);
        shapePropLi.append(shapes);
        texturePropLi.append(textures);
        typePropLi.append(types);
        benePropLi.append(benes);
        cookPropLi.append(cooks);
    }

    sidebarTopics.forEach(function (topic) {
        topic.addEventListener('click', handleTopicClick);
    });

    // Display the first ingredient of that category by default
    if (sidebarTopics.length > 0) {
        sidebarTopics[0].click();
    }
}

/**
 * Compare a query with given ingredient from list of substitutions.
 */
document.addEventListener('DOMContentLoaded', function() {
    let compButton = document.querySelector('#compButton');
    if (compButton) {
        compButton.addEventListener('click', function() {
            let queryName = document.getElementById('resultHeaderSpan').innerHTML;
            queryName = queryName.replace(/\(.*?\)/g, '');

            displayCompareDetails(queryName, clickedTopic);
        });
    }
});

function containsThai(text) {
    const thaiRegex = /[\u0E00-\u0E7F]/; // Thai Unicode range
    return thaiRegex.test(text);
}

function getDLSyntax(syntax, cooks, colors, flavors, shapes, textures, minerals, nutris, sugar, vitas, benes, types) {
    function handleProperty(property, type) {
        if (property.includes(',')) {
            var propertyList = property.split(',');
            propertyList.forEach(function(prop) {
                prop = prop.replace(/\s/g, '');
                syntax += ' ⊓ ∃ ' + type + prop;
            });
        } else {
            syntax += ' ⊓ ∃ ' + type + property;
        }
    }
    handleProperty(cooks, 'canCook.');
    handleProperty(benes, 'hasBenefit.');
    handleProperty(colors, 'hasColor.');
    handleProperty(flavors, 'hasFlavor.');
    handleProperty(shapes, 'hasShape.');
    handleProperty(textures, 'hasTexture.');
    handleProperty(minerals, 'hasMineral.');
    handleProperty(nutris, 'hasNutrient.');
    handleProperty(sugar, 'hasSugar.');
    handleProperty(vitas, 'hasVitamin.');
    handleProperty(types, 'hasType.');

    return syntax;
}

function changeColor() {
    let foodGroup = document.getElementById('foodGroupTitle');
    let imgElement = document.getElementById('foodtype-img');

    if (foodGroup && imgElement) {
        var colorBase, colorSub;

        foodGroup = foodGroup.textContent;

        if (foodGroup === 'Cereal') {
            colorBase = 'rgb(0, 55, 107)';
            colorSub = 'rgb(0, 116, 217)';

            imgElement.src = 'img/category/cereal.png';
        } else if (foodGroup === 'Egg') {
            colorBase = 'rgb(66, 118, 138)';
            colorSub = 'rgb(106,176,201)';

            imgElement.src = 'img/category/egg.png';
        } else if (foodGroup === 'Fruit') {
            colorBase = 'rgb(0, 158, 154)';
            colorSub = 'rgb(110, 197, 193)';

            imgElement.src = 'img/category/fruit.png';

        } else if (foodGroup === 'Insect') {
            colorBase = 'rgb(224, 131, 83)';
            colorSub = 'rgb(232, 165, 132)';

            imgElement.src = 'img/category/insect.png';
        } else if (foodGroup === 'Milk') {
            colorBase = 'rgb(216, 85, 58)';
            colorSub = 'rgb(225, 122, 101)';

            imgElement.src = 'img/category/milk.png';
        } else if (foodGroup === 'Meat_Poultry') {
            colorBase = 'rgb(251, 111, 146)';
            colorSub = 'rgb(255, 143, 171)';

            imgElement.src = 'img/category/meat.png';
        } else if (foodGroup === 'Pulse_Seed_Nut') {
            colorBase = 'rgb(161,29,51)';
            colorSub = 'rgb(218, 30, 55)';

            imgElement.src = 'img/category/Pulse_Seed_Nut.png';
        } else if (foodGroup === 'Shellfish') {
            colorBase = 'rgb(193, 163, 222)';
            colorSub = 'rgb(201, 163, 205)';

            imgElement.src = 'img/category/Shellfish.png';
        } else if (foodGroup === 'Spice_Condiment') {
            colorBase = 'rgb(191, 161, 61)';
            colorSub = 'rgb(173, 159, 114)';

            imgElement.src = 'img/category/Spice_Condiment.png';
        } else if (foodGroup === 'StarchyRoot_Tuber') {
            colorBase = 'rgb(0, 153, 77)';
            colorSub = 'rgb(0, 179, 119)';

            imgElement.src = 'img/category/StarchyRoot_Tuber.png';
        } else if (foodGroup === 'Vegetable') {
            colorBase = 'rgb(134, 55, 143)';
            colorSub = 'rgb(188,94,199)';

            imgElement.src = 'img/category/Vegetable.png';
        }

        headerColor(colorBase);
        contentHeaderColor(colorSub);
    }
}

function headerColor(color) {
    var content_category = document.getElementById('foodGroupTitle');
    var content_header = document.getElementById('ingredient-title');
    content_category.style.backgroundColor = color;
    content_category.style.color = '#ffffff';

    content_header.style.backgroundColor = color;
    content_header.style.color = '#ffffff';
}

function contentHeaderColor(color) {
    var content_headerH2 = document.getElementsByClassName('content-headerH2');

    [...content_headerH2].forEach(function(headerH2) {
        headerH2.style.backgroundColor = color;
    });
}

function visualize(name, category) {
    window.location.href = `visualization?queryName=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}`;
}

function displayCompareDetails(query, selectedName) {
    window.open(`/compare?queryName=${encodeURIComponent(query)}&selected=${encodeURIComponent(selectedName)}`, '_blank');
}