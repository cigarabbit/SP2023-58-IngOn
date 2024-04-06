package IngOn.IngredientSubstitution.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class DescriptionLogicDisplayService {

    public static HashMap<String, Set<String>> getProperties(String type, HashMap<String, HashMap<String, Set<String>>> conceptList) {
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

    public static HashMap<String, HashMap<String, Set<String>>> getDataByIngredientName(Set<String> ingredients, HashMap<String, HashMap<String, HashMap<String, Set<String>>>> concepts) {
        HashMap<String, HashMap<String, Set<String>>> dataWithName = new HashMap<>();

        for (Map.Entry<String, HashMap<String, HashMap<String, Set<String>>>> outerEntry : concepts.entrySet()) {
            String category = outerEntry.getKey();
            HashMap<String, HashMap<String, Set<String>>> middleMap = outerEntry.getValue();

            for (Map.Entry<String, HashMap<String, Set<String>>> middleEntry : middleMap.entrySet()) {
                String conceptName = middleEntry.getKey();
                HashMap<String, Set<String>> innerMap = middleEntry.getValue();

                for (String ingredient : ingredients) {
                    HashMap<String, Set<String>> prop = new HashMap<>();

                    if (conceptName.equals(ingredient)) {
                        prop.put("isInCategory", Collections.singleton(category));
                        for (Map.Entry<String, Set<String>> entry : innerMap.entrySet()) {
                            String type = entry.getKey();
                            Set<String> propSet = entry.getValue();

                            prop.put(type, propSet);
                        }

                        dataWithName.put(ingredient, prop);
                    }
                }

            }
        }

//        System.out.println(dataWithName);
        return dataWithName;
    }

}
