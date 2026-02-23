package com.example.metrics;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayDeque;
import java.util.Deque;

@Service
public class ContinuityService {

    // ---- configuration ----
    private static final int WINDOW_SIZE = 20;        // last 20 seconds
    private static final double OUTLIER_Z = 2.0;      // stddev threshold
    private static final double DROP_RATE = 8.0;      // per bad tick
    private static final double RECOVERY_RATE = 1.5;  // per good tick

    private final Deque<Long> samples = new ArrayDeque<>();
    private long packetsThisTick = 0;
    private double continuity = 100.0;

    //packet parser calls this 
    public synchronized void onPacketSeen() {
        packetsThisTick++;
        //System.out.println("[PACKET] seen");
    }

    //ticker
    @Scheduled(fixedRate = 1000)
    public synchronized void tick() {
        System.out.println("[CONTINUITY TICK] packetsThisTick=" + packetsThisTick);
        samples.addLast(packetsThisTick);
        if (samples.size() > WINDOW_SIZE) {
            samples.removeFirst();
        }

        double mean = mean();
        double stddev = stddev(mean);

        boolean outlier = false;
        if (stddev > 0) {
            double z = Math.abs(packetsThisTick - mean) / stddev;
            outlier = z > OUTLIER_Z;
        }

        if (outlier) {
            continuity -= DROP_RATE;
        } else {
            continuity += RECOVERY_RATE;
        }

        continuity = clamp(continuity, 0.0, 100.0);

        // reset for next tick
        packetsThisTick = 0;
    }

    public synchronized double getContinuity() {
        return Math.round(continuity * 10.0) / 10.0;
    }

    //helpers
    private double mean() {
        if (samples.isEmpty()) return 0;
        return samples.stream().mapToDouble(Long::doubleValue).average().orElse(0);
    }

    private double stddev(double mean) {
        if (samples.size() < 2) return 0;
        double variance = samples.stream()
                .mapToDouble(v -> Math.pow(v - mean, 2))
                .average()
                .orElse(0);
        return Math.sqrt(variance);
    }

    private double clamp(double v, double min, double max) {
        return Math.max(min, Math.min(max, v));
    }
}
