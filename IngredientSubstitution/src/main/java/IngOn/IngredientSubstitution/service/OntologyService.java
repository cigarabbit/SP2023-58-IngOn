package IngOn.IngredientSubstitution.service;

import org.semanticweb.owlapi.reasoner.InferenceType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
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
    @Autowired
    Environment env;

    private static Set<String> processedProperties = new HashSet<>();

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

    public static List<String> retrieveConceptName(OWLOntology ontology, String foodGroup) throws OWLOntologyCreationException {
        List<String> conceptNames = new ArrayList<>();

        OWLReasonerFactory reasonerFactory = new StructuralReasonerFactory();
        OWLReasoner reasoner = reasonerFactory.createReasoner(ontology);

        reasoner.precomputeInferences(InferenceType.CLASS_HIERARCHY);

        OWLClass mainClass = getOWLClassByName(ontology, foodGroup);

        Set<OWLClass> directSubclasses = reasoner.getSubClasses(mainClass, false).getFlattened();

        System.out.println("Main Class: " + getShortForm(mainClass, ontology));
        System.out.println("Direct Subclasses: " + directSubclasses);
        for (OWLClass cls : directSubclasses) {
            String className = getShortForm(cls, ontology);
            if (checkSubclassType(className)) {
                conceptNames.add(className);
            }
        }

        return conceptNames;
    }

    public static Boolean checkSubclassType(String className) {
        if (!className.equals("CerealType") && !className.equals("SeedType") && !className.equals("MeatType") && !className.equals("SpiceType")) {
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

    public static void addObjectProperties(OWLOntology ontology, OWLClass owlClass, ShortFormProvider shortFormProvider) {

        for (OWLIndividual individual : owlClass.getIndividuals(ontology)) {
            for (OWLObjectPropertyAssertionAxiom axiom : ontology.getObjectPropertyAssertionAxioms(individual)) {
                OWLObjectProperty property = axiom.getProperty().asOWLObjectProperty();

                String propertyName = shortFormProvider.getShortForm(property);

                processedProperties.add(propertyName);
            }
        }
    }
}
