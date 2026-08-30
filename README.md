# ❄️ ColdRescue AI — Autonomous Cold Chain Preservation & Food Salvage

> **Real-time autonomous multi-agent cold-chain preservation platform powered by Google Cloud Pub/Sub, BigQuery GIS, Dataplex Governance, and Vertex AI / Gemini 3.7.**

---

## 🎯 Executive Summary & Purpose

When a refrigerated freight truck ("reefer") carrying **40,000 lbs of perishable food** suffers a refrigeration failure mid-transit, traditional dispatch systems fail:
1. Drivers only notice hours later or at destination receiving docks.
2. The entire load is rejected and dumped in a municipal landfill, incurring **write-off losses ($15,000–$40,000+)** and **landfill tipping fees ($2,000+)**.
3. Decomposing organic food in landfills releases potent methane gas ($14.8\text{ MT } CO_2e$ per truckload).

**ColdRescue AI solves this in real time.**
By processing sub-second multi-zone IoT sensor streams, calculating Arrhenius biochemical shelf-life decay, and executing **BigQuery GIS spatial arbitrage**, ColdRescue AI's **Gemini 3.7 Multi-Agent System** autonomously routes only the compromised pallets to certified off-takers (industrial juice/puree processors, flash grocers, or food banks) *before* the food spoils—protecting cargo value and preventing landfill methane emissions.

---

## 🏗️ System Architecture & Data Flow

```
                                  [ REEFER TRUCK IOT TELEMETRY ]
                     (Multi-Zone Sensors: Temp °C, Ethylene ppm, Vibration, GPS)
                                                │
                                                ▼
                             ┌───────────────────────────────────────┐
                             │    1. Google Cloud Pub/Sub Topic      │
                             │        `truck-telemetry-live`         │
                             └──────────────────┬────────────────────┘
                                                │ (Sub-second streaming)
                                                ▼
                             ┌───────────────────────────────────────┐
                             │       2. Cold Sentinel Agent          │
                             │    (Arrhenius RSL Decay Kinetics)     │
                             └──────────────────┬────────────────────┘
                                                │ (Anomaly Flagged: RSL < 36h)
                                                ▼
    ┌─────────────────────────────────────────────────────────────────────────────────┐
    │                      3. BigQuery GIS Spatial Lakehouse                          │
    │          `coldrescue_prod.certified_off_takers` & `logistics_corridors`         │
    │                                                                                 │
    │  • ST_DWITHIN(facility_geog, truck_geog, 35 miles)                              │
    │  • ST_DISTANCE / 1609.34 (Precise Detour Miles)                                 │
    │  • Intake Dock Availability & Pallet Capacity Filter                            │
    └───────────────────────────────────────────┬─────────────────────────────────────┘
                                                │
                                                ▼
    ┌─────────────────────────────────────────────────────────────────────────────────┐
    │                4. Vertex AI / Gemini 3.7 Multi-Agent Swarm                      │
    │                                                                                 │
    │  ┌───────────────────────┐   ┌────────────────────────┐   ┌──────────────────┐ │
    │  │ Economic Arbiter      │   │ Dataplex Auditor       │   │ Master           │ │
    │  │ • Net Salvage vs Loss │   │ • FDA FSMA 111 Cert    │   │ Dispatcher       │ │
    │  │ • Diesel Detour Cost  │   │ • EPA Methane Offset   │   │ • e-BOL Amend    │ │
    │  └───────────────────────┘   └────────────────────────┘   └──────────────────┘ │
    └───────────────────────────────────────────┬─────────────────────────────────────┘
                                                │ (Consensus Reached)
                                                ▼
                             ┌───────────────────────────────────────┐
                             │       5. Autonomous Execution         │
                             │   • In-Cab Driver Navigation Detour   │
                             │   • Off-Taker Receiver Bay Handshake  │
                             │   • Amended e-BOL Digital Audit Trail │
                             └───────────────────────────────────────┘
```

---

## 📡 What is the Purpose of Google Cloud Pub/Sub in this Project?

In a commercial fleet with thousands of active refrigerated trailers, **Pub/Sub** acts as the high-throughput, decoupled event backbone:

1. **High-Frequency Ingestion:** Ingests live telemetry packets from individual trailer compartments (Temperature, Humidity, Ethylene Gas in ppm, Compressor Power Draw, Vibration, GPS coordinates) every 500ms without overwhelming downstream services.
2. **Zone-Specific Isolation:** Pub/Sub messages carry compartment IDs (`COMP-A`, `COMP-B`, `COMP-C`), allowing the system to isolate a single compartment failure (e.g., Zone A strawberries) while confirming that Zones B and C remain pristine.
3. **Decoupled Architecture:** Telemetry is published to topic `truck-telemetry-live`. Downstream subscribers (the Arrhenius decay engine, live dashboard, BigQuery streaming insert, and agent trigger) process events asynchronously without blocking driver telematics.
4. **Instant Event-Driven Trigger:** If temperature breaches safe thresholds (e.g., $> 4.0^\circ\text{C}$ for berries), an event immediately triggers the **Gemini Multi-Agent Orchestrator** to solve the incident within seconds.

---

## 🗺️ What is the Purpose of Google BigQuery GIS in this Project?

