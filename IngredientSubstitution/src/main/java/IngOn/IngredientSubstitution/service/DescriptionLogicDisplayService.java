package IngOn.IngredientSubstitution.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class DescriptionLogicDisplayService {

    private static HashMap<String, HashMap<String, Set<String>>> conceptList = new HashMap<>();

    public static void setConceptList(HashMap<String, HashMap<String, Set<String>>> concepts) {
        conceptList = concepts;
    }

    public static HashMap<String, Set<String>> getProperties(String type) {
        HashMap<String, Set<String>> properties = new HashMap<>();

        for (Map.Entry<String, HashMap<String, Set<String>>> entry : conceptList.entrySet()) {
            String conceptName = entry.getKey();
            HashMap<String, Set<String>> propertyMap = entry.getValue();

            if (propertyMap.containsKey(type)) {
                Set<String> propSet = propertyMap.get(type);

                properties.put(conceptName, propSet);
            }
        }

        return properties;
    }
}
