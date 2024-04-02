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

import java.nio.file.Files;
import java.nio.file.Paths;
@Controller
public class WebController {

 private static final File owlFile = new File("./src/main/resources/ontology/ThaiIngredients-v4.owl");
// private static final File owlFile = new File("C:\\Users\\Acer\\Documents\\GitHub\\ThaiLocalIngredients\\ThaiIngredients-v4.owl");
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

    @GetMapping("/ingredient")
    public String ingredient(@RequestParam("id") String selectedId, Model model) throws IOException {

        HashMap<String, HashMap<String, Set<String>>> conceptList = concepts.get(selectedId); // specific category

        DescriptionLogicDisplayService.setConceptList(conceptList);

        HashMap<String, Set<String>> colorProperties = DescriptionLogicDisplayService.getProperties("hasColor");
        HashMap<String, Set<String>> flavorProperties = DescriptionLogicDisplayService.getProperties("hasFlavor");
        HashMap<String, Set<String>> shapeProperties = DescriptionLogicDisplayService.getProperties("hasShape");
        HashMap<String, Set<String>> textureProperties = DescriptionLogicDisplayService.getProperties("hasTexture");
        HashMap<String, Set<String>> mineralProperties = DescriptionLogicDisplayService.getProperties("hasMineral");
        HashMap<String, Set<String>> nutriProperties = DescriptionLogicDisplayService.getProperties("hasNutrient");
        HashMap<String, Set<String>> sugarProp = DescriptionLogicDisplayService.getProperties("hasSugar");
        HashMap<String, Set<String>> vitaProperties = DescriptionLogicDisplayService.getProperties("hasVitamin");
        HashMap<String, Set<String>> beneProperties = DescriptionLogicDisplayService.getProperties("hasBenefit");
        HashMap<String, Set<String>> cookProperties = DescriptionLogicDisplayService.getProperties("canCook");
        HashMap<String, Set<String>> namesProperties = DescriptionLogicDisplayService.getProperties("hasOtherNames");
        HashMap<String, Set<String>> typeProperties = DescriptionLogicDisplayService.getProperties("hasType");

        // logger.info("Concept List: {}", Arrays.toString(formattedConceptList));

        model.addAttribute("foodGroup", selectedId);
        model.addAttribute("conceptList", conceptList);
        model.addAttribute("ingredientList", conceptList.keySet());

        // Properties
        model.addAttribute("colorProp", colorProperties);
        model.addAttribute("flavorProp", flavorProperties);
        model.addAttribute("shapeProp", shapeProperties);
        model.addAttribute("textureProp", textureProperties);
        model.addAttribute("mineralProp", mineralProperties);
        model.addAttribute("nutriProp", nutriProperties);
        model.addAttribute("sugarProp", sugarProp);
        model.addAttribute("vitaProp", vitaProperties);
        model.addAttribute("beneProp", beneProperties);
        model.addAttribute("cookProp", cookProperties);
        model.addAttribute("otherNames", namesProperties);
        model.addAttribute("typeProp", typeProperties);

        return "ingredient";
    }

    @GetMapping("/visualization")
    public String visualization() {
        return "visualization";
    }

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

    @GetMapping("/search")
    public String showSearchPage() {
        return "searchResult";
    }

    @PostMapping("/search")
    public String computeSim(@RequestParam("ingredient") String ingredientToCompare, Model model) throws FileNotFoundException {
        findAndSetSimResult(ingredientToCompare, model);
        return "searchResult";
    }

    @PostMapping("/processIngredient")
    public String processIngredient(@RequestParam("selectedIngredient") String selectedIngredient, Model model) throws FileNotFoundException {
        findAndSetSimResult(selectedIngredient, model);
        return "searchResult";
    }

    public HashMap<String, List<Map.Entry<String, Double>>> findAndSetSimResult(String ingredient, Model model) throws FileNotFoundException {
        String officialName = OntologyService.findOfficialName(ingredient, concepts);

        HashMap<String, List<Map.Entry<String, Double>>> simResult = OntologySimilarityService.findSubstitution(officialName);

        model.addAttribute("ingredientQuery", ingredient);
        model.addAttribute("simResult", simResult);
        model.addAttribute("redirectToAnchor", true);

        return simResult;
    }
    @GetMapping("/error")
    public String errorPage() {
        return "error";
    }
}
