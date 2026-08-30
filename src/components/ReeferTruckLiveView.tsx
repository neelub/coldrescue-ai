import React from 'react';
import { 
  Truck, 
  Thermometer, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Activity, 
  Zap,
  Sparkles,
  ShieldCheck,
  Leaf,
  Send,
  ArrowRight
} from 'lucide-react';
import { RefrigeratedTruck, OffTakerBuyer } from '../types';

interface ReeferTruckLiveViewProps {
  fleetTrucks: RefrigeratedTruck[];
  selectedTruckId: string;
  onSelectTruck: (truckId: string) => void;
  truck: RefrigeratedTruck;
  onSimulateBreach: (compartmentId: string) => void;
  onTriggerRescue: () => void;
  isSolving: boolean;
  offTakers: OffTakerBuyer[];
  selectedOffTaker: OffTakerBuyer | null;
  onSelectOffTaker: (buyer: OffTakerBuyer) => void;
  onConfirmHandshake: (buyer: OffTakerBuyer) => void;
  isHandshakeDone: boolean;
  onCompleteDropoff: (buyer: OffTakerBuyer) => void;
  isDropoffComplete: boolean;
}

export const ReeferTruckLiveView: React.FC<ReeferTruckLiveViewProps> = ({
  fleetTrucks,
  selectedTruckId,
  onSelectTruck,
  truck,
  onSimulateBreach,
  onTriggerRescue,
  isSolving,
  offTakers,
  selectedOffTaker,
  onSelectOffTaker,
  onConfirmHandshake,
  isHandshakeDone,
  onCompleteDropoff,
  isDropoffComplete,
}) => {
  const hasBreachedCompartment = truck.compartments.some(c => c.status === 'CRITICAL_BREACH');
  const breachedComp = truck.compartments.find(c => c.status === 'CRITICAL_BREACH') || truck.compartments[0];

  return (
    <div className="space-y-6">
      {/* 5-Truck Real-Time Fleet Command Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-500/40">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            </span>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Active Refrigerated Fleet Monitor (5 Live Interstate Reefer Units)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Click any truck below to inspect its multi-zone twin & telemetry
          </span>
        </div>

        {/* 5 Truck Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {fleetTrucks.map((trk) => {
            const isSelected = trk.id === selectedTruckId;
            const isBreached = trk.compartments.some(c => c.status === 'CRITICAL_BREACH');
            const totalValue = trk.compartments.reduce((acc, c) => acc + c.marketValueUSD, 0);
            const mainCommodity = trk.compartments[0]?.commodity.split('(')[0].trim() || 'Produce';

            return (
              <button
                key={trk.id}
                onClick={() => onSelectTruck(trk.id)}
                className={`p-3 rounded-xl border text-left transition relative cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-emerald-950/50 border-emerald-500 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500'
                    : isBreached
                    ? 'bg-rose-950/30 border-rose-500/50 hover:bg-rose-950/50'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-100 block">{trk.truckNumber}</span>
                    <span className="text-[10px] font-mono text-slate-400">{trk.id}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${
                    isBreached 
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/60 animate-pulse' 
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {isBreached ? 'BREACH' : 'OPTIMAL'}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="text-[11px] font-semibold text-emerald-300 truncate">
                    {mainCommodity}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {trk.currentLocationName.split('(')[1]?.replace(')', '') || trk.currentLocationName}
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{trk.speedMph} MPH</span>
                  <span className="font-mono text-slate-300 font-semibold">${(totalValue / 1000).toFixed(1)}k</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Truck Detail View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Header with Truck Telemetry Status */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-100">{truck.truckNumber}</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-slate-300 rounded border border-slate-700">
                  {truck.id}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Pub/Sub Telemetry Stream
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Carrier: <span className="text-slate-200">{truck.carrierName}</span> • Driver: <span className="text-slate-200">{truck.driverName}</span> • Speed: <span className="text-emerald-400 font-mono font-semibold">{truck.speedMph} MPH</span>
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={() => onSimulateBreach(truck.compartments[0]?.id || 'COMP-A')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border transition active:scale-95 cursor-pointer shadow-md ${
                truck.compartments[0]?.status === 'CRITICAL_BREACH'
                  ? 'bg-rose-900/60 border-rose-500/80 text-rose-200 hover:bg-rose-900'
                  : 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 border-rose-500/50 text-rose-300 hover:bg-rose-500/30'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
              {truck.compartments[0]?.status === 'CRITICAL_BREACH' 
                ? `Reset ${truck.compartments[0]?.name.split('(')[0]} to Optimal (${truck.compartments[0]?.targetTempC}°C)` 
                : `⚡ Simulate ${truck.compartments[0]?.name.split('(')[0]} Anomaly (+11.8°C)`}
            </button>

            <button
              onClick={onTriggerRescue}
              disabled={isSolving}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/40 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSolving ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-slate-950" />
                  Agents Deliberating Rescue...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-slate-950" />
                  Deploy Multi-Agent Rescue Optimizer
                </>
              )}
            </button>
          </div>
        </div>

        {/* Geospatial Route Bar */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Current GPS Location</span>
              <p className="text-slate-200 font-medium">{truck.currentLocationName}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Remaining to Final Receiver DC</span>
              <p className="text-slate-200 font-medium">{truck.distanceToDestinationMiles} miles (~{truck.estimatedArrivalHours} hrs)</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Activity className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Origin & Destination</span>
              <p className="text-slate-300 text-[11px] truncate">{truck.origin} ➔ {truck.originalDestination}</p>
            </div>
          </div>
        </div>

        {/* Multi-Compartment 53-ft Trailer Visual Twin */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              Multi-Zone 53-ft Reefer Digital Twin (Pallet-Level Granularity)
            </h3>
            <span className="text-[11px] text-slate-400">
              Total Load: {truck.totalCapacityPallets} Pallets ({truck.compartments.reduce((a, b) => a + b.totalPounds, 0).toLocaleString()} lbs) • ${truck.compartments.reduce((a, b) => a + b.marketValueUSD, 0).toLocaleString()} USD Inventory Value
            </span>
          </div>

          {/* The 3 Compartment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {truck.compartments.map((comp) => {
              const isBreached = comp.status === 'CRITICAL_BREACH';
              const isSalvaged = comp.status === 'SALVAGED' || comp.quantityPallets === 0;
              return (
                <div 
                  key={comp.id}
                  className={`p-4 rounded-xl border transition relative flex flex-col justify-between ${
                    isBreached 
                      ? 'bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-950/20' 
                      : isSalvaged
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  {/* Status Indicator Tag */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">{comp.name}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                      isBreached 
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/60 animate-pulse' 
                        : isSalvaged
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {isBreached ? 'CRITICAL THERMAL BREACH' : isSalvaged ? '✓ SALVAGED & OFFLOADED' : 'OPTIMAL'}
                    </span>
                  </div>

                  {/* Commodity Info */}
                  <div className="space-y-1 my-2">
                    <div className="text-sm font-bold text-slate-100">{comp.commodity}</div>
                    <div className="text-[11px] text-slate-400">
                      {isSalvaged ? (
                        <span className="text-emerald-300 font-semibold">
                          0 Pallets Remaining (4 Pallets Offloaded at Salvage Partner Dock)
                        </span>
                      ) : (
                        `${comp.quantityPallets} Pallets • ${comp.totalPounds.toLocaleString()} lbs • `
                      )}
                      {!isSalvaged && (
                        <span className="text-slate-200 font-semibold">${comp.marketValueUSD.toLocaleString()} USD</span>
                      )}
                    </div>
                  </div>

                  {/* Live Sensor Metrics Grid */}
                  <div className="grid grid-cols-3 gap-1.5 p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 text-center my-3">
                    <div>
                      <span className="text-[9px] text-slate-400 block flex items-center justify-center gap-0.5">
                        <Thermometer className="w-2.5 h-2.5" /> Temp
                      </span>
                      <span className={`font-mono text-xs font-bold ${
                        isBreached ? 'text-rose-400 text-sm animate-pulse' : isSalvaged ? 'text-slate-400' : 'text-emerald-400'
                      }`}>
                        {isSalvaged ? '--' : `${comp.currentTempC}°C`}
                      </span>
                      <span className="text-[8px] text-slate-500 block">Target: {comp.targetTempC}°C</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 block flex items-center justify-center gap-0.5">
                        <Droplets className="w-2.5 h-2.5" /> Humidity
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-200">
                        {isSalvaged ? '--' : `${comp.currentHumidityPct}%`}
                      </span>
                      <span className="text-[8px] text-slate-500 block">Target: {comp.targetHumidityPct}%</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 block flex items-center justify-center gap-0.5">
                        <Wind className="w-2.5 h-2.5" /> Ethylene
                      </span>
                      <span className={`font-mono text-xs font-bold ${
                        isSalvaged ? 'text-slate-400' : comp.ethylenePpm > 2.0 ? 'text-amber-400' : 'text-slate-300'
                      }`}>
                        {isSalvaged ? '0.0 ppm' : `${comp.ethylenePpm} ppm`}
                      </span>
                      <span className="text-[8px] text-slate-500 block">{isSalvaged ? 'Zone Empty' : 'Gas Decay'}</span>
                    </div>
                  </div>

                  {/* Remaining Shelf Life (RSL) Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Compartment Payload:</span>
                      <span className={`font-mono font-bold ${
                        isBreached ? 'text-rose-400' : isSalvaged ? 'text-emerald-400' : 'text-emerald-400'
                      }`}>
                        {isSalvaged ? '0 / 4 Pallets (Empty)' : `${comp.quantityPallets} / 4 Pallets`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isBreached ? 'bg-rose-500 w-[18%]' : isSalvaged ? 'bg-slate-700 w-0' : 'bg-emerald-400 w-[85%]'
                        }`}
                      />
                    </div>
                    {isBreached && (
                      <div className="text-[10px] text-rose-300 flex items-center gap-1 font-semibold pt-1">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        Will spoil before arrival at final DC ({truck.estimatedArrivalHours} hrs remaining + intake).
                      </div>
                    )}
                    {isSalvaged && (
                      <div className="text-[10px] text-emerald-300 flex items-center gap-1 font-semibold pt-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Offloaded & verified. Remaining {truck.totalCapacityPallets - comp.quantityPallets} pallets en route.
                      </div>
                    )}
                  </div>

                  {/* Simulation Toggle Button */}
                  <div className="mt-4 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => onSimulateBreach(comp.id)}
                      className={`w-full py-1.5 text-[11px] font-bold rounded transition cursor-pointer border ${
                        isBreached
                          ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border-rose-500/60'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {isBreached ? `Reset ${comp.name.split('(')[0]} to Optimal (${comp.targetTempC}°C)` : `Simulate ${comp.name.split('(')[0]} Thermal Anomaly (+11.8°C)`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Multi-Candidate Salvage Off-Takers Section - ONLY shown when an active breach is detected */}
        {hasBreachedCompartment ? (
          <div className="space-y-4 pt-2">
            {/* Top Breach Action Banner */}
            <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 ${
              isHandshakeDone
                ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/30'
                : 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/20 animate-pulse'
            }`}>
              <div className="flex items-start sm:items-center space-x-3">
                <div className={`p-2.5 rounded-lg border text-base shrink-0 ${
                  isHandshakeDone
                    ? 'bg-emerald-900/80 border-emerald-500 text-emerald-300'
                    : 'bg-rose-900/80 border-rose-500 text-rose-300'
                }`}>
                  {isHandshakeDone ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isHandshakeDone
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                        : 'bg-rose-950 text-rose-300 border-rose-500/60'
                    }`}>
                      {isHandshakeDone ? '✓ RESCUE DETOUR DISPATCHED' : '⚡ RESCUE DETOUR PENDING DISPATCH'}
                    </span>
                    <span className="text-xs font-bold text-slate-100">
                      {breachedComp.name.split('(')[0]}: {breachedComp.quantityPallets} Pallets ({breachedComp.totalPounds.toLocaleString()} lbs {breachedComp.commodity})
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {isHandshakeDone ? (
                      <>
                        Handshake confirmed with <strong className="text-emerald-300">{selectedOffTaker?.name}</strong>. Waypoint pushed to in-cab GPS. {truck.totalCapacityPallets - breachedComp.quantityPallets} unaffected pallets continue to primary receiver.
                      </>
                    ) : (
                      <>
                        Thermal excursion will spoil cargo in <strong>{breachedComp.currentRemainingShelfLifeHours} hours</strong>. BigQuery GIS identified <strong className="text-emerald-300">{offTakers.length} certified off-takers</strong> within detour range. Select a buyer below:
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`px-3 py-1.5 text-xs font-extrabold rounded-lg shadow inline-block ${
                  isHandshakeDone
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-rose-600 text-white'
                }`}>
                  {isHandshakeDone
                    ? `${breachedComp.quantityPallets} Pallets Routed to Salvage`
                    : `${breachedComp.quantityPallets} Pallets Targeted for Salvage`}
                </span>
              </div>
            </div>

            {/* In-Cab Driver Reroute & Dock Offload Controller (Visible after Handshake Dispatch) */}
            {isHandshakeDone && selectedOffTaker && (
              <div className="bg-slate-900 border border-emerald-500/60 rounded-xl p-4 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Driver In-Cab Telematics & Active Waypoint Execution
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    Samsara / ELD Connected • Waypoint Pushed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Detour Destination:</span>
                    <p className="font-bold text-slate-100 mt-0.5">{selectedOffTaker.name}</p>
                    <span className="text-[10px] text-slate-400">{selectedOffTaker.dockAvailability}</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">In-Cab ETA & Mileage:</span>
                    <p className="font-mono font-bold text-emerald-400 mt-0.5">
                      +{selectedOffTaker.detourTimeMinutes} Mins ({selectedOffTaker.distanceMilesFromTruck} Miles)
                    </p>
                    <span className="text-[10px] text-slate-400">Diesel Overhead: -${selectedOffTaker.extraFuelCostUSD} USD</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Digital Chain of Custody:</span>
                    <p className="font-mono font-bold text-blue-400 mt-0.5">eBOL-{truck.id.replace('TRK-', '')}-SALVAGE-01</p>
                    <span className="text-[10px] text-teal-300">FDA FSMA Reclassified (Grade-B)</span>
                  </div>
                </div>

                {/* Confirm Physical Drop-off / Dock Scan Button */}
                <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-[11px] text-slate-400">
                    Once the truck arrives at the off-taker dock, click below to simulate the receiver RFID pallet barcode scan and unload the cargo.
                  </p>

                  <button
                    onClick={() => onCompleteDropoff(selectedOffTaker)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs rounded-lg shadow-lg shadow-emerald-950/40 transition active:scale-95 cursor-pointer flex items-center gap-2 shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    Simulate Dock Arrival & RFID Pallet Offload
                  </button>
                </div>
              </div>
            )}

            {/* Candidate Off-Takers Comparison Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Nearby Off-Taker Candidates (Spatial Ranking & Financial Arbitrage)
                </span>
                <span className="text-[11px] text-slate-400">
                  Click any option to preview economic yield & dispatch
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {offTakers.map((buyer) => {
                  const isSelected = selectedOffTaker?.id === buyer.id;
                  return (
                    <div
                      key={buyer.id}
                      onClick={() => onSelectOffTaker(buyer)}
                      className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 relative ${
                        isSelected
                          ? isHandshakeDone
                            ? 'bg-emerald-950/50 border-emerald-500 shadow-lg shadow-emerald-950/40 ring-2 ring-emerald-500/60'
                            : 'bg-slate-900 border-emerald-500 shadow-lg ring-1 ring-emerald-500/40'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      {/* Card Top */}
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-950 text-blue-300 border border-blue-600/30 rounded truncate">
                            {buyer.category}
                          </span>
                          <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                            Match: {buyer.matchScore}%
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-100 mt-2 line-clamp-1">{buyer.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Detour: <span className="text-slate-200 font-semibold">{buyer.distanceMilesFromTruck} mi ({buyer.detourTimeMinutes} mins)</span>
                        </p>
                      </div>

                      {/* Financial Yield & Carbon */}
                      <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1">
                        <div className="flex justify-between text-slate-300 text-[11px]">
                          <span>Net Recovery:</span>
                          <span className="font-bold text-emerald-400">${buyer.netFinancialRecoveryUSD.toLocaleString()} USD</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[10px]">
                          <span>Salvage Bid:</span>
                          <span className="font-mono text-slate-300">${buyer.salvageBidPerLbUSD.toFixed(2)} / lb</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[10px]">
                          <span>Avoided Methane:</span>
                          <span className="text-teal-300 font-semibold">{buyer.avoidedMethaneEmissionsMT} MT CO2e</span>
                        </div>
                        <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400 truncate">
                          Dock: <span className="text-slate-200 font-mono">{buyer.dockAvailability}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOffTaker(buyer);
                          onConfirmHandshake(buyer);
                        }}
                        className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          isSelected && isHandshakeDone
                            ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default'
                            : isSelected
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow active:scale-95'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500 active:scale-95'
                        }`}
                      >
                        {isSelected && isHandshakeDone ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Dock Reserved & Dispatched
                          </>
                        ) : isSelected ? (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            1-Click Dispatch Handshake
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-3.5 h-3.5" />
                            Select Candidate
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Fleet Reefer Status: Optimal (No Detour Needed)
                </span>
                <h4 className="text-sm font-semibold text-slate-200">
                  All 3 compartments in {truck.truckNumber} are within strict temperature & gas thresholds.
                </h4>
                <p className="text-[11px] text-slate-500">
                  En route directly to primary receiver: <span className="text-slate-300">{truck.originalDestination}</span> (ETA ~{truck.estimatedArrivalHours}h).
                </p>
              </div>
            </div>

            <button
              onClick={() => onSimulateBreach(truck.compartments[0]?.id || 'COMP-A')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Simulate Zone Anomaly to Trigger Salvage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
