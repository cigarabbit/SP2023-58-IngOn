package IngOn.IngredientSubstitution;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class IngredientSubstitutionApplication {

	public static void main(String[] args) {
		SpringApplication.run(IngredientSubstitutionApplication.class, args);
	}

}
