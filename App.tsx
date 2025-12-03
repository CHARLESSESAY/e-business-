
import React, { useState, useMemo } from 'react';
import { Company, LegalForm, ReportStatus, ViewState, AuditLog, AnnualReport } from './types';
import { generateHash, formatCurrency, formatDate } from './utils';
import { SearchFilters } from './components/SearchFilters';
import { AIAssistant } from './components/AIAssistant';
import { 
  Building2, 
  ShieldCheck, 
  ChevronRight, 
  FileText, 
  History, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Search,
  Globe,
  Lock,
  User,
  LogOut,
  Briefcase,
  Download,
  ExternalLink,
  Users,
  AlertTriangle,
  Network,
  Database,
  Hand, 
  FileSpreadsheet,
  FileCode,
  Edit,
  Save,
  Clock,
  Settings,
  PenTool,
  Home,
  Plus,
  Image as ImageIcon,
  MapPin,
  Video
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_COMPANIES: Company[] = [
  {
    id: 'c1',
    registryCode: 'SL-2023-001245',
    name: 'Lion Mountains Mining Ltd',
    legalForm: LegalForm.LTD,
    registrationDate: '2020-03-15',
    capital: 5000000,
    address: '12 Wilkinson Road, Freetown',
    website: 'www.lionmines.sl',
    businessLogo: 'https://placehold.co/200x200/2563eb/ffffff?text=LMM',
    status: 'Active',
    managementBoard: ['Amara Bangura', 'Sarah Cole'], 
    contactEmail: 'info@lionmines.sl',
    contactPhone: '+232 76 000 000',
    beneficialOwners: ['Global Mining Corp', 'Ibrahim Bah'],
    taxDebt: 0,
    commercialPledges: 2,
    relationships: [
        { entity: 'Global Mining Corp', type: 'Parent' },
        { entity: 'Lion Transport Services', type: 'Subsidiary' }
    ],
    reports: [
      { year: 2023, status: ReportStatus.APPROVED, revenue: 12000000, transactionVolume: 4500, submissionDate: '2024-02-10', filedBy: 'Sarah Cole' },
      { year: 2022, status: ReportStatus.APPROVED, revenue: 9500000, transactionVolume: 3200, submissionDate: '2023-03-01', filedBy: 'Sarah Cole' }
    ],
    history: [
      { id: 'h1', timestamp: '2024-02-10T14:30:00Z', action: 'REPORT_SUBMITTED', details: 'Annual Report 2023 submitted', previousHash: '0x3a1f8...', hash: '0x9f2b3...', actor: 'User: S.Cole' },
      { id: 'h2', timestamp: '2020-03-15T09:00:00Z', action: 'REGISTRATION', details: 'Company Registered', previousHash: '0x00000...', hash: '0x3a1f8...', actor: 'Registrar' }
    ]
  },
  {
    id: 'c2',
    registryCode: 'SL-2021-008821',
    name: 'Salone Tech Innovators',
    legalForm: LegalForm.PLC,
    registrationDate: '2021-06-20',
    capital: 150000,
    address: '45 Siaka Stevens Street, Freetown',
    website: 'www.salonetech.com',
    businessLogo: 'https://placehold.co/200x200/16a34a/ffffff?text=STI',
    status: 'Active',
    managementBoard: ['David Mansaray'],
    contactEmail: 'hello@salonetech.com',
    contactPhone: '+232 99 111 222',
    beneficialOwners: ['David Mansaray'],
    taxDebt: 5000,
    commercialPledges: 0,
    relationships: [
        { entity: 'Freetown Hub', type: 'Partner' }
    ],
    reports: [
      { year: 2023, status: ReportStatus.MISSING }
    ],
    history: [
      { id: 'h3', timestamp: '2021-06-20T10:15:00Z', action: 'REGISTRATION', details: 'Company Registered', previousHash: '0x00000...', hash: '0x7b4c2...', actor: 'Registrar' }
    ]
  },
  {
    id: 'c3',
    registryCode: 'SL-2019-003311',
    name: 'Bo Agricultural Co-op',
    legalForm: LegalForm.NGO,
    registrationDate: '2019-01-10',
    capital: 25000,
    address: '5 Bo-Kenema Highway, Bo',
    website: 'www.bo-agri.org',
    businessLogo: '',
    status: 'Active',
    managementBoard: ['Chief Kamara'],
    contactEmail: 'contact@bo-agri.org',
    contactPhone: '+232 33 444 555',
    beneficialOwners: ['Community Trust'],
    taxDebt: 0,
    commercialPledges: 0,
    relationships: [],
    reports: [
      { year: 2023, status: ReportStatus.APPROVED, revenue: 450000, transactionVolume: 120 }
    ],
    history: [
      { id: 'h4', timestamp: '2019-01-10T08:30:00Z', action: 'REGISTRATION', details: 'Company Registered', previousHash: '0x00000...', hash: '0x2c9a1...', actor: 'Registrar' }
    ]
  }
];

type Tab = 'GENERAL' | 'REPORTS' | 'GOVERNANCE' | 'HISTORY' | 'VISUALIZER';

type ExtendedViewState = ViewState | 'PORTAL_LOGIN' | 'PORTAL_DASHBOARD' | 'PORTAL_FILE_REPORT' | 'PORTAL_EDIT_DETAILS' | 'NAME_CHECK' | 'OPEN_DATA';

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    directoryTitle: 'SL Business Directory',
    searchPlaceholder: 'Search by company name or registry code...',
    checkName: 'Check Name Availability',
    login: 'Login',
    myPortal: 'My Portal',
    dashboard: 'Dashboard',
    search: 'Directory Search',
    openData: 'Open Data / Bulk',
    langName: 'English',
    pendingReports: 'Pending Reports',
    approvedReports: 'Approved Reports',
    fileReport: 'File Annual Report',
    editProfile: 'Edit Profile',
    status: 'Status',
    revenue: 'Revenue (SLE)',
    txVolume: 'Tx Volume',
    actions: 'Actions',
    approve: 'Approve',
    reject: 'Reject',
    businessLogin: 'Business Login',
    registryCode: 'Registry Code / Business ID',
    home: 'Home'
  },
  zh: {
    directoryTitle: '塞拉利昂商业目录 (SL Registry)',
    searchPlaceholder: '按公司名称或注册码搜索...',
    checkName: '检查名称可用性',
    login: '登录',
    myPortal: '我的门户',
    dashboard: '仪表板',
    search: '目录搜索',
    openData: '开放数据',
    langName: '中文 (Chinese)',
    pendingReports: '待处理报告',
    approvedReports: '已批准报告',
    fileReport: '提交年度报告',
    editProfile: '编辑资料',
    status: '状态',
    revenue: '收入 (SLE)',
    txVolume: '交易量',
    actions: '操作',
    approve: '批准',
    reject: '拒绝',
    businessLogin: '企业登录',
    registryCode: '注册码 / 企业ID',
    home: '首页'
  },
  fr: {
    directoryTitle: 'Répertoire des Entreprises SL',
    searchPlaceholder: 'Rechercher par nom ou code...',
    checkName: 'Vérifier la Disponibilité du Nom',
    login: 'Connexion',
    myPortal: 'Mon Portail',
    dashboard: 'Tableau de Bord',
    search: 'Recherche',
    openData: 'Données Ouvertes',
    langName: 'Français',
    pendingReports: 'Rapports en attente',
    approvedReports: 'Rapports approuvés',
    fileReport: 'Déposer le rapport annuel',
    editProfile: 'Modifier le profil',
    status: 'Statut',
    revenue: 'Revenu (SLE)',
    txVolume: 'Volume Tx',
    actions: 'Actions',
    approve: 'Approuver',
    reject: 'Rejeter',
    businessLogin: 'Connexion Entreprise',
    registryCode: 'Code de registre / ID',
    home: 'Accueil'
  }
};

