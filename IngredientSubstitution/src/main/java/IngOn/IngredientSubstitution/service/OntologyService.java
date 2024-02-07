package IngOn.IngredientSubstitution.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
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
import java.io.IOException;
import java.util.*;

@Service
public class OntologyService {
    private static Set<String> processedProperties = new HashSet<>();

    private static HashMap<String, Set<String>> allConceptNames = new HashMap<>();

    private static String base_IRI = "http://www.semanticweb.org/acer/ontologies/2023/9/ThaiIngredients-v4#";

    /**
     * Initialize OWL reasoner.
     * @param ontology
     * @return
     */
    public static OWLReasoner init(OWLOntology ontology) {
        OWLReasonerFactory reasonerFactory = new StructuralReasonerFactory();

        OWLReasoner reasoner = reasonerFactory.createReasoner(ontology);

        reasoner.precomputeInferences(InferenceType.CLASS_HIERARCHY);

        return reasoner;
    }

    /**
     * Access to an .owl file and convert it to OWLontology.
     * @param owlFile
     * @return
     */
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

    /**
     * Retrieve a set of string of concept names from the given .owl file.
     * @param ontology
     * @param foodGroup
     * @return
     */
    public static Set<String> retrieveConceptName(OWLOntology ontology, String foodGroup) {
        Set<String> conceptNames = new HashSet<>();

        OWLReasoner reasoner = init(ontology);

        OWLClass mainClass = getOWLClassByName(ontology, foodGroup);

        Set<OWLClass> directSubclasses = reasoner.getSubClasses(mainClass, false).getFlattened();

        for (OWLClass cls : directSubclasses) {
            String className = getShortForm(cls);

            // Not a class that is a type and not a type name
            if (checkSubclassType(className) && !isSubclassOfSpecificTypes(cls, ontology)) {
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
        return !className.equals("CerealType") && !className.equals("SeedType") && !className.equals("MeatType")
                && !className.equals("SpiceType") && !className.equals("Nothing");
    }

    public static Set<OWLClass> getSpecificTypes(OWLOntology ontology) {
        Set<OWLClass> specificTypes = new HashSet<>();

        OWLDataFactory dataFactory = ontology.getOWLOntologyManager().getOWLDataFactory();

        String[] specificClassNames = {"CerealType", "SeedType", "MeatType", "SpiceType"};

        for (String className : specificClassNames) {
            IRI classIRI = IRI.create(base_IRI + className);

            OWLClass cls = dataFactory.getOWLClass(classIRI);
            if (ontology.containsClassInSignature(cls.getIRI())) {
                specificTypes.add(cls);
            }
        }

        return specificTypes;
    }

    public static Boolean isSubclassOfSpecificTypes(OWLClass cls, OWLOntology ontology) {
        Set<OWLClass> specificTypes = getSpecificTypes(ontology);

        OWLReasoner reasoner = init(ontology);

        for (OWLClass type : specificTypes) {
            if (reasoner.getSuperClasses(cls, false).containsEntity(type)) {
                return true;
            }
        }
        return false;
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

    public static HashMap<String, Set<String>> getAllConceptNames() {
        return allConceptNames;
    }

    /**
     * Retrieve all object properties exist in the ontology.
     * @param ontology
     * @return
     */
    public static Set<String> retrieveAllObjectProperties(OWLOntology ontology) {
        Set<String> objectProperties = new HashSet<>();

        for (OWLObjectProperty objectProperty : ontology.getObjectPropertiesInSignature()) {
            String propertyShortForm = getObjectPropertyShortForm(objectProperty);
            objectProperties.add(propertyShortForm);
        }

        return objectProperties;
    }

    /**
     * Retrieve the short form of an object property.
     * @param objectProperty
     * @return
     */
    public static String getObjectPropertyShortForm(OWLObjectProperty objectProperty) {
        ShortFormProvider shortFormProvider = new SimpleShortFormProvider();
        return shortFormProvider.getShortForm(objectProperty);
    }

}
