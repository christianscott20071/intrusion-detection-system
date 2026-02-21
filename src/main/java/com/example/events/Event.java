package com.example.events;

public class Event {
    private final long timestamp;
    private final String srcIp;
    private final String dstIp;
    private final int srcPort;
    private final int dstPort;
    private final int protocol;
    private final int length;
    private final boolean synFlag;

    public Event(long timestamp, String srcIp, String dstIp, int srcPort, int dstPort, int protocol, int length, boolean synFlag) {
        this.timestamp = timestamp;
        this.srcIp = srcIp;
        this.dstIp = dstIp;
        this.srcPort = srcPort;
        this.dstPort = dstPort;
        this.protocol = protocol;
        this.length = length;
        this.synFlag = synFlag;
    }

    //getters
    public long getTimestamp() { return timestamp; }
    public String getSrcIp() { return srcIp; }
    public String getDstIp() { return dstIp; }
    public int getSrcPort() { return srcPort; }
    public int getDstPort() { return dstPort; }
    public int getProtocol() { return protocol; }
    public int getLength() { return length; }
    public boolean isSynFlag() { return synFlag; }

    @Override
    public String toString() {
        return String.format("Event[%d %s:%d -> %s:%d %s len=%d syn=%b]",timestamp, srcIp, srcPort, dstIp, dstPort, protocol, length, synFlag);
    }
}
