package IngOn.IngredientSubstitution.service;

import org.apache.commons.text.similarity.CosineSimilarity;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;
import java.util.regex.Pattern;

public class OntologySimilarityService {
//    private static final String FILE_PATH = "src/main/resources/data.json";
    private static final String FILE_PATH = "IngredientSubstitution/src/main/resources/data.json";

    public static List<String> setUp(String FILE_PATH) {
        List<String> itemsList = new ArrayList<>();

        try {
            String content = new Scanner(new File(FILE_PATH)).useDelimiter("\\Z").next();

            JSONObject jsonObject = new JSONObject(content);

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

        } catch (FileNotFoundException | JSONException e) {
            e.printStackTrace();
        }

        return itemsList;
    }

    public static HashMap<String, List<Map.Entry<String, Double>>> findSubstitution(String ingredientToCompare) {

        List<Map.Entry<String, Double>> similarityResult;
        HashMap<String, List<Map.Entry<String, Double>>> similarityResults = new HashMap<>();

        List<String> itemsList = setUp(FILE_PATH);
//      String ingredientProperties = displayProperties(ingredientToCompare, itemsList);

        List<String> matchingIngredientNames = findMatchingIngredientNames(ingredientToCompare, itemsList);
        if (!matchingIngredientNames.isEmpty()) {
            for (String matchingIngredient : matchingIngredientNames) {
//              System.out.println(matchingIngredient+":");
                String ingredientProperties = displayProperties(matchingIngredient, itemsList);

                similarityResult = findMostSimilarIngredients(matchingIngredient, ingredientProperties, itemsList);
                similarityResults.put(matchingIngredient, similarityResult);
//              System.out.println();
            }
        }

//      similarityResult = findMostSimilarIngredients(ingredientToCompare, ingredientProperties, itemsList);

        return similarityResults;
    }

    private static void propertiesCategory(JSONObject jsonObject, String category, List<String> itemsList) throws JSONException {
        JSONObject categoryObject = jsonObject.getJSONObject(category);

        JSONArray keys = categoryObject.names();
        if (keys != null) {
            for (int i = 0; i < keys.length(); i++) {
                String itemName = keys.getString(i);
                if (containsThaiCharacters(itemName)) {
                    continue;
                }
                JSONObject item = categoryObject.getJSONObject(itemName);
                StringBuilder itemProperties = new StringBuilder();
                itemProperties.append(itemName).append(" = ");
                for (String s : Arrays.asList("hasBenefit", "hasSugar", "hasTexture", "hasColor", "hasShape", "hasMineral", "hasFlavor", "hasVitamin", "hasNutrient")) {
                    addJSONArrayToString(item, s, itemProperties);
                }
                itemsList.add(itemProperties.toString());
            }
        }
    }

    private static void addJSONArrayToString(JSONObject jsonObject, String key, StringBuilder stringBuilder) throws JSONException {
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

    public static List<String> findMatchingIngredientNames(String ingredientToCompare, List<String> itemsList) {
        List<String> matchingIngredientNames = new ArrayList<>();

        for (String item : itemsList) {
            String[] parts = item.split(" = ");
            if (parts.length >= 1) {
                String ingredientName = parts[0];
                if (ingredientName.toLowerCase().contains(ingredientToCompare.toLowerCase())) {
                    matchingIngredientNames.add(ingredientName);
                }
            }
        }

        return matchingIngredientNames;
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
                    if (similarity > 0.00) {
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

        List<Map.Entry<String, Double>> filteredList = new ArrayList<>();
        for (Map.Entry<String, Double> entry : sortedList) {
            if (entry.getValue() > 0.85) {
                filteredList.add(entry);
            } else {
                break;
            }
        }

        return filteredList;
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