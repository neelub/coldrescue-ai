export interface ReeferCompartment {
  id: string;
  name: string;
  commodity: string;
  quantityPallets: number;
  totalPounds: number;
  marketValueUSD: number;
  targetTempC: number;
  currentTempC: number;
  targetHumidityPct: number;
  currentHumidityPct: number;
  ethylenePpm: number;
  baseShelfLifeDays: number;
  currentRemainingShelfLifeHours: number;
  status: 'OPTIMAL' | 'AT_RISK' | 'CRITICAL_BREACH' | 'RESCUE_IN_PROGRESS' | 'SALVAGED';
}

export interface RefrigeratedTruck {
  id: string;
  truckNumber: string;
  carrierName: string;
  driverName: string;
  origin: string;
  originalDestination: string;
  currentLocationName: string;
  coordinates: [number, number];
  speedMph: number;
  engineStatus: 'RUNNING' | 'IDLE' | 'DETOURING';
  totalCapacityPallets: number;
  distanceToDestinationMiles: number;
  estimatedArrivalHours: number;
  compartments: ReeferCompartment[];
}

export interface OffTakerBuyer {
  id: string;
  name: string;
  category: 'Industrial Processor (Juice/Bakery)' | 'Flash-Sale Discount Grocer' | 'Regional Food Rescue Bank' | 'Biogas Digester';
  coordinates: [number, number];
  distanceMilesFromTruck: number;
  detourTimeMinutes: number;
  currentIntakeCapacityPallets: number;
  acceptedCommodities: string[];
  salvageBidPerLbUSD: number;
  estimatedPayoutUSD: number;
  extraFuelCostUSD: number;
  netFinancialRecoveryUSD: number;
  avoidedLandfillFeeUSD: number;
  avoidedMethaneEmissionsMT: number;
  matchScore: number;
  dockAvailability: string;
  complianceRating: string;
}

export interface PubSubSensorTelemetry {
  messageId: string;
  topic: string;
  timestamp: string;
  truckId: string;
  compartmentId: string;
  sensorId: string;
  metrics: {
    tempC: number;
    ambientTempC: number;
    humidityPct: number;
    ethylenePpm: number;
    co2Ppm: number;
    vibrationG: number;
    reeferPowerStatus: 'MAIN_BATTERY' | 'BACKUP_AUX' | 'FAULT';
  };
  priority: 'CRITICAL' | 'WARNING' | 'INFO';
}

export interface BigQueryAnalyticsMetric {
  metricName: string;
  value: string;
  trend: string;
  status: 'positive' | 'warning' | 'neutral';
  explanation: string;
  sqlSnippet: string;
}

export interface SalvageLedgerRecord {
  id: string;
  timestamp: string;
  truckId: string;
  truckNumber: string;
  carrierName: string;
  driverName: string;
  zoneName: string;
  commodity: string;
  palletsOffloaded: number;
  totalPounds: number;
  originalDestination: string;
  salvageFacilityName: string;
  salvageCategory: string;
  salvageLocation: string;
  salvageBidPerLbUSD: number;
  grossPayoutUSD: number;
  detourFuelCostUSD: number;
  netFinancialRecoveryUSD: number;
  avoidedLandfillFeeUSD: number;
  avoidedMethaneMT: number;
  ebolNumber: string;
  status: 'IN_TRANSIT' | 'OFFLOADED_VERIFIED' | 'SETTLED';
}

export interface AgentDecisionLog {
  id: string;
  timestamp: string;
  timeOffset: string;
  agentName: 'Cold Sentinel' | 'Logistics GIS Analyst' | 'Economic & Loss Arbiter' | 'Dataplex Compliance Auditor' | 'Master Dispatcher';
  actionType: 'TELEMETRY_ANOMALY' | 'SPATIAL_SEARCH' | 'ECONOMIC_ARBITRAGE' | 'COMPLIANCE_AUDIT' | 'DISPATCH_EXECUTION';
  summary: string;
  details: string;
  confidenceScore: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'TRIGGERED';
  metadata: {
    service: string;
    payloadKey?: string;
    payloadValue?: string;
    codeSnippet?: string;
    tags?: string[];
  };
}
