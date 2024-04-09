window.addEventListener('load', function () {
    initializeProperties(); // Property Filter
    sortTopics();
    displayIngredientColor();
});

var currentSortOrder = 'asc';
var foodGroup, colorProp, flavorProp, mineralProp, nutriProp, sugarProp, vitaProp, shapeProp, textureProp, otherNames, typeProp;

function initializeProperties() {
    let allCategories = document.querySelectorAll('.category');

    if (allCategories) {
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
    let sidebar = document.getElementById('sidebar-ingredient');

    if (sidebar) {
        let list = sidebar.querySelector('ul');
        let items = Array.from(list.getElementsByTagName('li'));

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
}

function filterProperty() {


}

function assignColor(colorSelector, type) {
    let colorRegex = /\w+/g;
    let colors = colorSelector.innerHTML.match(colorRegex);

    if (colors) {
        let container;
        if (type === 'query') {
            container = document.querySelector('.color-box.queryBox');
        } else {
            container = document.querySelector('.color-box.selectedBox');
        }

        for (let i = 0; i < colors.length; i++) {
            let circle_bg = document.createElement('div');
            circle_bg.classList.add('color-circle');

            if (colors[i] === 'Green') {
                circle_bg.style.backgroundColor = '#49d354';
            } else if (colors[i] === "Red") {
                circle_bg.style.backgroundColor = '#a90e24';
            } else if (colors[i] === "Beige") {
                circle_bg.style.backgroundColor = '#dedec3';
            } else if (colors[i] === "Black") {
                circle_bg.style.backgroundColor = '#000000';
            } else if (colors[i] === "Brown") {
                circle_bg.style.backgroundColor = '#56350e';
            } else if (colors[i] === "Cream") {
                circle_bg.style.backgroundColor = '#ded4c3';
            } else if (colors[i] === "Gold") {
                circle_bg.style.backgroundColor = '#b28d1d';
            } else if (colors[i] === "Gray") {
                circle_bg.style.backgroundColor = '#808080';
            } else if (colors[i] === "Pink") {
                circle_bg.style.backgroundColor = '#FFB6C1';
            } else if (colors[i] === "Purple") {
                circle_bg.style.backgroundColor = '#800080';
            } else if (colors[i] === "RedBrown") {
                circle_bg.style.backgroundColor = '#A52A2A';
            } else if (colors[i] === "Silver") {
                circle_bg.style.backgroundColor = '#C0C0C0';
            } else if (colors[i] === "Orange") {
                circle_bg.style.backgroundColor = '#ff6900';
            } else if (colors[i] === "White" || colors[i] === "Transparent") {
                circle_bg.style.backgroundColor = '#FFFFFF';
            } else if (colors[i] === "Yellow") {
                circle_bg.style.backgroundColor = '#FFFF00';
            }

            container.appendChild(circle_bg);
        }
    }
}


function displayIngredientColor() {
    let color_query = document.querySelector('#colorQuery');
    let color_selected = document.querySelector('#colorSelected');

    if (color_query && color_selected) {
        assignColor(color_query, 'query');
        assignColor(color_selected, 'selected');
    }

}