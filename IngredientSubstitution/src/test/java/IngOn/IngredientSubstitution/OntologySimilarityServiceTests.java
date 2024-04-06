package IngOn.IngredientSubstitution;

import static org.junit.Assert.*;

import IngOn.IngredientSubstitution.service.OntologySimilarityService;
import org.junit.BeforeClass;
import org.junit.Test;
import java.util.*;

public class OntologySimilarityServiceTests {
    public static List<String> ingredientList = new ArrayList<>();
    private static final String FILE_PATH = "src/test/java/data.json";

    /**
     * Set up ontology concept list initially.
     */
    @BeforeClass
    public static void setUp() {
        ingredientList = OntologySimilarityService.setUp(FILE_PATH);
    }

    /**
     * A method to verify that it properly finds all ingredients that are partial matches.
     */
    @Test
    public void testFindMatchingIngredientNames() {
        // Test Data
        String ingredientToCompare = "Banana";

        // Expected Results
        List<String> expectedResults = new ArrayList<>();
        expectedResults.addAll(Arrays.asList(
                "Leb-muenang Banana", "Nom Sao Banana", "Khai Phama Banana", "Hom Banana", "Khai Banana", "Hom-jumpa Banana",
                "Saba Banana", "Thepparot Banana", "Pisang Awak Banana", "Takhui Banana", "Nang Phaya Banana", "Nha Chang Banana",
                "Nam-chiangrai Banana", "Pisangsusu Banana", "Nak Banana", "Hin Banana", "Cavendish Banana", "Hom-short-body Banana",
                "Namwa-ngaen Banana", "Khai Nonsung Banana", "Phama-heak-kuk Banana", "Hak-mook-nuan Banana", "Hom-thip Banana",
                "Nam-tai Banana", "Hak-mook Banana", "Thipparot Banana", "Nam Banana", "Namwa-dang Banana", "Lady Finger Banana",
                "Ducasse Banana", "Nam Wah Banana", "Tib-mukdahan Banana", "Banana Pepper", "Banana Blossom", "Dwarf Namwah Banana Stem",
                "Young Banana Stem"
        ));

        List<String> actualResults = new ArrayList<>();
        actualResults = OntologySimilarityService.findMatchingIngredientNames(ingredientToCompare, ingredientList);

        assertEquals(expectedResults, actualResults);

    }

    /**
     * A method to verify that every property in a given concept (String) is retrieved correctly.
     */
    @Test
    public void testDisplayProperties() {
        // Test Data
        String ingredient1 = "Krill";
        String ingredient2 = "Julliens Mud Carp";

        // Expected Results
        String expectedResult1 = "Culinary Health Potential Tender Phosphorus Iron Iodine Umami Riboflavin Niacin Thiamin Water Energy Ash Fat Carbohydrate Protein";
        String expectedResult2 = "Culinary Health Potential Flaky Tender Gray Phosphorus Iodine Umami Riboflavin Niacin Thiamin Water Energy Ash Fat Carbohydrate Protein";

        String actualResult1 = OntologySimilarityService.displayProperties(ingredient1, ingredientList);
        String actualResult2 = OntologySimilarityService.displayProperties(ingredient2, ingredientList);

        expectedResult1 = expectedResult1.replaceAll("\\s", "");
        actualResult1 = actualResult1.replaceAll("\\s", "");

        expectedResult2 = expectedResult2.replaceAll("\\s", "");
        actualResult2 = actualResult2.replaceAll("\\s", "");

        assertEquals(expectedResult1, actualResult1);
        assertEquals(expectedResult2, actualResult2);
    }

    /**
     * A method to verify that given string is tokenized into an array of terms correctly.
     */
    @Test
    public void testTokenize() {
        // Test Data
        String ingredient1 = "Krill";
        List<String> matchingIngredients1 = OntologySimilarityService.findMatchingIngredientNames(ingredient1, ingredientList);
        String ingredientProperties1 = OntologySimilarityService.displayProperties(matchingIngredients1.get(0), ingredientList);

        String ingredient2 = "Julliens Mud Carp";
        List<String> matchingIngredients = OntologySimilarityService.findMatchingIngredientNames(ingredient2, ingredientList);
        String ingredientProperties2 = OntologySimilarityService.displayProperties(matchingIngredients.get(0), ingredientList);

        // Expected Results
        List<CharSequence> expectedResult1 = new ArrayList<>(Arrays.asList(
                "culinary", "health", "potential", "tender", "phosphorus", "iron", "iodine", "umami", "riboflavin",
                "niacin", "thiamin", "water", "energy", "ash", "fat", "carbohydrate", "protein"));

        List<CharSequence> expectedResult2 = new ArrayList<>(Arrays.asList(
                "culinary", "health", "potential", "flaky", "tender", "gray", "phosphorus", "iodine",
                "umami", "riboflavin", "niacin", "thiamin", "water", "energy", "ash", "fat",
                "carbohydrate", "protein"
        ));

        // Action
        List<CharSequence> actualResults1 = OntologySimilarityService.tokenize(ingredientProperties1);
        List<CharSequence> actualResults2 = OntologySimilarityService.tokenize(ingredientProperties2);

        assertEquals(expectedResult1, actualResults1);
        assertEquals(expectedResult2, actualResults2);
    }

