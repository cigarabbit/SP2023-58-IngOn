package IngOn.IngredientSubstitution.enumeration;

public enum FoodGroupEnum {
        Cereal("Cereal"),
        Egg("Egg"),
        Fruit("Fruit"),
        Insect("Insect"),
        Milk("Milk"),
        Meat_Poultry("Meat_Poultry"),
        Pulse_Seed_Nut("Pulse_Seed_Nut"),
        Shellfish("Shellfish"),
        Spice_Condiment("Spice_Condiment"),
        StarchyRoot_Tuber("StarchyRoot_Tuber"),
        Vegetable("Vegetable");

        private final String foodGroupCategory;

        FoodGroupEnum(String foodGroupCategory) {
                this.foodGroupCategory = foodGroupCategory;
        }

        public String getFoodGroupCategory() {
                return foodGroupCategory;
        }
}
