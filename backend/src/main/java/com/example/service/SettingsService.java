package com.example.service;

import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    private int globalSensitivity;

    public int getGlobalSensitivity() {
        return globalSensitivity;
    }

    public void setGlobalSensitivity(int globalSensitivity) {
        this.globalSensitivity = globalSensitivity;
    }
}