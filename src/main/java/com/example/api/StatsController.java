package com.example.api;

import com.example.state.SystemState;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @GetMapping
    public Map<String, Object> getStats() {
        return Map.of(
            "packetsSeen", SystemState.packetsSeen.get(),
            "ipScores", SystemState.ipScores
        );
    }
}
