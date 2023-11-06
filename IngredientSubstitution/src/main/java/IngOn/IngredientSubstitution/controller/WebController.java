package IngOn.IngredientSubstitution.controller;

import IngOn.IngredientSubstitution.service.OntologyService;
import org.semanticweb.owlapi.model.OWLOntology;
import org.semanticweb.owlapi.model.OWLOntologyCreationException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.File;
import java.util.List;

@Controller
public class WebController {

    private static final File owlFile = new File("./src/main/resources/ontology/ThaiIngredients-v4.owl");

    @GetMapping("/")
    public String homePage() {
        return "index";
    }

    @GetMapping("/aboutus")
    public String aboutUs() { return "aboutUs"; }

    @GetMapping("/ingredient")
    public String ingredient (@RequestParam("id") String selectedId, Model model) throws OWLOntologyCreationException {
        OWLOntology ontology = OntologyService.prepareOWLFile(owlFile);

        List<String> conceptList = OntologyService.retrieveConceptName(ontology, selectedId);

        String formattedConceptList = String.join("\n", conceptList);

        model.addAttribute("conceptList", formattedConceptList);

        return "ingredient";
    }
}
