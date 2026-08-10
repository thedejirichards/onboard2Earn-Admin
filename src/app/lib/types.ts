// Shared domain types for the Staff Assist Admin Portal.
// Mirrors the entities described in the Admin Portal UX/UI Design Brief v1.1.

export type RoleName =
  | "Executive / Management Viewer"
  | "Supervisor / Business Manager"
  | "Operations Support"
  | "Campaign Administrator"
  | "Compliance / Financial Crime"
  | "Internal Audit"
  | "Information Security / Technical Support"
  | "Staff Assist Administrator";

export type JourneyStatus =
  | "Draft"
  | "Link sent"
  | "Awaiting customer action"
  | "Customer requirements completed"
  | "Identity verification in progress"
  | "Account-opening checks in progress"
  | "Ready for account creation"
  | "Account created"
  | "Awaiting AccessMore activation"
  | "Activated"
  | "Awaiting qualifying transaction"
  | "Qualifying transaction completed"
  | "Completed"
  | "Expired"
  | "Cancelled"
  | "Failed"
  | "Exception"
  | "Additional review required";

export type ArtefactStatus =
  | "Not yet generated"
  | "Pending synchronisation"
  | "Synchronising"
  | "Stored successfully"
  | "Failed"
  | "Reconciliation required";

export type RewardStatus =
  | "Not yet eligible"
  | "Provisional"
  | "Eligible"
  | "Pending fulfilment"
  | "Fulfilled"
  | "Failed"
  | "Reversed";

export interface Journey {
  reference: string;
  customerName: string;
  maskedPhone: string;
  maskedEmail: string;
  initiatingStaff: string;
  staffId: string;
  department: string;
  branch: string;
  accountType: string;
  stage: string;
  status: JourneyStatus;
  dateInitiated: string;
  lastUpdated: string;
  accountNumber?: string;
  accessMoreStatus: "Not activated" | "Awaiting activation" | "Activated";
  firstTransactionStatus: "Not started" | "Awaiting" | "Completed";
  artefactStatus: ArtefactStatus;
  rewardStatus: RewardStatus;
  actionRequired: string;
  identityOutcome: "Passed" | "Failed" | "Pending" | "Not started";
  amlOutcome: "Clear" | "Referred" | "Pending" | "Not started";
  duplicateOutcome: "Clear" | "Existing customer detected" | "Pending";
}

export type ExceptionType =
  | "Consent delivery failure"
  | "Expired customer link"
  | "Identity mismatch"
  | "Facial verification failure"
  | "AML referral"
  | "Duplicate account"
  | "Existing customer"
  | "Eligibility failure"
  | "Account-creation failure"
  | "Pending account-opening outcome"
  | "AccessMore activation delay"
  | "Transaction milestone delay"
  | "Reward exception"
  | "Suspicious employee activity";

export interface ExceptionCase {
  id: string;
  type: ExceptionType;
  journeyReference: string;
  customer: string;
  initiatingStaff: string;
  orgUnit: string;
  dateRaised: string;
  ageDays: number;
  priority: "Low" | "Medium" | "High" | "Critical";
  slaStatus: "Within SLA" | "Due soon" | "Breached";
  owner: string | null;
  status: "Open" | "In review" | "Escalated" | "Resolved";
  lastAction: string;
  recommendedAction: string;
}

export interface ArtefactRecord {
  journeyReference: string;
  accountOpeningReference: string;
  accountNumber: string;
  customer: string;
  dateOpened: string;
  expectedArtefacts: number;
  storedArtefacts: number;
  repositoryReference: string;
  status: ArtefactStatus;
  lastAttempt: string;
  retryCount: number;
  lastError: string | null;
  owner: string | null;
}

export interface StaffMember {
  staffId: string;
  name: string;
  email: string;
  department: string;
  unit: string;
  sbu: string;
  branch: string;
  entity: string;
  employmentStatus: "Active" | "Inactive";
  standardAccess: "Active" | "Suspended";
  elevatedRole: RoleName | null;
  campaign: string;
  league: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
  points: number;
  accountsOpened: number;
  fundedAccounts: number;
  activationRate: number;
  depositMobilised: number;
  lastActivity: string;
  journeysInitiated: number;
  conversionRate: number;
  firstTransactions: number;
  tier3Upgrades: number;
  streak: number;
  pointsAtRisk: number;
  exceptionsAttributed: number;
}

