package com.elasticsearch.search;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class SearchApplication implements WebMvcConfigurer {

	public static void main(String[] args) {
		SpringApplication.run(SearchApplication.class, args);
	}

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")  // Adapte o caminho conforme necessário
                .allowedOrigins("http://localhost:5173")  // Permite CORS de localhost:5173
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Métodos permitidos
                .allowCredentials(true)
                .allowedHeaders("*");
    }
}
