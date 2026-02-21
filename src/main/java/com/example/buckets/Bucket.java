package com.example.buckets;
import com.example.events.Event;

import java.util.*;
public class Bucket{
    private long startTime;
    private List<Event> events;
    public Bucket(){
        this.events  = new ArrayList<>();
        this.startTime = System.currentTimeMillis();
    }
    public void addEvent(Event event){
        events.add(event);
    }
    public void clear(){
        if (events == null) {
            events = new ArrayList<>();
        } else {
            events.clear();
        }
        startTime = System.currentTimeMillis();
    }
    public List<Event> getEvents(){
        return events;
    }
}
