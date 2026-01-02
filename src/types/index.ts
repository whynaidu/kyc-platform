// User and Authentication Types
export type UserRole = 'admin' | 'agent' | 'user';

export type KYCStatus = 'pending' | 'verified' | 'failed' | 'in_progress' | 'not_started';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  kycStatus: KYCStatus;
  createdAt: Date;
  updatedAt: Date;
  phone?: string;
  address?: string;
  // Indian KYC fields
  aadhaar?: string;
  pan?: string;
}

export interface AuthUser extends User {
  permissions: Permission[];
}

// Permission and Role Types
export type PermissionModule =
  | 'dashboard'
  | 'kyc'
  | 'video_kyc'
  | 'users'
  | 'agents'
  | 'analytics'
  | 'settings'
  | 'roles';

export interface Permission {
  module: PermissionModule;
  actions: ('view' | 'create' | 'edit' | 'delete')[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
  createdAt: Date;
}

// Agent Types
export type AgentStatus = 'online' | 'offline' | 'in_call' | 'break';

export interface Agent {
  id: string;
  userId: string;
  user: User;
  status: AgentStatus;
  todayVerifications: number;
  weekVerifications: number;
  monthVerifications: number;
  approvalRate: number;
  avgSessionDuration: number; // in seconds
  customerSatisfaction: number; // 0-5
  totalSessions: number;
  lastActive: Date;
}

// KYC Record Types
export type KYCType = 'face_liveness' | 'face_match' | 'handwriting' | 'location' | 'video_kyc';

export type VerificationStatus = 'pending' | 'verified' | 'failed' | 'in_progress';

export interface KYCRecord {
  id: string;
  userId: string;
  user: User;
  type: KYCType;
  status: VerificationStatus;
  agentId?: string;
  confidence?: number;
  createdAt: Date;
  completedAt?: Date;
  metadata?: Record<string, unknown>;
}

// Video KYC Types
export type VideoSessionStatus = 'waiting' | 'in_progress' | 'completed' | 'cancelled';

export interface VideoSession {
  id: string;
  userId: string;
  user: User;
  agentId?: string;
  agent?: Agent;
  status: VideoSessionStatus;
  queuePosition?: number;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in seconds
  outcome?: 'approved' | 'rejected' | 'escalated';
  rejectionReason?: string;
  agentNotes?: string;
  recordingUrl?: string;
}

// Queue Item for Agent
export type Priority = 'high' | 'medium' | 'normal';

export interface QueueItem {
  id: string;
  userId: string;
  user: User;
  kycType: KYCType;
  priority: Priority;
  waitTime: number; // in minutes
  documents: string[];
  createdAt: Date;
}

// Analytics Types
export interface DailyMetrics {
  date: string;
  totalVerifications: number;
  successfulVerifications: number;
  failedVerifications: number;
  avgCompletionTime: number; // in seconds
  faceLiveness: number;
  faceMatch: number;
  handwriting: number;
  location: number;
  videoKyc: number;
}

export interface RegionalStats {
  region: string;
  country: string;
  verifications: number;
  successRate: number;
  avgTime: number; // in seconds
  lat: number;
  lng: number;
}

export interface KPIData {
  value: number;
  previousValue: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface DashboardKPIs {
  totalVerifications: KPIData;
  successRate: KPIData;
  failedAttempts: KPIData;
  avgCompletionTime: KPIData;
}

export interface AgentKPIs {
  todayVerifications: KPIData;
  approvalRate: KPIData;
  avgSessionDuration: KPIData;
  customerSatisfaction: KPIData;
}

export interface AdminKPIs {
  totalUsers: KPIData;
  activeAgents: KPIData;
  currentQueueLength: KPIData;
  systemHealth: KPIData;
}

// Activity Feed Types
export type ActivityType =
  | 'verification_completed'
  | 'verification_failed'
  | 'user_registered'
  | 'agent_status_changed'
  | 'video_session_started'
  | 'video_session_ended';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  userId?: string;
  user?: User;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Document Types for KYC
export type DocumentType = 'passport' | 'drivers_license' | 'national_id';

export interface DocumentInfo {
  type: DocumentType;
  label: string;
  icon: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  address?: string;
}

// ============================================
// Device Analytics Types
// ============================================

export type DeviceType = 'mobile' | 'desktop' | 'tablet';

export interface DeviceStats {
  deviceType: DeviceType;
  count: number;
  successRate: number;
  avgCompletionTime: number;
}

export type OSType = 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Other';

export interface OSStats {
  os: OSType;
  count: number;
  successRate: number;
  avgCompletionTime: number;
}

export type BrowserType = 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Other';

export interface BrowserStats {
  browser: BrowserType;
  count: number;
  successRate: number;
  compatibilityIssues: number;
  commonIssues: string[];
}

export type NetworkType = '5G' | '4G' | '3G' | 'WiFi' | 'Ethernet' | 'Unknown';

export interface NetworkStats {
  networkType: NetworkType;
  count: number;
  avgLatency: number;
  dropoutRate: number;
  avgCompletionTime: number;
}

// ============================================
// Onboarding Analytics Types
// ============================================

export type OnboardingStep = 'mobile' | 'identity' | 'video_kyc' | 'address' | 'bank' | 'review';

export interface OnboardingFunnelStep {
  step: OnboardingStep;
  stepNumber: number;
  label: string;
  started: number;
  completed: number;
  dropoffs: number;
  avgTimeSeconds: number;
}

export interface OnboardingDailyMetrics {
  date: string;
  started: number;
  completed: number;
  avgTotalTimeMinutes: number;
  conversionRate: number;
}

export interface OnboardingKPIs {
  totalStarted: KPIData;
  conversionRate: KPIData;
  avgCompletionTime: KPIData;
  dropoffRate: KPIData;
}

// ============================================
// KYC Failure Analytics Types
// ============================================

export type KYCFailureStep = 'face_liveness' | 'face_match' | 'handwriting' | 'location' | 'video_kyc';

export interface KYCFailureReason {
  reason: string;
  count: number;
  percentage: number;
}

export interface KYCStepFailure {
  step: KYCFailureStep;
  label: string;
  totalAttempts: number;
  failures: number;
  failureRate: number;
  topReasons: KYCFailureReason[];
}

export interface KYCFailureTimePattern {
  hour: number;
  failures: number;
  total: number;
}

export interface KYCRetryPattern {
  attempts: number;
  count: number;
  eventualSuccessRate: number;
}

export interface KYCFailureKPIs {
  totalFailures: KPIData;
  highestFailureStep: { step: string; rate: number };
  retrySuccessRate: KPIData;
  peakFailureHour: number;
}

// ============================================
// Onboarding Failure Analytics Types
// ============================================

export interface OnboardingStepFailure {
  step: OnboardingStep;
  label: string;
  dropoffs: number;
  dropoffRate: number;
  topReasons: { reason: string; count: number; percentage: number }[];
}

export interface OnboardingDropoffTiming {
  timeRange: string;
  count: number;
  percentage: number;
}

export interface OnboardingFailureKPIs {
  totalDropoffs: KPIData;
  highestDropoffStep: { step: string; rate: number };
  avgDropoffTime: KPIData;
  recoveryRate: KPIData;
}
