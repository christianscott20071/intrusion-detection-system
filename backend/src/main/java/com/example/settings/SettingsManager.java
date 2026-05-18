package com.example.settings;

import java.io.File;
import com.fasterxml.jackson.databind.ObjectMapper;

public class SettingsManager {

    private static Settings settings = new Settings();
    // Absolute path based on project root
    private static final String SETTINGS_FILE = "/Users/christianscott/Documents/Development/CSIV Project/csivproj/backend/config/settings.json";;

    public static Settings load() {
        try {
            File file = new File(SETTINGS_FILE);

            if(file.exists()) {
                ObjectMapper mapper = new ObjectMapper();
                settings = mapper.readValue(file, Settings.class);
            } else {
                // Create folder if it doesn't exist
                file.getParentFile().mkdirs();
                save(); // write default settings
            }

            System.out.println("Loaded settings from: " + SETTINGS_FILE);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return settings;
    }

    private static void save() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            File file = new File(SETTINGS_FILE);

            file.getParentFile().mkdirs(); // make sure folder exists

            mapper.writerWithDefaultPrettyPrinter().writeValue(file, settings);
            System.out.println("Saved settings to: " + SETTINGS_FILE);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void update(Settings newSettings) {
        settings = newSettings;
        save();
    }
}