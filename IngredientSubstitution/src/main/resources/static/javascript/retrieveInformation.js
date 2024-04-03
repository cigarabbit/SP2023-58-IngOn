window.addEventListener('load', function () {
    setThaiName();
    retrieveData();
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
    let ingredientList = document.querySelectorAll('.substitution-key');

    if (ingredientList.length === 0 && sidebarTopics.length > 0) {
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
    } else {
        try {
            const data = await loadData();

            let ingredientTopic = document.getElementById('resultHeaderSpan');
            let possibleIngredient = document.querySelectorAll('.ingredientButton');

            let thaiTopic = findThaiNameByEnglishName(data, ingredientTopic.textContent);

            if (thaiTopic !== undefined) {
                ingredientTopic.textContent += ' (' + thaiTopic + ')';
            }

            possibleIngredient.forEach(button => {
                let englishName = button.textContent;
                let thaiName = findThaiNameByEnglishName(data, englishName);

                if (thaiName !== undefined && !button.nextElementSibling.classList.contains('thai-name')) {
                    button.setAttribute('data-thai-name', thaiName);
                    button.insertAdjacentHTML('afterend', '<span class="thai-name"> (' + thaiName + ')</span>');
                }
            });

            ingredientList.forEach(substitution => {
                let englishName = substitution.textContent;
                let thaiName = findThaiNameByEnglishName(data, englishName);

                if (thaiName !== undefined) {
                    substitution.textContent += ' (' + thaiName + ')';

                }
            });
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
        sidebarTopics.forEach(function (topic) {
            topic.classList.remove('active-topic');
        });

        event.target.classList.add('active-topic');

        let prev_clickedTopic = event.target.textContent;
        contentHeader.textContent = prev_clickedTopic;

        let clickedTopic = prev_clickedTopic.replace(/\(.*?\)/g, '').trim();
        let DL_Concept = clickedTopic;


        let synName;

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

        var vitas = vitaProp[clickedTopic].join(', ');

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

        vitaProp[clickedTopic].forEach(function(vita) {
            var span = document.createElement('span');
            span.textContent = vita;
            span.classList.add('nutrient-item');

            vitaPropLi.appendChild(span);
        });

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