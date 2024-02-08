package IngOn.IngredientSubstitution.controller;

import IngOn.IngredientSubstitution.service.OntologyConverter;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Controller
public class WebController {

// private static final File owlFile = new File("./src/main/resources/ontology/ThaiIngredients-v4.owl");
 private static final File owlFile = new File("C:\\Users\\Acer\\Documents\\GitHub\\ThaiLocalIngredients\\ThaiIngredients-v4.owl");
private static final HashMap<String, Set<String>> concepts;
    static {
        try {
            concepts = OntologyConverter.readJSONfile();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

//    private static final Logger logger = LoggerFactory.getLogger(WebController.class);

    @GetMapping("/")
    @Cacheable
    public String homePage() {
        return "index";
    }

    @GetMapping("/ontology-manager")
    @Cacheable
    public String ontologyManager() {
        String directoryPath = "src/main/resources";
        String fileName = "data.json";

        OntologyConverter.writeAllConceptNamesToFile(directoryPath, fileName);

        return "index";
    }

    @GetMapping("/aboutus")
    public String aboutUs() { return "aboutUs"; }

    @GetMapping("/document")
    public String document() { return "document"; }

    @GetMapping("/ingredient")
    public String ingredient(@RequestParam("id") String selectedId, Model model, HttpSession session) throws IOException {

        Set<String> conceptList = concepts.get(selectedId); // specific category

        // logger.info("Concept List: {}", Arrays.toString(formattedConceptList));

        model.addAttribute("conceptList", conceptList);
        model.addAttribute("foodGroup", selectedId);


        return "ingredient";
    }

    @GetMapping("/visualization")
    public String visualization(HttpSession session, Model model) {
        return "visualization";
    }

    @GetMapping("/error")
    public String errorPage() {
        return "error";
    }
}
