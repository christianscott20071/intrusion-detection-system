package com.example.detection;

import java.util.*;

public class IPThreatProfile {

    private final String ip;
    private double totalScore;
    private int totalHits;
    private final Map<AttackType, Integer> attackCounts;
    private long firstSeen;
    private long lastSeen;
    private ThreatLevel threatLevel;

    public enum ThreatLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public IPThreatProfile(String ip) {
        this.ip = ip;
        this.totalScore = 0;
        this.totalHits = 0;
        this.attackCounts = new HashMap<>();
        this.threatLevel = ThreatLevel.LOW;
    }

    public void applyEvent(DetectionEvent event) {

        if (totalHits == 0) {
            firstSeen = event.timestamp();
        }

        lastSeen = event.timestamp();
        attackCounts.merge(event.attackType(), 1, Integer::sum);

        // Count every received event as a raw hit (separate from weighted totalScore).
        totalHits++;

        // Apply decay first (optional but keeps score realistic)
        decayScore(lastSeen);

        // Only add the event's score if it pushes totalScore above the threshold for that attack type
        double threshold = getScoreThreshold(event.attackType());

        if ((totalScore + event.score()) >= threshold) {
            totalScore += event.score();
            updateThreatLevel();
        }
    }

private double getScoreThreshold(AttackType type) {
    return switch(type) {
        case SHORT_PACKET -> 1000;      // low-risk packets need cumulative score of 1000
        case COMMON_ATTACK_PORT -> 1000; 
        case NULL_SCAN, XMAS_SCAN, SYN_FIN_SCAN, STEALTH_SCAN -> 1; // high-risk, trigger immediately
        case MALFORMED_PACKET, TTL_ANOMALY -> 20; // medium risk
        default -> 500;
    };
}

    private void updateThreatLevel() {

        if (totalScore >= 20000) {
            threatLevel = ThreatLevel.CRITICAL;
        } else if (totalScore >= 10000) {
            threatLevel = ThreatLevel.HIGH;
        } else if (totalScore >= 5000) {
            threatLevel = ThreatLevel.MEDIUM;
        } else {
            threatLevel = ThreatLevel.LOW;
        }
    }

    public void decayScore(long nowMillis) {
    long secondsSinceLast = (nowMillis - lastSeen) / 1000;
    if (secondsSinceLast <= 0) return;
    double decayPerSecond = 20.0;
    double decayAmount = decayPerSecond;
    totalScore -= decayAmount;

    // Never go below zero
    if (totalScore < 0) totalScore = 0;

    updateThreatLevel();
}
    public String getIp() { return ip; }
    public double getTotalScore() { return totalScore; }
    public int getTotalHits() { return totalHits; }
    public Map<AttackType, Integer> getAttackCounts() { return attackCounts; }
    public long getFirstSeen() { return firstSeen; }
    public long getLastSeen() { return lastSeen; }
    public ThreatLevel getThreatLevel() { return threatLevel; }
}
