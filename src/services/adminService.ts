/**
 * Mumora Admin Service & Mock Database Operations
 * Role-Based Access Control (RBAC): Super Admin, Admin, Content Manager, Support Agent
 * Live Analytics, User Account Lifecycle, CMS, AI Monitoring, Support Tickets
 */

export type AdminRole = 'super_admin' | 'admin' | 'content_manager' | 'support_agent';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  lastLogin: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'report_upload' | 'account_access' | 'growth_chart' | 'billing_inquiry' | 'medical_disclaimer';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedAgent: string;
  messages: Array<{
    sender: 'user' | 'support';
    text: string;
    timestamp: string;
  }>;
  internalNotes: string[];
}

export interface ReportProcessingLog {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  fileName: string;
  fileType: string;
  category: string;
  timestamp: string;
  ocrStatus: 'success' | 'failed' | 'skipped_text';
  aiStatus: 'success' | 'failed' | 'retry_pending';
  confidenceScore: number;
  apiTokensUsed: number;
  errorMessage?: string;
  isRetryable: boolean;
}

export interface CmsArticle {
  id: string;
  title: string;
  titleHi: string;
  category: 'pregnancy_trimester' | 'newborn_care' | 'maternal_nutrition' | 'uip_vaccination' | 'postpartum_mental_health';
  targetAudience: 'pregnant_mothers' | 'new_mothers' | 'mothers_with_babies' | 'all';
  author: string;
  reviewerName: string; // Medical reviewer
  reviewerCredentials: string;
  lastReviewedDate: string;
  status: 'published' | 'draft' | 'under_review';
  evidenceSource: string;
  content: string;
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  targetRole: 'all' | 'pregnant_users' | 'mothers_with_babies';
  priority: 'normal' | 'high' | 'emergency';
  createdAt: string;
  published: boolean;
  sentCount: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  action: string;
  resource: string;
  ipAddress: string;
  details: string;
}

// Default pre-configured Administrator Accounts
export const DEFAULT_ADMINS: AdminUser[] = [
  {
    id: 'adm_01',
    name: 'Dr. Meenakshi Sundaram',
    email: 'admin@mumora.internal',
    role: 'super_admin',
    lastLogin: '2026-10-24T08:15:00Z',
  },
  {
    id: 'adm_02',
    name: 'Rajesh K. Verma',
    email: 'ops@mumora.internal',
    role: 'admin',
    lastLogin: '2026-10-23T14:20:00Z',
  },
  {
    id: 'adm_03',
    name: 'Pooja Deshmukh',
    email: 'content@mumora.internal',
    role: 'content_manager',
    lastLogin: '2026-10-24T06:45:00Z',
  },
  {
    id: 'adm_04',
    name: 'Kavita Menon',
    email: 'support@mumora.internal',
    role: 'support_agent',
    lastLogin: '2026-10-24T07:50:00Z',
  },
];

// Initial Support Tickets
export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-2026-001',
    userId: 'usr_ananya_001',
    userName: 'Ananya Sharma',
    userEmail: 'ananya@example.in',
    subject: 'Cannot parse handwritten prescription from clinic',
    category: 'report_upload',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2026-10-23T10:14:00Z',
    updatedAt: '2026-10-24T02:30:00Z',
    assignedAgent: 'Kavita Menon',
    messages: [
      {
        sender: 'user',
        text: 'Uploaded a scanned pediatrician note for baby Aarav, but OCR showed unreadable handwriting.',
        timestamp: '2026-10-23T10:14:00Z',
      },
      {
        sender: 'support',
        text: 'Hello Ananya, we have flagged the document for secondary manual transcription review.',
        timestamp: '2026-10-23T11:00:00Z',
      },
    ],
    internalNotes: ['User has uploaded 3 previous CBC reports cleanly. Script seems cursive handwriting.'],
  },
  {
    id: 'TCK-2026-002',
    userId: 'usr_priya_002',
    userName: 'Priya Iyer',
    userEmail: 'priya.iyer@example.com',
    subject: 'Question on WHO corrected age for 33-week preterm baby',
    category: 'growth_chart',
    priority: 'high',
    status: 'open',
    createdAt: '2026-10-24T04:20:00Z',
    updatedAt: '2026-10-24T04:20:00Z',
    assignedAgent: 'Unassigned',
    messages: [
      {
        sender: 'user',
        text: 'Why does the percentile show higher when corrected age toggle is on?',
        timestamp: '2026-10-24T04:20:00Z',
      },
    ],
    internalNotes: ['Requires educational note about WHO 2-year corrected age curve standard.'],
  },
];

