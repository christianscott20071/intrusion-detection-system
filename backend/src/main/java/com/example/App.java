package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import jakarta.annotation.PostConstruct;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import org.pcap4j.packet.Packet;

import com.example.buckets.BucketManager;
import com.example.capture.PacketSniffer;
import com.example.detection.DetectionEngine;
import com.example.parser.PacketParser;
import com.example.metrics.ContinuityService;
import com.example.detection.ThreatAggregator;
import com.example.settings.SettingsManager;
import jakarta.annotation.PostConstruct;

@SpringBootApplication
@EnableScheduling
public class App {

    private final PacketSniffer sniffer;
    private final PacketParser parser;
    private final DetectionEngine detector;

    public App(PacketSniffer sniffer,
               PacketParser parser,
               DetectionEngine detector) {
        this.sniffer = sniffer;
        this.parser = parser;
        this.detector = detector;
    }

    static Thread snifferThread;
    static Thread parserThread;
    static Thread detectorThread;

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    @PostConstruct
    public void startIDS() {
        System.out.println("Starting IDS...");

        snifferThread = new Thread(sniffer);
        parserThread = new Thread(parser);
        detectorThread = new Thread(detector);

        snifferThread.start();
        parserThread.start();
        detectorThread.start();
        SettingsManager.load();
    }
}
