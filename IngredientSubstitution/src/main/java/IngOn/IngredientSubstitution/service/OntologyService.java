package IngOn.IngredientSubstitution.service;

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
import java.util.*;

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
            String className = getShortForm(cls);
            if (checkSubclassType(className)) { // Not any types
                conceptNames.add(className);

                // Get equivalent classes of the subclass
                Set<OWLClassExpression> equivalentClasses = cls.getEquivalentClasses(ontology);

                for (OWLClassExpression equivalentClass : equivalentClasses) {
                    String equivalentCls = getShortForm(equivalentClass.asOWLClass());
                    conceptNames.add(equivalentCls);
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
    public static HashMap<String, Set<String>> retrieveAllConcepts(OWLOntology ontology) {
        HashMap<String, Set<String>> allConceptNames = new HashMap<>();

        allConceptNames.put("Cereal", retrieveConceptName(ontology, "Cereal"));
        allConceptNames.put("Egg", retrieveConceptName(ontology, "Egg"));
        allConceptNames.put("Fruit", retrieveConceptName(ontology, "Fruit"));
        allConceptNames.put("Insect", retrieveConceptName(ontology, "Insect"));
        allConceptNames.put("Milk", retrieveConceptName(ontology, "Milk"));
        allConceptNames.put("Meat_Poultry", retrieveConceptName(ontology, "Meat_Poultry"));
        allConceptNames.put("Pulse_Seed_Nut", retrieveConceptName(ontology, "Pulse_Seed_Nut"));
        allConceptNames.put("Shellfish", retrieveConceptName(ontology, "Shellfish"));
        allConceptNames.put("Spice_Condiment", retrieveConceptName(ontology, "Spice_Condiment"));
        allConceptNames.put("StarchyRoot_Tuber", retrieveConceptName(ontology, "StarchyRoot_Tuber"));
        allConceptNames.put("Vegetable", retrieveConceptName(ontology, "Vegetable"));

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
            if (getShortForm(cls).equals(className)) {
                return cls;
            }
        }
        return null;
    }

    public static String getShortForm(OWLClass cls) {
        ShortFormProvider shortFormProvider = new SimpleShortFormProvider();
        return shortFormProvider.getShortForm(cls);
    }

    public static String getObjectPropertyShortForm(OWLObjectProperty objectProperty) {
        ShortFormProvider shortFormProvider = new SimpleShortFormProvider();
        return shortFormProvider.getShortForm(objectProperty);
    }



}
