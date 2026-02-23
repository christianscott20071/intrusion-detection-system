
package com.example.buckets;

import org.springframework.stereotype.Component;
import com.example.buckets.BucketManager;
import com.example.buckets.Bucket;
import java.util.*;
import com.example.events.Event;
@Component
public class BucketManager{
    private List<Bucket> bucketArray;
    private int currentIndex;
    private long lastRotationTime;
    private long duration;
    private int bucketCount = 10;
    public BucketManager(){
        bucketArray = new ArrayList<Bucket>(10);
        for(int i = 0; i<bucketCount; i++){
            bucketArray.add(new Bucket());
        }
        currentIndex = 0;
        lastRotationTime = System.currentTimeMillis();
        duration = 1000;
    }
    public synchronized void rotateIfNeeded(){
        if(Math.abs(System.currentTimeMillis() - lastRotationTime) >= duration){
            bucketArray.get(currentIndex).clear();
            currentIndex= (currentIndex+1) %bucketCount;
            lastRotationTime = System.currentTimeMillis();
        }
    }
    public synchronized void  addEvent(Event e){
        rotateIfNeeded();
        bucketArray.get(currentIndex).addEvent(e);
    }
    public synchronized ArrayList<Event> getEventsInLast(int secs){
        int goBack = secs;
        ArrayList<Event> eventCollection = new ArrayList<>();
        int index = currentIndex;
        for(int i=0; i<secs; i++){
            if(i>=bucketCount) break;
            Bucket b = bucketArray.get(index);
            eventCollection.addAll(b.getEvents());
            index-=1;
            if(index<0){
                index = bucketCount-1;
            }
        }
        return eventCollection;
    }
    public synchronized ArrayList<Event> getAllEvents(){
    ArrayList<Event> all = new ArrayList<>();
        for (Bucket bucket : bucketArray) {
            all.addAll(bucket.getEvents());
        }
    return all;
    }
}