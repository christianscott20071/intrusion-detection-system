package com.example.events;
import java.util.*;
public class EventBuilder {

    public static Event fromParsedMap(Map<String, Object> parsedMap){
        long timestamp = System.currentTimeMillis();
        String srcAddress = (String)parsedMap.get("Source Address");
        String dstAddress = (String)parsedMap.get("Destination Address");
        int srcPort = (int)parsedMap.get("Source Port");
        int dstPort = (int)parsedMap.get("Destination Port");
        int protocol = (int)parsedMap.get("Protocol");
        int length = (int)parsedMap.get("Length");
        boolean isSynFlag = false;
        try{
            isSynFlag = (boolean)parsedMap.get("SynFlag");
        }catch(NullPointerException e){
            isSynFlag = false;
        }
        return new Event(
            timestamp,
            srcAddress,
            dstAddress,
            srcPort,
            dstPort,
            protocol,
            length,
            isSynFlag
        );
        }
    }

