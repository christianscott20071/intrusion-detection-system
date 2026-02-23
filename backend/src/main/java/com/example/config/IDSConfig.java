package com.example.config;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import org.pcap4j.packet.Packet;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class IDSConfig {

    @Bean
    public BlockingQueue<Packet> packetChannel() {
        return new LinkedBlockingQueue<>();
    }
}
