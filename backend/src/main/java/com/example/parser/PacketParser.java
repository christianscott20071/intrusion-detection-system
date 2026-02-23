package com.example.parser;
import com.example.buckets.BucketManager;
import com.example.detection.DetectionEngine;
import com.example.events.EventBuilder;
import com.example.metrics.ContinuityService;
import com.example.metrics.dto.PacketSnapshot;
import com.example.state.SystemState;
import com.example.events.Event;
import java.util.*;
import org.pcap4j.packet.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.concurrent.BlockingQueue;

@Component
public class PacketParser implements Runnable{
    //@Autowired
    Map<String, Object> compiledData = new HashMap<>();
    byte[] data;
    //eth header
    String srcMac;
    String destMac;
    String ethType;
    //IPv4 header
    int version;
    int ihl;
    int tos;
    int totalLength;
    int identification;
    int fragFlags;
    int fragmentOffset;
    int ttl;
    int protocol;
    int headerChecksum;
    String srcAddress;
    String destAddress;
    //TCP header
    int srcPort;
    int dstPort;
    long seqNum;
    long ackNum;
    int dataOffset;
    int ctrlFlags;
    int windowSize;
    int checksum;
    int urgentPointer;
    //UDP
    int udpLength;

    //payload
    Byte[] payload;
    //misc
    private final BucketManager bucketManager;
    private final BlockingQueue<Packet> channel1;
    private final DetectionEngine detector;
    private final ContinuityService continuityService;

