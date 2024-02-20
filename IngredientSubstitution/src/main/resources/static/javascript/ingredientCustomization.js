window.addEventListener('load', function () {
    sortTopics();
    retrieveData();
    changeColor();
});

var currentSortOrder = 'asc';
var foodGroup, colorProp, flavorProp, mineralProp, nutriProp, vitaProp, shapeProp, textureProp;

function sortTopics() {
    var sidebar = document.getElementById("sidebar-topic");
    var list = sidebar.querySelector("ul");
    var items = Array.from(list.getElementsByTagName("li"));

    items.sort(function (a, b) {
        if (currentSortOrder === 'asc') {
            return a.textContent.localeCompare(b.textContent);
        } else {
            return b.textContent.localeCompare(a.textContent);
        }
    });

    list.innerHTML = "";
    items.forEach(function (item) {
        list.appendChild(item);
    });

    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
}

function filterProperty() {
    // Select properties they would like to find

}

function setConceptList(group, colors, flavors, minerals, nutris, vitas, shapes, textures, benes, cooks) {
    foodGroup = group;
    colorProp = colors;
    flavorProp = flavors;
    mineralProp = minerals;
    nutriProp = nutris;
    vitaProp = vitas;
    shapeProp = shapes;
    textureProp = textures;
    beneProp = benes;
    cookProp = cooks;
}

function retrieveData() {
    var sidebarTopics = document.querySelectorAll('#sidebar-topic ul li a');
    var contentBox = document.querySelector('#content-box');
    var contentHeader = document.querySelector('.content-header');

    var DL_Display = document.querySelector('#DL_Syntax span');
    var colorPropLi = document.querySelector('#propertyColor span');
    var flavorPropLi = document.querySelector('#propertyFlavor span');
    var shapePropLi = document.querySelector('#propertyShape span');
    var texturePropLi = document.querySelector('#propertyTexture span');

    var mineralPropLi = document.querySelector('#propMineral div');
    var nutriPropLi = document.querySelector('#propNutrient div');
    var vitaPropLi = document.querySelector('#propVitamin div');

    var benePropLi = document.querySelector('#benefits');
    var cookPropLi = document.querySelector('#cooking-types');

    function handleTopicClick(event) {
        sidebarTopics.forEach(function (topic) {
            topic.classList.remove('active-topic');
        });

        event.target.classList.add('active-topic');

        var clickedTopic = event.target.textContent;
        contentHeader.textContent = clickedTopic;

        var colors = colorProp[clickedTopic].join(', ');
        var flavors = flavorProp[clickedTopic].join(', ');

        var shapes;
        if (shapeProp[clickedTopic] !== undefined) {
            shapes = shapeProp[clickedTopic].join(', ');
        } else {
            shapes = "No shapes available because it lacks standard recording methods.";
        }

        var textures = textureProp[clickedTopic].join(', ');

        var minerals;
        if (mineralProp[clickedTopic] !== undefined) {
            minerals = mineralProp[clickedTopic].join(', ');
        } else {
            minerals = "It does not have any minerals.";
        }

        var nutris = nutriProp[clickedTopic].join(', ');
        var vitas = vitaProp[clickedTopic].join(', ');

        var benes = beneProp[clickedTopic].join(', ');
        var cooks = cookProp[clickedTopic].join(', ');

        var DLSyntax = getDLSyntax(clickedTopic, colors, flavors, shapes, textures, minerals, nutris, vitas, benes, cooks);

        DL_Display.innerHTML = '';
        colorPropLi.innerHTML = '';
        flavorPropLi.innerHTML = '';
        shapePropLi.innerHTML = '';
        texturePropLi.innerHTML = '';
        mineralPropLi.innerHTML = '';
        nutriPropLi.innerHTML = '';
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

        nutriProp[clickedTopic].forEach(function(nutri) {
            var span = document.createElement('span');
            span.textContent = nutri;
            span.classList.add('nutrient-item');

            nutriPropLi.appendChild(span);
        });

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
        benePropLi.append(benes);
        cookPropLi.append(cooks);

        contentBox.style.opacity = '1';
    }

    sidebarTopics.forEach(function (topic) {
        topic.addEventListener('click', handleTopicClick);
    });

    // Display the first ingredient of that category by default
    if (sidebarTopics.length > 0) {
        sidebarTopics[0].click();
    }
}

function getDLSyntax(conceptName, colors, flavors, shapes, textures, minerals, nutris, vitas, benes, cooks) {
    var syntax = conceptName + " ⊑ " + foodGroup;

    function handleProperty(property, type) {
        if (property.includes(',')) {
            var propertyList = property.split(',');
            propertyList.forEach(function(prop) {
                syntax += ' ⊓ ∃ ' + type + prop;
            });
        } else {
            syntax += ' ⊓ ∃ ' + type + property;
        }
    }

    handleProperty(colors, 'hasColor.');
    handleProperty(flavors, 'hasFlavor.');
    handleProperty(shapes, 'hasShape.');
    handleProperty(textures, 'hasTexture.');
    handleProperty(minerals, 'hasMineral.');
    handleProperty(nutris, 'hasNutrient.');
    handleProperty(vitas, 'hasVitamin.');

    handleProperty(benes, 'hasBenefit');
    handleProperty(cooks, 'canCook');



    return syntax;
}


function changeColor() {
    var foodGroup = document.getElementById('foodGroupTitle').textContent;
    var imgElement = document.getElementById('foodtype-img');

    var colorBase, colorSub;
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

function headerColor(color) {
    var content_category = document.getElementById('content-category');
    var content_header = document.getElementsByClassName('content-header');

    content_category.style.backgroundColor = color;
    content_category.style.color = '#ffffff';

    [...content_header].forEach(function(header) {
        header.style.backgroundColor = color;
        header.style.color = '#ffffff';
    });
}

function contentHeaderColor(color) {
    var content_headerH2 = document.getElementsByClassName('content-headerH2');

    [...content_headerH2].forEach(function(headerH2) {
        headerH2.style.backgroundColor = color;
    });
}


