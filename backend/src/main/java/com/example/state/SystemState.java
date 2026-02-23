package com.example.state;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.atomic.AtomicLong;

import com.example.metrics.dto.PacketSnapshot;

public class SystemState {
    public static volatile long incomingPackets = 0;
    public static volatile long processedPackets = 0;
    public static volatile long backlog = 0;
    // packets seen (simple metric)
    public static final AtomicLong packetsSeen = new AtomicLong(0);
    public static volatile long lastPacketTimestamp = System.currentTimeMillis();
   
    // IP → score
    public static final ConcurrentHashMap<String, Integer> ipScores = new ConcurrentHashMap<>();

    public static int maxPacketsDisplayed = 200;

    public static final ConcurrentLinkedDeque<PacketSnapshot> recentPackets =
        new ConcurrentLinkedDeque<>();

    public static void addPacket(PacketSnapshot p) {
        recentPackets.addFirst(p);
        while (recentPackets.size() > maxPacketsDisplayed) {
            recentPackets.removeLast();
        }
    }
}
