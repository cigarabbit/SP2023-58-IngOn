package IngOn.IngredientSubstitution.service;

import IngOn.IngredientSubstitution.controller.ConceptListManager;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.semanticweb.owlapi.model.OWLOntology;

import java.io.File;
import java.io.IOException;
import java.util.*;

public class OntologyConverter {
//    private static final File owlFile = new File("./src/main/resources/ontology/ThaiIngredients-v4.owl");
    private static final File owlFile = new File("C:\\Users\\Acer\\Documents\\GitHub\\ThaiLocalIngredients\\ThaiIngredients-v4.owl");

    public static void writeAllConceptNamesToFile(String directoryPath, String fileName) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT);

        File directory = new File(directoryPath);
        File file = new File(directory, fileName);

        OWLOntology ontology = OntologyService.prepareOWLFile(owlFile);
        ConceptListManager.loadConceptList(ontology);

        HashMap<String, HashMap<String, HashMap<String, Set<String>>>> conceptList = ConceptListManager.getConceptList();

        HashMap<String, HashMap<String, HashMap<String, Set<String>>>> separatedKeysConceptList = new HashMap<>();

        for (Map.Entry<String, HashMap<String, HashMap<String, Set<String>>>> entry : conceptList.entrySet()) {
            String outerKey = entry.getKey();
            HashMap<String, HashMap<String, Set<String>>> innerMap = entry.getValue();
            HashMap<String, HashMap<String, Set<String>>> separatedInnerMap = new HashMap<>();

            for (Map.Entry<String, HashMap<String, Set<String>>> innerEntry : innerMap.entrySet()) {
                String[] formattedInnerKeyArray = separateWord(Collections.singleton(innerEntry.getKey()));
                String formattedInnerKey = String.join(" ", formattedInnerKeyArray);
//                System.out.println(formattedInnerKey);

                HashMap<String, Set<String>> propertyList = innerEntry.getValue();
                HashMap<String, Set<String>> separatedPropertyList = new HashMap<>();

                for (Map.Entry<String, Set<String>> propertyEntry : propertyList.entrySet()) {
                    Set<String> conceptSet = propertyEntry.getValue();
                    Set<String> formattedConcepts = new HashSet<>();

                    for (String concept : conceptSet) {
                        String[] formattedWords = separateWord(Collections.singleton(concept));
                        formattedConcepts.addAll(Arrays.asList(formattedWords));
                    }

                    separatedPropertyList.put(propertyEntry.getKey(), formattedConcepts);
                }

                separatedInnerMap.put(formattedInnerKey, separatedPropertyList);
            }

            separatedKeysConceptList.put(outerKey, separatedInnerMap);
        }

        try {
            objectMapper.writeValue(file, separatedKeysConceptList);
            System.out.println("JSON data written to " + file.getAbsolutePath());
        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("Error writing JSON data to " + file.getAbsolutePath());
        }
    }


    public static HashMap<String, HashMap<String, HashMap<String, Set<String>>>> readJSONfile() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();

        HashMap<String, HashMap<String, HashMap<String, Set<String>>>> concepts = null;

        try {
            File jsonFile = new File("IngredientSubstitution/src/main/resources/data.json");
//            File jsonFile = new File("src/main/resources/data.json");
            concepts = objectMapper.readValue(jsonFile, new TypeReference<HashMap<String, HashMap<String, HashMap<String, Set<String>>>>>() {});

        } catch (IOException e) {
            e.printStackTrace();
        }

        return concepts;
    }

    public static String[] separateWord(Set<String> conceptList) {
        List<String> formattedConceptList = new ArrayList<>();

        for (String name : conceptList) {
            StringBuilder formattedConcept = new StringBuilder();

            for (int i = 0; i < name.length(); i++) {
                char currentChar = name.charAt(i);

                if (currentChar == '_') {
                    formattedConcept.append(' ');
                } else if (Character.isUpperCase(currentChar)) {
                    // Append a space before the uppercase letter
                    if (i > 0) {
                        formattedConcept.append(' ');
                    }
                    formattedConcept.append(currentChar);
                } else {
                    // Append the lowercase or non-alphabetic characters
                    formattedConcept.append(currentChar);
                }

            }

            formattedConceptList.add(formattedConcept.toString());
        }

        return formattedConceptList.toArray(new String[0]);
    }


}