BigQuery is not used as a static database; it serves as the **Spatial Arbitrage Engine**:

1. **Sub-Second Spatial Search (`ST_DWITHIN` & `ST_DISTANCE`):**
   ```sql
   SELECT 
     facility_id,
     name,
     category,
     salvage_bid_per_lb_usd,
     cold_intake_capacity_pallets,
     ROUND(ST_DISTANCE(facility_geog, ST_GEOGPOINT(@truck_lng, @truck_lat)) / 1609.34, 1) AS distance_miles
   FROM `coldrescue_prod.certified_off_takers`
   WHERE 
     ST_DWITHIN(facility_geog, ST_GEOGPOINT(@truck_lng, @truck_lat), 56327.0) -- 35-mile radius in meters
     AND cold_intake_capacity_pallets >= 4
     AND fsma_certified = TRUE
   ORDER BY distance_miles ASC;
   ```
2. **Economic Arbitrage Matrix:** Computes net financial recovery:
   $$\text{Net Recovery} = (\text{Salvage Bid/lb} \times \text{Weight}) - (\text{Detour Fuel} + \text{Driver Time}) + \text{Avoided Landfill Tipping Fee}$$
3. **Historical Corridor Analytics:** Analyzes historical thermal breach hot spots along interstate freight corridors (e.g., I-80 Salt Lake Basin).

---

## 🤖 The 5-Agent Autonomous Swarm (Gemini 3.7 Flash)

ColdRescue AI uses a specialized multi-agent consensus workflow:

| Agent | Responsibility | Core Technology |
| :--- | :--- | :--- |
| **1. Cold Sentinel** | Evaluates real-time Pub/Sub sensor deltas; computes Remaining Shelf Life (RSL) using Arrhenius bio-kinetics equations. | Google Cloud Pub/Sub, Arrhenius Model |
| **2. Logistics GIS Analyst** | Performs spatial proximity queries across commercial buyers and computes turn-by-turn detour impact. | BigQuery GIS, Google Maps Routing |
| **3. Economic & Loss Arbiter** | Evaluates financial ROI (e.g., +$9,105 net recovery vs. -$20,600 total landfill write-off). | Gemini 3.7 Reasoning Engine |
| **4. Dataplex Compliance Auditor** | Enforces FDA FSMA Section 111 Sanitary Transport rules and calculates EPA WARM avoided methane offsets ($14.8\text{ MT } CO_2e$). | Google Cloud Dataplex, EPA WARM |
| **5. Master Dispatcher** | Reaches swarm consensus, executes 1-click receiver dock reservation, and amends electronic Bill of Lading (e-BOL). | Telematics Webhooks, In-Cab Dispatch |

---

## 📊 Public Datasets & Regulatory Standards Modeled

This project integrates and models the following verified public standards and datasets:

1. **USDA FoodData Central & Agricultural Handbook No. 66:**
   - Baseline perishability and shelf-life decay curves under variable thermal conditions (Strawberries, Spinach, Carrots).
2. **FDA FSMA (Food Safety Modernization Act) - 21 CFR Part 1, Subpart O:**
   - Sanitary Transportation of Human and Animal Food Rule parameters for temperature auditability and Grade-B processing reclassification.
3. **EPA WARM (Waste Reduction Model) Organic Protocol:**
   - Conversion factors for avoided municipal landfilling of organic matter ($1.85\text{ MT } CO_2e\text{ per ton of food diverted}$).
4. **US DOT Freight Analysis Framework (FAF5) & OpenStreetMap:**
   - Freight routing coordinates, designated truck corridors (I-80, I-15, I-90), and commercial off-taker facility nodes.
5. **Bill Emerson Good Samaritan Food Donation Act (42 U.S. Code § 1791):**
   - Legal liability protection standards applied when routing pallets to regional food banks.

---

## 💻 Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Recharts (Arrhenius Kinetics Visualizer), Lucide Icons, Motion.
- **Backend Server:** Express.js, TypeScript (`tsx`), Vite Middleware.
- **Cloud Infrastructure & AI:**
  - **Vertex AI / Google AI Studio:** `@google/genai` (Gemini 3.7 Flash).
  - **BigQuery GIS:** `@google-cloud/bigquery` (Spatial SQL).
  - **Pub/Sub:** `@google-cloud/pubsub` (Real-Time Ingestion).
  - **Deployment:** Google Cloud Run (Serverless Container).

---

## 🚀 Quickstart & Local Development

### 1. Prerequisites
- Node.js (v18+)
- Google AI Studio API Key (or Google Cloud Application Default Credentials)

### 2. Install & Run
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# 3. Start local development server (runs on Port 3000)
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## ☁️ Google Cloud Deployment (Cloud Run)

To deploy to production on Google Cloud Run:

```bash
# 1. Authenticate & set project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 2. Create Pub/Sub topic and BigQuery dataset
gcloud pubsub topics create truck-telemetry-live
bq --location=US mk --dataset YOUR_PROJECT_ID:coldrescue_prod

# 3. Deploy container to Cloud Run
gcloud run deploy coldrescue-ai \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID",PUBSUB_TOPIC_NAME="truck-telemetry-live",GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

---

## 📄 License
MIT License. Built for the Google AI Studio & Google Cloud Hackathon.
