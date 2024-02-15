package IngOn.IngredientSubstitution.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class DescriptionLogicDisplayService {
    public static HashMap<String, Set<String>> getColorProperties(HashMap<String, HashMap<String, Set<String>>> conceptList) {
        HashMap<String, Set<String>> colorProperties = new HashMap<>();

        for (Map.Entry<String, HashMap<String, Set<String>>> entry : conceptList.entrySet()) {
            String conceptName = entry.getKey();
            HashMap<String, Set<String>> propertyMap = entry.getValue();

            if (propertyMap.containsKey("hasColor")) {
                Set<String> colorSet = propertyMap.get("hasColor");

                colorProperties.put(conceptName, colorSet);
            }
        }

        return colorProperties;
    }

}
