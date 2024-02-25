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
    private static HashMap<String, HashMap<String, HashMap<String, Set<String>>>> allConceptNames = new HashMap<>();
    private static HashMap<String, HashMap<String, Set<String>>> conceptWithValues = new HashMap<>();

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

    public static HashMap<String, HashMap<String, Set<String>>> retrieveConceptName(OWLOntology ontology, String foodGroup) {

        OWLReasoner reasoner = init(ontology);
        OWLClass mainClass = getOWLClassByName(ontology, foodGroup);

        Set<OWLClass> directSubclasses = reasoner.getSubClasses(mainClass, false).getFlattened();

        HashMap<String, HashMap<String, Set<String>>> conceptList = new HashMap<>();

        for (OWLClass cls : directSubclasses) {
            String className = getShortForm(cls);

            // Not a class that is a type and not a type name
            if (checkSubclassType(className) && !isSubclassOfSpecificTypes(cls, ontology)) {

                // Get equivalent classes of the subclass
                Set<OWLClassExpression> equivalentClasses = cls.getEquivalentClasses(ontology);

                for (OWLClassExpression equivalentClass : equivalentClasses) {
                    if (equivalentClass instanceof OWLClass) {
                        OWLClass equivalentCls = (OWLClass) equivalentClass;
                        String equivalentClassName = getShortForm(equivalentCls);

                        System.out.println(className + ":   " + equivalentClassName);
                    }
                }

                // Store the returned value from retrieveConceptValues
                conceptList.put(className, retrieveConceptValues(ontology, cls));
            }
        }

        return conceptList;
    }

    /**
     * Retrieve all concepts exist in Thai ingredients ontology.
     * Category: Class Name -> Property with set of values
     * @param ontology
     * @return
     */
    public static HashMap<String, HashMap<String, HashMap<String, Set<String>>>> retrieveAllConcepts(OWLOntology ontology) {

        HashMap<String, HashMap<String, Set<String>>> cerealConcepts = retrieveConceptName(ontology, "Cereal");
        HashMap<String, HashMap<String, Set<String>>> eggConcepts = retrieveConceptName(ontology, "Egg");
        HashMap<String, HashMap<String, Set<String>>> fruitConcepts = retrieveConceptName(ontology, "Fruit");
        HashMap<String, HashMap<String, Set<String>>> insectConcepts = retrieveConceptName(ontology, "Insect");
        HashMap<String, HashMap<String, Set<String>>> milkConcepts = retrieveConceptName(ontology, "Milk");
        HashMap<String, HashMap<String, Set<String>>> meatPoultryConcepts = retrieveConceptName(ontology, "Meat_Poultry");
        HashMap<String, HashMap<String, Set<String>>> pulseSeedNutConcepts = retrieveConceptName(ontology, "Pulse_Seed_Nut");
        HashMap<String, HashMap<String, Set<String>>> shellfishConcepts = retrieveConceptName(ontology, "Shellfish");
        HashMap<String, HashMap<String, Set<String>>> spiceCondimentConcepts = retrieveConceptName(ontology, "Spice_Condiment");
        HashMap<String, HashMap<String, Set<String>>> starchyRootTuberConcepts = retrieveConceptName(ontology, "StarchyRoot_Tuber");
        HashMap<String, HashMap<String, Set<String>>> vegetableConcepts = retrieveConceptName(ontology, "Vegetable");

        allConceptNames.put("Cereal", cerealConcepts);
        allConceptNames.put("Egg", eggConcepts);
        allConceptNames.put("Fruit", fruitConcepts);
        allConceptNames.put("Insect", insectConcepts);
        allConceptNames.put("Milk", milkConcepts);
        allConceptNames.put("Meat_Poultry", meatPoultryConcepts);
        allConceptNames.put("Pulse_Seed_Nut", pulseSeedNutConcepts);
        allConceptNames.put("Shellfish", shellfishConcepts);
        allConceptNames.put("Spice_Condiment", spiceCondimentConcepts);
        allConceptNames.put("StarchyRoot_Tuber", starchyRootTuberConcepts);
        allConceptNames.put("Vegetable", vegetableConcepts);

        return allConceptNames;
    }

    public static Boolean checkSubclassType(String className) {
        return !className.equals("CerealType") && !className.equals("SeedsType") && !className.equals("MeatType")
                && !className.equals("SpiceType") && !className.equals("Nothing");
    }

    public static Set<OWLClass> getSpecificTypes(OWLOntology ontology) {
        Set<OWLClass> specificTypes = new HashSet<>();

        OWLDataFactory dataFactory = ontology.getOWLOntologyManager().getOWLDataFactory();

        String[] specificClassNames = {"CerealType", "SeedsType", "MeatType", "SpiceType"};

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

    public static HashMap<String, HashMap<String, HashMap<String, Set<String>>>> getAllConceptNames() {
        return allConceptNames;
    }

    public static HashMap<String, Set<String>> retrieveConceptValues(OWLOntology ontology, OWLClass cls) {
//        OWLClass cls = ontology.getOWLOntologyManager().getOWLDataFactory().getOWLClass(IRI.create("http://www.semanticweb.org/acer/ontologies/2023/9/ThaiIngredients-v4#RawCricket"));

        HashMap<String, Set<String>> propertyList = new HashMap<>();

        for (OWLClassExpression superClass : cls.getSuperClasses(ontology)) {
            if (superClass instanceof OWLObjectSomeValuesFrom) {
                OWLObjectSomeValuesFrom someValuesFrom = (OWLObjectSomeValuesFrom) superClass;
                OWLProperty property = (OWLProperty) someValuesFrom.getProperty();
                OWLClassExpression filler = someValuesFrom.getFiller();

                String propertyName = getObjectPropertyShortForm((OWLObjectProperty) property);
                String fillerName = getShortForm((OWLClass) filler);

                if (propertyList.containsKey(propertyName)) {
                    Set<String> existingSet = propertyList.get(propertyName);
                    existingSet.add(fillerName);
                } else {
                    Set<String> newSet = new HashSet<>();
                    newSet.add(fillerName);

                    propertyList.put(propertyName, newSet);
                }
            }
        }


        return propertyList;
    }

    public static String getObjectPropertyShortForm(OWLObjectProperty objectProperty) {
        ShortFormProvider shortFormProvider = new SimpleShortFormProvider();
        return shortFormProvider.getShortForm(objectProperty);
    }

}
