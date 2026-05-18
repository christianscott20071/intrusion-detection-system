package com.example.detection;

import java.util.Map;
import java.util.List;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Set;
import com.example.buckets.BucketManager;
import com.example.state.SystemState;
import com.example.events.Event;

import org.springframework.stereotype.Component;

@Component
public class DetectionEngine implements Runnable {

    private final BucketManager bucketManager;
    private final ThreatAggregator threatAggregator;

    private final Map<String, Long> bruteForceCooldown = new HashMap<>();
    private static final long BRUTE_FORCE_COOLDOWN_MS = 90000;
    private static final Set<Integer> LOGIN_PORTS = Set.of(22, 21, 23, 3389, 2222);

    public DetectionEngine(BucketManager bucketManager, ThreatAggregator threatAggregator) {
        this.bucketManager = bucketManager;
        this.threatAggregator = threatAggregator;
    }

    public void processPacket(HashMap<String, Object> packetInfo) {
        try {
            String srcIP = (String) packetInfo.get("Source Address");
            String dstIP = (String) packetInfo.get("Destination Address");
            boolean urg = Boolean.TRUE.equals(packetInfo.get("UrgFlag"));
            boolean psh = Boolean.TRUE.equals(packetInfo.get("PshFlag"));
            boolean fin = Boolean.TRUE.equals(packetInfo.get("FinFlag"));
            boolean syn = Boolean.TRUE.equals(packetInfo.get("SynFlag"));
            boolean ack = Boolean.TRUE.equals(packetInfo.get("AckFlag"));
            boolean rst = Boolean.TRUE.equals(packetInfo.get("RstFlag"));
            int dstPort = (packetInfo.get("Destination Port") != null)
                ? (int) packetInfo.get("Destination Port") : -1;

            int srcPort = (packetInfo.get("Source Port") != null)
                    ? (int) packetInfo.get("Source Port") : -1;

            int ttl = (packetInfo.get("TTL") != null)
                    ? (int) packetInfo.get("TTL") : -1;
            int protocol = (int) packetInfo.get("Protocol");

            if (protocol == 6) {
                if (urg && psh && fin) {
                    threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP,
                            AttackType.XMAS_SCAN, 50, System.currentTimeMillis()));
                } 
                else if (syn && fin) {
                    threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP,
                            AttackType.SYN_FIN_SCAN, 50, System.currentTimeMillis()));
                } 
                else if (!urg && !psh && !fin && !syn && !ack && !rst) {
                    threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP,
                            AttackType.NULL_SCAN, 40, System.currentTimeMillis()));
                }
                else if (syn && !ack && !fin && !psh && !urg && !rst && !isLoginPort(dstPort)) {
                    threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP,
                            AttackType.STEALTH_SCAN, 20, System.currentTimeMillis()));
                }

            } else if (protocol == 17) {
                // UDP checks can be added later
            }

           

            if (dstPort == 0 || dstPort >= 65535) {
                threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP,
                        AttackType.MALFORMED_PACKET, 50, System.currentTimeMillis()));
            }

            if (ttl > 0 && ttl <= 2) {
                threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP,
                        AttackType.TTL_ANOMALY, 50, System.currentTimeMillis()));
            }

            if (srcPort == 123 || srcPort == 1900 || srcPort == 5353 || srcPort == 0) {
                threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP,
                        AttackType.COMMON_ATTACK_PORT, 30, System.currentTimeMillis()));
            }

            checkBogusIp(srcIP, dstIP);

            int len = (packetInfo.get("Length") != null)
                    ? (int) packetInfo.get("Length") : 0;

            if (len > 0 && len < 20) {
                threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP,
                        AttackType.SHORT_PACKET, 10, System.currentTimeMillis()));
            }

        } catch (Exception e) {
            System.err.println("Detection Engine Error: " + e.getMessage());
        }
    }

    private void checkBogusIp(String srcIP, String dstIP) {
        try {
            String[] octets = srcIP.split("\\.");
            if (octets.length == 4) {

                int a = Integer.parseInt(octets[0]);

                if (a == 0 || a == 127 || (a >= 224 && a <= 239)) {
                    threatAggregator.processEvent(new DetectionEvent(
                            srcIP,
                            dstIP,
                            AttackType.BOGUS_IP,
                            20,
                            System.currentTimeMillis()));
                }
            }
        } catch (Exception ignored) {}
    }
    private boolean isLoginPort(int port){
        return LOGIN_PORTS.contains(port);
    }
    @Override
    public void run() {
        while (!Thread.currentThread().isInterrupted()) {
            try {
                Thread.sleep(1000);

                long now = System.currentTimeMillis();

                Map<String, Integer> counts = new HashMap<>();
                List<Event> events = bucketManager.getEventsInLast(30);

                //counter for login attempts
                for (Event event : events) {

                    int port = event.getDstPort();

                    if (!isLoginPort(port)) {
                        continue;
                    }

                    String srcIP = event.getSrcIp();

                    counts.put(
                            srcIP,
                            counts.getOrDefault(srcIP, 0) + 1
                    );
                }
                //threshold for counts in timeframe 
                int threshold = 20;

                for (String ip : counts.keySet()) {

                    if (counts.get(ip) < threshold) {
                        continue;
                    }

                    Long lastAlertTime = bruteForceCooldown.get(ip);

                    if (lastAlertTime != null &&
                            now - lastAlertTime < BRUTE_FORCE_COOLDOWN_MS) {
                        continue;
                    }

                    threatAggregator.processEvent(
                            new DetectionEvent(
                                    ip,
                                    "NETWORK",
                                    AttackType.BRUTE_FORCE,
                                    60,
                                    now
                            )
                    );

                    bruteForceCooldown.put(ip, now);
                }

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}