    public PacketParser(BlockingQueue<Packet> channel, BucketManager bucketManager, DetectionEngine detector, ContinuityService continuityService){
        this.detector = detector;
        channel1 = channel;
        this.bucketManager = bucketManager;
        this.continuityService = continuityService;
    }
    public void run(){
        while(true){
            try{
                Packet packet = channel1.take();
                
                try{
                parse(packet);
                }catch(Exception e){
                    //System.out.println("Parser Crashed");
                    //e.printStackTrace();
                }
                //continuityService.onPacketSeen(SystemState.packetsSeen.get());
                continuityService.onPacketSeen();
            }catch(InterruptedException e){
                //e.printStackTrace();
            }
        }
    }
    public void parse(Packet packet){
        
        //so step 1 is to convert packet to an array of bytes
        data = packet.getRawData();
        byte[] destMacBytes = Arrays.copyOfRange(data, 0, 6);
        byte[] srcMacBytes = Arrays.copyOfRange(data, 6, 12);
        //awesome, done
        //now i need to convert eth header to string
        destMac = formatMac(destMacBytes);
        srcMac = formatMac(srcMacBytes);
        //now, I need to figure out the version
        byte[] ethBytes = Arrays.copyOfRange(data, 12,14);
        int ethTypeValue = ((ethBytes[0] & 0xFF) << 8) | (ethBytes[1] & 0xFF);
        if(ethTypeValue==0x86DD){
            ethType = "IPv6";
        }else if(ethTypeValue==0x0800){
            ethType = "IPv4";
        }else{
            ethType=null;
        }
        //NOW LETS MOVE ON TO IP STUFF YAYAYAYAAY
        //version
        byte ipVer = data[14];
        if(ipVer ==0x45){
            version = 4;
            ihl = 5;
        }else if(ipVer ==0x60){
            version =6;
            ihl=-1;
        }else{
            version= -1;
            ihl=-1;
        }
        //WE ARE SKIPPING DS FIELD
        //Now we are doing more ip header
        totalLength = ((data[16] & 0xFF) << 8) | (data[17] & 0xFF);
        //we are ALSO skipping identification
        int flagsAndOffset = ((data[20] & 0xFF) << 8) | (data[21] & 0xFF);
        fragFlags = flagsAndOffset >> 13;
        fragFlags = fragFlags & 0x07;
        fragmentOffset = flagsAndOffset & 0x1FFF;
        ttl = (data[22] & 0xFF);
        protocol = (data[23] & 0xFF);
        //We are skipping checksum

        //IPs YAYAYAYAYAYYAAYAYAYAYAYYAYAYAAYAYAY
        byte[] srcAddyBytes = Arrays.copyOfRange(data, 26, 30);
        srcAddress = formatIP(srcAddyBytes);
        byte[] destAddyBytes = Arrays.copyOfRange(data, 30, 34);
        destAddress = formatIP(destAddyBytes);
        //System.out.println("\n");
        //System.out.println("Parsing packet...");
        //System.out.println("Len: " + data.length);
        compiledData.put("Length",data.length);
        //System.out.println("Eth dest: " + destMac);
        compiledData.put("Ethernet Destination",destMac);
        //System.out.println("Eth src: " + srcMac);
        compiledData.put("Ethernet Source", srcMac);
        //System.out.println("EtherType: " + ethType);
        compiledData.put("Ethernet Type", ethType);
        //System.out.println("ttl: " + ttl);
        compiledData.put("TTL", ttl);
        //System.out.println("protocol: " + protocol);
        compiledData.put("Protocol", protocol);
        //System.out.println("Src Address: " + srcAddress);
        compiledData.put("Source Address", srcAddress);
        //System.out.println("Dest Address: " + destAddress);
        compiledData.put("Destination Address", destAddress);
        //TCP STUFF!!!!
        if(protocol==6){
            int tcpStart = 14+ihl*4;
            srcPort = ((data[tcpStart]& 0xFF) << 8) | (data[tcpStart+1] & 0xFF);
            dstPort = ((data[tcpStart+2]& 0xFF) << 8) | (data[tcpStart+3] & 0xFF);
            seqNum = ((data[tcpStart + 4] & 0xFFL) << 24) | ((data[tcpStart + 5] & 0xFFL) << 16) | ((data[tcpStart + 6] & 0xFFL) << 8) | (data[tcpStart + 7] & 0xFFL);
            ackNum = ((data[tcpStart + 8] & 0xFFL) << 24) | ((data[tcpStart + 9] & 0xFFL) << 16) | ((data[tcpStart + 10] & 0xFFL) << 8) | (data[tcpStart + 11] & 0xFFL);
            int offsetAndFlags = ((data[tcpStart + 12] & 0xFF) << 8) | (data[tcpStart + 13] & 0xFF);
            dataOffset = ((offsetAndFlags >> 12) & 0xF) * 4; 
            ctrlFlags = offsetAndFlags & 0x1FF;              
            windowSize = ((data[tcpStart + 14] & 0xFF) << 8) | (data[tcpStart + 15] & 0xFF);
            checksum = ((data[tcpStart + 16] & 0xFF) << 8) | (data[tcpStart + 17] & 0xFF);
            urgentPointer = ((data[tcpStart + 18] & 0xFF) << 8) | (data[tcpStart + 19] & 0xFF);

            boolean urg = (ctrlFlags & 0x20) != 0;
            boolean ack = (ctrlFlags & 0x10) != 0;
            boolean psh = (ctrlFlags & 0x08) != 0;
            boolean rst = (ctrlFlags & 0x04) != 0;
            boolean syn = (ctrlFlags & 0x02) != 0;
            boolean fin = (ctrlFlags & 0x01) != 0;

            //System.out.println("Src Port: " +srcPort);
            compiledData.put("Source Port", srcPort);
            //System.out.println("Dest Port: " +dstPort);
            compiledData.put("Destination Port", dstPort);
            //System.out.println("Sequence Number: " + seqNum);
            compiledData.put("Sequence Number", seqNum);
            //System.out.println("Acknowlegement number: " +ackNum);
            compiledData.put("Acknowlegement number", ackNum);
            //System.out.println("Offset: " +dataOffset);
            compiledData.put("Offset", dataOffset);
            //System.out.println("Control Flags: " +ctrlFlags);
            compiledData.put("Control Flags", ctrlFlags);
            //System.out.println("Window Size: "+ windowSize);
            compiledData.put("Window Size", windowSize);
            //System.out.println("checksum: "+ checksum);
            compiledData.put("checksum", checksum);
            //System.out.println("Urgent Pointer: "+ urgentPointer);
            compiledData.put("Urgent Pointer", urgentPointer);
            compiledData.put("UrgFlag", urg);
            compiledData.put("AckFlag", ack);
            compiledData.put("PshFlag", psh);
            compiledData.put("RstFlag", rst);
            compiledData.put("SynFlag", syn);
            compiledData.put("FinFlag", fin);
        }else if(protocol ==17){
            //UDP STUFF!!! YAYAYAYYAYAYAYYAYAYYAYYYAY
            int udpStart= 14+ ihl*4;
            srcPort = ((data[udpStart]& 0xFF) << 8) | (data[udpStart+1] & 0xFF);
            dstPort = ((data[udpStart+2]& 0xFF) << 8) | (data[udpStart+3] & 0xFF);
            udpLength = ((data[udpStart+4]& 0xFF) << 8) | (data[udpStart+5] & 0xFF);
            checksum = ((data[udpStart+6]& 0xFF) << 8) | (data[udpStart+7] & 0xFF);
            //System.out.println("Src Port: " +srcPort);
            compiledData.put("Source Port", srcPort);
            //System.out.println("Dest Port: " +dstPort);
            compiledData.put("Destination Port", dstPort);
            //System.out.println("UDP Length: " +udpLength);
            compiledData.put("UDP Length", udpLength);
            //System.out.println("checksum: "+ checksum);
            compiledData.put("checksum", checksum);
        }else{
            System.out.println("Uncommon Protocol");
        }
        SystemState.addPacket(new PacketSnapshot(
            Integer.toString(protocol),
            srcAddress,
            destAddress,
            data.length,
            (long) System.currentTimeMillis()
        ));
        HashMap<String, Object> parsedMap = new HashMap<>(compiledData);
        Event e = EventBuilder.fromParsedMap(parsedMap);
        bucketManager.addEvent(e);
        compiledData.clear();
        detector.processPacket(parsedMap);
        SystemState.processedPackets++;

    }

    //format mac address from byte array to string
    private String formatMac(byte[] input){
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < input.length; i++) {
            sb.append(String.format("%02X", input[i])); // convert to hex two digits
            if (i < input.length - 1) sb.append(":");  // add colon separators
            }
        return sb.toString();
    }
    private String formatIP(byte[] input) {
    return String.format("%d.%d.%d.%d",
        input[0] & 0xFF,
        input[1] & 0xFF,
        input[2] & 0xFF,
        input[3] & 0xFF);
    }
}