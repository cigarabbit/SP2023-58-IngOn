package IngOn.IngredientSubstitution;

import static org.junit.Assert.*;

import IngOn.IngredientSubstitution.service.OntologySimilarityService;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.BeforeClass;
import org.junit.Test;

import org.apache.commons.text.similarity.CosineSimilarity;
import java.util.*;

public class OntologySimilarityServiceTests {
    public static List<String> ingredientList = new ArrayList<>();
    private static final String FILE_PATH = "src/test/java/data.json";

    @BeforeClass
    public static void setUp() {
        ingredientList = OntologySimilarityService.setUp(FILE_PATH);
    }

    /**
     * A method to verify that it properly finds all ingredients that are partial matches.
     */
    @Test
    public void testFindMatchingIngredientNames() {
        String ingredientToCompare = "Banana";

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
     * A method to verify that the term frequency before calculating cosine similarity.
     */
//    @Test
    public void testCalculateTermFrequency() {

    }


}

