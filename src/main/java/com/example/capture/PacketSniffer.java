package com.example.capture;

import com.example.capture.PacketSniffer;
import com.example.state.SystemState;

import java.util.*;
import java.util.concurrent.BlockingQueue;
import org.pcap4j.core.*;
import org.pcap4j.core.PcapNetworkInterface.PromiscuousMode;
import org.pcap4j.packet.*;
import org.springframework.stereotype.Component;
//skeleton atm
@Component
public class PacketSniffer implements Runnable{
    //Now I am going to make my first channel!!
    private final BlockingQueue<Packet> channel1;
    public PacketSniffer(BlockingQueue<Packet> channel) {
        channel1 = channel;
    }
    //okay so this class needs to read packets and print
public void run(){
    startCapture();
}
public void startCapture(){
    try{
    //set system props
    System.setProperty("org.pcap4j.core.pcapLibName", "/opt/homebrew/Cellar/libpcap/1.10.5/lib/libpcap.dylib");
    System.setProperty("jna.nosys", "true");
    //Now we are going to add devices to a list to be accessed later.
    List<PcapNetworkInterface> devices = Pcaps.findAllDevs();
    if (devices == null || devices.isEmpty()) {
    System.out.println("No interfaces found!");
    return;
}
System.out.println("Available interfaces:");
for (int i = 0; i < devices.size(); i++) {
    System.out.println(i + ": " + devices.get(i).getName() + " (" + devices.get(i).getDescription() + ")");
}
    //Now we want to open this list and open our capturing
    PcapNetworkInterface nif = devices.get(1);
    System.out.println("Using network interface: "+ nif.getName() + "(" + nif.getDescription()+  ")");
    PcapHandle handle = nif.openLive(65536, PromiscuousMode.PROMISCUOUS,100);
    try {
            handle.setFilter("ip or ip6", BpfProgram.BpfCompileMode.OPTIMIZE);
        } catch (NotOpenException e) {
            e.printStackTrace();
            handle.close();
            return;
        }
    //now we have our stream of packets open, now we need to listen in
    PacketListener listener = new PacketListener(){
        public void gotPacket(Packet packet){
        //System.out.println(packet);
        SystemState.incomingPackets++;
        try{
            channel1.put(packet);
        }catch(InterruptedException e){
            e.printStackTrace();
        }
        }
    };
    handle.loop(-1, listener);
}catch(Exception e){
    e.printStackTrace();
}
    }
}
