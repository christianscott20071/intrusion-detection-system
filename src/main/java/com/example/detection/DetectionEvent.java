package com.example.detection;
import com.example.metrics.dto.PacketSnapshot;

public record DetectionEvent (
    String srcIP,
    String dstIP,
    AttackType attackType,
    double score,
    long timestamp
) {}
