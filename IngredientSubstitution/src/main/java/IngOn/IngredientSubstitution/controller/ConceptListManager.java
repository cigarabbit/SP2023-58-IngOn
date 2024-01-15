package IngOn.IngredientSubstitution.controller;

import IngOn.IngredientSubstitution.service.OntologyService;
import org.semanticweb.owlapi.model.OWLOntology;

import java.util.HashMap;
import java.util.Set;

public class ConceptListManager {
    private static HashMap<String, Set<String>> conceptList;

    public static synchronized void loadConceptList(OWLOntology ontology) {
        if (conceptList == null) {
            OntologyService.retrieveAllConcepts(ontology);
            conceptList = OntologyService.getAllConceptNames();
        }
    }

    public static HashMap<String, Set<String>> getConceptList() {
        return conceptList;
    }

}
