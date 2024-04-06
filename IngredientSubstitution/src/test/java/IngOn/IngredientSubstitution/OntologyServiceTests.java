package IngOn.IngredientSubstitution;

import static org.junit.Assert.*;

import IngOn.IngredientSubstitution.service.OntologyService;
import org.junit.Test;
import org.semanticweb.owlapi.apibinding.OWLManager;
import org.semanticweb.owlapi.model.IRI;
import org.semanticweb.owlapi.model.OWLOntology;
import org.semanticweb.owlapi.model.OWLOntologyCreationException;
import org.semanticweb.owlapi.model.OWLOntologyManager;
import java.io.File;
import java.util.HashMap;
import java.util.Set;

public class OntologyServiceTests {

    //    private static final File owlFile = new File("./src/main/resources/ontology/ThaiIngredients-v4.owl");
    private static final File owlFile = new File("C:\\Users\\Acer\\Documents\\GitHub\\ThaiLocalIngredients\\ThaiIngredients-v4.owl");

    private OWLOntology createMockOWLOntology() {
        OWLOntologyManager manager = OWLManager.createOWLOntologyManager();
        OWLOntology ontology = null;
        try {
            ontology = manager.loadOntologyFromOntologyDocument(IRI.create(owlFile));

        } catch (OWLOntologyCreationException e) {
            e.printStackTrace();
        }

        return ontology;
    }

    /**
     * A method to verify that it retrieves ingredients from ontology correctly.
     */
    @Test
    public void testRetrieveConceptName() {

        // Arrangement
        OWLOntology ontology = createMockOWLOntology();
        String foodGroup = "Insect";

        HashMap<String, HashMap<String, Set<String>>> result = OntologyService.retrieveConceptName(ontology, foodGroup);

        assertNotNull(result);

        // Assert that result contains expected concepts
        assertTrue(result.containsKey("FriedBombayLocust"));
        assertTrue(result.containsKey("RawGiantCricket"));
        assertTrue(result.containsKey("RawBombayLocust"));

        // Assert that expected values are present for each concept
        HashMap<String, Set<String>> insectConcept = result.get("FriedBombayLocust");

        assertNotNull(insectConcept);
        assertTrue(insectConcept.containsKey("hasColor"));
        assertTrue(insectConcept.containsKey("hasBenefit"));
        assertTrue(insectConcept.containsKey("hasOtherNames"));

        Set<String> insectColors = insectConcept.get("hasColor");
        Set<String> insectBenefits = insectConcept.get("hasBenefit");
        Set<String> insectOtherNames = insectConcept.get("hasOtherNames");

        assertNotNull(insectColors);
        assertNotNull(insectBenefits);
        assertNotNull(insectOtherNames);

        assertEquals(2, insectColors.size());
        assertEquals(2, insectBenefits.size());
        assertEquals(1, insectOtherNames.size());

        assertTrue(insectColors.contains("Brown"));
        assertTrue(insectColors.contains("Gold"));
        assertTrue(insectBenefits.contains("Culinary"));
        assertTrue(insectBenefits.contains("HealthPotential"));
        assertTrue(insectOtherNames.contains("ตั๊กแตนปาทังกาทอด"));

    }

}
