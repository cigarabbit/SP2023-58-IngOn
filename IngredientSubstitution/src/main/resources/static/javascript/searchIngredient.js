window.addEventListener('load', function () {
    setThaiName();

    let searchType = document.getElementById('search-type');
    let searchForm = document.getElementById('search-form');
    let propertyForm = document.getElementById('property-form');

    if (searchType) {
        searchType.addEventListener('click', function () {
            if (searchType.textContent === 'Or do you want to search by a category and property?') {
                searchForm.style.display = 'none';
                propertyForm.style.display = 'flex';
                searchType.innerHTML = 'Want to search by ingredient name?';
                clearSuggestions();
            } else {
                searchType.innerHTML = 'Or do you want to search by a category and property?';
                searchForm.style.display = 'flex';
                propertyForm.style.display = 'none';
                clearSuggestions();
            }
        })
    }

});

/** Data Retrieval **/
async function loadData() {
    try {
        const response = await fetch('/data');
        return await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

async function autoCompleteSearch() {
    let propertyForm = document.getElementById('property-form');
    let query = document.getElementById('targetInput').value;
    let suggestionList = document.getElementById('suggestionList');
    let property_queryBar = document.getElementById('propertyNode');

    suggestionList.innerHTML = '';

    try {
        const data = await loadData();

        if (query.length < 2) {
            suggestionList.style.display = 'none';
        }
        else if (query.length >= 2) {
            let ingredientList = retrieveMatchIngredient(data, query);

            if (ingredientList.length > 0) {
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
            } else {
                suggestionList.style.display = 'none';
            }
        }

        if (propertyForm.style.display === 'flex') {
            let property_query = property_queryBar.value;
            let property_option = document.getElementById('propertyMenu').value;
            let listOfProperties = getListOfProperties(property_option);

            clearSuggestions();

            if (property_query.length >= 1 && listOfProperties.length > 0) {
                let matchedProperties = listOfProperties.filter(property =>
                    property.toLowerCase().includes(property_query.toLowerCase()) || property_query.toLowerCase().includes(property.toLowerCase())
                );

                if (matchedProperties.length > 0) {
                    matchedProperties.forEach(property => {
                        let listItem = createAndAppendListItem(property, suggestionList);

                        listItem.addEventListener('click', () => {
                            document.getElementById('propertyNode').value = property;
                            suggestionList.style.display = 'none';
                        });
                    });

                    suggestionList.style.display = 'block';
                    suggestionList.style.zIndex = '1000';
                    suggestionList.style.border = '1px solid #dee2e6';
                } else {
                    suggestionList.style.display = 'none';
                }
            } else {
                suggestionList.style.display = 'none';
            }
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

function clearSuggestions() {
    const suggestionList = document.getElementById('suggestionList');
    suggestionList.innerHTML = '';
    suggestionList.style.display = 'none';
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
            'Pungent', 'Salty', 'Sour', 'Spicy', 'Sulfury', 'Sweet', 'Tropical', 'Umami', 'Mammal', 'Fowl'
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


