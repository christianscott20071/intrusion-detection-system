package com.example.settings;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    @GetMapping
    public Settings getSettings() {
        return SettingsManager.load();
    }

    @PostMapping
    public void saveSettings(@RequestBody Settings settings) {
        SettingsManager.update(settings);
    }
}