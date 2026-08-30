import React, { useState } from 'react';
import { 
  Radio, 
  Database, 
  Cpu, 
  ShieldCheck, 
  DollarSign, 
  Leaf, 
  Sparkles, 
  Zap,
  Layers,
  ThermometerSnowflake,
  FileCheck,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Truck,
  Brain
} from 'lucide-react';
import { AgentDecisionLogs } from './AgentDecisionLogs';
import { AppIntentFlowchartModal } from './AppIntentFlowchartModal';

export const ColdChainArchitectureView: React.FC = () => {
  const [isFlowchartOpen, setIsFlowchartOpen] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);

  const pipelineStages = [
    {
      step: 1,
      title: "1. In-Transit Breach Detection",
      subtitle: "Pub/Sub IoT Multi-Zone Telematics",
      icon: <Radio className="w-4 h-4 text-emerald-400" />,
      color: "emerald",
      badge: "Sub-Second Ingest",
      summary: "High-frequency sensors in each trailer zone stream temperature, humidity, and ethylene gas to Google Cloud Pub/Sub.",
      impact: "Zero silent spoilage: anomalies flagged immediately."
    },
    {
      step: 2,
      title: "2. Shelf-Life Decay Forecasting",
      subtitle: "Arrhenius Biochemical ML Kinetics",
      icon: <Cpu className="w-4 h-4 text-blue-400" />,
      color: "blue",
      badge: "Biochemical Decay Model",
      summary: "Predicts pallet Remaining Shelf Life (RSL). For example, cherry shelf life drops from 240 hrs to 34 hrs when temp hits +11.8°C.",
      impact: "Identifies that load will be rejected at destination 19 hrs away."
    },
    {
      step: 3,
      title: "3. Spatial Off-Taker Matching",
      subtitle: "BigQuery GIS (ST_DWITHIN 35mi)",
      icon: <Database className="w-4 h-4 text-purple-400" />,
      color: "purple",
      badge: "Spatial Ranking Index",
      summary: "Scans nearby certified food processing plants, cider mills, and food banks along the truck's immediate transit corridor.",
      impact: "Matches certified buyers with open dock doors in <30 mins."
    },
    {
      step: 4,
      title: "4. Multi-Agent Economic Arbitrage",
      subtitle: "Gemini 3.7 Deliberation Engine",
      icon: <Brain className="w-4 h-4 text-amber-400" />,
      color: "amber",
      badge: "Financial Optimization",
      summary: "Calculates Net Recovery = [Salvage Bid × Lbs] - [Extra Diesel] + [Avoided Landfill Tipping Fees].",
      impact: "Selects the optimal buyer with highest economic & ESG yield."
    },
    {
      step: 5,
      title: "5. Surgical Reroute & Pallet Offload",
      subtitle: "In-Cab Telematics & amended e-BOL",
      icon: <Truck className="w-4 h-4 text-rose-400" />,
      color: "rose",
      badge: "1-Click Dispatch Handshake",
      summary: "Pushes waypoint to driver's tablet. 4 breached pallets are unloaded at the salvage dock; remaining 16 pallets continue to primary DC.",
      impact: "Turns a $20,600 write-off into +$12,670 cash recovery."
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Intent Flowchart Interactive Modal */}
      <AppIntentFlowchartModal isOpen={isFlowchartOpen} onClose={() => setIsFlowchartOpen(false)} />

      {/* Title & Overview Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-500/30">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              ColdRescue AI: Multi-Agent System Architecture & Solution Intent
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Autonomous end-to-end perishable rescue pipeline: Converting in-transit cold-chain thermal excursions from total cargo write-offs into real-time salvage monetization and ESG carbon avoidance.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFlowchartOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-extrabold rounded-lg shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-950" />
            Explain App Intent & View Flowchart
          </button>

          <span className="px-3 py-1 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            ColdRescue AI Live
          </span>
        </div>
      </div>

      {/* Problem vs. Solution Executive Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Problem Card */}
        <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-1 bg-rose-950 text-rose-400 rounded border border-rose-500/40">
                <XCircle className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-300">
                The Problem: $35B Cold-Chain Write-Offs
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
              -$20,600 avg write-off
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Reefer temperature excursions (compressor trip, insulation leak) occur silently mid-transit. By the time the truck arrives at the distribution center 18 hours later, perishable produce is rejected, dumped into landfills ($2,200 tipping fee), and generates potent methane gas.
          </p>
          <div className="flex items-center gap-3 text-[11px] font-mono text-rose-300/90 pt-1">
            <span>• 100% Cargo Write-Off</span>
            <span>• $2,200 Dump Fee</span>
            <span>• 14.8 MT CO2e Methane</span>
          </div>
        </div>

        {/* Solution Card */}
        <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-1 bg-emerald-950 text-emerald-400 rounded border border-emerald-500/40">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                The Solution: Autonomous In-Flight Salvage
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              +$12,670 net recovery
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Google Cloud Pub/Sub & BigQuery GIS detect thermal breaches within seconds, compute Arrhenius shelf-life decay, and instantly match certified local processors (puree plants, bakeries, food banks) for a quick 15-min drop-off while the rest of the trailer continues safely.
          </p>
          <div className="flex items-center gap-3 text-[11px] font-mono text-emerald-300 pt-1">
            <span>• +$9,200 Cash Payout</span>
            <span>• $0 Landfill Fee</span>
            <span>• 100% Primary Load Preserved</span>
          </div>
        </div>
      </div>

      {/* High-Level Visual Flowchart & Executive Solution Summary */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              High-Level Execution Flowchart • End-to-End Perishable Rescue Pipeline
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Hover or click any stage to see how data flows from sensors to dollar recovery
          </span>
        </div>

        {/* 5-Step Connected Flowchart Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {pipelineStages.map((stage, idx) => {
            const isSelected = activePipelineStep === idx;
            return (
              <div
                key={stage.step}
                onClick={() => setActivePipelineStep(idx)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500 shadow-lg ring-1 ring-emerald-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                      STEP {stage.step}
                    </span>
                    {stage.icon}
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 line-clamp-2">
                    {stage.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {stage.summary}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-800/80 text-[10px] text-emerald-300 font-semibold truncate">
                  ✓ {stage.impact}
                </div>

                {idx < pipelineStages.length - 1 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-slate-900 border border-slate-700 rounded-full p-0.5 text-slate-400 shadow">
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Interactive Step Highlight Explanation Box */}
        <div className="p-3.5 bg-slate-900/90 rounded-lg border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[10px] font-bold rounded uppercase border border-emerald-500/30">
              Selected Stage
            </span>
            <span className="font-bold text-slate-200">{pipelineStages[activePipelineStep].title}:</span>
            <span className="text-slate-300">{pipelineStages[activePipelineStep].summary}</span>
          </div>
          <span className="text-teal-300 font-mono text-[11px] shrink-0 font-semibold">
            {pipelineStages[activePipelineStep].badge}
          </span>
        </div>
      </div>

      {/* GCP Technical Service Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {/* Step 1: Pub/Sub IoT Streaming */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between hover:border-emerald-500/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                STEP 1
              </span>
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mt-2 flex items-center gap-1.5">
              Google Cloud Pub/Sub
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Ingests high-frequency multi-zone IoT sensor streams (temperature, relative humidity, ethylene gas, vibration, GPS coordinates).
            </p>
          </div>
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-[10px] font-mono text-emerald-300">
            Topic: <span className="text-slate-300">/topics/truck-telemetry-live</span>
          </div>
        </div>

        {/* Step 2: BigQuery GIS & Decay ML */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between hover:border-blue-500/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded">
                STEP 2
              </span>
              <Database className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mt-2 flex items-center gap-1.5">
              BigQuery GIS & ML
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Computes Arrhenius biochemical shelf-life decay curves and runs spatial queries against local off-taker capacities.
            </p>
          </div>
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-[10px] font-mono text-blue-300">
            Query: <span className="text-slate-300">ST_DWITHIN(truck, buyer, 35mi)</span>
          </div>
        </div>

        {/* Step 3: Multi-Agent Deliberation */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between hover:border-purple-500/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded">
                STEP 3
              </span>
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mt-2 flex items-center gap-1.5">
              Gemini 3.7 Multi-Agent
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Specialized agents collaborate: Cold Sentinel, Logistics Analyst, and Economic Arbiter evaluate net recovery vs. diesel detour costs.
            </p>
          </div>
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-[10px] font-mono text-purple-300">
            Consensus: <span className="text-slate-300">Surgical Drop 4 Pallets</span>
          </div>
        </div>

        {/* Step 4: Dataplex Compliance Audit */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between hover:border-amber-500/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
                STEP 4
              </span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mt-2 flex items-center gap-1.5">
              Dataplex Catalog
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Audits FSMA / HACCP food safety standards, verifies buyer dock permits, generates amended e-Bill of Lading, and logs carbon tokens.
            </p>
          </div>
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-[10px] font-mono text-amber-300">
            Governance: <span className="text-slate-300">FSMA Grade-B Reclassification</span>
          </div>
        </div>

        {/* Step 5: Autonomous Dispatch & Handshake */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between hover:border-rose-500/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded">
                STEP 5
              </span>
              <Zap className="w-4 h-4 text-rose-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mt-2 flex items-center gap-1.5">
              1-Click Handshake
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Receiver accepts 4-pallet rescue lot on their portal, truck reroutes for a 15-min drop-off, and safely continues with remaining cargo.
            </p>
          </div>
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-[10px] font-mono text-rose-300">
            Status: <span className="text-emerald-400 font-bold">Rescued & Verified</span>
          </div>
        </div>
      </div>

      {/* Dual Column: Core Impact Metrics & Multi-Agent Roles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Left: Quantified Value Proposition */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Quantified Value Proposition (Per 4-Pallet Incident)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Status Quo Write-off Risk</span>
              <span className="text-base font-extrabold text-rose-400">-$20,600</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Cargo loss + $2,200 dump fee</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Salvage Value Recovered</span>
              <span className="text-base font-extrabold text-emerald-400">+$9,200</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Instant cash from processor</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Avoided Methane Emissions</span>
              <span className="text-base font-extrabold text-teal-400">14.8 MT CO2e</span>
              <p className="text-[10px] text-slate-500 mt-0.5">8,000 lbs organic food saved</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Net Carbon Efficiency</span>
              <span className="text-base font-extrabold text-purple-400">32 : 1 Ratio</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Avoided food waste vs. diesel</p>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-lg text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-emerald-300">Why the Seller Wins:</span> Shippers avoid total write-offs, eliminate dump fees, preserve insurance loss ratios, and maintain customer trust via proactive re-dispatch buffers.
          </div>
        </div>

        {/* Right: Specialized Agent Roles */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              5 Specialized Google Cloud AI Agents
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-start space-x-2.5">
              <ThermometerSnowflake className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200">1. Cold Sentinel Agent:</span>
                <span className="text-slate-400 ml-1">Monitors Pub/Sub streams and calculates pallet-level remaining shelf life (RSL) using Arrhenius kinetics.</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-start space-x-2.5">
              <Database className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200">2. Logistics GIS Analyst:</span>
                <span className="text-slate-400 ml-1">Queries BigQuery spatial index to identify all qualified food processors and food banks within detour range.</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-start space-x-2.5">
              <DollarSign className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200">3. Economic & Loss Arbiter:</span>
                <span className="text-slate-400 ml-1">Calculates Net Recovery = [Salvage Bid - Extra Fuel - Driver Overtime + Avoided Landfill Fees].</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-start space-x-2.5">
              <FileCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200">4. Dataplex Compliance Auditor:</span>
                <span className="text-slate-400 ml-1">Ensures FSMA/HACCP temperature chain-of-custody, updates e-Bill of Lading, and issues carbon offset certificates.</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-start space-x-2.5">
              <Zap className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200">5. Master Dispatcher:</span>
                <span className="text-slate-400 ml-1">Executes receiver handshake, updates in-cab truck GPS waypoints, and releases escrow funds.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Autonomous Agent Decision Logs Timeline */}
      <AgentDecisionLogs />
    </div>
  );
};
