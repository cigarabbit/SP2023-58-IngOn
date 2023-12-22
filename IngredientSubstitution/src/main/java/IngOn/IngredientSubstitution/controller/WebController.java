package IngOn.IngredientSubstitution.controller;

import IngOn.IngredientSubstitution.service.OntologyService;
import jakarta.servlet.http.HttpSession;
import org.semanticweb.owlapi.model.OWLOntology;
import org.semanticweb.owlapi.model.OWLOntologyCreationException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.File;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Controller
public class WebController {

    private static final File owlFile = new File("./src/main/resources/ontology/ThaiIngredients-v4.owl");

    @GetMapping("/")
    public String homePage(HttpSession session) {
        OWLOntology ontology = OntologyService.prepareOWLFile(owlFile);

        HashMap<String, Set<String>> conceptList = OntologyService.retrieveAllConcepts(ontology);

        session.setAttribute("allConceptList", conceptList);

        return "index";
    }

    @GetMapping("/aboutus")
    public String aboutUs() { return "aboutUs"; }

    @GetMapping("/document")
    public String document() { return "document"; }

    @GetMapping("/ingredient")
    public String ingredient (@RequestParam("id") String selectedId, Model model, HttpSession session) {
        HashMap<String, Set<String>> concepts = (HashMap<String, Set<String>>) session.getAttribute("allConceptList");

        Set<String> conceptList = concepts.get(selectedId);

        String formattedConceptList = String.join("\n", conceptList);

        model.addAttribute("conceptList", formattedConceptList);
        model.addAttribute("foodGroup", selectedId);

        session.setAttribute("conceptList", conceptList);

        return "ingredient";
    }

    @GetMapping("/visualization")
    public String visualization (HttpSession session, Model model) {
        


        return "visualization";
    }
}
