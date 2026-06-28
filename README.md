Insite - Intrusion Detection System
---------------------------------------

A full-stack intrusion detection system built in Java that monitors live network traffic and alerts users to potential threats in real time.


What it does:

Detects port scanning and brute force attacks by analyzing live network packets
Translates raw threat data into plain-language alerts for non-technical users using the Gemini API
Displays alerts and threat history through a desktop frontend

Tech Stack:
Backend: Java, Spring Boot, pcap4j (custom packet parser)
Frontend: Electron
AI Integration: Google Gemini API
Testing: Validated using Kali Linux attack simulations (Nmap, Hydra)

Architecture:

/backend   → Spring Boot server, packet capture engine, detection logic

/insite-electron-app  → Electron desktop application

How it works:
1. Packets are captured over the network using pcap4j
2. Packets are parsed using a custom built parser
3. Packets are scanned for known threats and flagged
4. Threats are aggregated using a scoring system
5. Threats are sent to Gemini API to convert it into natural language
6. Attacks and network information are displayed through the Insite Desktop app
