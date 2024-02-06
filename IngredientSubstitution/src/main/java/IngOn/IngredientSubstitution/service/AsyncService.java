package IngOn.IngredientSubstitution.service;

import IngOn.IngredientSubstitution.controller.ConceptListManager;
import jakarta.servlet.http.HttpSession;
import org.semanticweb.owlapi.model.OWLOntology;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.HashMap;
import java.util.Set;

@Service
public class AsyncService {

    private static final Logger logger = LoggerFactory.getLogger(AsyncService.class);

    @Async
    public void backgroundTask(HttpSession session, File owlFile) {
        OWLOntology ontology = OntologyService.prepareOWLFile(owlFile);

        Set<String> objectProperties = OntologyService.retrieveAllObjectProperties(ontology);

        logger.info(objectProperties.toString());

        ConceptListManager.loadConceptList(ontology);

        HashMap<String, Set<String>> conceptList = ConceptListManager.getConceptList();

        session.setAttribute("allConceptList", conceptList);
    }
}
