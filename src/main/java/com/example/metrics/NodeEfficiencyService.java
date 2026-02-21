package com.example.metrics;

import org.springframework.stereotype.Service;

@Service
public class NodeEfficiencyService {

    private double efficiency = 100.0;

    // thresholds
    private static final int BACKLOG_TOLERANCE = 50;
    private static final int LATENCY_BASELINE = 50; // ms

    public synchronized void update(
        double incoming,
        double processed,
        double backlog,
        double latencyMs
    ) {
        double target = 100.0;

        if (incoming > 0 && processed < incoming) {
            double ratio = processed / incoming;
            target -= (1.0 - ratio) * 40.0; // max -40
        }

        if (backlog > BACKLOG_TOLERANCE) {
            target -= (backlog - BACKLOG_TOLERANCE) * 0.2;
        }

        if (latencyMs > LATENCY_BASELINE) {
            target -= (latencyMs - LATENCY_BASELINE) * 0.1;
        }

        target = Math.max(0, Math.min(100, target));
        //smooth
        efficiency = efficiency * 0.9 + target * 0.1;
    }

    public synchronized double getLastEfficiency() {
        return Math.round(efficiency * 10.0) / 10.0;
    }
}
