import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Radio, 
  Brain, 
  MapPin, 
  Truck, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  DollarSign, 
  Leaf, 
  ShieldCheck, 
  FileText,
  Clock,
  Sparkles,
  HelpCircle,
  Layers,
  Scale,
  Fuel,
  Building2
} from 'lucide-react';

export const AppIntentFlowchartModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [selectedStage, setSelectedStage] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'flowchart' | 'economics' | 'problem-solution'>('flowchart');

  if (!isOpen) return null;

  const stages = [
    {
      step: 1,
      tag: "THE PROBLEM",
      title: "In-Transit Refrigeration Failure",
      badgeColor: "bg-rose-950 text-rose-300 border-rose-500/50",
      icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
      shortDesc: "Compressor failure in 1 compartment leads to entire trailer rejection at destination.",
      details: "Normally, when a thermal breach occurs (+11.8°C excursion on cherries or berries), the driver continues to the destination DC 19 hours away unaware of the chemical shelf-life collapse. Upon arrival, the supermarket inspector rejects the load. Result: $18,400 cargo loss + $2,200 landfill dumping fee = -$20,600 total write-off, plus methane emissions."
    },
    {
      step: 2,
      tag: "REAL-TIME DETECTION",
      title: "Pub/Sub IoT & Shelf-Life ML",
      badgeColor: "bg-blue-950 text-blue-300 border-blue-500/50",
      icon: <Radio className="w-5 h-5 text-blue-400" />,
      shortDesc: "IoT telematics detect excursion in seconds & calculate Arrhenius shelf-life decay.",
      details: "Multi-zone sensors stream live temperature, humidity, and ethylene gas to Google Cloud Pub/Sub. Machine learning models instantly compute that remaining shelf life has plummeted from 240 hours down to 34 hours, proving the load will not survive primary DC inventory storage."
    },
    {
      step: 3,
      tag: "SPATIAL ARBITRAGE",
      title: "BigQuery GIS Off-Taker Matching",
      badgeColor: "bg-purple-950 text-purple-300 border-purple-500/50",
      icon: <MapPin className="w-5 h-5 text-purple-400" />,
      shortDesc: "Scans certified processors (puree plants, cider mills, food banks) along the route.",
      details: "BigQuery GIS runs spatial radius queries (ST_DWITHIN) to find secondary buyers with open dock doors who can immediately utilize Grade-B fruit (e.g. Mountain Pure Smoothie Co., +22 min detour, $1.15/lb salvage bid for 8,000 lbs = $9,200 gross payout)."
    },
    {
      step: 4,
      tag: "SURGICAL DETOUR",
      title: "1-Click Dispatch & Dock Offload",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-500/50",
      icon: <Truck className="w-5 h-5 text-amber-400" />,
      shortDesc: "Truck takes a 15-min detour, unloads 4 pallets, and continues with remaining 16 pallets.",
      details: "The driver receives in-cab waypoint navigation via ELD. The dock door is reserved automatically. The 4 endangered pallets are scanned and dropped off in under 25 minutes. The remaining 16 unaffected pallets continue to the original destination on schedule."
    },
    {
      step: 5,
      tag: "THE RECOVERY",
      title: "Financial Arbitrage & ESG Verification",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-500/50",
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      shortDesc: "Converts a -$20,600 write-off into +$12,670 net economic recovery & 14.8 MT CO2e saved.",
      details: "Shipper collects instant cash, avoids $2,200 landfill tipping fees, saves insurance loss-ratio claims, and generates verified ESG carbon credits logged into BigQuery for automated Looker Studio executive reporting."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl p-5 sm:p-6 space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-500/40">
                <Brain className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-100">
                ColdRescue AI: Problem Statement, Solution & Executive ROI
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              An autonomous perishable rescue system built on Google Cloud to convert in-transit cold-chain failures from total cargo losses into instant revenue and ESG carbon credits.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition cursor-pointer text-sm font-bold"
          >
            ✕ Close
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('flowchart')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'flowchart'
                ? 'bg-emerald-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Execution Flowchart & Pipeline
          </button>

          <button
            onClick={() => setActiveTab('problem-solution')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'problem-solution'
                ? 'bg-emerald-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Problem vs. Solution Overview
          </button>

          <button
            onClick={() => setActiveTab('economics')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'economics'
                ? 'bg-emerald-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Quantified Financial ROI & Savings Breakdown
          </button>
        </div>

        {/* TAB 1: FLOWCHART PIPELINE */}
        {activeTab === 'flowchart' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                End-to-End Autonomous Lifecycle
              </span>
              <span>Click any step below for technical breakdown</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {stages.map((stage, idx) => {
                const isSelected = selectedStage === idx;
                return (
                  <div
                    key={stage.step}
                    onClick={() => setSelectedStage(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                      isSelected 
                        ? 'bg-slate-800 border-emerald-500 shadow-lg ring-2 ring-emerald-500/40'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${stage.badgeColor}`}>
                          Step {stage.step}
                        </span>
                        {stage.icon}
                      </div>

                      <h4 className="text-xs font-bold text-slate-200 line-clamp-2 mt-1">
                        {stage.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {stage.shortDesc}
                      </p>
                    </div>

                    {idx < stages.length - 1 && (
                      <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 bg-slate-900 border border-slate-700 rounded-full p-0.5 text-slate-400">
                        <ArrowRight className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Focused Step Deep-Dive Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${stages[selectedStage].badgeColor}`}>
                    Step {stages[selectedStage].step}: {stages[selectedStage].tag}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">
                    {stages[selectedStage].title}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {stages[selectedStage].details}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => setSelectedStage((prev) => (prev > 0 ? prev - 1 : stages.length - 1))}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-xs border border-slate-800 transition cursor-pointer"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setSelectedStage((prev) => (prev < stages.length - 1 ? prev + 1 : 0))}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs shadow transition cursor-pointer"
                >
                  Next Step →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROBLEM STATEMENT VS SOLUTION */}
        {activeTab === 'problem-solution' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Problem Box */}
              <div className="p-4 bg-rose-950/20 border border-rose-500/40 rounded-xl space-y-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  <h3 className="text-sm font-bold text-rose-300 uppercase tracking-wide">
                    The Problem Statement: The $35B Cold-Chain Blindspot
                  </h3>
                </div>
                
                <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-rose-300">1. Silent In-Transit Spoilage:</strong> Over 12% of perishable reefer shipments experience temperature excursions (compressor trip, door seal failure, driver error). Shippers and drivers only find out 18–36 hours later when the grocery distribution center rejects the trailer at the receiving dock.
                  </p>
                  <p>
                    <strong className="text-rose-300">2. All-or-Nothing Rejection:</strong> A minor failure in Zone A (4 pallets) frequently triggers receiver rejection of the entire $80,000+ multi-zone trailer due to strict supermarket DC shelf-life tolerances.
                  </p>
                  <p>
                    <strong className="text-rose-300">3. Triple Financial & Environmental Penalty:</strong>
                    Shippers suffer 100% cargo write-off, pay $2,200+ in landfill disposal tipping fees, spike insurance loss ratios, and emit thousands of pounds of methane (CH4) gas into landfills.
                  </p>
                </div>

                <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-lg text-rose-200 text-xs font-mono">
                  Average Loss Per Incident: <span className="font-bold text-rose-400">-$20,600 USD</span> + 14.8 MT CO2e Methane
                </div>
              </div>

              {/* Solution Box */}
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/40 rounded-xl space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wide">
                    The Solution: ColdRescue Autonomous Perishable Arbitrage
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-emerald-300">1. Sub-Second Pub/Sub Telematics:</strong> Captures multi-zone IoT sensor streams (temperature, humidity, ethylene gas) and calculates real-time Arrhenius chemical shelf-life decay curves within seconds of breach.
                  </p>
                  <p>
                    <strong className="text-emerald-300">2. BigQuery GIS Spatial Off-Taker Matching:</strong> Dynamically scans registered industrial processors (puree plants, juice/cider mills, bakeries, flash grocers, food banks) along the truck's immediate transit corridor (&lt;35 mi detour).
                  </p>
                  <p>
                    <strong className="text-emerald-300">3. Surgical Reroute & 1-Click Handshake:</strong> Generates automated e-BOL reclassification, sends in-cab waypoints to the driver, unloads the 4 endangered pallets at the buyer in 20 minutes, and allows the remaining 16 pallets to continue undisturbed.
                  </p>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-200 text-xs font-mono">
                  Average Net Recovery Per Incident: <span className="font-bold text-emerald-400">+$12,670 USD</span> + 100% Cargo Preserved
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: QUANTIFIED ROI & SAVINGS BREAKDOWN */}
        {activeTab === 'economics' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    Detailed Financial Breakdown: Status Quo vs. ColdRescue AI
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-500/30">
                  +$33,270 Total Net Swing
                </span>
              </div>

              {/* Comparative Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
                  <thead className="bg-slate-900 text-slate-300 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3 border-b border-slate-800">Financial / ESG Metric</th>
                      <th className="p-3 border-b border-slate-800 text-rose-400">Traditional Status Quo (Landfill)</th>
                      <th className="p-3 border-b border-slate-800 text-emerald-400">ColdRescue AI Salvage</th>
                      <th className="p-3 border-b border-slate-800 text-teal-300">Net Dollar Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-sans text-slate-200 font-semibold">Endangered Cargo Value (4 Pallets Cherries)</td>
                      <td className="p-3 text-rose-400 font-bold">-$18,400 (100% Write-off)</td>
                      <td className="p-3 text-emerald-400 font-bold">+$9,200 (Salvage Bid @ $1.15/lb)</td>
                      <td className="p-3 text-teal-300 font-bold">+$9,200 cash yield</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-sans text-slate-200 font-semibold">Landfill Disposal & Tipping Fee</td>
                      <td className="p-3 text-rose-400 font-bold">-$2,200</td>
                      <td className="p-3 text-emerald-400 font-bold">$0 (Eliminated)</td>
                      <td className="p-3 text-teal-300 font-bold">+$2,200 fee saved</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-sans text-slate-200 font-semibold">Detour Fuel & Driver Time</td>
                      <td className="p-3 text-slate-400">$0 (Drove to failure)</td>
                      <td className="p-3 text-amber-300">-$38.50 (18.4 mi detour @ $4.10/gal)</td>
                      <td className="p-3 text-slate-400">-$38.50 operational cost</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-sans text-slate-200 font-semibold">Primary Load Continuity (Remaining 16 Pallets)</td>
                      <td className="p-3 text-rose-400 font-bold">High Risk of Full Rejection ($64k)</td>
                      <td className="p-3 text-emerald-400 font-bold">100% Preserved & Delivered On-Time</td>
                      <td className="p-3 text-teal-300 font-bold">Zero primary penalty</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-sans text-slate-200 font-semibold">Insurance Deductible & Loss Ratio Penalty</td>
                      <td className="p-3 text-rose-400 font-bold">-$2,500 claim fee</td>
                      <td className="p-3 text-emerald-400 font-bold">$0 (No claim filed)</td>
                      <td className="p-3 text-teal-300 font-bold">+$2,500 premium saved</td>
                    </tr>
                    <tr className="bg-slate-900/80 font-bold text-xs">
                      <td className="p-3 font-sans text-slate-100">NET BOTTOM-LINE RESULT</td>
                      <td className="p-3 text-rose-400 text-sm font-extrabold">-$20,600 Loss</td>
                      <td className="p-3 text-emerald-400 text-sm font-extrabold">+$12,670 Net Recovery</td>
                      <td className="p-3 text-teal-300 text-sm font-extrabold">+$33,270 Net ROI</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ESG & Environmental Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Avoided Methane</span>
                  <span className="text-lg font-bold text-emerald-400">14.8 MT CO2e</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">8,000 lbs organic produce diverted from landfill</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Carbon Return on Detour Fuel</span>
                  <span className="text-lg font-bold text-purple-400">32 : 1 Ratio</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">32 kg carbon saved per 1 kg diesel burned</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Fleet Scale (100 Trucks/Yr)</span>
                  <span className="text-lg font-bold text-teal-300">$1.26M Annual Recovery</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Based on 1.2 thermal incidents per truck/year</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Built on Google Cloud Pub/Sub, BigQuery GIS, Dataplex, and Gemini 3.7</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition cursor-pointer"
          >
            Got it, take me back to the app
          </button>
        </div>
      </div>
    </div>
  );
};
