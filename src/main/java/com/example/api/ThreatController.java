package com.example.api;

import com.example.detection.*;
import com.example.metrics.dto.AlertSummaryDTO;

import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("api/threats")
public class ThreatController {

    private final ThreatAggregator threatAggregator;

    public ThreatController(ThreatAggregator threatAggregator) {
        System.out.println("ThreatController instance: " + this);
        this.threatAggregator = threatAggregator;
    }

    @GetMapping
    public Collection<IPThreatProfile> getAllThreats() {
        System.out.println("Aggregator reading from: " + threatAggregator);
        System.out.println("Profiles size: " + threatAggregator.getAllProfiles().size());
        return threatAggregator.getAllProfiles();
    }

    @GetMapping("/{ip}")
    public IPThreatProfile getThreat(@PathVariable String ip) {
        return threatAggregator.getProfile(ip);
    }
}