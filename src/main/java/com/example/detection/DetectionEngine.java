package com.example.detection;

import com.example.buckets.BucketManager;
import com.example.state.SystemState;
import java.util.HashMap;
import org.springframework.stereotype.Component;

@Component
public class DetectionEngine implements Runnable {

    private final BucketManager bucketManager;
    private final ThreatAggregator threatAggregator;
    
    // Replace with your Mac's bridge100 IP to prevent self-flagging
    //private final String HOST_IP = "192.168.128.1";

    public DetectionEngine(BucketManager bucketManager, ThreatAggregator threatAggregator) {
        this.bucketManager = bucketManager;
        this.threatAggregator = threatAggregator;
    }

    public void processPacket(HashMap<String, Object> packetInfo) {
        try {
            String srcIP = (String) packetInfo.get("Source Address");
            String dstIP = (String) packetInfo.get("Destination Address");

            // 1. Filter out nulls and OUTGOING traffic from your Mac
            // This stops the Mac's "Reset" responses from being counted as Null Scans
            // 2. Safe Flag Extraction
            boolean urg = Boolean.TRUE.equals(packetInfo.get("UrgFlag"));
            boolean psh = Boolean.TRUE.equals(packetInfo.get("PshFlag"));
            boolean fin = Boolean.TRUE.equals(packetInfo.get("FinFlag"));
            boolean syn = Boolean.TRUE.equals(packetInfo.get("SynFlag"));
            boolean ack = Boolean.TRUE.equals(packetInfo.get("AckFlag"));
            boolean rst = Boolean.TRUE.equals(packetInfo.get("RstFlag"));

            // 3. Signature Detection (Prioritized Chain)
            // If it's an Xmas scan, it won't hit any 'else if' blocks below it
            // Inside processPacket
            int protocol = (int) packetInfo.get("Protocol");

            if (protocol == 6) { // 6 is TCP
                // RUN YOUR XMAS, NULL, AND STEALTH CHECKS HERE
                 if (urg && psh && fin) {
                threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP, AttackType.XMAS_SCAN, 50, System.currentTimeMillis()));
            } 
            else if (syn && fin) {
                threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP, AttackType.SYN_FIN_SCAN, 50, System.currentTimeMillis()));
            } 
            // Only classify as NULL_SCAN if NO flags are set at all (including ACK and RST)
            else if (!urg && !psh && !fin && !syn && !ack && !rst) {
                threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP, AttackType.NULL_SCAN, 40, System.currentTimeMillis()));
            }
            else if (syn && !ack && !fin && !psh && !urg && !rst) {
            // This is a pure SYN scan (Stealth)
            threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP, AttackType.STEALTH_SCAN, 20, System.currentTimeMillis()));
}
            } else if (protocol == 17) { // 17 is UDP
                // RUN UDP-SPECIFIC CHECKS (like UDP Flood)

            } else {
                // IGNORE OR RUN BASIC IP CHECKS
            }
            // 4. Anomaly Detection (Ports & TTL)
            int dstPort = (packetInfo.get("Destination Port") != null) ? (int) packetInfo.get("Destination Port") : -1;
            int srcPort = (packetInfo.get("Source Port") != null) ? (int) packetInfo.get("Source Port") : -1;
            int ttl = (packetInfo.get("TTL") != null) ? (int) packetInfo.get("TTL") : -1;

            // Port Validity
            if (dstPort == 0 || dstPort >= 65535) {
                threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP, AttackType.MALFORMED_PACKET, 50, System.currentTimeMillis()));
            }

            // TTL Anomaly (0-2 is very suspicious for incoming remote traffic)
            if (ttl > 0 && ttl <= 2) {
                threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP, AttackType.TTL_ANOMALY, 50, System.currentTimeMillis()));
            }

            // Common Attack Ports (Flagged only for specific high-risk ports)
            if (srcPort == 123 || srcPort == 1900 || srcPort == 5353 || srcPort == 0) {
                threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP, AttackType.COMMON_ATTACK_PORT, 30, System.currentTimeMillis()));
            }

            // 5. IP Validation
            checkBogusIp(srcIP, dstIP);

            // 6. Packet Length Checks
            int len = (packetInfo.get("Length") != null) ? (int) packetInfo.get("Length") : 0;
            if (len > 0 && len < 20) {
                threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP, AttackType.SHORT_PACKET, 10, System.currentTimeMillis()));
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
                // Ignore loopback (127.x.x.x) and Multicast
                if (a == 0 || a == 127 || (a >= 224 && a <= 239)) {
                    threatAggregator.processEvent(new DetectionEvent(srcIP, dstIP, AttackType.BOGUS_IP, 20, System.currentTimeMillis()));
                }
            }
        } catch (Exception ignored) {}
    }

    @Override
    public void run() {
        while (!Thread.currentThread().isInterrupted()) {
            try {
                Thread.sleep(1000);
                long now = System.currentTimeMillis();
                for (IPThreatProfile profile : threatAggregator.getAllProfiles()) {
                    profile.decayScore(now);
                }

                bucketManager.getAllEvents();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
    
}