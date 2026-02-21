package com.example.metrics.dto;

import java.util.Map;

public class AlertSummaryDTO {
    private String ip;
    private double totalScore;
    private int totalHits;
    private Map<String,Integer> attackCounts;

    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }

    public double getTotalScore() { return totalScore; }
    public void setTotalScore(double s) { this.totalScore = s; }

    public int getTotalHits() { return totalHits; }
    public void setTotalHits(int h) { this.totalHits = h; }

    public Map<String,Integer> getAttackCounts() { return attackCounts; }
    public void setAttackCounts(Map<String,Integer> m) { this.attackCounts = m; }
}
