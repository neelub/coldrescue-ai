/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Layers, 
  Radio, 
  Database, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { ColdChainArchitectureView } from './components/ColdChainArchitectureView';
import { ReeferTruckLiveView } from './components/ReeferTruckLiveView';
import { BigQueryAndOffTakerView } from './components/BigQueryAndOffTakerView';
import { PubSubLiveStreamView } from './components/PubSubLiveStreamView';
import { 
  FLEET_TRUCKS, 
  OFF_TAKERS_BY_TRUCK, 
  INITIAL_PUBSUB_TELEMETRY_LOGS, 
  BIGQUERY_ANALYTICS_METRICS,
  INITIAL_SALVAGE_LEDGER
} from './data/coldChainMockData';
import { RefrigeratedTruck, OffTakerBuyer, PubSubSensorTelemetry, SalvageLedgerRecord } from './types';
import { AppIntentFlowchartModal } from './components/AppIntentFlowchartModal';
import { HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'truck-twin' | 'bigquery-offtakers' | 'pubsub-stream'>('architecture');
  const [fleetTrucks, setFleetTrucks] = useState<RefrigeratedTruck[]>(FLEET_TRUCKS);
  const [selectedTruckId, setSelectedTruckId] = useState<string>('TRK-9042');
  
  // Current active truck
  const currentTruck = fleetTrucks.find(t => t.id === selectedTruckId) || fleetTrucks[0];
  
  // Off-takers mapped to selected truck
  const activeOffTakers = OFF_TAKERS_BY_TRUCK[selectedTruckId] || OFF_TAKERS_BY_TRUCK['TRK-9042'];
  const [selectedOffTaker, setSelectedOffTaker] = useState<OffTakerBuyer | null>(activeOffTakers[0]);
  
  const [telemetryLogs, setTelemetryLogs] = useState<PubSubSensorTelemetry[]>(INITIAL_PUBSUB_TELEMETRY_LOGS);
  const [isSolving, setIsSolving] = useState(false);
  const [isHandshakeDone, setIsHandshakeDone] = useState(false);
  const [isDropoffComplete, setIsDropoffComplete] = useState(false);
  const [salvageLedger, setSalvageLedger] = useState<SalvageLedgerRecord[]>(INITIAL_SALVAGE_LEDGER);
  const [isFlowchartModalOpen, setIsFlowchartModalOpen] = useState(false);

  // Switch selected truck
  const handleSelectTruck = (truckId: string) => {
    setSelectedTruckId(truckId);
    const newOffTakers = OFF_TAKERS_BY_TRUCK[truckId] || OFF_TAKERS_BY_TRUCK['TRK-9042'];
    setSelectedOffTaker(newOffTakers[0]);
    setIsHandshakeDone(false);
    setIsDropoffComplete(false);
  };

  // Simulate Compressor Failure Toggle for a specific compartment on the active truck
  const handleSimulateBreach = (compartmentId: string) => {
    setFleetTrucks(prevFleet => {
      return prevFleet.map(trk => {
        if (trk.id !== selectedTruckId) return trk;
        
        const updatedComp = trk.compartments.map(comp => {
          if (comp.id === compartmentId || (compartmentId.startsWith('comp-') && comp.id === 'COMP-A')) {
            const isCurrentlyBreached = comp.status === 'CRITICAL_BREACH';
            const newStatus = isCurrentlyBreached ? ('OPTIMAL' as const) : ('CRITICAL_BREACH' as const);
            const newTemp = isCurrentlyBreached ? comp.targetTempC : 11.8;
            const newRSL = isCurrentlyBreached ? comp.baseShelfLifeDays * 24 : 34;
            
            // If breaching, also inject a critical Pub/Sub log
            if (!isCurrentlyBreached) {
              const newLog: PubSubSensorTelemetry = {
                messageId: `pubsub-msg-${Math.floor(Math.random() * 90000 + 10000)}`,
                topic: 'projects/coldrescue-prod/topics/truck-telemetry-live',
                timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
                truckId: trk.id,
                compartmentId: comp.id,
                sensorId: `IOT-TEMP-${trk.id.replace('TRK-', '')}-01`,
                metrics: {
                  tempC: 11.8,
                  ambientTempC: 29.4,
                  humidityPct: 66,
                  ethylenePpm: 4.8,
                  co2Ppm: 750,
                  vibrationG: 0.13,
                  reeferPowerStatus: 'FAULT',
                },
                priority: 'CRITICAL',
              };
              setTelemetryLogs(prev => [newLog, ...prev]);
            }

            return {
              ...comp,
              currentTempC: newTemp,
              currentRemainingShelfLifeHours: newRSL,
              status: newStatus,
            };
          }
          return comp;
        });

        return { ...trk, compartments: updatedComp };
      });
    });
  };

  // Deploy Multi-Agent Solver Execution
  const handleTriggerRescue = async () => {
    setIsSolving(true);
    try {
      const breachedComp = currentTruck.compartments.find(c => c.status === 'CRITICAL_BREACH') || currentTruck.compartments[0];
      const response = await fetch('/api/agents/solve-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zone: { name: currentTruck.currentLocationName, region: currentTruck.origin },
          incidentTitle: `Reefer ${breachedComp.name} Thermal Anomaly (${breachedComp.commodity})`,
          customContext: `${breachedComp.quantityPallets} pallets of ${breachedComp.commodity} at ${breachedComp.currentTempC}°C. Remaining RSL: ${breachedComp.currentRemainingShelfLifeHours}h.`,
          sensorData: { 
            tempC: breachedComp.currentTempC, 
            ethylenePpm: breachedComp.ethylenePpm, 
            pallets: breachedComp.quantityPallets, 
            commodity: breachedComp.commodity 
          },
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSelectedOffTaker(activeOffTakers[0]);
      }
    } catch (e) {
      console.error('Agent solver failed:', e);
      setSelectedOffTaker(activeOffTakers[0]);
    } finally {
      setIsSolving(false);
    }
  };

  // Confirm Handshake and set pallet capacity
  const handleConfirmHandshake = (buyer: OffTakerBuyer) => {
    setSelectedOffTaker({
      ...buyer,
      currentIntakeCapacityPallets: 0,
    });
    setIsHandshakeDone(true);
  };

  // Complete physical dock arrival, RFID scan, and offload pallets from truck digital twin
  const handleCompleteDropoff = (buyer: OffTakerBuyer) => {
    const targetComp = currentTruck.compartments.find(c => c.status === 'CRITICAL_BREACH') || currentTruck.compartments[0];
    const offloadedPallets = targetComp.quantityPallets || 4;
    const offloadedPounds = targetComp.totalPounds || 6200;

    // 1. Physically delete / offload pallets from this zone in the truck twin
    setFleetTrucks(prevFleet => {
      return prevFleet.map(trk => {
        if (trk.id !== selectedTruckId) return trk;
        const updatedComps = trk.compartments.map(comp => {
          if (comp.id === targetComp.id) {
            return {
              ...comp,
              quantityPallets: 0,
              totalPounds: 0,
              marketValueUSD: 0,
              status: 'OPTIMAL' as const,
              currentTempC: comp.targetTempC,
              currentRemainingShelfLifeHours: 0,
            };
          }
          return comp;
        });
        return {
          ...trk,
          compartments: updatedComps,
        };
      });
    });

    // 2. Register complete financial & ESG audit transaction in BigQuery Salvage Ledger
    const newRecord: SalvageLedgerRecord = {
      id: `SALVAGE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      truckId: currentTruck.id,
      truckNumber: currentTruck.truckNumber,
      carrierName: currentTruck.carrierName,
      driverName: currentTruck.driverName,
      zoneName: targetComp.name,
      commodity: targetComp.commodity,
      palletsOffloaded: offloadedPallets,
      totalPounds: offloadedPounds,
      originalDestination: currentTruck.originalDestination,
      salvageFacilityName: buyer.name,
      salvageCategory: buyer.category,
      salvageLocation: `${buyer.distanceMilesFromTruck} mi detour from ${currentTruck.currentLocationName}`,
      salvageBidPerLbUSD: buyer.salvageBidPerLbUSD,
      grossPayoutUSD: buyer.estimatedPayoutUSD,
      detourFuelCostUSD: buyer.extraFuelCostUSD,
      netFinancialRecoveryUSD: buyer.netFinancialRecoveryUSD,
      avoidedLandfillFeeUSD: 420,
      avoidedMethaneMT: buyer.avoidedMethaneEmissionsMT,
      ebolNumber: `eBOL-${currentTruck.id.replace('TRK-', '')}-SALVAGE-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'OFFLOADED_VERIFIED',
    };

    setSalvageLedger(prev => [newRecord, ...prev]);
    setIsDropoffComplete(true);
    setIsHandshakeDone(false);
  };

  // Inject live sensor telemetry spike manually
  const handleInjectSpike = () => {
    const newLog: PubSubSensorTelemetry = {
      messageId: `pubsub-msg-${Math.floor(Math.random() * 90000 + 10000)}`,
      topic: 'projects/coldrescue-prod/topics/truck-telemetry-live',
      timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
      truckId: currentTruck.id,
      compartmentId: 'COMP-A',
      sensorId: `IOT-TEMP-${currentTruck.id.replace('TRK-', '')}-01`,
      metrics: {
        tempC: 12.8,
        ambientTempC: 31.2,
        humidityPct: 62,
        ethylenePpm: 5.4,
        co2Ppm: 780,
        vibrationG: 0.15,
        reeferPowerStatus: 'FAULT',
      },
      priority: 'CRITICAL',
    };
    setTelemetryLogs(prev => [newLog, ...prev]);
  };

  const breachedComp = currentTruck.compartments.find(c => c.status === 'CRITICAL_BREACH');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top App Header */}
      <header className="bg-slate-900 border-b border-emerald-900/40 text-slate-100 sticky top-0 z-50 shadow-xl backdrop-blur-md bg-slate-900/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-900/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Truck className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
                  COLDRESCUE <span className="text-emerald-400 font-extrabold">AI</span>
                </h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-full">
                  Fleet Engine • 5 Live Reefer Units
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous Multi-Agent Cold Chain Preservation & Dynamic Perishable Rescue
              </p>
            </div>
          </div>

          {/* GCP Service Status Badges & Quick Intent Explainer Button */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <button
              onClick={() => setIsFlowchartModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 rounded-lg font-extrabold shadow transition active:scale-95 cursor-pointer text-xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-950" />
              Explain App Intent & Flowchart
            </button>

            <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/90 text-emerald-300 rounded-md border border-slate-700 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Pub/Sub Ingest
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/90 text-blue-300 rounded-md border border-slate-700 font-mono text-[11px]">
              <Database className="w-3 h-3 text-blue-400" />
              BigQuery GIS
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/90 text-amber-300 rounded-md border border-slate-700 font-mono text-[11px]">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              Dataplex FSMA
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-950/70 text-emerald-300 rounded-md border border-emerald-500/40 font-mono text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Gemini 3.7 Multi-Agent
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar gap-1 border-t border-slate-800/60 pt-1">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'architecture'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            1. System Architecture & ROI Diagram
          </button>

          <button
            onClick={() => setActiveTab('truck-twin')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'truck-twin'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-teal-400" />
            2. Multi-Zone Reefer Fleet (5 Trucks)
          </button>

          <button
            onClick={() => setActiveTab('bigquery-offtakers')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'bigquery-offtakers'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            3. BigQuery Spatial Off-Takers & Analytics
          </button>

          <button
            onClick={() => setActiveTab('pubsub-stream')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'pubsub-stream'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400" />
            4. Google Cloud Pub/Sub Sensor Stream
          </button>
        </div>
      </header>

      {/* Intent Flowchart Global Modal */}
      <AppIntentFlowchartModal isOpen={isFlowchartModalOpen} onClose={() => setIsFlowchartModalOpen(false)} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6 w-full">
        {/* Active Tab View Rendering */}
        {activeTab === 'architecture' && <ColdChainArchitectureView />}

        {activeTab === 'truck-twin' && (
          <ReeferTruckLiveView
            fleetTrucks={fleetTrucks}
            selectedTruckId={selectedTruckId}
            onSelectTruck={handleSelectTruck}
            truck={currentTruck}
            onSimulateBreach={handleSimulateBreach}
            onTriggerRescue={handleTriggerRescue}
            isSolving={isSolving}
            offTakers={activeOffTakers}
            selectedOffTaker={selectedOffTaker}
            onSelectOffTaker={(b) => setSelectedOffTaker(b)}
            onConfirmHandshake={handleConfirmHandshake}
            isHandshakeDone={isHandshakeDone}
            onCompleteDropoff={handleCompleteDropoff}
            isDropoffComplete={isDropoffComplete}
          />
        )}

        {activeTab === 'bigquery-offtakers' && (
          <BigQueryAndOffTakerView
            offTakers={activeOffTakers}
            selectedOffTaker={selectedOffTaker}
            onSelectOffTaker={(b) => setSelectedOffTaker(b)}
            metrics={BIGQUERY_ANALYTICS_METRICS}
            onConfirmHandshake={handleConfirmHandshake}
            isHandshakeDone={isHandshakeDone}
            truck={currentTruck}
            salvageLedger={salvageLedger}
          />
        )}

        {activeTab === 'pubsub-stream' && (
          <PubSubLiveStreamView
            telemetryLogs={telemetryLogs}
            onInjectSpike={handleInjectSpike}
          />
        )}

        {/* Persistent Bottom Quick-Navigation & Highlights */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2">
            {breachedComp ? (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                <span className="text-slate-300">
                  Active Excursion: <strong className="text-rose-300">{currentTruck.truckNumber} ({currentTruck.id})</strong> • {breachedComp.quantityPallets} Pallets {breachedComp.commodity} at <span className="text-rose-400 font-mono font-bold">{breachedComp.currentTempC}°C</span> (RSL: {breachedComp.currentRemainingShelfLifeHours}h).
                </span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">
                  Active Truck: <strong className="text-slate-100">{currentTruck.truckNumber} ({currentTruck.id})</strong> • All 3 compartments operating at optimal chill tolerances.
                </span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('truck-twin')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition cursor-pointer"
            >
              Inspect Fleet Twin
            </button>
            <button
              onClick={() => setActiveTab('bigquery-offtakers')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg transition cursor-pointer"
            >
              Match Local Off-Takers
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ColdRescue AI • Multi-Agent Cold Chain Preservation & Arbitrage Engine</span>
          <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
            <span>Google Cloud Pub/Sub</span>
            <span>•</span>
            <span>BigQuery GIS</span>
            <span>•</span>
            <span>Dataplex Governance</span>
            <span>•</span>
            <span>Gemini 3.7 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
