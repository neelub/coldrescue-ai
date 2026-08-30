import React, { useState } from 'react';
import { 
  Database, 
  MapPin, 
  Leaf, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Send,
  Truck,
  Download,
  Copy,
  ExternalLink,
  BarChart3,
  FileText
} from 'lucide-react';
import { OffTakerBuyer, BigQueryAnalyticsMetric, RefrigeratedTruck, SalvageLedgerRecord } from '../types';

interface BigQueryAndOffTakerViewProps {
  offTakers: OffTakerBuyer[];
  selectedOffTaker: OffTakerBuyer | null;
  onSelectOffTaker: (buyer: OffTakerBuyer) => void;
  metrics: BigQueryAnalyticsMetric[];
  onConfirmHandshake: (buyer: OffTakerBuyer) => void;
  isHandshakeDone: boolean;
  truck?: RefrigeratedTruck;
  salvageLedger: SalvageLedgerRecord[];
}

export const BigQueryAndOffTakerView: React.FC<BigQueryAndOffTakerViewProps> = ({
  offTakers,
  selectedOffTaker,
  onSelectOffTaker,
  metrics,
  onConfirmHandshake,
  isHandshakeDone,
  truck,
  salvageLedger,
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeLedgerTab, setActiveLedgerTab] = useState<'records' | 'looker-sql' | 'schema'>('records');

  const totalDollarsRecovered = salvageLedger.reduce((acc, curr) => acc + curr.netFinancialRecoveryUSD, 0);
  const totalLbsSalvaged = salvageLedger.reduce((acc, curr) => acc + curr.totalPounds, 0);
  const totalMethaneAvoided = salvageLedger.reduce((acc, curr) => acc + curr.avoidedMethaneMT, 0);

  const lookerStudioSql = `-- Google Looker Studio / Data Studio Connected SQL Query
-- Source: BigQuery dataset: coldrescue_prod.salvage_ledger
SELECT 
  id AS transaction_id,
  DATE(timestamp) AS dropoff_date,
  truck_number,
  carrier_name,
  commodity,
  pallets_offloaded,
  total_pounds_salvaged,
  salvage_facility_name,
  salvage_category,
  salvage_location,
  salvage_bid_per_lb_usd,
  gross_payout_usd,
  detour_fuel_cost_usd,
  net_financial_recovery_usd,
  avoided_landfill_fee_usd,
  (net_financial_recovery_usd + avoided_landfill_fee_usd) AS total_economic_benefit_usd,
  avoided_methane_mt_co2e,
  ebol_number,
  status
FROM \`coldrescue_prod.salvage_ledger\`
ORDER BY timestamp DESC;`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(lookerStudioSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleDownloadCsv = () => {
    const headers = [
      'Transaction ID',
      'Timestamp',
      'Truck',
      'Carrier',
      'Driver',
      'Commodity',
      'Pallets Offloaded',
      'Pounds',
      'Drop-Off Facility',
      'Category',
      'Location',
      'Salvage Bid ($/lb)',
      'Gross Payout ($)',
      'Detour Fuel ($)',
      'Net Recovery ($)',
      'Avoided Landfill Fee ($)',
      'Avoided Methane (MT CO2e)',
      'e-BOL Reference',
      'Status'
    ];

    const rows = salvageLedger.map(r => [
      r.id,
      r.timestamp,
      r.truckNumber,
      r.carrierName,
      r.driverName,
      `"${r.commodity}"`,
      r.palletsOffloaded,
      r.totalPounds,
      `"${r.salvageFacilityName}"`,
      `"${r.salvageCategory}"`,
      `"${r.salvageLocation}"`,
      r.salvageBidPerLbUSD,
      r.grossPayoutUSD,
      r.detourFuelCostUSD,
      r.netFinancialRecoveryUSD,
      r.avoidedLandfillFeeUSD,
      r.avoidedMethaneMT,
      r.ebolNumber,
      r.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ColdRescue_Sender_Salvage_Ledger_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Section: BigQuery Analytics KPIs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              BigQuery Enterprise Telemetry & ESG Analytics
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Dataset: <code className="text-blue-300">coldrescue_prod.financial_arbitrage</code>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block font-medium">{metric.metricName}</span>
              <div className="text-lg font-extrabold text-slate-100">{metric.value}</div>
              <div className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {metric.trend}
              </div>
              <p className="text-[10px] text-slate-500 pt-1 leading-tight">{metric.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SENDER DATA STUDIO / LOOKER STUDIO DASHBOARD & SALVAGE LEDGER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Sender Executive Portal • Looker Studio & BigQuery Salvage Ledger
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/40 rounded-full">
                Zero-ETL Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              All drop-offs, off-taker locations, financial recoveries, and carbon avoidance are recorded in BigQuery table <code className="text-blue-300">coldrescue_prod.salvage_ledger</code> for instant Google Looker Studio / Data Studio visualization.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Export CSV for BI
            </button>
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-950 hover:bg-purple-900 text-purple-200 text-xs font-bold rounded-lg border border-purple-500/50 shadow transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-purple-300" />
              {copiedSql ? '✓ Copied SQL to Clipboard!' : 'Copy Looker Studio Query'}
            </button>
          </div>
        </div>

        {/* Sender Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Total Net Value Recovered</span>
            <div className="text-xl font-extrabold text-emerald-400 mt-0.5">
              ${totalDollarsRecovered.toLocaleString()} USD
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">From {salvageLedger.length} completed surgical drop-offs</p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Total Produce Salvaged</span>
            <div className="text-xl font-extrabold text-slate-100 mt-0.5">
              {totalLbsSalvaged.toLocaleString()} lbs
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">{salvageLedger.reduce((a, c) => a + c.palletsOffloaded, 0)} pallets diverted from landfills</p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Avoided Methane Emissions</span>
            <div className="text-xl font-extrabold text-teal-400 mt-0.5">
              {totalMethaneAvoided.toFixed(1)} MT CO2e
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">EPA WARM Verified & Scope-3 ESG reportable</p>
          </div>
        </div>

        {/* Tabs for Ledger vs SQL */}
        <div className="flex border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveLedgerTab('records')}
            className={`px-4 py-2 font-semibold border-b-2 transition cursor-pointer ${
              activeLedgerTab === 'records'
                ? 'border-purple-400 text-purple-300 bg-purple-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📋 Dropped-Off Salvage Transactions ({salvageLedger.length})
          </button>
          <button
            onClick={() => setActiveLedgerTab('looker-sql')}
            className={`px-4 py-2 font-semibold border-b-2 transition cursor-pointer ${
              activeLedgerTab === 'looker-sql'
                ? 'border-purple-400 text-purple-300 bg-purple-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🔍 Looker Studio SQL Template
          </button>
          <button
            onClick={() => setActiveLedgerTab('schema')}
            className={`px-4 py-2 font-semibold border-b-2 transition cursor-pointer ${
              activeLedgerTab === 'schema'
                ? 'border-purple-400 text-purple-300 bg-purple-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 BigQuery Table Schema
          </button>
        </div>

        {/* Active Tab Content */}
        {activeLedgerTab === 'records' && (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Transaction / e-BOL</th>
                  <th className="py-2.5 px-3">Truck & Driver</th>
                  <th className="py-2.5 px-3">Commodity & Pallets</th>
                  <th className="py-2.5 px-3">Drop-Off Facility & Location</th>
                  <th className="py-2.5 px-3 text-right">Net Recovery ($)</th>
                  <th className="py-2.5 px-3 text-right">Avoided CO2e</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/60 font-mono text-[11px]">
                {salvageLedger.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-850 transition">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-200 block">{record.id}</span>
                      <span className="text-[10px] text-blue-400">{record.ebolNumber}</span>
                      <span className="text-[9px] text-slate-500 block">{record.timestamp}</span>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <div className="font-semibold text-slate-200">{record.truckNumber}</div>
                      <div className="text-[10px] text-slate-400">Driver: {record.driverName}</div>
                      <div className="text-[9px] text-slate-500 truncate">{record.carrierName}</div>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <div className="font-semibold text-slate-200">{record.commodity}</div>
                      <div className="text-[10px] text-emerald-400 font-mono font-bold">
                        {record.palletsOffloaded} Pallets ({record.totalPounds.toLocaleString()} lbs)
                      </div>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <div className="font-semibold text-purple-300">{record.salvageFacilityName}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                        {record.salvageLocation}
                      </div>
                      <span className="text-[9px] text-slate-500">{record.salvageCategory}</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="font-bold text-emerald-400 text-xs">
                        +${record.netFinancialRecoveryUSD.toLocaleString()}
                      </div>
                      <div className="text-[9px] text-slate-400">
                        (${record.salvageBidPerLbUSD.toFixed(2)}/lb - ${record.detourFuelCostUSD} fuel)
                      </div>
                      <div className="text-[9px] text-slate-500">
                        +${record.avoidedLandfillFeeUSD} fee saved
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-teal-300 font-bold">{record.avoidedMethaneMT} MT</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 text-[9px] font-extrabold rounded uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                        {record.status === 'OFFLOADED_VERIFIED' ? '✓ Verified' : record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeLedgerTab === 'looker-sql' && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">Copy and paste this query into Google Looker Studio / Data Studio custom query connector:</span>
              <button
                onClick={handleCopySql}
                className="px-2.5 py-1 bg-purple-900 hover:bg-purple-800 text-purple-200 text-xs font-bold rounded flex items-center gap-1 transition"
              >
                <Copy className="w-3 h-3" />
                {copiedSql ? 'Copied!' : 'Copy SQL'}
              </button>
            </div>
            <pre className="p-3 bg-slate-900 rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto border border-slate-800">
              {lookerStudioSql}
            </pre>
          </div>
        )}

        {activeLedgerTab === 'schema' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="font-mono text-blue-400 font-bold">coldrescue_prod.salvage_ledger</span>
              <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                <li><code className="text-slate-200">id</code>: STRING (Transaction UUID)</li>
                <li><code className="text-slate-200">timestamp</code>: TIMESTAMP (Drop-off confirmation UTC)</li>
                <li><code className="text-slate-200">truck_id</code> / <code className="text-slate-200">truck_number</code>: STRING</li>
                <li><code className="text-slate-200">commodity</code>: STRING</li>
                <li><code className="text-slate-200">pallets_offloaded</code>: INT64</li>
                <li><code className="text-slate-200">total_pounds</code>: FLOAT64</li>
                <li><code className="text-slate-200">salvage_facility_name</code>: STRING</li>
                <li><code className="text-slate-200">salvage_coordinates</code>: GEOGRAPHY</li>
              </ul>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="font-mono text-emerald-400 font-bold">Financial & ESG Columns</span>
              <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                <li><code className="text-slate-200">salvage_bid_per_lb_usd</code>: NUMERIC</li>
                <li><code className="text-slate-200">gross_payout_usd</code>: NUMERIC</li>
                <li><code className="text-slate-200">detour_fuel_cost_usd</code>: NUMERIC</li>
                <li><code className="text-slate-200">net_financial_recovery_usd</code>: NUMERIC</li>
                <li><code className="text-slate-200">avoided_landfill_fee_usd</code>: NUMERIC</li>
                <li><code className="text-slate-200">avoided_methane_mt_co2e</code>: FLOAT64</li>
                <li><code className="text-slate-200">ebol_number</code>: STRING (Digital signature token)</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Off-Taker Matching Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                BigQuery Spatial Off-Taker Directory (Standby & Active Corridors)
              </h3>
              {truck && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                  truck.compartments.some(c => c.status === 'CRITICAL_BREACH')
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/60 animate-pulse'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {truck.compartments.some(c => c.status === 'CRITICAL_BREACH') ? 'Active Excursion Detected' : 'Standby Mode (All Zones Optimal)'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {truck ? (
                <>
                  Evaluating standby off-taker candidates for <strong className="text-slate-200">{truck.truckNumber} ({truck.id})</strong> along <span className="text-emerald-300">{truck.currentLocationName}</span>.
                </>
              ) : (
                'Filtered for verified industrial cold storage capacity and FSMA food processing certification.'
              )}
            </p>
          </div>

          <span className="px-2.5 py-1 text-xs font-semibold bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
            {offTakers.length} Qualified Facilities Mapped
          </span>
        </div>

        {/* The Buyer Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {offTakers.map((buyer) => {
            const isSelected = selectedOffTaker?.id === buyer.id;
            return (
              <div
                key={buyer.id}
                onClick={() => onSelectOffTaker(buyer)}
                className={`p-5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected 
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/30' 
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-600/30 rounded">
                      {buyer.category}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      Match: {buyer.matchScore}%
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mt-2">{buyer.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Detour: <span className="text-slate-200 font-semibold">{buyer.distanceMilesFromTruck} mi ({buyer.detourTimeMinutes} mins)</span>
                  </p>
                </div>

                {/* Financial Recovery Breakdown */}
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-300">
                    <span>Salvage Purchase Price:</span>
                    <span className="font-bold text-emerald-400">${buyer.salvageBidPerLbUSD.toFixed(2)} / lb</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Gross Cash Payout:</span>
                    <span className="font-bold text-slate-100">${buyer.estimatedPayoutUSD.toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Extra Detour Diesel Cost:</span>
                    <span className="text-rose-400">-${buyer.extraFuelCostUSD} USD</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-800 flex justify-between font-bold text-slate-100">
                    <span>Net Financial Recovery:</span>
                    <span className="text-emerald-400 text-sm">${buyer.netFinancialRecoveryUSD.toLocaleString()} USD</span>
                  </div>
                </div>

                {/* Ecological & Dock Details */}
                <div className="text-[11px] space-y-1 text-slate-400">
                  <div className="flex items-center gap-1 text-teal-300">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>Avoided Methane: <strong>{buyer.avoidedMethaneEmissionsMT} MT CO2e</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>{buyer.complianceRating}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Dock Status: {buyer.dockAvailability}
                  </div>
                </div>

                {/* Action Handshake Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onConfirmHandshake(buyer);
                  }}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    isSelected && isHandshakeDone
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 cursor-pointer active:scale-95'
                  }`}
                >
                  {isSelected && isHandshakeDone ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Rescue Agreement Executed & Dock Reserved
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      1-Click Match & Execute e-BOL
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
