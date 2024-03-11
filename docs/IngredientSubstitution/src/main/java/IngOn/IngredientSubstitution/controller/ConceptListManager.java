package IngOn.IngredientSubstitution.controller;

import IngOn.IngredientSubstitution.service.OntologyService;
import org.semanticweb.owlapi.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class ConceptListManager {
    private static HashMap<String, HashMap<String, HashMap<String, Set<String>>>> conceptList;
    private static final Logger logger = LoggerFactory.getLogger(WebController.class);

    public static synchronized void loadConceptList(OWLOntology ontology) {

        OntologyService.retrieveAllConcepts(ontology);
        conceptList = OntologyService.getAllConceptNames();
    }

    public static HashMap<String, HashMap<String, HashMap<String, Set<String>>>> getConceptList() {
        return conceptList;
    }

}
