package com.example.api;

import com.example.service.GeminiService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/ai")
@CrossOrigin
public class AiController {

    private final GeminiService geminiService;

    // Cache explanation per alert ID
    private final Map<String, String> alertCache = new ConcurrentHashMap<>();
    private final Map<String, String> alertSeverityCache = new ConcurrentHashMap<>();

    public AiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    /**
     * Analyze IP data (unchanged behavior)
     */
    @PostMapping(
        path = "/analyzeIP",
        consumes = MediaType.TEXT_PLAIN_VALUE,
        produces = MediaType.TEXT_PLAIN_VALUE
    )
    public String analyzeIp(@RequestBody String summary) {

        if (summary == null || summary.isBlank()) {
            return "No data provided for IP analysis.";
        }

        String prompt = """
                You are an assistant to an intrusion detection system.

                Explain this IP behavior briefly to an adult beginner-intermediate in networking/security.
                Keep it under 100 words.
                Data:
                """ + summary;

        return geminiService.analyze(prompt);
    }

    /**
     * Analyze alert (TEXT ONLY)
     * Only regenerates if severity changes
     */
    @PostMapping(
        path = "/analyzeAlert",
        consumes = MediaType.TEXT_PLAIN_VALUE,
        produces = MediaType.TEXT_PLAIN_VALUE
    )
    public String analyzeAlert(@RequestBody String alertText) {

        if (alertText == null || alertText.isBlank()) {
            return "No alert data provided to summarize.";
        }

        /*
         Expected text format from frontend:

         ID: 10.95.202.244-STEALTH_SCAN
         Severity: MEDIUM
         Type: STEALTH_SCAN
         Origin: 10.95.202.244
         Target: Internal Network
         Hits: 25
        */

        String id = extractField(alertText, "ID:");
        String severity = extractField(alertText, "Severity:");

        if (id == null) {
            // If ID not present, fallback (no caching possible)
            return generateExplanation(alertText);
        }

        String lastSeverity = alertSeverityCache.get(id);

        // If severity unchanged, return cached explanation
        if (lastSeverity != null && lastSeverity.equals(severity)) {
            return alertCache.get(id);
        }

        // Otherwise regenerate
        String explanation = generateExplanation(alertText);

        alertCache.put(id, explanation);
        alertSeverityCache.put(id, severity);

        return explanation;
    }

    private String generateExplanation(String alertText) {

        String prompt = """
                You are an assistant to an intrusion detection system.

                Summarize this alert briefly for an adult beginner-intermediate in networking/security.
                Include the number of hits.
                Keep it under 50 words.

                Alert Data:
                """ + alertText;

        return geminiService.analyze(prompt);
    }

    private String extractField(String text, String prefix) {
        for (String line : text.split("\\R")) {
            if (line.startsWith(prefix)) {
                return line.replace(prefix, "").trim();
            }
        }
        return null;
    }
}