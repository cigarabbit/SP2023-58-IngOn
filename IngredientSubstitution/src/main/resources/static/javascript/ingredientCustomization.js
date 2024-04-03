window.addEventListener('load', function () {
    initializeProperties(); // Property Filter
    // SetThaiName();
    sortTopics();
    changeColor();
});

var currentSortOrder = 'asc';
var foodGroup, colorProp, flavorProp, mineralProp, nutriProp, sugarProp, vitaProp, shapeProp, textureProp, otherNames, typeProp;

function initializeProperties() {
    let allCategories = document.querySelectorAll('.category');

    allCategories.forEach((category, index) => {
        let checkboxes = category.querySelectorAll('.checkbox-container');
        if (checkboxes.length > 10) {
            for (let i = 10; i < checkboxes.length; i++) {
                checkboxes[i].style.display = 'none';
            }

            let viewMoreBtn = document.createElement('button');
            viewMoreBtn.textContent = 'View More';
            viewMoreBtn.setAttribute('onclick', `showMoreCheckboxes(${index})`);
            viewMoreBtn.classList.add('view-more-btn');
            category.appendChild(viewMoreBtn);
        }

    })
}

function showMoreCheckboxes(categoryIndex) {
    let allCategories = document.querySelectorAll('.category');
    allCategories.forEach((category, index) => {
        let checkboxes = category.querySelectorAll('.checkbox-container');
        if (index === categoryIndex) {
            for (let i = 0; i < checkboxes.length; i++) {
                checkboxes[i].style.display = 'block';
            }

            category.querySelector('.view-more-btn').style.display = 'none';
        } else {
            for (let i = 10; i < checkboxes.length; i++) {
                checkboxes[i].style.display = 'none';
            }
        }
    });
}


function hideCheckbox(category) {
    let checkboxContainer = document.querySelector('.' + category + '-container');
    checkboxContainer.classList.toggle('hidden');
}

function sortTopics() {
    var sidebar = document.getElementById('sidebar-ingredient');
    var list = sidebar.querySelector('ul');
    var items = Array.from(list.getElementsByTagName('li'));

    items.sort(function (a, b) {
        const nameA = a.textContent.replace(/\(.*?\)/g, '').trim();
        const nameB = b.textContent.replace(/\(.*?\)/g, '').trim();
        if (currentSortOrder === 'asc') {
            return nameA.localeCompare(nameB);
        } else {
            return nameB.localeCompare(nameA);
        }
    });

    list.innerHTML = "";

    items.forEach(function (item) {
        const itemName = item.textContent.replace(/\(.*?\)/g, '').trim();
        if (beneProp[itemName] !== undefined) { // Not a subclass
            list.appendChild(item);
        }
    });

    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';

}

function filterProperty() {


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

function findIngredientFromCategory() {
    var itemName = document.getElementById("search-query").value.toLowerCase();

    console.log(itemName)
}