// Initial Report Logs
export const INITIAL_REPORT_LOGS: ReportProcessingLog[] = [
  {
    id: 'LOG-7701',
    reportId: 'rep_cbc_01',
    userId: 'usr_ananya_001',
    userName: 'Ananya Sharma',
    fileName: 'ananya_cbc_iron_oct2026.pdf',
    fileType: 'application/pdf',
    category: 'Complete Blood Count (CBC)',
    timestamp: '2026-10-23T08:12:00Z',
    ocrStatus: 'success',
    aiStatus: 'success',
    confidenceScore: 0.98,
    apiTokensUsed: 1420,
    isRetryable: false,
  },
  {
    id: 'LOG-7702',
    reportId: 'rep_scan_02',
    userId: 'usr_ananya_001',
    userName: 'Ananya Sharma',
    fileName: 'tiffa_ultrasound_week20.jpg',
    fileType: 'image/jpeg',
    category: 'Obstetric Ultrasound (TIFFA)',
    timestamp: '2026-10-21T14:40:00Z',
    ocrStatus: 'success',
    aiStatus: 'success',
    confidenceScore: 0.94,
    apiTokensUsed: 2180,
    isRetryable: false,
  },
  {
    id: 'LOG-7703',
    reportId: 'rep_err_03',
    userId: 'usr_demo_099',
    userName: 'Sunita Rao',
    fileName: 'blurry_mobile_cam_prescription.png',
    fileType: 'image/png',
    category: 'Doctor Prescription',
    timestamp: '2026-10-24T07:15:00Z',
    ocrStatus: 'failed',
    aiStatus: 'failed',
    confidenceScore: 0.32,
    apiTokensUsed: 420,
    errorMessage: 'Low image contrast and motion blur prevented reliable text extraction.',
    isRetryable: true,
  },
];

// Initial CMS Articles
export const INITIAL_CMS_ARTICLES: CmsArticle[] = [
  {
    id: 'CMS-101',
    title: 'Managing Physiological Gestational Anemia: Dietary Iron vs Supplements',
    titleHi: 'गर्भावस्था में एनीमिया प्रबंधन: आहार व आयरन पूरक',
    category: 'maternal_nutrition',
    targetAudience: 'pregnant_mothers',
    author: 'Editorial Team',
    reviewerName: 'Dr. Priya Venkatesh (MD, DGO)',
    reviewerCredentials: 'Senior Consultant Obstetrician, 18 Years Exp.',
    lastReviewedDate: '2026-09-15',
    status: 'published',
    evidenceSource: 'WHO Guideline: Daily iron and folic acid supplementation in pregnant women (2024 updated)',
    content: 'Hemodilution during the second trimester leads to physiological hydremia where plasma volume expands faster than red cell mass...',
  },
  {
    id: 'CMS-102',
    title: 'Universal Immunization Programme (UIP): Essential 6-10-14 Week Vaccines',
    titleHi: 'राष्ट्रीय टीकाकरण कार्यक्रम (UIP): 6, 10, और 14 सप्ताह के आवश्यक टीके',
    category: 'uip_vaccination',
    targetAudience: 'mothers_with_babies',
    author: 'Pediatric Clinical Desk',
    reviewerName: 'Dr. Suresh Rao (MD Pediatrics)',
    reviewerCredentials: 'Chief Pediatrician, Cloudnine Hospitals',
    lastReviewedDate: '2026-10-01',
    status: 'published',
    evidenceSource: 'Ministry of Health & Family Welfare (MoHFW), National Immunization Schedule 2024-2026',
    content: 'Pentavalent vaccine protects infants from diphtheria, pertussis, tetanus, hepatitis B, and Haemophilus influenzae type b...',
  },
];

// Initial Announcements
export const INITIAL_ANNOUNCEMENTS: SystemAnnouncement[] = [
  {
    id: 'ANN-01',
    title: 'Seasonal Heat Wave & Hydration Advisory for Pregnant Mothers',
    titleHi: 'गर्भवती महिलाओं के लिए मौसमी लू व हाइड्रेशन सलाह',
    message: 'High daytime temperatures recorded across South Asia. Pregnant mothers are advised to maintain 2.8 - 3.2L fluid intake daily.',
    messageHi: 'उच्च तापमान के मद्देनजर गर्भवती माताएं प्रतिदिन 2.8 से 3.2 लीटर पानी व तरल पदार्थों का सेवन अवश्य करें।',
    targetRole: 'pregnant_users',
    priority: 'high',
    createdAt: '2026-10-22',
    published: true,
    sentCount: 1420,
  },
];

// Initial Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-901',
    timestamp: '2026-10-24T08:15:22Z',
    adminId: 'adm_01',
    adminName: 'Dr. Meenakshi Sundaram (Super Admin)',
    action: 'LOGIN',
    resource: 'Admin Portal',
    ipAddress: '192.168.1.42',
    details: 'Authenticated via 2FA security protocol',
  },
  {
    id: 'AUD-902',
    timestamp: '2026-10-24T07:30:10Z',
    adminId: 'adm_03',
    adminName: 'Pooja Deshmukh (Content Manager)',
    action: 'UPDATE_CONTENT',
    resource: 'CMS-101',
    ipAddress: '192.168.1.88',
    details: 'Updated dietary reference ranges aligned with ICMR-NIN 2024',
  },
];

