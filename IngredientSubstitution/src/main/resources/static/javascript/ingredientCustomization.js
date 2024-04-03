window.addEventListener('load', function () {
    initializeProperties(); // Property Filter
    sortTopics();
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