    /**
     * A method to verify that the term frequency is computed correctly before calculating cosine similarity.
     */
    @Test
    public void testCalculateTermFrequency() {
        // Test Data
        String ingredient1 = "Krill";
        List<String> matchingIngredients1 = OntologySimilarityService.findMatchingIngredientNames(ingredient1, ingredientList);
        String ingredientProperties1 = OntologySimilarityService.displayProperties(matchingIngredients1.get(0), ingredientList);
        List<CharSequence> terms1 = OntologySimilarityService.tokenize(ingredientProperties1);

        String ingredient2 = "Julliens Mud Carp";
        List<String> matchingIngredients = OntologySimilarityService.findMatchingIngredientNames(ingredient2, ingredientList);
        String ingredientProperties2 = OntologySimilarityService.displayProperties(matchingIngredients.get(0), ingredientList);
        List<CharSequence> terms2 = OntologySimilarityService.tokenize(ingredientProperties2);

        // Expected Results
        Map<CharSequence, Integer> expectedResult1 = Map.ofEntries(
                Map.entry("tender", 1), Map.entry("umami", 1), Map.entry("thiamin", 1),
                Map.entry("niacin", 1), Map.entry("health", 1), Map.entry("water", 1),
                Map.entry("carbohydrate", 1), Map.entry("ash", 1), Map.entry("protein", 1),
                Map.entry("fat", 1), Map.entry("iron", 1), Map.entry("culinary", 1),
                Map.entry("iodine", 1), Map.entry("potential", 1), Map.entry("riboflavin", 1),
                Map.entry("phosphorus", 1), Map.entry("energy", 1)
        );

        Map<CharSequence, Integer> expectedResult2 = Map.ofEntries(
                Map.entry("tender", 1), Map.entry("flaky", 1), Map.entry("umami", 1),
                Map.entry("thiamin", 1), Map.entry("niacin", 1), Map.entry("health", 1),
                Map.entry("water", 1), Map.entry("carbohydrate", 1), Map.entry("gray", 1),
                Map.entry("ash", 1), Map.entry("protein", 1), Map.entry("fat", 1),
                Map.entry("culinary", 1), Map.entry("iodine", 1), Map.entry("potential", 1),
                Map.entry("riboflavin", 1), Map.entry("phosphorus", 1), Map.entry("energy", 1)
        );

        // Action
        Map<CharSequence, Integer> termFrequency1 = OntologySimilarityService.calculateTermFrequency(terms1);
        Map<CharSequence, Integer> termFrequency2 = OntologySimilarityService.calculateTermFrequency(terms2);

        assertEquals(expectedResult1, termFrequency1);
        assertEquals(expectedResult2, termFrequency2);
    }

    /**
     * A method to verify the cosine similarity computation of two ingredients.
     */
    @Test
    public void testCalculateCosineSimilarity() {
        // Test Data: Case 1 Krill & Julliens Mud Carp
        String ingredient1 = "Krill";
        List<String> matchingIngredients1 = OntologySimilarityService.findMatchingIngredientNames(ingredient1, ingredientList);
        String ingredientProperties1 = OntologySimilarityService.displayProperties(matchingIngredients1.get(0), ingredientList);

        String ingredient2 = "Julliens Mud Carp";
        List<String> matchingIngredients2 = OntologySimilarityService.findMatchingIngredientNames(ingredient2, ingredientList);
        String ingredientProperties2 = OntologySimilarityService.displayProperties(matchingIngredients2.get(0), ingredientList);

        double expectedResult1 = 0.9146591207600472;
        double actualResult1 = OntologySimilarityService.calculateCosineSimilarity(ingredientProperties1, ingredientProperties2);

        assertEquals(expectedResult1, actualResult1, 3);

        // Test Data: Case 2 Krill & Abalone
        String ingredient3 = "Abalone";
        List<String> matchingIngredients3 = OntologySimilarityService.findMatchingIngredientNames(ingredient3, ingredientList);
        String ingredientProperties3 = OntologySimilarityService.displayProperties(matchingIngredients3.get(0), ingredientList);

        double expectedResult2 = 0.9095085938862486;
        double actualResult2 = OntologySimilarityService.calculateCosineSimilarity(ingredientProperties1, ingredientProperties3);

        assertEquals(expectedResult2, actualResult2, 3);

    }

}

