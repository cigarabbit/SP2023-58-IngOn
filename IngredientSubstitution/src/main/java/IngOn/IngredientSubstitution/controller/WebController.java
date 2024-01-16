package IngOn.IngredientSubstitution.controller;

import IngOn.IngredientSubstitution.service.AsyncService;
import IngOn.IngredientSubstitution.service.OntologyService;
import jakarta.servlet.http.HttpSession;
import org.semanticweb.owlapi.model.OWLOntology;
import org.semanticweb.owlapi.model.OWLOntologyCreationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.File;
import java.util.*;

@Controller
public class WebController {

    @Autowired
    private AsyncService asyncService;

// private static final File owlFile = new File("./src/main/resources/ontology/ThaiIngredients-v4.owl");
 private static final File owlFile = new File("C:\\Users\\Acer\\Documents\\GitHub\\ThaiLocalIngredients\\ThaiIngredients-v4.owl");

//    private static final Logger logger = LoggerFactory.getLogger(WebController.class);

    @GetMapping("/")
    @Cacheable
    public String homePage(HttpSession session) {
        asyncService.backgroundTask(session, owlFile);
        return "index";
    }

    @GetMapping("/aboutus")
    public String aboutUs() { return "aboutUs"; }

    @GetMapping("/document")
    public String document() { return "document"; }

    @GetMapping("/ingredient")
    public String ingredient (@RequestParam("id") String selectedId, Model model, HttpSession session) {
        HashMap<String, Set<String>> concepts = (HashMap<String, Set<String>>) session.getAttribute("allConceptList");

        Set<String> conceptList = concepts.get(selectedId); // specific category
        String[] formattedConceptList = OntologyService.separateWord(conceptList);

        // logger.info("Concept List: {}", Arrays.toString(formattedConceptList));

        model.addAttribute("conceptList", formattedConceptList);
        model.addAttribute("foodGroup", selectedId);

        session.setAttribute("conceptList", formattedConceptList);

        return "ingredient";
    }

    @GetMapping("/visualization")
    public String visualization (HttpSession session, Model model) {

        return "visualization";
    }
}
