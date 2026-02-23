package com.example.metrics;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.pcap4j.packet.Packet;

import java.util.concurrent.BlockingQueue;
import com.example.state.SystemState;
@Component
public class MetricsTicker {

    private final NodeEfficiencyService nodeEfficiencyService;
    private final ResponseDelayService responseDelayService;
    private final BlockingQueue<Packet> packetChannel;

    private long lastCaptured = 0;
    private long lastProcessed = 0;

    public MetricsTicker(
        NodeEfficiencyService nodeEfficiencyService,
        ResponseDelayService responseDelayService,
        BlockingQueue<Packet> packetChannel
    ) {
        this.nodeEfficiencyService = nodeEfficiencyService;
        this.responseDelayService = responseDelayService;
        this.packetChannel = packetChannel;
    }

    @Scheduled(fixedRate = 500)
    public void tick() {
        long captured = SystemState.incomingPackets;
        long processed = SystemState.processedPackets;

        long incomingDelta = captured - lastCaptured;
        long processedDelta = processed - lastProcessed;

        int backlog = packetChannel.size();

        long latencyMs = responseDelayService.getLastResponseDelayMs();

        nodeEfficiencyService.update(
            incomingDelta,
            processedDelta,
            backlog,
            latencyMs
        );

        lastCaptured = captured;
        lastProcessed = processed;
    }
}
