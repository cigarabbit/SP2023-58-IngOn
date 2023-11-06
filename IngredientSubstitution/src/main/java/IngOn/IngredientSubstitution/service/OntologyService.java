package IngOn.IngredientSubstitution.service;

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

        OWLClass mainClass = getOWLClassByName(ontology, foodGroup);

        for (OWLClass cls : ontology.getClassesInSignature()) {
            if (reasoner.getSubClasses(mainClass, true).containsEntity(cls)) { // Checks if cls is a subclass of mainClass using the reasoner
                String className = getShortForm(cls, ontology);
                conceptNames.add(className);
            }
        }

        return conceptNames;
    }

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
