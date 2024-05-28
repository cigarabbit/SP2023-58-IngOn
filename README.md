# SP2023-Ingon Web Applcation
***
## Pre-condition
1. The computer system should have a Java Development Kit (JDK) [[Click here]](https://www.oracle.com/java/technologies/downloads/) as this web application is built on Java and integrated with Spring Framework.
2. Select any Integrated Development Environment (IDE) as you preferred. IntelliJ IDEA [[Click here]](https://www.jetbrains.com/idea/) is preferable in this system.
***
## How to Run the IngOn Web Application
1. Build a project by using `pom.xml` file using selected IDE.
2. Change directory path in the [`application.properties`](../IngredientSubstitution/src/main/resources/application.properties) file.
   However, if the search bar directs you to an error page when try to search for a substitution, you may change the directory on the line number 102 in the [`OntologyConverter.java`](../IngredientSubstitution/src/main/java/IngOn/IngredientSubstitution/service/OntologyConverter.java) file.
3. Run the IngredientSubstitutionApplication. The web application will be run on a port number 8080 automatically. It can now be accessed in [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

## IngOn Web Application Document
***
### Ingredient Search
On the homepage of the IngOn web application, users can effortlessly search for ingredient substitutions. By entering specific criteria such as color, cooking type, flavor, texture, or even the English name of an ingredient into the search box, the application provides a list of suitable alternatives. This comprehensive tool simplifies the process of finding ingredient substitutions, making it an invaluable resource for both novice and experienced cooks.

#### Search for ingredient substitutions
Users have the capability to search for ingredient substitutions by specifying solely the English name of the ingredient in the search box. The system considers the properties of the specific ingredient using ontology similarity computation and displays a list of possible ingredient substitutions as a result.

#### Search for ingredient's information
Users can look up ingredients that contain a specified property in a specified category that the system provides.

### Visualization
#### Category Visualization
Category visualization allows users to view ingredients in any categories by selecting the ingredient's initial alphabet. The information is displayed in a form of network graph, representing relationship between the concept and properties of ontology. This feature enhances user experience within the application's ontology of ingredients.

#### List Visualization
List visualization displays a list of ingredients in a table. Users can select each ingredient provided on the result page to read the ingredients' properties.

#### Graph Visualization
Users can click on a node of interest to access more detailed information associated with that particular node. Each node in a graphical representation denotes a concept name. The selected node is highlighted with a prominent color and larger size. The highlighted node provides its child nodes according to the ontology hierarchy structure. Graph visualization provides users an option to search for ingredients by using an ingredient name or a category with a property.

## Ontology Overview
***
Our ingredient ontology is sourced from the Food Composition Table of Thai Food published by the Bureau of Nutrition, Department of Health, Ministry of Public Health. We chose 11 food groups: Finfish, Shellfish, Other aquatic animals and their products, Cereals and their products, Starchy roots, tubers and their products, Pulses, seeds, nuts and their products, Vegetables and their products, Fruits and their products, Meat, Poultry and their products, Spices and condiments, Milk and its products, Insects, and Eggs. In the ontology design, each ingredient is represented as a class. Both English and Thai names are included for each ingredient, with the Thai name added as an equivalent class to the English name. Each ingredient consists of several properties, such as benefit, cooking type, and color.
