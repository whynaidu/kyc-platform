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
