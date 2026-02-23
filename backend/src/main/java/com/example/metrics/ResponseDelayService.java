package com.example.metrics;

import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ResponseDelayService {

    private final AtomicLong lastResponseDelayMs = new AtomicLong(1);

    public void record(long delayMs) {
        lastResponseDelayMs.set(delayMs);
        //OUTPUTS RIGHT NUMBER WITH TICK
    }

    public long getLastResponseDelayMs() {
        //System.out.println("Returned! response delay: " + lastResponseDelayMs.get() + " ms");
        // DOES NOT OUTPUT with tick
        return lastResponseDelayMs.get();
    }
}
