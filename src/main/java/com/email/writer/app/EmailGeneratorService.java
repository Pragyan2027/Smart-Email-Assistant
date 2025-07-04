package com.email.writer.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class EmailGeneratorService {

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    private final WebClient webClient;
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    // src/main/java/com/email/writer/app/EmailGeneratorService.java
    public Mono<String> generateEmailReply(EmailRequest emailRequest) {
        String prompt = buildPrompt(emailRequest);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );
        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path(geminiApiUrl)
                        .queryParam("key", geminiApiKey)
                        .build())
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .map(this::extractResponseContent);
    }

    private String extractResponseContent(String response) {
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

        } catch (Exception e) {
           return "Error processing response: " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("Generate a professional email reply with the following content:\n\n");
        if(emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            promptBuilder.append("Use a ").append(emailRequest.getTone()).append("tone.");
        }
        promptBuilder.append("\nOriginal Email Content: \n ").append(emailRequest.getEmailContent());
        return promptBuilder.toString();
    }
}
