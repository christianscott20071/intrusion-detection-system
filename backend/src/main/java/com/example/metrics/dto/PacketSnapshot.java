package com.example.metrics.dto;

public record PacketSnapshot(
    String proto,
    String srcIP,
    String dstIP,
    int size,
    long timestamp
) {}

