package IngOn.IngredientSubstitution.controller;

import IngOn.IngredientSubstitution.service.DescriptionLogicDisplayService;
import IngOn.IngredientSubstitution.service.OntologyConverter;
import IngOn.IngredientSubstitution.service.OntologyService;
import IngOn.IngredientSubstitution.service.OntologySimilarityService;
import jakarta.servlet.http.HttpSession;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.*;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import javax.sound.midi.SysexMessage;
import java.nio.file.Files;
import java.nio.file.Paths;
@Controller
public class WebController {

private static final HashMap<String, HashMap<String, HashMap<String, Set<String>>>> concepts;
    static {
        try {
            concepts = OntologyConverter.readJSONfile();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

//    private static final Logger logger = LoggerFactory.getLogger(WebController.class);

    @GetMapping("/")
    public String homePage() {
        return "index";
    }

    /**
     * Convert Ontology file to JSON file.
     * @return
     */
    @GetMapping("/ontology-manager")
    @Cacheable
    public String ontologyManager() {
        String directoryPath = "src/main/resources";
//        String directoryPath = "IngredientSubstitution/src/main/resources";
        String fileName = "data.json";

        OntologyConverter.writeAllConceptNamesToFile(directoryPath, fileName);

        return "index";
    }

    @GetMapping("/aboutus")
    public String aboutUs() { return "aboutUs"; }

    @GetMapping("/document")
    public String document() { return "document"; }

    /**
     * Ingredient page that displays each ingredient's details in each category.
     * @param selectedId
     * @param model
     * @return
     * @throws IOException
     */
    @GetMapping("/ingredient")
    public String ingredient(@RequestParam("id") String selectedId, Model model) throws IOException {

        HashMap<String, HashMap<String, Set<String>>> conceptList = concepts.get(selectedId); // specific category

        setAllPropertyModel(model, conceptList);

        model.addAttribute("foodGroup", selectedId);
        model.addAttribute("conceptList", conceptList);
        model.addAttribute("ingredientList", conceptList.keySet());

        return "ingredient";
    }

    @GetMapping("/visualization")
    public String visualization() {
        return "visualization";
    }

    /**
     * A URL to fetch data from JSON file.
     * @return
     */
    @GetMapping("/data")
    public ResponseEntity<String> getData() {
        try {
            Resource resource = new ClassPathResource("data.json");
            String data = new String(Files.readAllBytes(Paths.get(resource.getURI())));
            return ResponseEntity.ok().body(data);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reading data.json");
        }
    }

    @GetMapping("/searchByName")
    public String showSearchPage() {
        return "searchResult";
    }

    @PostMapping("/searchByName")
    public String computeSim(@RequestParam("ingredient") String ingredientToCompare, Model model, HttpSession session) {
        if (findAndSetSimResult(ingredientToCompare, model, session)) {
            return "searchResult";
        } else {
            model.addAttribute("errorMessage", "No such ingredient exists.");
            return "index";
        }
    }

    @GetMapping("/searchByProperty")
    public String showSearchResultPage() {
        return "searchResult";
    }

    @PostMapping("/searchByProperty")
    public String findIngredientByProps(@RequestParam("propertyNode") String propertyQuery,
                                        @RequestParam("categoryMenu") String category,
                                        @RequestParam("propertyMenu") String propertyType, Model model) {
        HashMap<String, HashMap<String, Set<String>>> conceptList = concepts.get(category);
        HashMap<String, Set<String>> ingredientsWithProps = DescriptionLogicDisplayService.getProperties(propertyType, conceptList);

        Set<String> listOfMatchingIngredients = new HashSet<>();

        for (String ingredient : ingredientsWithProps.keySet()) {
            Set<String> properties = ingredientsWithProps.get(ingredient);

            for (String prop : properties) {
                if (prop.toLowerCase().contains(propertyQuery.toLowerCase()) || propertyQuery.toLowerCase().contains(prop.toLowerCase())) {
                    listOfMatchingIngredients.add(ingredient);
                }
            }
        }

        HashMap<String, HashMap<String, Set<String>>> matchingIngredientsData = DescriptionLogicDisplayService.getDataByIngredientName(listOfMatchingIngredients, concepts);

        if (matchingIngredientsData.isEmpty()) {
            model.addAttribute("errorMessage", "No such ingredient exists.");
            return "index";
        } else {
            setAllPropertyModel(model, matchingIngredientsData);

            model.addAttribute("propertyQuery", propertyQuery);
            model.addAttribute("foodGroup", category);
            model.addAttribute("conceptList", matchingIngredientsData);
            model.addAttribute("ingredientList", matchingIngredientsData.keySet());
            model.addAttribute("redirectToAnchor", true);

            return "propertyResult";

        }
    }

    @PostMapping("/processIngredient")
    public String processIngredient(@RequestParam("selectedIngredient") String selectedIngredient, Model model, HttpSession session) {
        if (findAndSetSimResult(selectedIngredient, model, session)) {
            return "searchResult";
        } else {
            model.addAttribute("errorMessage", "No such ingredient exists.");
            return "index";
        }
    }

    @GetMapping("/compare")
    public String comparePage(@RequestParam(name = "queryName", required = false) String queryName,
                              @RequestParam(name = "selected", required = false) String selected, Model model, HttpSession session) {
        Object simResult = session.getAttribute("simResult");
        String officialName = (String) session.getAttribute("officialName");
        String[] specifiedProperties = {"hasColor", "hasFlavor", "hasShape", "hasTexture", "hasMineral", "hasNutrient",
                "hasSugar", "hasVitamin", "hasBenefit", "canCook", "hasOtherNames", "hasType"};

        double simVal = findSimValue(officialName, selected, simResult);
        double simValPercentage = simVal * 100;
        String formattedPercentage = String.format("%.2f", simValPercentage);
        System.out.println(formattedPercentage);

        Set<String> ingredientList = Set.of(officialName, selected);

        HashMap<String, HashMap<String, Set<String>>> dataWithName = DescriptionLogicDisplayService.getDataByIngredientName(ingredientList, concepts);

        model.addAttribute("officialName", officialName);
        model.addAttribute("simVal", formattedPercentage);
        model.addAttribute("selected", selected);

        for (String ingredient : dataWithName.keySet()) {
            HashMap<String, Set<String>> innerHashMap = dataWithName.get(ingredient);
            String ingredientType;

            if (ingredient == officialName) {
                ingredientType = "query";
            } else {
                ingredientType = "select";
            }


            for (String ing : innerHashMap.keySet()) {
                if (Arrays.asList(specifiedProperties).contains(ing)) {
                    Set<String> attributeValues = innerHashMap.get(ing);

                    addAttributesForIngredient(model, ingredientType, ing, attributeValues);
                }
            }
        }

        return "compare";
    }

    /**
     * Handle error page
     * @return
     */
    @GetMapping("/error")
    public String errorPage() {
        return "error";
    }

    public void addAttributesForIngredient(Model model, String ingredientType, String attributeName, Set<String> attributeValues) {
        String attributeNamePrefix = ingredientType.equals("query") ? "Query" : "Selected";
        String fullAttributeName = attributeNamePrefix + attributeName;

        model.addAttribute(fullAttributeName, attributeValues);
    }

    public double findSimValue(String officialName, String selected, Object simResult) {
        double simVal = 0.0;

        if (simResult instanceof HashMap) {
            HashMap<String, List<Map.Entry<String, Double>>> simResultMap = (HashMap<String, List<Map.Entry<String, Double>>>) simResult;
            List<Map.Entry<String, Double>> entries = simResultMap.get(officialName);

            for (Map.Entry<String, Double> entry : entries) {
                if (entry.getKey().equals(selected)) {
                    simVal = entry.getValue();
                    break;
                }
            }
        }

        return simVal;
    }

    public boolean findAndSetSimResult(String ingredient, Model model, HttpSession session) {
        String officialName = OntologyService.findOfficialName(ingredient, concepts);
        HashMap<String, List<Map.Entry<String, Double>>> simResult = OntologySimilarityService.findSubstitution(officialName);

        if (!simResult.isEmpty()) {
            session.setAttribute("simResult", simResult);
            session.setAttribute("officialName", officialName);

            Set<String> resultList = retrieveKeysFromEntries(simResult);

            HashMap<String, HashMap<String, Set<String>>> dataWithName = DescriptionLogicDisplayService.getDataByIngredientName(resultList, concepts);

            setAllPropertyModel(model, dataWithName);

            model.addAttribute("ingredientQuery", ingredient);
            model.addAttribute("simResult", simResult);

            model.addAttribute("redirectToAnchor", true);

            return true;
        } else {
            return false;
        }

    }

    public void setAllPropertyModel(Model model, HashMap<String, HashMap<String, Set<String>>> dataWithName) {
        HashMap<String, Set<String>> colorProperties = DescriptionLogicDisplayService.getProperties("hasColor", dataWithName);
        HashMap<String, Set<String>> flavorProperties = DescriptionLogicDisplayService.getProperties("hasFlavor", dataWithName);
        HashMap<String, Set<String>> shapeProperties = DescriptionLogicDisplayService.getProperties("hasShape", dataWithName);
        HashMap<String, Set<String>> textureProperties = DescriptionLogicDisplayService.getProperties("hasTexture", dataWithName);
        HashMap<String, Set<String>> mineralProperties = DescriptionLogicDisplayService.getProperties("hasMineral", dataWithName);
        HashMap<String, Set<String>> nutriProperties = DescriptionLogicDisplayService.getProperties("hasNutrient", dataWithName);
        HashMap<String, Set<String>> sugarProp = DescriptionLogicDisplayService.getProperties("hasSugar", dataWithName);
        HashMap<String, Set<String>> vitaProperties = DescriptionLogicDisplayService.getProperties("hasVitamin", dataWithName);
        HashMap<String, Set<String>> beneProperties = DescriptionLogicDisplayService.getProperties("hasBenefit", dataWithName);
        HashMap<String, Set<String>> cookProperties = DescriptionLogicDisplayService.getProperties("canCook", dataWithName);
        HashMap<String, Set<String>> namesProperties = DescriptionLogicDisplayService.getProperties("hasOtherNames", dataWithName);
        HashMap<String, Set<String>> typeProperties = DescriptionLogicDisplayService.getProperties("hasType", dataWithName);
        HashMap<String, Set<String>> category = DescriptionLogicDisplayService.getProperties("isInCategory", dataWithName);

        setPropertyModel(model, colorProperties, "colorProp");
        setPropertyModel(model, flavorProperties, "flavorProp");
        setPropertyModel(model, shapeProperties, "shapeProp");
        setPropertyModel(model, textureProperties, "textureProp");
        setPropertyModel(model, mineralProperties, "mineralProp");
        setPropertyModel(model, nutriProperties, "nutriProp");
        setPropertyModel(model, sugarProp, "sugarProp");
        setPropertyModel(model, vitaProperties, "vitaProp");
        setPropertyModel(model, beneProperties, "beneProp");
        setPropertyModel(model, cookProperties, "cookProp");
        setPropertyModel(model, namesProperties, "otherNames");
        setPropertyModel(model, typeProperties, "typeProp");
        setPropertyModel(model, category, "foodGroup");
    }

    public void setPropertyModel(Model model, HashMap<String, Set<String>> properties, String modelName) {
        model.addAttribute(modelName, properties);
    }

    public static Set<String> retrieveKeysFromEntries(HashMap<String, List<Map.Entry<String, Double>>> simResult) {
        Set<String> keys = new HashSet<>();

        for (List<Map.Entry<String, Double>> entryList : simResult.values()) {
            for (Map.Entry<String, Double> entry : entryList) {
                keys.add(entry.getKey());
            }
        }

        return keys;
    }
}