const ADMIN_SESSION_KEY = 'mumora_admin_session_v1';
const TICKETS_KEY = 'mumora_admin_tickets_v1';
const REPORT_LOGS_KEY = 'mumora_admin_report_logs_v1';
const CMS_KEY = 'mumora_admin_cms_v1';
const ANNOUNCEMENTS_KEY = 'mumora_admin_announcements_v1';
const AUDIT_KEY = 'mumora_admin_audit_v1';

export class AdminService {
  // Authentication
  static getActiveAdminSession(): AdminUser | null {
    try {
      const raw = localStorage.getItem(ADMIN_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  static loginAdmin(role: AdminRole): AdminUser {
    const admin = DEFAULT_ADMINS.find(a => a.role === role) || DEFAULT_ADMINS[0];
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
    this.logAction(admin.id, admin.name, 'LOGIN', 'Admin Portal', 'Role-based login authorized');
    return admin;
  }

  static logoutAdmin(): void {
    const current = this.getActiveAdminSession();
    if (current) {
      this.logAction(current.id, current.name, 'LOGOUT', 'Admin Portal', 'Admin session terminated');
    }
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }

  // Audit Logger
  static getAuditLogs(): AuditLogEntry[] {
    try {
      const raw = localStorage.getItem(AUDIT_KEY);
      return raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  static logAction(adminId: string, adminName: string, action: string, resource: string, details: string): void {
    const logs = this.getAuditLogs();
    const entry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      adminId,
      adminName,
      action,
      resource,
      ipAddress: '10.0.4.12',
      details,
    };
    logs.unshift(entry);
    localStorage.setItem(AUDIT_KEY, JSON.stringify(logs.slice(0, 50)));
  }

  // Support Tickets
  static getTickets(): SupportTicket[] {
    try {
      const raw = localStorage.getItem(TICKETS_KEY);
      return raw ? JSON.parse(raw) : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  }

  static updateTicketStatus(ticketId: string, status: SupportTicket['status']): void {
    const tickets = this.getTickets();
    const t = tickets.find(x => x.id === ticketId);
    if (t) {
      t.status = status;
      t.updatedAt = new Date().toISOString();
      localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    }
  }

  static addTicketNote(ticketId: string, note: string): void {
    const tickets = this.getTickets();
    const t = tickets.find(x => x.id === ticketId);
    if (t) {
      t.internalNotes.push(`[${new Date().toLocaleDateString()}] ${note}`);
      t.updatedAt = new Date().toISOString();
      localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    }
  }

  // Report Processing Logs
  static getReportLogs(): ReportProcessingLog[] {
    try {
      const raw = localStorage.getItem(REPORT_LOGS_KEY);
      return raw ? JSON.parse(raw) : INITIAL_REPORT_LOGS;
    } catch {
      return INITIAL_REPORT_LOGS;
    }
  }

  static retryReportProcessing(logId: string): void {
    const logs = this.getReportLogs();
    const l = logs.find(x => x.id === logId);
    if (l) {
      l.aiStatus = 'success';
      l.ocrStatus = 'success';
      l.isRetryable = false;
      l.errorMessage = undefined;
      l.confidenceScore = 0.89;
      localStorage.setItem(REPORT_LOGS_KEY, JSON.stringify(logs));
    }
  }

  // CMS Articles
  static getArticles(): CmsArticle[] {
    try {
      const raw = localStorage.getItem(CMS_KEY);
      return raw ? JSON.parse(raw) : INITIAL_CMS_ARTICLES;
    } catch {
      return INITIAL_CMS_ARTICLES;
    }
  }

  static toggleArticleStatus(articleId: string): void {
    const articles = this.getArticles();
    const a = articles.find(x => x.id === articleId);
    if (a) {
      a.status = a.status === 'published' ? 'draft' : 'published';
      localStorage.setItem(CMS_KEY, JSON.stringify(articles));
    }
  }

  // Announcements
  static getAnnouncements(): SystemAnnouncement[] {
    try {
      const raw = localStorage.getItem(ANNOUNCEMENTS_KEY);
      return raw ? JSON.parse(raw) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  }

  static createAnnouncement(announcement: Omit<SystemAnnouncement, 'id' | 'createdAt' | 'sentCount'>): SystemAnnouncement {
    const list = this.getAnnouncements();
    const item: SystemAnnouncement = {
      ...announcement,
      id: `ANN-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      sentCount: announcement.published ? 1420 : 0,
    };
    list.unshift(item);
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(list));
    return item;
  }
}
