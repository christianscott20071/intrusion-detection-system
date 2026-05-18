package com.example.api;

import com.example.state.SystemState;
import com.example.metrics.*;
import com.example.metrics.dto.PacketSnapshot;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MetricsController {

    private final ContinuityService continuityService;
    private final ResponseDelayService responseDelayService;
    private final NodeEfficiencyService nodeEfficiencyService;

    public MetricsController(
        ContinuityService continuityService,
        ResponseDelayService responseDelayService,
        NodeEfficiencyService nodeEfficiencyService
    ) {
        this.continuityService = continuityService;
        this.responseDelayService = responseDelayService;
        this.nodeEfficiencyService = nodeEfficiencyService;
    }

    @GetMapping("/metrics/continuity")
    public Map<String, Object> continuity() {

        long start = System.nanoTime(); //start

        double continuity = continuityService.getContinuity();

        long end = System.nanoTime();   //end
        long delayMs = (end - start) / 1_000_000;
        //System.out.println("Recordedd response delay: " + delayMs + " ms");
        responseDelayService.record(delayMs); // record

        return Map.of(
            "continuity", continuity
        );
    }

    @GetMapping("/metrics/responseDelay")
    public Map<String, Object> responseDelay() {
        long start = System.nanoTime();

        long delayMs = responseDelayService.getLastResponseDelayMs();

        long end = System.nanoTime();
       // long responseTimeMs = (end - start) / 1_000_000;
        //System.out.println("Recorded! response delay: " + responseTimeMs + " ms");
        //responseDelayService.record(responseTimeMs);

        return Map.of(
            "responseDelay", responseDelayService.getLastResponseDelayMs()
        );
    }
    @GetMapping("/metrics/nodeEfficiency")
    public Map<String, Object> nodeEfficiency() {
        return Map.of("nodeEfficiency", nodeEfficiencyService.getLastEfficiency());
    }
    @GetMapping("/metrics/packets")
    public List<PacketSnapshot> packets() {
        return List.copyOf(SystemState.recentPackets);
    }
}

