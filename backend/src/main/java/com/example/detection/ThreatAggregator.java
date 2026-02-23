package com.example.detection;

import java.util.*;
import org.springframework.stereotype.Component;

@Component
public class ThreatAggregator {

    private final Map<String, IPThreatProfile> profiles = new HashMap<>();

    public ThreatAggregator() {
        System.out.println("ThreatAggregator instance: " + this);
    }

    public void processEvent(DetectionEvent event) {
        System.out.println("Detection event processing: " + event);
        profiles.putIfAbsent(
            event.srcIP(),
            new IPThreatProfile(event.srcIP())
        );

        profiles.get(event.srcIP()).applyEvent(event);
    }

    public Collection<IPThreatProfile> getAllProfiles() {
    long now = System.currentTimeMillis();
    for (IPThreatProfile profile : profiles.values()) {
        profile.decayScore(now); // decay the score on every fetch
    }
    return profiles.values();
}

    public IPThreatProfile getProfile(String ip) {
        return profiles.get(ip);
    }
}