export interface CampaignMilestone {
  name: string;
  points: number;
  status: "Provisional" | "Final";
  eventSource: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: "Draft" | "Pending approval" | "Scheduled" | "Active" | "Paused" | "Completed" | "Archived";
  startDate: string;
  endDate: string;
  eligibleScope: string;
  participants: number;
  milestones: CampaignMilestone[];
  pointsIssued: number;
  rewardStatus: RewardStatus;
  configVersion: string;
  lastUpdatedBy: string;
  accountTarget: number;
  accountsAchieved: number;
  casaTarget: number;
  casaAchieved: number;
}

export interface StaffRewardEligibility {
  id: string;
  category: "Grand Finale" | "Milestone" | "Sustaining Momentum";
  rankOrPosition: string;
  employeeOrGroup: string;
  accountsOpened: number;
  fundedAccounts: number;
  depositMobilised: number;
  targetAchievement: number;
  gateResult: "Pass" | "Fail" | "Pending";
  proposedReward: string;
  status: "Tracking" | "Potentially eligible" | "Qualified" | "Under review" | "Approved" | "Awaiting fulfilment" | "Fulfilled" | "Rejected" | "Reversed";
}

export interface CustomerRewardEligibility {
  id: string;
  tier: string;
  cadence: "Monthly" | "Quarterly";
  customerRef: string;
  balanceIncrease: number;
  transactions: number;
  reward: number;
  status: "Tracking" | "Qualified" | "Approved" | "Fulfilled";
}

export interface LeaderboardEntry {
  rank: number;
  staffId: string;
  name: string;
  orgUnit: string;
  league: StaffMember["league"];
  points: number;
  accountsOpened: number;
  activationRate: number;
  qualifyingTransactions: number;
  movement: number;
  status: "Promotion" | "Relegation" | "Stable";
  rewardStatus: RewardStatus;
  depositMobilised: number;
  fundedAccounts: number;
  fundingRate: number;
  accountTargetAchievement: number;
  casaTargetAchievement: number;
  gateResult: "Pass" | "Fail" | "Pending";
}

export interface AuditLogEntry {
  id: string;
  dateTime: string;
  user: string;
  staffId: string;
  role: RoleName;
  module: string;
  action: string;
  recordAffected: string;
  previousValue?: string;
  newValue?: string;
  outcome: "Success" | "Failed" | "Denied";
  reason?: string;
  approvalReference?: string;
}

export interface IntegrationHealth {
  service: string;
  status: "Operational" | "Degraded" | "Unavailable" | "Maintenance";
  lastSuccess: string;
  failureRate: number;
  avgResponseMs: number;
  pendingQueue: number;
  openIncident: string | null;
  lastUpdated: string;
}

export interface ReportDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  lastRun: string;
  owner: string;
}

export interface ContentItem {
  id: string;
  category: string;
  name: string;
  version: string;
  status: "Draft" | "Pending approval" | "Approved" | "Scheduled" | "Published" | "Archived";
  lastUpdated: string;
  updatedBy: string;
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  channel: "Email" | "SMS";
  status: "Draft" | "Pending approval" | "Approved" | "Scheduled" | "Published";
  lastUpdated: string;
  sent: number;
  delivered: number;
  failed: number;
  opened?: number;
}

export interface AccessUser {
  staffId: string;
  name: string;
  currentRoles: RoleName[];
  orgScope: string;
  requestStatus: "None" | "Pending approval" | "Approved" | "Rejected";
  effectiveDate: string;
  expiryDate: string | null;
  lastLogin: string;
  accountStatus: "Active" | "Suspended" | "Dormant";
}

export interface SupportFaq {
  id: string;
  category: string;
  question: string;
  answer: string;
  status: "Published" | "Draft";
  lastUpdated: string;
}

export interface DmoMetric {
  key: string;
  label: string;
  individual: string;
  operatingGroup: string;
  overallBank: string;
  target: string;
  achievement: number;
  previousPeriod: number;
  trend: "up" | "down" | "flat";
  source: string;
  refreshedAt: string;
  completeness: "Complete" | "Delayed" | "Partial" | "Under reconciliation";
}
