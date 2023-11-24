package IngOn.IngredientSubstitution.service;

import IngOn.IngredientSubstitution.enumeration.FoodGroupEnum;
import org.semanticweb.owlapi.reasoner.InferenceType;
import org.springframework.stereotype.Service;

import org.semanticweb.owlapi.reasoner.OWLReasoner;
import org.semanticweb.owlapi.reasoner.OWLReasonerFactory;
import org.semanticweb.owlapi.reasoner.structural.StructuralReasonerFactory;
import org.semanticweb.owlapi.apibinding.OWLManager;
import org.semanticweb.owlapi.model.*;
import org.semanticweb.owlapi.util.ShortFormProvider;
import org.semanticweb.owlapi.util.SimpleShortFormProvider;

import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class OntologyService {
    private static Set<String> processedProperties = new HashSet<>();

    public static OWLReasoner init(OWLOntology ontology) {
        OWLReasonerFactory reasonerFactory = new StructuralReasonerFactory();

        OWLReasoner reasoner = reasonerFactory.createReasoner(ontology);

        reasoner.precomputeInferences(InferenceType.CLASS_HIERARCHY);

        return reasoner;
    }

    public static OWLOntology prepareOWLFile(File owlFile) {
        OWLOntologyManager manager = OWLManager.createOWLOntologyManager();
        OWLOntology ontology = null;
        try {
            ontology = manager.loadOntologyFromOntologyDocument(IRI.create(owlFile));
        } catch (OWLOntologyCreationException e) {
            e.printStackTrace();
        }

        return ontology;
    }

    public static Set<String> retrieveConceptName(OWLOntology ontology, String foodGroup) {
        Set<String> conceptNames = new HashSet<>();

        OWLReasoner reasoner = init(ontology);

        OWLClass mainClass = getOWLClassByName(ontology, foodGroup);

        Set<OWLClass> directSubclasses = reasoner.getSubClasses(mainClass, false).getFlattened();

        for (OWLClass cls : directSubclasses) {
            String className = getShortForm(cls, ontology);
            if (checkSubclassType(className)) {
                conceptNames.add(className);

                // Get equivalent classes of the subclass
                Set<OWLClassExpression> equivalentClasses = cls.getEquivalentClasses(ontology);

                for (OWLClassExpression equivalentClass : equivalentClasses) {
                    String equivalentCls = getShortForm(equivalentClass.asOWLClass(), ontology);

                }
            }
        }

        return conceptNames;
    }

    /**
     * Retrieve all concepts exist in Thai ingredients ontology.
     * @param ontology
     * @return
     */
    public static HashSet<String> retrieveAllConcepts(OWLOntology ontology) {
        HashSet<String> allConceptNames = new HashSet<>();

        OWLReasoner reasoner = init(ontology);

        for (OWLClass cls : ontology.getClassesInSignature()) {
            allConceptNames.add(getShortForm(cls, ontology));
        }

        // FoddGroup: "Cereal", "Egg", "Fruit", "Insect", "Milk",
        //    "Meat/Poultry", "Pulse/Seed/Nut", "Shellfish",
        //    "Spice", "Starchy Root/Tuber", "Vegetable"


        return allConceptNames;
    }

    public static Boolean checkSubclassType(String className) {
        if (!className.equals("CerealType") && !className.equals("SeedType") && !className.equals("MeatType")
                && !className.equals("SpiceType") && !className.equals("Nothing")) {
            return Boolean.TRUE;
        }
        return Boolean.FALSE;
    }

    /**
     * Retrieve an owl class from the specific category.
     * @param ontology
     * @param className
     * @return
     */
    public static OWLClass getOWLClassByName(OWLOntology ontology, String className) {
        for (OWLClass cls : ontology.getClassesInSignature()) {
            if (getShortForm(cls, ontology).equals(className)) {
                return cls;
            }
        }
        return null;
    }

    public static String getShortForm(OWLClass cls, OWLOntology ontology) {
        ShortFormProvider shortFormProvider = new SimpleShortFormProvider();
        return shortFormProvider.getShortForm(cls);
    }

    public static void retrieveObjectProperties(OWLOntology ontology, OWLClass owlClass, ShortFormProvider shortFormProvider) {

        for (OWLIndividual individual : owlClass.getIndividuals(ontology)) {
            for (OWLObjectPropertyAssertionAxiom axiom : ontology.getObjectPropertyAssertionAxioms(individual)) {
                OWLObjectProperty property = axiom.getProperty().asOWLObjectProperty();

                String propertyName = shortFormProvider.getShortForm(property);

                processedProperties.add(propertyName);
            }
        }
    }
}
