import React from 'react';
import { 
  Radio, 
  Thermometer, 
  Wind, 
  AlertTriangle
} from 'lucide-react';
import { PubSubSensorTelemetry } from '../types';

interface PubSubLiveStreamViewProps {
  telemetryLogs: PubSubSensorTelemetry[];
  onInjectSpike: () => void;
}

export const PubSubLiveStreamView: React.FC<PubSubLiveStreamViewProps> = ({
  telemetryLogs,
  onInjectSpike,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-500/30">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            </span>
            <h2 className="text-base font-bold text-slate-100 tracking-tight">
              Google Cloud Pub/Sub: Streaming Cold Chain Telemetry
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time subscriber stream ingesting multi-zone reefer telemetry every 5 seconds.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onInjectSpike}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold transition active:scale-95 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            Inject Live Sensor Anomaly Event
          </button>
        </div>
      </div>

      {/* Stream Messages Table */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Active Ingestion Log (Sub: <code className="text-emerald-300">coldrescue-telemetry-sub</code>)</span>
          <span className="text-[11px] font-mono text-slate-500">{telemetryLogs.length} Messages Ingested</span>
        </div>

        <div className="space-y-2">
          {telemetryLogs.map((log) => {
            const isCritical = log.priority === 'CRITICAL';
            const isWarning = log.priority === 'WARNING';
            return (
              <div 
                key={log.messageId}
                className={`p-3.5 rounded-xl border font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isCritical 
                    ? 'bg-rose-950/30 border-rose-500/50 text-rose-200' 
                    : isWarning 
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                    isCritical 
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/60' 
                      : isWarning
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/60'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {log.priority}
                  </span>
                  <div>
                    <span className="text-slate-100 font-bold">{log.sensorId}</span>
                    <span className="text-slate-400 text-[11px] ml-2">({log.compartmentId} • {log.truckId})</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center flex-wrap gap-3 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                    Temp: <strong className={isCritical ? 'text-rose-400 font-extrabold text-xs' : 'text-slate-200'}>{log.metrics.tempC}°C</strong>
                  </span>
                  <span>Humidity: <strong>{log.metrics.humidityPct}%</strong></span>
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-amber-400" />
                    Ethylene: <strong>{log.metrics.ethylenePpm} ppm</strong>
                  </span>
                  <span className="text-slate-400">Power: <strong className="text-slate-200">{log.metrics.reeferPowerStatus}</strong></span>
                </div>

                <div className="text-slate-500 text-[10px] text-right shrink-0">
                  {log.timestamp}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
