package com.example.api;

import com.example.state.SystemState;
import com.example.metrics.*;
import com.example.metrics.dto.TrafficSnapshot;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/metrics")
public class TrafficMetricsController {

    private long lastIn = 0;
    private long lastOut = 0;
    private long lastTime = System.currentTimeMillis();

    @GetMapping("/traffic")
    public synchronized TrafficSnapshot traffic() {
        long now = System.currentTimeMillis();
        long dt = Math.max(now - lastTime, 1);

        long in = SystemState.incomingPackets;
        long out = SystemState.processedPackets;

        long inboundPps = (in - lastIn) * 1000 / dt;
        long outboundPps = (out - lastOut) * 1000 / dt;

        lastIn = in;
        lastOut = out;
        lastTime = now;

        return new TrafficSnapshot(
            Math.max(inboundPps, 1),
            Math.max(outboundPps, 1)
        );
    }
}
