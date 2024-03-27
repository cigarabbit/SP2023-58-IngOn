package IngOn.IngredientSubstitution.service;

import org.apache.commons.text.similarity.CosineSimilarity;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;
import java.util.regex.Pattern;

public class OntologySimilarityService {

    public static List<Map.Entry<String, Double>> findSubstitution(String ingredientToCompare) throws FileNotFoundException {

        List<Map.Entry<String, Double>> similarityResult = null;
        try {
            // src/main/resources/data.json
            String content = new Scanner(new File("IngredientSubstitution/src/main/resources/data.json")).useDelimiter("\\Z").next();

            JSONObject jsonObject = new JSONObject(content);

            List<String> itemsList = new ArrayList<>();

            propertiesCategory(jsonObject, "Egg", itemsList);
            propertiesCategory(jsonObject, "Fruit", itemsList);
            propertiesCategory(jsonObject, "Shellfish", itemsList);
            propertiesCategory(jsonObject, "Spice_Condiment", itemsList);
            propertiesCategory(jsonObject, "Cereal", itemsList);
            propertiesCategory(jsonObject, "Insect", itemsList);
            propertiesCategory(jsonObject, "Meat_Poultry", itemsList);
            propertiesCategory(jsonObject, "Pulse_Seed_Nut", itemsList);
            propertiesCategory(jsonObject, "Vegetable", itemsList);
            propertiesCategory(jsonObject, "Milk", itemsList);
            propertiesCategory(jsonObject, "StarchyRoot_Tuber", itemsList);

            String ingredientProperties = displayProperties(ingredientToCompare, itemsList);

            similarityResult = findMostSimilarIngredients(ingredientToCompare, ingredientProperties, itemsList);
            
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        System.out.println(similarityResult);
        return similarityResult;
    }

    private static void propertiesCategory(JSONObject jsonObject, String category, List<String> itemsList) {
        JSONObject categoryObject = jsonObject.getJSONObject(category);
        for (String itemName : categoryObject.keySet()) {
            if (containsThaiCharacters(itemName)) {
                continue;
            }
            JSONObject item = categoryObject.getJSONObject(itemName);
            StringBuilder itemProperties = new StringBuilder();
            itemProperties.append(itemName).append(" = ");
            addJSONArrayToString(item, "hasBenefit", itemProperties);
            addJSONArrayToString(item, "hasSugar", itemProperties);
            addJSONArrayToString(item, "hasTexture", itemProperties);
            addJSONArrayToString(item, "hasColor", itemProperties);
            addJSONArrayToString(item, "hasShape", itemProperties);
            addJSONArrayToString(item, "hasMineral", itemProperties);
            addJSONArrayToString(item, "hasFlavor", itemProperties);
            addJSONArrayToString(item, "hasVitamin", itemProperties);
            addJSONArrayToString(item, "hasNutrient", itemProperties);
            itemsList.add(itemProperties.toString());
        }
    }

    private static void addJSONArrayToString(JSONObject jsonObject, String key, StringBuilder stringBuilder) {
        if (jsonObject.has(key)) {
            JSONArray array = jsonObject.getJSONArray(key);
            for (int i = 0; i < array.length(); i++) {
                stringBuilder.append(array.getString(i));
                if (i < array.length() - 1) {
                    stringBuilder.append(" ");
                }
            }
            stringBuilder.append(" ");
        }
    }

    private static boolean containsThaiCharacters(String str) {
        Pattern thaiPattern = Pattern.compile("[ก-๛]");
        return thaiPattern.matcher(str).find();
    }

    private static String displayProperties(String ingredientName, List<String> itemsList) {
        StringBuilder properties = new StringBuilder();
        boolean found = false;
        for (String item : itemsList) {
            if (item.startsWith(ingredientName)) {
                found = true;
                String[] parts = item.split(" = ");
                if (parts.length == 2) {
                    properties.append(parts[1]).append("\n");
                    break;
                }
            }
        }
        return properties.toString();
    }


    private static List<Map.Entry<String, Double>> findMostSimilarIngredients(String ingredientToCompare, String ingredientProp, List<String> itemsList) {
        HashMap<String, Double> similarityMap = new HashMap<>();

        for (String item : itemsList) {
            String[] parts = item.split(" = ");
            // Check if parts array has at least two elements before accessing index 1
            if (parts.length >= 2) {
                String ingredientName = parts[0];
                String ingredientPro = parts[1];
                if (!ingredientName.equals(ingredientToCompare)) {
                    double similarity = calculateCosineSimilarity(ingredientProp, ingredientPro);
                    if (similarity > 0.0) {
                        similarityMap.put(ingredientName, similarity);
                    }
                }
            } else {
                continue;
            }
        }

        // Sort the similarity values in descending order
        List<Map.Entry<String, Double>> sortedList = new ArrayList<>(similarityMap.entrySet());
        sortedList.sort(Map.Entry.comparingByValue(Comparator.reverseOrder()));

//        // Display top 5 most similar ingredients
//        int count = 0;
//        for (Map.Entry<String, Double> entry : sortedList) {
//            if (count >= 5) {
//                break;
//            }
//            if (entry.getValue() > 0.0) {
//                System.out.println(entry.getKey() + ": " + entry.getValue());
//                count++;
//            }
//        }

        return sortedList;
    }

    // Calculate the cosine similarity between two strings
    private static double calculateCosineSimilarity(String str1, String str2) {
        List<CharSequence> terms1 = Arrays.asList(str1.toLowerCase().split("\\s+"));
        List<CharSequence> terms2 = Arrays.asList(str2.toLowerCase().split("\\s+"));

        //System.out.print(terms1+"\n");
        //System.out.print(terms2+"\n");

        Map<CharSequence, Integer> termFrequency1 = calculateTermFrequency(terms1);
        Map<CharSequence, Integer> termFrequency2 = calculateTermFrequency(terms2);

        //System.out.print(termFrequency1+"\n");
        //System.out.print(termFrequency2+"\n");

        CosineSimilarity cosineSimilarity = new CosineSimilarity();
        return cosineSimilarity.cosineSimilarity(termFrequency1, termFrequency2);
    }

    // Calculate the term frequency of terms in a list
    private static Map<CharSequence, Integer> calculateTermFrequency(List<CharSequence> terms) {
        Map<CharSequence, Integer> termFrequency = new HashMap<>();
        for (CharSequence term : terms) {
            termFrequency.put(term, termFrequency.getOrDefault(term, 0) + 1);
        }
        return termFrequency;
    }
}