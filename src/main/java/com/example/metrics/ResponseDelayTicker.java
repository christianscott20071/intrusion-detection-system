package com.example.metrics;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ResponseDelayTicker {

    private final ResponseDelayService responseDelayService;

    public ResponseDelayTicker(ResponseDelayService responseDelayService) {
        this.responseDelayService = responseDelayService;
    }

    @Scheduled(fixedRate = 500) 
    public void tick() {
        long simulatedProcessingDelay = (long) (Math.random() * 30);
        responseDelayService.record(simulatedProcessingDelay);
        System.out.println("Ticked! Simulated processing delay: " + simulatedProcessingDelay + " ms");
    }
}
