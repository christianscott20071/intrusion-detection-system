package com.example.service;

import com.example.metrics.dto.AlertSummaryDTO;
import com.google.genai.Client;
import com.google.genai.errors.ClientException;
import com.google.genai.errors.GenAiIOException;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class GeminiService {

    private final Client client;
    private static final String MODEL = "gemini-2.5-flash-lite";

    public GeminiService(@Value("${gemini.api.key}") String apiKey) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalArgumentException("Gemini API key is missing or empty!");
        }
        System.out.println("Gemini API Key loaded: [SET]");

        this.client = new Client.Builder()
                .apiKey(apiKey)
                .build();
    }

    /**
     * Generates a summary or explanation from Gemini AI
     * @param prompt The text prompt to send
     * @return The AI response text or error message
     */
    public String analyze(String prompt) {
        try {
            GenerateContentResponse response = client.models.generateContent(
                    MODEL,
                    prompt,
                    null
            );
            return response.text();
        } catch (ClientException e) {
            // Handles API errors like 404, 429, etc.
            return "Error from Gemini API: " + e.getMessage();
        } catch (GenAiIOException e) {
            // Handles network or timeout issues
            return "Network error while contacting Gemini API: " + e.getMessage();
        } catch (Exception e) {
            // Fallback for unexpected issues
            return "Unexpected error while summarizing: " + e.getMessage();
        }
    }

    public void sendTelemetry(AlertSummaryDTO dto) {
        Map<String,Object> payload = new HashMap<>();
        payload.put("ip", dto.getIp());
        payload.put("totalScore", dto.getTotalScore());
        payload.put("totalHits", dto.getTotalHits());
        payload.put("attackCounts", dto.getAttackCounts());
        // ...send payload to AI endpoint...
    }
}