// Illustrative mock data for the Staff Assist Admin Portal.
// Stands in for the curated Reporting Data Mart / DMO analytics layer described
// in the design brief until the real reporting integrations are wired up.

import type {
  AccessUser,
  ArtefactRecord,
  AuditLogEntry,
  Campaign,
  CommunicationTemplate,
  ContentItem,
  CustomerRewardEligibility,
  DmoMetric,
  ExceptionCase,
  IntegrationHealth,
  Journey,
  LeaderboardEntry,
  ReportDefinition,
  RoleName,
  StaffMember,
  StaffRewardEligibility,
  SupportFaq,
} from "./types";

const departments = ["Retail Banking", "Commercial Banking", "Digital Banking", "Consumer Lending", "Private Banking"];
const branches = [
  "Victoria Island", "Ikeja", "Lekki Phase 1", "Wuse II Abuja", "Port Harcourt GRA",
  "Kano Sabon Gari", "Enugu Independence Layout", "Ibadan Bodija", "Onitsha Main Market", "Benin City Ring Road",
];
const entities = ["Access Bank Nigeria", "Access Bank Ghana", "Access Bank Kenya"];
const regions = ["Lagos & West", "Abuja & North", "South-South", "South-East", "East Africa"];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}
const rand = seededRandom(42);
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function pad(n: number, len: number) {
  return String(n).padStart(len, "0");
}
function daysAgo(n: number) {
  const d = new Date("2026-08-10T09:00:00Z");
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 16).replace("T", " ");
}

const staffNames = [
  "Adaeze Nwosu", "Tunde Bakare", "Fatima Sule", "Chidi Okonkwo", "Ngozi Eze",
  "Emeka Obi", "Hauwa Ibrahim", "Kunle Adeyemi", "Blessing Uche", "Yusuf Danjuma",
  "Amaka Chukwu", "Segun Afolabi", "Zainab Mohammed", "Ifeanyi Okafor", "Grace Etim",
  "Uche Igwe", "Aisha Bello", "Chinedu Anya", "Folake Ogundipe", "Musa Garba",
  "Rita Nnamdi", "Bolaji Adeleke", "Amina Suleiman", "Victor Osaze", "Chioma Umeh",
  "Kelechi Nnaji", "Halima Yakubu", "Daniel Ekong", "Precious Attah", "Ibrahim Lawal",
];

