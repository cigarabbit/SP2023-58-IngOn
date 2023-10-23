package IngOn.IngredientSubstitution.controller;

import org.springframework.web.bind.annotation.GetMapping;

public class webController {

    @GetMapping("/")
    public String homePage() {
        return "homePage";
    }
}
