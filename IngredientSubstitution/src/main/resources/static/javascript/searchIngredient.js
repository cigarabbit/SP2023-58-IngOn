window.addEventListener('load', function () {
    setThaiName();

    let searchType = document.getElementById('search-type');
    let searchForm = document.getElementById('search-form');
    let propertyForm = document.getElementById('property-form');

    searchType.addEventListener('click', function () {
        if (searchType.textContent === 'Or do you want to search by a category and property?') {
            searchForm.style.display = 'none';
            propertyForm.style.display = 'flex';
            searchType.innerHTML = 'Want to search by ingredient name?';
        } else {
            searchType.innerHTML = 'Or do you want to search by a category and property?';
            searchForm.style.display = 'flex';
            propertyForm.style.display = 'none';
        }
    })
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    let scrollToTopBtn = document.getElementById("scrollToTopBtn");

    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

/** Data Retrieval **/
async function loadData() {
    try {
        const response = await fetch('/data');
        return await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

/**
 * Suggestion List for query.
 * @returns {Promise<void>}
 */
async function autoComplete() {
    let query = document.getElementById('targetInput').value;
    let suggestionList = document.getElementById('suggestionList');

    suggestionList.innerHTML = '';

    try {
        const data = await loadData();

        if (query.length < 2) {
            suggestionList.style.display = 'none';
        }
        if (query.length >= 2) {
            let ingredientList = retrieveMatchIngredient(data, query);

            ingredientList.forEach(ingredient => {
                let listItem = createAndAppendListItem(ingredient.ingredient, suggestionList);

                listItem.addEventListener('click', () => {
                    document.getElementById('targetInput').value = ingredient.ingredient;

                    suggestionList.style.display = 'none';
                });
            })

            suggestionList.style.display = 'block';
            suggestionList.style.zIndex = '1000';
            suggestionList.style.border = '1px solid #dee2e6';
        }

    } catch (e) {
        console.log(e);
    }

}

function retrieveMatchIngredient(data, query) {
    let ingredientList = [];

    for (let category in data) {
        for (let ingredient in data[category]) {
            if (ingredient.toLowerCase().includes(query.toLowerCase())) {
                ingredientList.push({ingredient: ingredient, category: category});
            }
        }
    }

    return ingredientList;
}

function createAndAppendListItem(text, parent, bold = false) {
    let listItem = document.createElement('li');
    listItem.textContent = text;
    if (bold) listItem.style.fontWeight = 'bold';
    listItem.style.borderBottom = '1px solid #dee2e6';

    parent.appendChild(listItem);

    return listItem;
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
            'Roasted', 'Rubbed', 'Sauteed', 'Scrambled', 'Seasoned', 'Shredded',
            'Simmered', 'Sliced', 'Soaked', 'Spread', 'Sprinkled', 'Steamed', 'Stewed',
            'Stir-Fried', 'Terpenoid', 'Thickened', 'Toasted', 'Torn', 'Wrapped', 'Zested'
        ];
        properties.push(...cookingMethods);
    } else if (property_option === 'hasColor') {
        let colors = [
            'Beige', 'Black', 'Blue', 'Brown', 'Colorful', 'Cream', 'Gold', 'Golden', 'Gray',
            'Green', 'Orange', 'Pink', 'Purple', 'Red', 'RedBrown', 'Silver', 'Tan', 'Transparent', 'White', 'Yellow'
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

