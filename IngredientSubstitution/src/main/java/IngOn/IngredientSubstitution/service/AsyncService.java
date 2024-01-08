package IngOn.IngredientSubstitution.service;

import IngOn.IngredientSubstitution.controller.ConceptListManager;
import jakarta.servlet.http.HttpSession;
import org.semanticweb.owlapi.model.OWLOntology;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.HashMap;
import java.util.Set;

@Service
public class AsyncService {
    @Async
    public void backgroundTask(HttpSession session, File owlFile) {
        OWLOntology ontology = OntologyService.prepareOWLFile(owlFile);

        ConceptListManager.loadConceptList(ontology);

        HashMap<String, Set<String>> conceptList = ConceptListManager.getConceptList();

        session.setAttribute("allConceptList", conceptList);
    }
}