export const staff: StaffMember[] = staffNames.map((name, i) => {
  const accountsOpened = 20 + Math.floor(rand() * 260);
  const fundedAccounts = Math.floor(accountsOpened * (0.55 + rand() * 0.35));
  const leagues: StaffMember["league"][] = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];
  return {
    staffId: `SA-${pad(10230 + i, 5)}`,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@accessbankplc.com`,
    department: pick(departments),
    unit: pick(["Onboarding Desk", "Relationship Team", "Branch Ops", "Digital Sales"]),
    sbu: pick(["North SBU", "West SBU", "East SBU", "South-South SBU"]),
    branch: pick(branches),
    entity: pick(entities),
    employmentStatus: rand() > 0.05 ? "Active" : "Inactive",
    standardAccess: rand() > 0.03 ? "Active" : "Suspended",
    elevatedRole: i < 8 ? (
      [
        "Staff Assist Administrator", "Campaign Administrator", "Operations Support",
        "Compliance / Financial Crime", "Supervisor / Business Manager", "Internal Audit",
        "Information Security / Technical Support", "Executive / Management Viewer",
      ][i] as RoleName
    ) : null,
    campaign: "Onboard & Earn – Season 4",
    league: leagues[Math.min(4, Math.floor(accountsOpened / 60))],
    points: 400 + accountsOpened * 12 + Math.floor(rand() * 500),
    accountsOpened,
    fundedAccounts,
    activationRate: Math.round((0.5 + rand() * 0.45) * 100),
    depositMobilised: fundedAccounts * (35000 + Math.floor(rand() * 180000)),
    lastActivity: daysAgo(Math.floor(rand() * 5)),
    journeysInitiated: accountsOpened + Math.floor(rand() * 30),
    conversionRate: Math.round((0.6 + rand() * 0.35) * 100),
    firstTransactions: Math.floor(fundedAccounts * (0.6 + rand() * 0.3)),
    tier3Upgrades: Math.floor(fundedAccounts * rand() * 0.2),
    streak: Math.floor(rand() * 21),
    pointsAtRisk: Math.floor(rand() * 300),
    exceptionsAttributed: Math.floor(rand() * 6),
  };
});

const journeyStatuses: Journey["status"][] = [
  "Awaiting customer action", "Customer requirements completed", "Identity verification in progress",
  "Account-opening checks in progress", "Account created", "Awaiting AccessMore activation",
  "Activated", "Qualifying transaction completed", "Completed", "Expired", "Failed", "Exception",
  "Additional review required", "Link sent",
];
const customerFirst = ["Chioma", "Bayo", "Amina", "Obinna", "Peace", "Tobi", "Nkechi", "Femi", "Sadiq", "Mercy", "Chika", "Wale"];
const customerLast = ["Okoro", "Adebayo", "Balogun", "Eze", "Nwachukwu", "Yusuf", "Abiodun", "Okoye", "Ibrahim", "Danladi"];

export const journeys: Journey[] = Array.from({ length: 42 }).map((_, i) => {
  const s = pick(staff);
  const status = journeyStatuses[i % journeyStatuses.length];
  const accountCreated = ["Account created", "Awaiting AccessMore activation", "Activated", "Qualifying transaction completed", "Completed"].includes(status);
  const activated = ["Activated", "Qualifying transaction completed", "Completed"].includes(status);
  const txnDone = ["Qualifying transaction completed", "Completed"].includes(status);
  return {
    reference: `SAJ-2026-${pad(100000 + i, 6)}`,
    customerName: `${pick(customerFirst)} ${pick(customerLast)}`,
    maskedPhone: `080*****${pad(Math.floor(rand() * 99), 2)}`,
    maskedEmail: `c***${i}@*****.com`,
    initiatingStaff: s.name,
    staffId: s.staffId,
    department: s.department,
    branch: s.branch,
    accountType: pick(["Savings", "Current", "Diamond Xtra Savings", "Target Savings"]),
    stage: ["Account & Consent", "Customer Action", "Identity Verification", "Review & Create Account"][i % 4],
    status,
    dateInitiated: daysAgo(3 + Math.floor(rand() * 40)),
    lastUpdated: daysAgo(Math.floor(rand() * 3)),
    accountNumber: accountCreated ? `00${pad(Math.floor(rand() * 99999999), 8)}` : undefined,
    accessMoreStatus: activated ? "Activated" : accountCreated ? "Awaiting activation" : "Not activated",
    firstTransactionStatus: txnDone ? "Completed" : activated ? "Awaiting" : "Not started",
    artefactStatus: accountCreated ? (rand() > 0.85 ? "Failed" : rand() > 0.7 ? "Pending synchronisation" : "Stored successfully") : "Not yet generated",
    rewardStatus: txnDone ? "Eligible" : accountCreated ? "Provisional" : "Not yet eligible",
    actionRequired: ({
      "Awaiting customer action": "Send reminder",
      "Identity verification in progress": "Monitor verification",
      "Exception": "Investigate exception",
      "Failed": "Review failure reason",
      "Additional review required": "Assign to Compliance",
      "Expired": "Re-issue link or cancel",
    } as Record<string, string>)[status] ?? "None",
    identityOutcome: status === "Failed" ? "Failed" : accountCreated ? "Passed" : "Pending",
    amlOutcome: status === "Additional review required" ? "Referred" : accountCreated ? "Clear" : "Pending",
    duplicateOutcome: rand() > 0.92 ? "Existing customer detected" : "Clear",
  };
});

const exceptionTypes: ExceptionCase["type"][] = [
  "Consent delivery failure", "Expired customer link", "Identity mismatch", "Facial verification failure",
  "AML referral", "Duplicate account", "Existing customer", "Eligibility failure", "Account-creation failure",
  "Pending account-opening outcome", "AccessMore activation delay", "Transaction milestone delay",
  "Reward exception", "Suspicious employee activity",
];

export const exceptions: ExceptionCase[] = Array.from({ length: 22 }).map((_, i) => {
  const j = journeys[i % journeys.length];
  const age = 1 + Math.floor(rand() * 12);
  return {
    id: `EXC-${pad(5000 + i, 4)}`,
    type: exceptionTypes[i % exceptionTypes.length],
    journeyReference: j.reference,
    customer: j.customerName,
    initiatingStaff: j.initiatingStaff,
    orgUnit: j.department,
    dateRaised: daysAgo(age),
    ageDays: age,
    priority: age > 8 ? "Critical" : age > 5 ? "High" : age > 2 ? "Medium" : "Low",
    slaStatus: age > 7 ? "Breached" : age > 4 ? "Due soon" : "Within SLA",
    owner: rand() > 0.4 ? pick(staff).name : null,
    status: rand() > 0.7 ? "Resolved" : rand() > 0.4 ? "In review" : rand() > 0.85 ? "Escalated" : "Open",
    lastAction: pick(["Note added", "Retried service call", "Assigned to owner", "Routed to Compliance", "Awaiting customer response"]),
    recommendedAction: pick([
      "Retry approved technical activity", "Resend customer communication", "Route to Compliance for review",
      "Escalate to Operations lead", "Reconcile with source system", "Close – resolved externally",
    ]),
  };
});

export const artefacts: ArtefactRecord[] = journeys
  .filter((j) => j.accountNumber)
  .map((j, i) => {
    const expected = 3 + (i % 3);
    const failed = j.artefactStatus === "Failed";
    const pending = j.artefactStatus === "Pending synchronisation";
    const stored = failed ? expected - 1 : pending ? expected - 1 : expected;
    return {
      journeyReference: j.reference,
      accountOpeningReference: `AOR-${pad(20000 + i, 6)}`,
      accountNumber: j.accountNumber!,
      customer: j.customerName,
      dateOpened: j.dateInitiated,
      expectedArtefacts: expected,
      storedArtefacts: stored,
      repositoryReference: `SC-REPO-${pad(300000 + i, 6)}`,
      status: j.artefactStatus,
      lastAttempt: j.lastUpdated,
      retryCount: failed ? 2 + Math.floor(rand() * 3) : pending ? 1 : 0,
      lastError: failed ? pick([
        "Repository acknowledgement timeout", "Artefact payload validation failed", "Service Central connection reset",
      ]) : null,
      owner: failed || pending ? pick(staff).name : null,
    };
  });

export const campaigns: Campaign[] = [
  {
    id: "CMP-2026-Q3-ONE",
    name: "Onboard & Earn – Grand Finale 2026",
    status: "Active",
    startDate: "2026-06-01",
    endDate: "2026-09-30",
    eligibleScope: "All entities – frontline and branch staff",
    participants: 1840,
    pointsIssued: 612000,
    rewardStatus: "Provisional",
    configVersion: "v3.2",
    lastUpdatedBy: "Adaeze Nwosu",
    accountTarget: 42000,
    accountsAchieved: 28650,
    casaTarget: 6_500_000_000,
    casaAchieved: 4_120_000_000,
    milestones: [
      { name: "Account created", points: 50, status: "Provisional", eventSource: "Account-opening service" },
      { name: "AccessMore activation", points: 30, status: "Provisional", eventSource: "AccessMore" },
      { name: "First qualifying transaction", points: 40, status: "Final", eventSource: "Transaction feed" },
      { name: "Tier 3 upgrade", points: 60, status: "Final", eventSource: "FLEXCUBE" },
    ],
  },
  {
    id: "CMP-2026-SUSTAIN",
    name: "Sustaining Momentum – Monthly Cycle",
    status: "Active",
    startDate: "2026-07-01",
    endDate: "2026-09-30",
    eligibleScope: "35 approved Operating Business Groups",
    participants: 35,
    pointsIssued: 0,
    rewardStatus: "Not yet eligible",
    configVersion: "v1.4",
    lastUpdatedBy: "Tunde Bakare",
    accountTarget: 35000,
    accountsAchieved: 27100,
    casaTarget: 5_000_000_000,
    casaAchieved: 3_650_000_000,
    milestones: [
      { name: "Month 1 gate – 80% of monthly target", points: 0, status: "Final", eventSource: "Reporting Data Mart" },
      { name: "Month 2 gate – 80% cumulative", points: 0, status: "Final", eventSource: "Reporting Data Mart" },
      { name: "Month 3 gate – 80% cumulative", points: 0, status: "Final", eventSource: "Reporting Data Mart" },
    ],
  },
  {
    id: "CMP-2025-ARCHIVE",
    name: "Onboard & Earn – Season 3",
    status: "Completed",
    startDate: "2025-10-01",
    endDate: "2026-03-31",
    eligibleScope: "All entities",
    participants: 2210,
    pointsIssued: 980000,
    rewardStatus: "Fulfilled",
    configVersion: "v5.0",
    lastUpdatedBy: "Fatima Sule",
    accountTarget: 60000,
    accountsAchieved: 61400,
    casaTarget: 8_000_000_000,
    casaAchieved: 8_450_000_000,
    milestones: [
      { name: "Account created", points: 50, status: "Final", eventSource: "Account-opening service" },
      { name: "AccessMore activation", points: 30, status: "Final", eventSource: "AccessMore" },
      { name: "First qualifying transaction", points: 40, status: "Final", eventSource: "Transaction feed" },
    ],
  },
];

const grandFinaleTiers = [
  { rankOrPosition: "National Champion", proposedReward: "Brand-new SUV" },
  { rankOrPosition: "1st Runner-up", proposedReward: "International return trip for two" },
  { rankOrPosition: "2nd Runner-up", proposedReward: "Five-star luxury weekend" },
  { rankOrPosition: "4th–10th", proposedReward: "₦200,000 each" },
  { rankOrPosition: "11th–25th", proposedReward: "₦100,000 each" },
  { rankOrPosition: "26th–50th", proposedReward: "₦50,000 each" },
];
const milestoneTiers = [
  { rankOrPosition: "First to fund 50 accounts", proposedReward: "Soundcore Space One Pro / AirPods" },
  { rankOrPosition: "First to fund 100 accounts", proposedReward: "Samsung or Apple Smart Watch" },
  { rankOrPosition: "First to fund 200 accounts", proposedReward: "Tablet" },
  { rankOrPosition: "First to fund 300 accounts", proposedReward: "iPhone Pro Max" },
];
const sustainingTiers = [
  { rankOrPosition: "Best-performing Operating Business Group", proposedReward: "₦300,000 and trophy" },
  { rankOrPosition: "2nd Place", proposedReward: "₦200,000" },
  { rankOrPosition: "3rd Place", proposedReward: "₦100,000" },
];

export const staffRewards: StaffRewardEligibility[] = [
  ...grandFinaleTiers.map((t, i) => ({
    id: `SR-GF-${i}`,
    category: "Grand Finale" as const,
    ...t,
    employeeOrGroup: pick(staff).name,
    accountsOpened: 180 - i * 20,
    fundedAccounts: 150 - i * 18,
    depositMobilised: (180 - i * 20) * 120000,
    targetAchievement: 130 - i * 8,
    gateResult: "Pass" as const,
    status: (["Approved", "Qualified", "Under review", "Potentially eligible", "Tracking", "Tracking"][i] ?? "Tracking") as StaffRewardEligibility["status"],
  })),
  ...milestoneTiers.map((t, i) => ({
    id: `SR-MS-${i}`,
    category: "Milestone" as const,
    ...t,
    employeeOrGroup: pick(staff).name,
    accountsOpened: 50 * (i + 1),
    fundedAccounts: Math.round(50 * (i + 1) * 0.9),
    depositMobilised: 50 * (i + 1) * 95000,
    targetAchievement: 100,
    gateResult: "Pass" as const,
    status: (["Fulfilled", "Approved", "Qualified", "Tracking"][i] ?? "Tracking") as StaffRewardEligibility["status"],
  })),
  ...sustainingTiers.map((t, i) => ({
    id: `SR-SM-${i}`,
    category: "Sustaining Momentum" as const,
    ...t,
    employeeOrGroup: `${["North", "West", "East", "South-South"][i % 4]} SBU`,
    accountsOpened: 3200 - i * 400,
    fundedAccounts: 2700 - i * 350,
    depositMobilised: (3200 - i * 400) * 110000,
    targetAchievement: 96 - i * 6,
    gateResult: i === 2 ? "Fail" as const : "Pass" as const,
    status: (["Under review", "Qualified", "Rejected"][i] ?? "Tracking") as StaffRewardEligibility["status"],
  })),
];

export const customerRewards: CustomerRewardEligibility[] = [
  { id: "CR-T1M", tier: "Monthly Tier 1", cadence: "Monthly", customerRef: "Top 200 customers", balanceIncrease: 20000, transactions: 5, reward: 10000, status: "Fulfilled" },
  { id: "CR-T2M", tier: "Monthly Tier 2", cadence: "Monthly", customerRef: "Top 100 customers", balanceIncrease: 100000, transactions: 10, reward: 20000, status: "Approved" },
  { id: "CR-T3M", tier: "Monthly Tier 3", cadence: "Monthly", customerRef: "Top 100 customers", balanceIncrease: 200000, transactions: 15, reward: 40000, status: "Qualified" },
  { id: "CR-T1Q", tier: "Quarterly Tier 1", cadence: "Quarterly", customerRef: "One customer", balanceIncrease: 300000, transactions: 50, reward: 1_000_000, status: "Tracking" },
  { id: "CR-T2Q", tier: "Quarterly Tier 2", cadence: "Quarterly", customerRef: "One customer", balanceIncrease: 500000, transactions: 50, reward: 5_000_000, status: "Tracking" },
];

export const leaderboard: LeaderboardEntry[] = [...staff]
  .sort((a, b) => b.points - a.points)
  .map((s, i) => ({
    rank: i + 1,
    staffId: s.staffId,
    name: s.name,
    orgUnit: `${s.branch} · ${s.department}`,
    league: s.league,
    points: s.points,
    accountsOpened: s.accountsOpened,
    activationRate: s.activationRate,
    qualifyingTransactions: s.firstTransactions,
    movement: Math.floor(rand() * 9) - 4,
    status: i < 5 ? "Promotion" : i > staff.length - 6 ? "Relegation" : "Stable",
    rewardStatus: i < 10 ? "Eligible" : i < 25 ? "Provisional" : "Not yet eligible",
    depositMobilised: s.depositMobilised,
    fundedAccounts: s.fundedAccounts,
    fundingRate: Math.round((s.fundedAccounts / Math.max(s.accountsOpened, 1)) * 100),
    accountTargetAchievement: Math.round((s.accountsOpened / 150) * 100),
    casaTargetAchievement: Math.round((s.depositMobilised / 20_000_000) * 100),
    gateResult: s.accountsOpened > 40 ? "Pass" : "Fail",
  }));

export const auditLogs: AuditLogEntry[] = Array.from({ length: 34 }).map((_, i) => {
  const s = pick(staff);
  const actions = [
    { module: "Onboarding Journeys", action: "Resent consent link", record: pick(journeys).reference },
    { module: "Exceptions", action: "Assigned exception owner", record: pick(exceptions).id },
    { module: "Artefact Reconciliation", action: "Retried synchronisation", record: pick(artefacts).accountOpeningReference },
    { module: "Campaigns", action: "Published campaign configuration", record: pick(campaigns).id },
    { module: "Staff Rewards", action: "Approved reward eligibility", record: pick(staffRewards).id },
    { module: "Access Management", action: "Assigned elevated role", record: pick(staff).staffId },
    { module: "Consent & Attestation Content", action: "Published content version", record: "PEP Declaration v2.3" },
    { module: "Communications", action: "Updated email template", record: "Account-created communication" },
    { module: "Audit Logs", action: "Exported audit report", record: "AUDIT-EXPORT-2026-08" },
    { module: "Leaderboard", action: "Investigated anomalous score", record: pick(staff).staffId },
  ];
  const a = pick(actions);
  return {
    id: `AUD-${pad(90000 + i, 5)}`,
    dateTime: daysAgo(Math.floor(rand() * 20)),
    user: s.name,
    staffId: s.staffId,
    role: (s.elevatedRole ?? "Operations Support") as RoleName,
    module: a.module,
    action: a.action,
    recordAffected: a.record,
    outcome: rand() > 0.08 ? "Success" : "Failed",
    reason: rand() > 0.7 ? "Routine operational action" : undefined,
    approvalReference: rand() > 0.6 ? `APR-${pad(4000 + i, 4)}` : undefined,
  };
});

export const systemHealth: IntegrationHealth[] = [
  "NT and staff-identity service", "Email-delivery service", "SMS service", "Consent and attestation service",
  "BVN service", "NIN service", "Facial-authentication service", "AML-screening service",
  "Duplicate-account service", "Account-opening service", "Artefact repository (Service Central)",
  "AccessMore activation events", "Transaction events feed", "Account-balance and funding service (FLEXCUBE)",
  "Deposit-mobilisation / Treasury feed", "Campaign metrics and Reporting Data Mart feed",
].map((service, i) => {
  const roll = rand();
  const status: IntegrationHealth["status"] = roll > 0.9 ? "Degraded" : roll > 0.97 ? "Unavailable" : rand() > 0.95 ? "Maintenance" : "Operational";
  return {
    service,
    status,
    lastSuccess: daysAgo(status === "Operational" ? 0 : Math.floor(rand() * 2)),
    failureRate: status === "Operational" ? Math.round(rand() * 2 * 10) / 10 : Math.round((4 + rand() * 20) * 10) / 10,
    avgResponseMs: 120 + Math.floor(rand() * (status === "Degraded" ? 2500 : 400)),
    pendingQueue: status === "Operational" ? Math.floor(rand() * 5) : Math.floor(rand() * 120),
    openIncident: status === "Operational" ? null : `INC-${pad(1000 + i, 4)}`,
    lastUpdated: daysAgo(0),
  };
});

export const reports: ReportDefinition[] = [
  { id: "R01", name: "Acquisition Performance Report", category: "Operational", description: "Onboarding volumes and acquisition trends by organisational scope.", lastRun: daysAgo(0), owner: "Operations Support" },
  { id: "R02", name: "Onboarding Funnel Report", category: "Operational", description: "Stage-by-stage conversion across the nine onboarding funnel steps.", lastRun: daysAgo(0), owner: "Operations Support" },
  { id: "R03", name: "Customer Drop-off Report", category: "Operational", description: "Journeys abandoned or stalled beyond the approved SLA.", lastRun: daysAgo(1), owner: "Operations Support" },
  { id: "R04", name: "Staff Participation Report", category: "Performance", description: "Active vs. eligible staff participation across the selected period.", lastRun: daysAgo(1), owner: "Campaign Administrator" },
  { id: "R05", name: "Employee Performance Report", category: "Performance", description: "Individual staff conversion, activation and points performance.", lastRun: daysAgo(0), owner: "Supervisor / Business Manager" },
  { id: "R06", name: "Entity, Region and Branch Performance Report", category: "Performance", description: "Roll-up performance comparison across organisational hierarchy.", lastRun: daysAgo(2), owner: "Executive / Management Viewer" },
  { id: "R07", name: "AccessMore Activation Report", category: "Commercial", description: "Digital activation status and activation rate by scope.", lastRun: daysAgo(0), owner: "Campaign Administrator" },
  { id: "R08", name: "Qualifying Transaction Report", category: "Commercial", description: "First qualifying transaction completion and conversion.", lastRun: daysAgo(1), owner: "Campaign Administrator" },
  { id: "R09", name: "Tier 3 Upgrade Report", category: "Commercial", description: "Tier 3 upgrade completions attributable to Staff Assist journeys.", lastRun: daysAgo(3), owner: "Campaign Administrator" },
  { id: "R10", name: "Campaign Points and Rewards Report", category: "Campaign", description: "Provisional and final points issued by campaign and milestone.", lastRun: daysAgo(0), owner: "Campaign Administrator" },
  { id: "R11", name: "Leaderboard Report", category: "Campaign", description: "League standings, movement and promotion / relegation history.", lastRun: daysAgo(0), owner: "Campaign Administrator" },
  { id: "R12", name: "Exception and SLA Report", category: "Operational", description: "Exception ageing, SLA breach rate and resolution performance.", lastRun: daysAgo(0), owner: "Operations Support" },
  { id: "R13", name: "AML and Eligibility Outcome Report", category: "Compliance", description: "AML referral, screening and eligibility outcome summary.", lastRun: daysAgo(1), owner: "Compliance / Financial Crime" },
  { id: "R14", name: "Duplicate and Existing-Customer Report", category: "Compliance", description: "Duplicate-account and existing-customer detection outcomes.", lastRun: daysAgo(2), owner: "Compliance / Financial Crime" },
  { id: "R15", name: "Consent and Attestation Completion Report", category: "Compliance", description: "Consent delivery, completion rate and content version tracking.", lastRun: daysAgo(1), owner: "Compliance / Financial Crime" },
  { id: "R16", name: "Communication Delivery Report", category: "Operational", description: "Send, delivery, open and failure rates across all templates.", lastRun: daysAgo(0), owner: "Operations Support" },
  { id: "R17", name: "Artefact Reconciliation Report", category: "Operational", description: "Synchronisation status of account-opening artefacts to Service Central.", lastRun: daysAgo(0), owner: "Operations Support" },
  { id: "R18", name: "Audit and Administrative Activity Report", category: "Audit", description: "Complete administrator and system action history.", lastRun: daysAgo(0), owner: "Internal Audit" },
  { id: "R19", name: "DMO Seven Metrics Report", category: "Commercial", description: "The seven DMO metrics at Individual Staff, Operating Group and Bank level.", lastRun: daysAgo(0), owner: "Executive / Management Viewer" },
  { id: "R20", name: "Deposit Mobilisation and Funding Report", category: "Commercial", description: "Deposit mobilised, funded accounts and funding rate by scope.", lastRun: daysAgo(0), owner: "Executive / Management Viewer" },
  { id: "R21", name: "Campaign Target Achievement Report", category: "Commercial", description: "Account-count and CASA achievement against approved targets.", lastRun: daysAgo(1), owner: "Campaign Administrator" },
  { id: "R22", name: "Staff Reward Eligibility and Fulfilment Report", category: "Campaign", description: "Grand Finale, Milestone and Sustaining Momentum reward status.", lastRun: daysAgo(0), owner: "Campaign Administrator" },
  { id: "R23", name: "Customer Reward Eligibility Report", category: "Campaign", description: "DiamondXtra customer reward eligibility, kept separate from staff rewards.", lastRun: daysAgo(2), owner: "Campaign Administrator" },
  { id: "R24", name: "Data Quality, Refresh and Source Reconciliation Report", category: "Data", description: "Source-system freshness, completeness and reconciliation status.", lastRun: daysAgo(0), owner: "Information Security / Technical Support" },
];

export const contentItems: ContentItem[] = [
  { id: "CNT-01", category: "Cryptocurrency attestation", name: "Cryptocurrency Source-of-Funds Attestation", version: "v2.1", status: "Published", lastUpdated: daysAgo(12), updatedBy: "Legal & Compliance" },
  { id: "CNT-02", category: "PEP declaration", name: "Politically Exposed Person Declaration", version: "v3.0", status: "Published", lastUpdated: daysAgo(30), updatedBy: "Compliance / Financial Crime" },
  { id: "CNT-03", category: "FEP declaration", name: "Foreign Exposed Person Declaration", version: "v1.4", status: "Pending approval", lastUpdated: daysAgo(2), updatedBy: "Legal & Compliance" },
  { id: "CNT-04", category: "Country of residence", name: "Country-of-Residence Declaration", version: "v1.0", status: "Published", lastUpdated: daysAgo(90), updatedBy: "Product" },
  { id: "CNT-05", category: "Terms and Conditions", name: "Account Opening Terms and Conditions", version: "v5.2", status: "Draft", lastUpdated: daysAgo(1), updatedBy: "Legal & Compliance" },
  { id: "CNT-06", category: "Privacy Notice", name: "Privacy Notice and Consent", version: "v4.1", status: "Published", lastUpdated: daysAgo(45), updatedBy: "Legal & Compliance" },
  { id: "CNT-07", category: "Final confirmation", name: "Final Customer Confirmation Page", version: "v1.2", status: "Scheduled", lastUpdated: daysAgo(3), updatedBy: "Product" },
];

export const communications: CommunicationTemplate[] = [
  { id: "CM-01", name: "Consent and attestation invitation email", channel: "Email", status: "Published", lastUpdated: daysAgo(20), sent: 18420, delivered: 18110, failed: 310, opened: 14980 },
  { id: "CM-02", name: "Consent and attestation SMS notification", channel: "SMS", status: "Published", lastUpdated: daysAgo(20), sent: 18420, delivered: 18260, failed: 160 },
  { id: "CM-03", name: "Link reminder", channel: "Email", status: "Published", lastUpdated: daysAgo(15), sent: 6210, delivered: 6080, failed: 130, opened: 4120 },
  { id: "CM-04", name: "Link expiry notification", channel: "SMS", status: "Published", lastUpdated: daysAgo(15), sent: 1980, delivered: 1940, failed: 40 },
  { id: "CM-05", name: "Customer-requirements completion confirmation", channel: "Email", status: "Published", lastUpdated: daysAgo(10), sent: 15200, delivered: 15010, failed: 190, opened: 12100 },
  { id: "CM-06", name: "Account-created communication", channel: "Email", status: "Published", lastUpdated: daysAgo(10), sent: 14800, delivered: 14650, failed: 150, opened: 12980 },
  { id: "CM-07", name: "AccessMore registration guidance", channel: "SMS", status: "Published", lastUpdated: daysAgo(8), sent: 14800, delivered: 14690, failed: 110 },
  { id: "CM-08", name: "Activation reminder", channel: "SMS", status: "Draft", lastUpdated: daysAgo(1), sent: 0, delivered: 0, failed: 0 },
  { id: "CM-09", name: "First-transaction reminder", channel: "Email", status: "Pending approval", lastUpdated: daysAgo(2), sent: 0, delivered: 0, failed: 0 },
];

export const accessUsers: AccessUser[] = staff.slice(0, 16).map((s) => ({
  staffId: s.staffId,
  name: s.name,
  currentRoles: s.elevatedRole ? [s.elevatedRole] : [],
  orgScope: `${s.entity} · ${s.department}`,
  requestStatus: s.elevatedRole ? "Approved" : rand() > 0.7 ? "Pending approval" : "None",
  effectiveDate: daysAgo(30 + Math.floor(rand() * 200)),
  expiryDate: rand() > 0.7 ? daysAgo(-60) : null,
  lastLogin: daysAgo(Math.floor(rand() * 4)),
  accountStatus: s.employmentStatus === "Active" ? (rand() > 0.85 ? "Dormant" : "Active") : "Suspended",
}));

export const supportFaqs: SupportFaq[] = [
  { id: "FAQ-01", category: "AML referral", question: "What happens when a customer is referred for AML review?", answer: "The journey moves to Additional review required and is routed to the Compliance queue. Operations cannot override the outcome.", status: "Published", lastUpdated: daysAgo(20) },
  { id: "FAQ-02", category: "Duplicate customer", question: "The system flagged an existing customer — what should I do?", answer: "Assign the exception to Operations for verification. The existing-customer outcome cannot be bypassed from the portal.", status: "Published", lastUpdated: daysAgo(20) },
  { id: "FAQ-03", category: "Consent and attestation link not received", question: "The customer says they never received the consent link.", answer: "Confirm the masked contact details, check delivery status in Communications, and resend the link from the journey record.", status: "Published", lastUpdated: daysAgo(14) },
  { id: "FAQ-04", category: "Facial verification not starting", question: "Facial verification will not start for the customer.", answer: "Check the Facial-authentication service status on System Health. If degraded, ask the customer to retry once restored.", status: "Published", lastUpdated: daysAgo(14) },
  { id: "FAQ-05", category: "Points reduced or not awarded", question: "Why were an employee's points reduced?", answer: "Points may be reduced following a reversed milestone (e.g. a reversed transaction). Check the Audit Trail on the journey for the adjustment record.", status: "Published", lastUpdated: daysAgo(9) },
  { id: "FAQ-06", category: "Customer cannot be onboarded again", question: "A customer wants to reapply after a failed journey — is this possible?", answer: "This depends on the original failure reason. Duplicate and existing-customer outcomes are not reversible from the portal.", status: "Published", lastUpdated: daysAgo(9) },
  { id: "FAQ-07", category: "Journey closed midway", question: "A journey shows as Cancelled but the customer wants to continue.", answer: "A new journey must be initiated by the employee. Cancelled journeys cannot be reopened.", status: "Draft", lastUpdated: daysAgo(1) },
  { id: "FAQ-08", category: "NT login issue", question: "An employee cannot sign in to the Admin Portal.", answer: "Confirm their NT profile is active and that they hold an approved elevated role in Access Management.", status: "Published", lastUpdated: daysAgo(5) },
];

export const dmoMetrics: DmoMetric[] = [
  { key: "accounts_opened", label: "Accounts Opened", individual: "148", operatingGroup: "5,240", overallBank: "28,650", target: "42,000", achievement: 68, previousPeriod: 61, trend: "up", source: "Account-opening service / FLEXCUBE", refreshedAt: daysAgo(0), completeness: "Complete" },
  { key: "deposit_mobilised", label: "Deposit Mobilised (₦)", individual: "₦17.8M", operatingGroup: "₦612M", overallBank: "₦4.12Bn", target: "₦6.50Bn", achievement: 63, previousPeriod: 55, trend: "up", source: "FLEXCUBE / Treasury-approved feed", refreshedAt: daysAgo(0), completeness: "Complete" },
  { key: "avg_balance", label: "Average Balance per Account", individual: "₦120,300", operatingGroup: "₦116,800", overallBank: "₦143,900", target: "₦150,000", achievement: 96, previousPeriod: 91, trend: "up", source: "FLEXCUBE", refreshedAt: daysAgo(0), completeness: "Complete" },
  { key: "funded_accounts", label: "Funded Accounts", individual: "121", operatingGroup: "4,310", overallBank: "22,940", target: "33,600", achievement: 68, previousPeriod: 64, trend: "up", source: "FLEXCUBE", refreshedAt: daysAgo(0), completeness: "Partial" },
  { key: "funding_rate", label: "Funding Rate (%)", individual: "82%", operatingGroup: "82%", overallBank: "80%", target: "85%", achievement: 94, previousPeriod: 90, trend: "flat", source: "Calculated – Reporting Data Mart", refreshedAt: daysAgo(0), completeness: "Partial" },
  { key: "digital_active", label: "Digitally Activated / Transacting Customers", individual: "96", operatingGroup: "3,420", overallBank: "18,760", target: "28,000", achievement: 67, previousPeriod: 59, trend: "up", source: "AccessMore / transaction feed", refreshedAt: daysAgo(1), completeness: "Delayed" },
  { key: "target_achievement", label: "Campaign Target Achievement (%)", individual: "71%", operatingGroup: "68%", overallBank: "68%", target: "100%", achievement: 68, previousPeriod: 60, trend: "up", source: "Campaign configuration service", refreshedAt: daysAgo(0), completeness: "Complete" },
];

export const conversionFunnel = [
  { stage: "Journey initiated", count: 34820, dropOff: 0 },
  { stage: "Consent & attestation link delivered", count: 33960, dropOff: 860 },
  { stage: "Customer requirements completed", count: 30410, dropOff: 3550 },
  { stage: "Identity verification completed", count: 29180, dropOff: 1230 },
  { stage: "Account-opening checks passed", count: 28990, dropOff: 190 },
  { stage: "Account created", count: 28650, dropOff: 340 },
  { stage: "AccessMore activated", count: 22940, dropOff: 5710 },
  { stage: "First qualifying transaction", count: 18760, dropOff: 4180 },
  { stage: "Tier 3 upgrade completed", count: 6120, dropOff: 12640 },
];

function series(base: number, days: number, volatility: number) {
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < days; i++) {
    v = Math.max(0, v + (rand() - 0.42) * volatility);
    out.push(Math.round(v));
  }
  return out;
}

export const trends = {
  journeysInitiated: series(1050, 14, 220),
  accountsOpened: series(820, 14, 180),
  accessMoreActivations: series(640, 14, 160),
  firstTransactions: series(480, 14, 140),
  staffParticipation: series(210, 14, 30),
};

function aggregateByBranch() {
  const map = new Map<string, { volume: number; funded: number; conversion: number[] }>();
  staff.forEach((s) => {
    const cur = map.get(s.branch) ?? { volume: 0, funded: 0, conversion: [] as number[] };
    cur.volume += s.accountsOpened;
    cur.funded += s.fundedAccounts;
    cur.conversion.push(s.conversionRate);
    map.set(s.branch, cur);
  });
  return Array.from(map.entries()).map(([name, v]) => ({
    name,
    volume: v.volume,
    rate: Math.round(v.conversion.reduce((a, b) => a + b, 0) / v.conversion.length),
  }));
}

const branchAgg = aggregateByBranch().sort((a, b) => b.volume - a.volume);
const branchByRate = [...branchAgg].sort((a, b) => b.rate - a.rate);

export const performanceBreakdown = {
  topEntities: entities.map((name, i) => ({ name, volume: 12500 - i * 3200, rate: 78 - i * 6 })),
  topRegions: regions.map((name, i) => ({ name, volume: 8600 - i * 1400, rate: 74 - i * 4 })),
  topBranches: branchAgg.slice(0, 5),
  lowestConverting: [...branchByRate].reverse().slice(0, 5),
  highestCohorts: [
    { name: "Digital Sales – Grade 3–5", volume: 6200, rate: 81 },
    { name: "Relationship Team – Grade 6–8", volume: 5100, rate: 76 },
    { name: "Onboarding Desk – Grade 1–2", volume: 3400, rate: 69 },
  ],
};

export const attentionPanel = [
  { label: "Customers awaiting action beyond SLA", count: exceptions.filter((e) => e.slaStatus !== "Within SLA").length, link: "/exceptions" },
  { label: "Failed consent and attestation delivery", count: exceptions.filter((e) => e.type === "Consent delivery failure").length, link: "/exceptions" },
  { label: "Failed identity verification", count: journeys.filter((j) => j.identityOutcome === "Failed").length, link: "/journeys" },
  { label: "AML or eligibility referrals", count: journeys.filter((j) => j.amlOutcome === "Referred").length, link: "/journeys" },
  { label: "Duplicate or existing-customer outcomes", count: journeys.filter((j) => j.duplicateOutcome !== "Clear").length, link: "/journeys" },
  { label: "Artefact-synchronisation failures", count: artefacts.filter((a) => a.status === "Failed").length, link: "/artefacts" },
  { label: "Customers awaiting AccessMore activation", count: journeys.filter((j) => j.accessMoreStatus === "Awaiting activation").length, link: "/journeys" },
  { label: "Customers awaiting first transaction", count: journeys.filter((j) => j.firstTransactionStatus === "Awaiting").length, link: "/journeys" },
];