type LangCode = 'en' | 'zh' | 'fr';

// --- ACCESSIBILITY COMPONENTS ---

const SignLanguageInterpreter: React.FC<{ isActive: boolean, isSigning: boolean }> = ({ isActive, isSigning }) => {
  if (!isActive) return null;

  return (
    <div className="fixed bottom-24 left-6 z-50 animate-bounce-in transition-all duration-300">
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl border-4 border-yellow-400 w-48">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">BSL Interpreter</span>
                <div className={`h-2 w-2 rounded-full ${isSigning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            </div>
            {/* Simulated Avatar Area */}
            <div className="h-32 bg-slate-800 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden group cursor-pointer border border-slate-700">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-700 to-slate-800"></div>
                
                {/* Animated Avatar Representation */}
                <div className={`relative transition-transform duration-300 ${isSigning ? 'scale-105' : ''}`}>
                    <User className={`w-16 h-16 text-slate-500 transition-colors ${isSigning ? 'text-yellow-100' : ''}`} />
                    {isSigning && (
                        <>
                            {/* Simulated Hand Movements */}
                            <div className="absolute top-10 -left-2 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-[ping_1s_infinite]"></div>
                            <div className="absolute top-10 -right-2 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-[ping_1s_infinite_0.5s]"></div>
                        </>
                    )}
                </div>

                <div className="absolute bottom-0 w-full h-1 bg-yellow-400 opacity-50"></div>
                <div className="absolute top-2 right-2 bg-black/50 px-1 rounded text-[8px] flex items-center gap-1">
                    <Video className="w-2 h-2" /> LIVE
                </div>
            </div>
            <p className="text-[10px] text-center text-slate-400 animate-pulse">
              {isSigning ? 'Translating to BSL...' : 'Interpreter Standing By'}
            </p>
        </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<ExtendedViewState>('SEARCH');
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('GENERAL');
  const [lang, setLang] = useState<LangCode>('en');
  
  // Accessibility State
  const [signLanguageMode, setSignLanguageMode] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);

  // Name Check State
  const [nameAvailability, setNameAvailability] = useState<'IDLE' | 'CHECKING' | 'AVAILABLE' | 'TAKEN'>('IDLE');
  const [nameCheckValue, setNameCheckValue] = useState('');

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForm, setSelectedForm] = useState('');
  const [minCapital, setMinCapital] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState<{name: string, role: 'USER' | 'ADMIN' | 'BUSINESS', companyId?: string} | null>(null);
  const [loginTab, setLoginTab] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [businessIdInput, setBusinessIdInput] = useState('');

  // Reporting/Editing State
  const [reportingCompanyId, setReportingCompanyId] = useState<string | null>(null);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);

  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key] || key;

  // Filter Companies
  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const termLower = searchTerm.toLowerCase();
      const matchesTerm = c.name.toLowerCase().includes(termLower) || 
                          c.registryCode.toLowerCase().includes(termLower);
      const matchesForm = selectedForm ? c.legalForm === selectedForm : true;
      const matchesCapital = minCapital ? c.capital >= Number(minCapital) : true;
      const matchesDate = dateFrom ? new Date(c.registrationDate) >= new Date(dateFrom) : true;
      return matchesTerm && matchesForm && matchesCapital && matchesDate;
    });
  }, [companies, searchTerm, selectedForm, minCapital, dateFrom]);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  // --- ACTIONS ---

  const handleViewCompany = (id: string) => {
    setSelectedCompanyId(id);
    setActiveTab('GENERAL');
    setView('COMPANY_DETAIL');
  };

  const handleLogin = (role: 'USER' | 'ADMIN') => {
    setCurrentUser({
        name: role === 'ADMIN' ? 'Registrar Admin' : 'Amara Bangura',
        role: role
    });
    if (role === 'ADMIN') {
        setView('ADMIN_DASHBOARD');
    } else {
        setView('PORTAL_DASHBOARD');
    }
  };

  const handleBusinessLogin = () => {
    const company = companies.find(c => c.registryCode === businessIdInput.trim());
    if (company) {
        setCurrentUser({
            name: company.name,
            role: 'BUSINESS',
            companyId: company.id
        });
        setView('PORTAL_DASHBOARD');
    } else {
        alert("Invalid Business Registry Code");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setBusinessIdInput('');
    setView('SEARCH');
  };

  const checkNameAvailability = (name: string) => {
    if (!name.trim()) {
        setNameAvailability('IDLE');
        return;
    }
    setNameAvailability('CHECKING');
    setTimeout(() => {
        const taken = companies.some(c => c.name.toLowerCase() === name.toLowerCase());
        setNameAvailability(taken ? 'TAKEN' : 'AVAILABLE');
    }, 800);
  };

  const addAuditLog = (companyId: string, action: string, details: string, actor: string) => {
    setCompanies(prev => prev.map(c => {
      if (c.id !== companyId) return c;
      const lastHash = c.history[0]?.hash || '0x00000000';
      const timestamp = new Date().toISOString();
      const rawData = `${timestamp}-${action}-${details}-${lastHash}`;
      const newHash = generateHash(rawData);
      const newLog: AuditLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp,
        action,
        details,
        previousHash: lastHash,
        hash: newHash,
        actor
      };
      return { ...c, history: [newLog, ...c.history] };
    }));
  };

  // User submits a report draft
  const handleUserSubmitReport = (companyId: string, year: number, revenue: number, txVolume: number) => {
    setCompanies(prev => prev.map(c => {
        if (c.id !== companyId) return c;
        const newReport: AnnualReport = {
            year,
            status: ReportStatus.SUBMITTED,
            revenue,
            transactionVolume: txVolume,
            submissionDate: new Date().toISOString().split('T')[0],
            filedBy: currentUser?.name || 'User'
        };
        // Remove old draft if exists for same year
        const otherReports = c.reports.filter(r => r.year !== year);
        return { ...c, reports: [newReport, ...otherReports] };
    }));
    addAuditLog(companyId, 'REPORT_SUBMITTED', `Annual Report ${year} Submitted for Approval`, currentUser?.name || 'User');
    setView('PORTAL_DASHBOARD');
  };

  // Admin approves/rejects report
  const handleAdminReviewReport = (companyId: string, year: number, approved: boolean) => {
    setCompanies(prev => prev.map(c => {
        if (c.id !== companyId) return c;
        const updatedReports = c.reports.map(r => {
            if (r.year === year) {
                return { ...r, status: approved ? ReportStatus.APPROVED : ReportStatus.REJECTED };
            }
            return r;
        });
        return { ...c, reports: updatedReports };
    }));
    const action = approved ? 'REPORT_APPROVED' : 'REPORT_REJECTED';
    addAuditLog(companyId, action, `Annual Report ${year} ${approved ? 'Approved' : 'Rejected'} by Admin`, 'Registrar Admin');
  };

  // Admin OR Business Owner Update
  const handleUpdateCompanyDetails = (companyId: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => {
        if (c.id !== companyId) return c;
        return { ...c, ...updates };
    }));
    
    // Create detailed log string
    const changes = Object.keys(updates).map(k => `${k} updated`).join(', ');
    const actor = currentUser?.role === 'BUSINESS' ? 'Business Admin' : 'Registrar Admin';
    const action = currentUser?.role === 'BUSINESS' ? 'BUSINESS_UPDATE' : 'ADMIN_UPDATE';
    
    addAuditLog(companyId, action, `Details Modified: ${changes}`, actor);
    
    if (currentUser?.role === 'BUSINESS') {
        setView('PORTAL_DASHBOARD');
    } else {
        setEditingCompanyId(null); // Close admin modal
    }
  };

  // Registrar Admin: Add New Entry
  const handleRegistrarAddEntry = (name: string, form: LegalForm, regCode: string) => {
      const newId = `c${Date.now()}`;
      const newCompany: Company = {
          id: newId,
          registryCode: regCode,
          name: name,
          legalForm: form,
          registrationDate: new Date().toISOString().split('T')[0],
          capital: 0,
          address: 'Pending Address Entry',
          businessLogo: '',
          status: 'Active',
          managementBoard: [],
          contactEmail: '',
          contactPhone: '',
          beneficialOwners: [],
          taxDebt: 0,
          commercialPledges: 0,
          relationships: [],
          reports: [],
          history: [{
              id: `h${Date.now()}`,
              timestamp: new Date().toISOString(),
              action: 'DATA_ENTRY',
              details: `Manual Entry by Registrar Admin`,
              previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
              hash: generateHash('INIT_ENTRY'),
              actor: 'Registrar Admin'
          }]
      };
      setCompanies([newCompany, ...companies]);
      alert(`Entity "${name}" added to registry successfully.`);
  };

  // --- DOWNLOAD HELPERS ---
  const downloadData = (format: 'JSON' | 'CSV' | 'XML') => {
     let content = '';
     let mimeType = '';
     if (format === 'JSON') {
        content = JSON.stringify(companies, null, 2);
        mimeType = 'application/json';
     } else if (format === 'CSV') {
        const headers = ['RegistryCode', 'Name', 'LegalForm', 'Status', 'Capital', 'Revenue(Latest)'];
        const rows = companies.map(c => [
            c.registryCode, c.name, c.legalForm, c.status, c.capital, c.reports[0]?.revenue || 0
        ].join(','));
        content = [headers.join(','), ...rows].join('\n');
        mimeType = 'text/csv';
     } else {
        content = `<companies>${companies.map(c => `<company><code>${c.registryCode}</code><name>${c.name}</name></company>`).join('')}</companies>`;
        mimeType = 'application/xml';
     }
     const blob = new Blob([content], { type: mimeType });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `sl_registry_data.${format.toLowerCase()}`;
     a.click();
  };

  // --- RENDERERS ---

  const renderNavbar = () => (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer gap-3" onClick={() => setView('SEARCH')}>
            <div className="bg-gradient-to-br from-green-600 to-blue-600 p-2 rounded-lg shadow-sm">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">{t('directoryTitle')}</h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase mt-1">Republic of Sierra Leone</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             {/* Home Button */}
             <button 
                onClick={() => setView('SEARCH')}
                className="hidden sm:flex p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title={t('home')}
             >
                <Home className="w-5 h-5" />
             </button>

             <button onClick={() => setSignLanguageMode(!signLanguageMode)} className={`p-2 rounded-full transition-colors ${signLanguageMode ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400' : 'text-slate-400 hover:text-slate-600'}`} title="Toggle Sign Language Interpreter">
                <Hand className="w-5 h-5" />
             </button>

            <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1 mr-2">
                {(['en', 'zh', 'fr'] as LangCode[]).map((l) => (
                    <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 text-xs font-bold rounded ${lang === l ? 'bg-white shadow text-blue-700' : 'text-slate-500 hover:text-slate-900'}`}>
                        {l === 'zh' ? '中文' : l.toUpperCase()}
                    </button>
                ))}
            </div>

            <button onClick={() => setView('OPEN_DATA')} className={`hidden sm:flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'OPEN_DATA' ? 'text-blue-700 bg-blue-50' : 'text-slate-500 hover:text-slate-900'}`}>
              <Database className="w-4 h-4" />
              {t('openData')}
            </button>
            
            {currentUser ? (
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                    <span className="text-sm font-medium text-slate-700 hidden sm:block truncate max-w-[150px]">{currentUser.name}</span>
                    <button onClick={() => currentUser.role === 'ADMIN' ? setView('ADMIN_DASHBOARD') : setView('PORTAL_DASHBOARD')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100`}>
                        {t('dashboard')}
                    </button>
                    <button onClick={handleLogout} className="text-slate-400 hover:text-red-600">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-3 ml-4">
                    <button onClick={() => setView('PORTAL_LOGIN')} className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        {t('login')}
                    </button>
                    <button onClick={() => setView('NAME_CHECK')} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm hover:bg-blue-700 transition-all flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        {t('checkName')}
                    </button>
                </div>
            )}
          </div>
        </div>
        {signLanguageMode && (
            <div className="bg-yellow-50 border-t border-yellow-100 p-2 flex items-center justify-center gap-2 text-xs text-yellow-800 font-medium animate-pulse">
                <Hand className="w-4 h-4" />
                <span>Sign Language (BSL) Mode Active: Accessibility features enabled</span>
            </div>
        )}
      </div>
    </nav>
  );

  const renderLogin = () => (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-slate-900 p-6 text-center">
                <ShieldCheck className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">{t('login')}</h2>
            </div>
            
            <div className="flex border-b border-slate-200">
                <button 
                    onClick={() => setLoginTab('PERSONAL')}
                    className={`flex-1 py-3 text-sm font-bold ${loginTab === 'PERSONAL' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Personal ID
                </button>
                <button 
                    onClick={() => setLoginTab('BUSINESS')}
                    className={`flex-1 py-3 text-sm font-bold ${loginTab === 'BUSINESS' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {t('businessLogin')}
                </button>
            </div>

            <div className="p-8 space-y-4">
                {loginTab === 'PERSONAL' ? (
                    <>
                        <button onClick={() => handleLogin('USER')} className="w-full flex items-center p-4 border rounded-xl hover:bg-blue-50 transition-all">
                            <User className="w-6 h-6 text-blue-600 mr-4" />
                            <div className="text-left">
                                <h3 className="font-bold text-slate-900">Mobile ID / User Portal</h3>
                                <p className="text-xs text-slate-500">For owners & board members</p>
                            </div>
                        </button>
                        <button onClick={() => handleLogin('ADMIN')} className="w-full py-2 text-sm text-slate-500 hover:text-slate-900">
                            Login as Registrar Admin
                        </button>
                    </>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleBusinessLogin(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('registryCode')}</label>
                            <input 
                                type="text" 
                                value={businessIdInput}
                                onChange={(e) => setBusinessIdInput(e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                                placeholder="e.g. SL-2023-..."
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
                            {t('login')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    </div>
  );

  const renderEditCompanyDetails = () => {
    if (!reportingCompanyId) return null;
    const company = companies.find(c => c.id === reportingCompanyId);
    if (!company) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 min-h-[calc(100vh-64px)]">
            <button onClick={() => setView('PORTAL_DASHBOARD')} className="flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </button>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Settings className="w-5 h-5" /> {t('editProfile')}
                    </h2>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">{company.registryCode}</span>
                </div>
                
                <div className="p-8">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        handleUpdateCompanyDetails(company.id, {
                            address: formData.get('address') as string,
                            website: formData.get('website') as string,
                            contactEmail: formData.get('email') as string,
                            contactPhone: formData.get('phone') as string,
                            businessLogo: formData.get('businessLogo') as string
                        });
                    }} className="space-y-6">
                        
                        {/* Logo Upload Simulation */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center gap-4">
                            <div className="h-16 w-16 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-300 overflow-hidden">
                                {company.businessLogo ? (
                                    <img 
                                        src={company.businessLogo} 
                                        alt="Logo" 
                                        className="h-full w-full object-cover" 
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/e2e8f0/64748b?text=Logo';
                                        }}
                                    />
                                ) : <ImageIcon className="w-8 h-8" />}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Business Logo URL</label>
                                <input name="businessLogo" type="text" defaultValue={company.businessLogo} className="w-full border rounded-lg px-4 py-2 text-sm" placeholder="https://..." />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Registered Address
                            </label>
                            <textarea name="address" rows={2} defaultValue={company.address} className="w-full border rounded-lg px-4 py-2" required />
                            <p className="text-xs text-green-600 mt-1">* Exclusive to Business Admin</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Website URL</label>
                                <input name="website" type="text" defaultValue={company.website} className="w-full border rounded-lg px-4 py-2" placeholder="www.example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Contact Phone</label>
                                <input name="phone" type="tel" defaultValue={company.contactPhone} className="w-full border rounded-lg px-4 py-2" />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Official Email</label>
                                <input name="email" type="email" defaultValue={company.contactEmail} className="w-full border rounded-lg px-4 py-2" />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Changes & Update Ledger
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
  };

  const renderFileReport = () => {
    if (!reportingCompanyId) return null;
    const company = companies.find(c => c.id === reportingCompanyId);
    if (!company) return null;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 min-h-[calc(100vh-64px)]">
             <button onClick={() => setView('PORTAL_DASHBOARD')} className="flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>
            <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    {t('fileReport')}
                </h2>
                <div className="mb-6 p-4 bg-slate-50 rounded">
                    <p className="font-bold">{company.name}</p>
                    <p className="text-sm text-slate-500">{company.registryCode}</p>
                </div>
                
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleUserSubmitReport(
                        company.id,
                        Number(formData.get('year')),
                        Number(formData.get('revenue')),
                        Number(formData.get('txVolume'))
                    );
                }} className="space-y-6">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Fiscal Year</label>
                        <input name="year" type="number" defaultValue={new Date().getFullYear() - 1} className="w-full border rounded px-4 py-2" required />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">{t('revenue')}</label>
                        <input name="revenue" type="number" className="w-full border rounded px-4 py-2" required />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">{t('txVolume')} (Proven)</label>
                        <input name="txVolume" type="number" className="w-full border rounded px-4 py-2" required placeholder="Total confirmed transactions" />
                        <p className="text-xs text-slate-500 mt-1">Requires Admin Verification</p>
                     </div>
                     
                     <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
                         Submit for Approval
                     </button>
                </form>
            </div>
        </div>
    );
  };

  const renderPortalDashboard = () => {
    // If Business Login, show single company. If User Login, show all associated.
    let myCompanies: Company[] = [];
    if (currentUser?.role === 'BUSINESS' && currentUser.companyId) {
        const c = companies.find(x => x.id === currentUser.companyId);
        if (c) myCompanies = [c];
    } else if (currentUser?.role === 'USER') {
        myCompanies = companies.filter(c => c.managementBoard.includes(currentUser.name));
    }

    return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-64px)]">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">{t('myPortal')}</h1>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">{currentUser?.role === 'BUSINESS' ? 'BUSINESS ADMIN' : 'AUTHORIZED USER'}</span>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Managed Entities</h2>
            {myCompanies.length > 0 ? (
                <div className="space-y-4">
                    {myCompanies.map(c => (
                        <div key={c.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 gap-4">
                            <div>
                                <p className="font-bold text-slate-800 text-lg">{c.name}</p>
                                <div className="flex gap-3 text-sm text-slate-500">
                                    <span>{c.registryCode}</span>
                                    <span>•</span>
                                    <span className={c.status === 'Active' ? 'text-green-600 font-medium' : 'text-red-500'}>{c.status}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => { setReportingCompanyId(c.id); setView('PORTAL_EDIT_DETAILS'); }}
                                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded hover:bg-slate-100 transition flex items-center gap-2"
                                >
                                    <PenTool className="w-4 h-4" /> {t('editProfile')}
                                </button>
                                <button 
                                    onClick={() => { setReportingCompanyId(c.id); setView('PORTAL_FILE_REPORT'); }}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700 transition flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" /> {t('fileReport')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-slate-500 italic">No associated entities found.</p>
            )}
        </div>
    </div>
  )};

  const renderAdminDashboard = () => {
    // Get Pending Reports
    const pendingReports = companies.flatMap(c => 
        c.reports.filter(r => r.status === ReportStatus.SUBMITTED).map(r => ({ company: c, report: r }))
    );

    return (
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-64px)]">
        <div className="mb-8 border-b pb-4">
            <h1 className="text-2xl font-bold text-slate-900">Registrar Admin Dashboard</h1>
            <p className="text-slate-500">Manage Due Diligence, Status, & Data Entry</p>
        </div>

        {/* Data Entry System */}
        <div className="bg-slate-900 rounded-lg shadow-xl overflow-hidden mb-8 text-white p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-green-400" /> New Entity Data Entry
            </h3>
            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleRegistrarAddEntry(
                    formData.get('name') as string,
                    formData.get('form') as LegalForm,
                    formData.get('code') as string
                );
                (e.target as HTMLFormElement).reset();
            }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input name="name" placeholder="Entity Name" className="text-slate-900 px-4 py-2 rounded" required />
                <select name="form" className="text-slate-900 px-4 py-2 rounded">
                    {Object.values(LegalForm).map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <input name="code" placeholder="Generated Registry Code" className="text-slate-900 px-4 py-2 rounded" required />
                <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add to Registry
                </button>
            </form>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden mb-8">
            <div className="px-6 py-4 bg-orange-50 border-b border-orange-100">
                <h3 className="font-bold text-orange-900 flex items-center gap-2">
                    <Clock className="w-5 h-5" /> {t('pendingReports')} ({pendingReports.length})
                </h3>
            </div>
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Entity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Year</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('revenue')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('txVolume')}</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {pendingReports.map(({company, report}) => (
                        <tr key={`${company.id}-${report.year}`}>
                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{company.name}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{report.year}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatCurrency(report.revenue || 0)}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{report.transactionVolume}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                                <button onClick={() => handleAdminReviewReport(company.id, report.year, true)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">{t('approve')}</button>
                                <button onClick={() => handleAdminReviewReport(company.id, report.year, false)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">{t('reject')}</button>
                             </td>
                        </tr>
                    ))}
                    {pendingReports.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">No pending reports for review.</td></tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Directory Management */}
        <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
             <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold text-slate-700">Full Directory Management</h3>
            </div>
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Entity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Last Report</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {companies.map(c => (
                        <tr key={c.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-slate-900">{c.name}</div>
                                <div className="text-xs text-slate-500">{c.registryCode}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {c.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{c.reports[0]?.year || 'None'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => setEditingCompanyId(c.id)} className="text-blue-600 hover:text-blue-900 flex items-center justify-end gap-1 ml-auto">
                                    <Settings className="w-4 h-4" /> Manage
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Admin Manage Modal - Restricted to Status Only */}
        {editingCompanyId && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                    {(() => {
                        const target = companies.find(c => c.id === editingCompanyId);
                        if (!target) return null;
                        return (
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6 border-b pb-4">
                                    <h2 className="text-xl font-bold">Manage Status: {target.name}</h2>
                                    <button onClick={() => setEditingCompanyId(null)} className="text-slate-400 hover:text-red-500"><XCircle className="w-6 h-6" /></button>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-yellow-50 p-4 rounded text-sm text-yellow-800 mb-4">
                                        Note: Address and details must be updated by the Business Admin. Registrar Admins are restricted to Status changes.
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700">Entity Status</label>
                                        <div className="flex gap-2">
                                            <select 
                                                id="admin-status" 
                                                defaultValue={target.status}
                                                className="flex-1 border rounded px-3 py-2"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="Liquidated">Liquidated</option>
                                                <option value="Bankruptcy">Bankruptcy</option>
                                            </select>
                                            <button 
                                                onClick={() => {
                                                    const newStatus = (document.getElementById('admin-status') as HTMLSelectElement).value;
                                                    handleUpdateCompanyDetails(target.id, { status: newStatus as any });
                                                }}
                                                className="bg-slate-900 text-white px-4 py-2 rounded font-bold text-sm"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>
        )}
     </div>
    );
  };

  // ... (Keep existing renderCompanyDetail, renderSearch, renderNameCheckView, renderOpenData)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {renderNavbar()}
      
      <main className="flex-grow">
        {view === 'SEARCH' && renderSearch()}
        {view === 'COMPANY_DETAIL' && renderCompanyDetail()}
        {view === 'ADMIN_DASHBOARD' && renderAdminDashboard()}
        
        {/* New Views */}
        {view === 'NAME_CHECK' && renderNameCheckView()}
        {view === 'OPEN_DATA' && renderOpenData()}
        
        {/* Portal Views */}
        {view === 'PORTAL_LOGIN' && renderLogin()}
        {view === 'PORTAL_DASHBOARD' && renderPortalDashboard()}
        {view === 'PORTAL_FILE_REPORT' && renderFileReport()}
        {view === 'PORTAL_EDIT_DETAILS' && renderEditCompanyDetails()}
      </main>

      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Government of Sierra Leone.</p>
        </div>
      </footer>
      <AIAssistant onThinking={setIsAIThinking} />
      <SignLanguageInterpreter isActive={signLanguageMode} isSigning={isAIThinking} />
    </div>
  );
}
