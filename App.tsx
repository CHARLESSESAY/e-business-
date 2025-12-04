
import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Video,
  Calendar
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
type LangCode = 'en' | 'zh' | 'fr' | 'es' | 'hi' | 'ru';

// --- TRANSLATIONS & DICTIONARY ---

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
    home: 'Home',
    legalForm: 'Legal Form',
    registered: 'Registered',
    capital: 'Capital',
    viewDetails: 'View Details',
    details: 'Details',
    address: 'Address',
    topMembers: 'Top Members',
    contact: 'Contact',
    email: 'Email',
    phone: 'Phone',
    beneficialOwners: 'Beneficial Owners',
    commercialPledges: 'Commercial Pledges',
    taxStatus: 'Tax Status',
    goodStanding: 'Good Standing',
    taxDebt: 'Tax Debt Found',
    year: 'Year',
    filedBy: 'Filed By',
    visualizer: 'Visualizer',
    generalInfo: 'General Info',
    governance: 'Governance & Risk',
    history: 'History',
    reports: 'Reports'
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
    langName: '中文',
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
    home: '首页',
    legalForm: '法律形式',
    registered: '注册',
    capital: '首都',
    viewDetails: '查看详情',
    details: '详情',
    address: '地址',
    topMembers: '高级成员',
    contact: '联系',
    email: '电子邮件',
    phone: '电话',
    beneficialOwners: '受益所有人',
    commercialPledges: '商业质押',
    taxStatus: '税务状况',
    goodStanding: '信誉良好',
    taxDebt: '发现税务债务',
    year: '年',
    filedBy: '提交人',
    visualizer: '可视化',
    generalInfo: '基本信息',
    governance: '治理与风险',
    history: '历史',
    reports: '报告'
  },
  fr: {
    directoryTitle: 'Répertoire des Entreprises SL',
    searchPlaceholder: 'Rechercher par nom ou code...',
    checkName: 'Vérifier la Disponibilité',
    login: 'Connexion',
    myPortal: 'Mon Portail',
    dashboard: 'Tableau de Bord',
    search: 'Recherche',
    openData: 'Données Ouvertes',
    langName: 'Français',
    pendingReports: 'Rapports en attente',
    approvedReports: 'Rapports approuvés',
    fileReport: 'Déposer le rapport',
    editProfile: 'Modifier le profil',
    status: 'Statut',
    revenue: 'Revenu (SLE)',
    txVolume: 'Volume Tx',
    actions: 'Actions',
    approve: 'Approuver',
    reject: 'Rejeter',
    businessLogin: 'Connexion Entreprise',
    registryCode: 'Code de registre / ID',
    home: 'Accueil',
    legalForm: 'Forme Juridique',
    registered: 'Enregistré',
    capital: 'Capital',
    viewDetails: 'Voir Détails',
    details: 'Détails',
    address: 'Adresse',
    topMembers: 'Membres Principaux',
    contact: 'Contact',
    email: 'Email',
    phone: 'Téléphone',
    beneficialOwners: 'Bénéficiaires Effectifs',
    commercialPledges: 'Gages Commerciaux',
    taxStatus: 'Statut Fiscal',
    goodStanding: 'En Règle',
    taxDebt: 'Dette Fiscale Trouvée',
    year: 'Année',
    filedBy: 'Déposé Par',
    visualizer: 'Visualiseur',
    generalInfo: 'Infos Générales',
    governance: 'Gouvernance',
    history: 'Historique',
    reports: 'Rapports'
  },
  es: {
    directoryTitle: 'Directorio de Empresas SL',
    searchPlaceholder: 'Buscar por nombre o código...',
    checkName: 'Verificar Nombre',
    login: 'Acceso',
    myPortal: 'Mi Portal',
    dashboard: 'Tablero',
    search: 'Búsqueda',
    openData: 'Datos Abiertos',
    langName: 'Español',
    pendingReports: 'Informes Pendientes',
    approvedReports: 'Informes Aprobados',
    fileReport: 'Presentar Informe',
    editProfile: 'Editar Perfil',
    status: 'Estado',
    revenue: 'Ingresos (SLE)',
    txVolume: 'Volumen Tx',
    actions: 'Acciones',
    approve: 'Aprobar',
    reject: 'Rechazar',
    businessLogin: 'Acceso Empresarial',
    registryCode: 'Código de Registro',
    home: 'Inicio',
    legalForm: 'Forma Legal',
    registered: 'Registrado',
    capital: 'Capital',
    viewDetails: 'Ver Detalles',
    details: 'Detalles',
    address: 'Dirección',
    topMembers: 'Miembros Principales',
    contact: 'Contacto',
    email: 'Correo',
    phone: 'Teléfono',
    beneficialOwners: 'Propietarios Beneficiarios',
    commercialPledges: 'Prendas Comerciales',
    taxStatus: 'Estado Fiscal',
    goodStanding: 'Buen Estado',
    taxDebt: 'Deuda Fiscal Encontrada',
    year: 'Año',
    filedBy: 'Presentado Por',
    visualizer: 'Visualizador',
    generalInfo: 'Info General',
    governance: 'Gobernanza',
    history: 'Historial',
    reports: 'Informes'
  },
  hi: {
    directoryTitle: 'सिएरा लियोन व्यापार निर्देशिका',
    searchPlaceholder: 'कंपनी का नाम या कोड खोजें...',
    checkName: 'नाम की उपलब्धता जांचें',
    login: 'लॉग इन',
    myPortal: 'मेरा पोर्टल',
    dashboard: 'डैशबोर्ड',
    search: 'निर्देशिका खोज',
    openData: 'खुला डेटा',
    langName: 'हिन्दी',
    pendingReports: 'लंबित रिपोर्ट',
    approvedReports: 'स्वीकृत रिपोर्ट',
    fileReport: 'वार्षिक रिपोर्ट दर्ज करें',
    editProfile: 'प्रोफ़ाइल संपादित करें',
    status: 'स्थिति',
    revenue: 'राजस्व (SLE)',
    txVolume: 'लेनदेन की मात्रा',
    actions: 'क्रियाएँ',
    approve: 'मंजूर करें',
    reject: 'अस्वीकार करें',
    businessLogin: 'व्यापार लॉग इन',
    registryCode: 'रजिस्ट्री कोड / आईडी',
    home: 'घर',
    legalForm: 'कानूनी रूप',
    registered: 'पंजीकृत',
    capital: 'पूंजी',
    viewDetails: 'विवरण देखें',
    details: 'विवरण',
    address: 'पता',
    topMembers: 'शीर्ष सदस्य',
    contact: 'संपर्क',
    email: 'ईमेल',
    phone: 'फ़ोन',
    beneficialOwners: 'लाभकारी स्वामी',
    commercialPledges: 'वाणिज्यिक प्रतिज्ञाएँ',
    taxStatus: 'कर स्थिति',
    goodStanding: 'अच्छी स्थिति',
    taxDebt: 'कर ऋण मिला',
    year: 'वर्ष',
    filedBy: 'द्वारा दायर',
    visualizer: 'विजुअलाइज़र',
    generalInfo: 'सामान्य जानकारी',
    governance: 'शासन और जोखिम',
    history: 'इतिहास',
    reports: 'रिपोर्ट'
  },
  ru: {
    directoryTitle: 'Бизнес-справочник Сьерра-Леоне',
    searchPlaceholder: 'Поиск по названию или коду...',
    checkName: 'Проверить имя',
    login: 'Войти',
    myPortal: 'Мой портал',
    dashboard: 'Панель',
    search: 'Поиск',
    openData: 'Открытые данные',
    langName: 'Русский',
    pendingReports: 'Ожидающие отчеты',
    approvedReports: 'Утвержденные отчеты',
    fileReport: 'Подать отчет',
    editProfile: 'Редактировать',
    status: 'Статус',
    revenue: 'Выручка (SLE)',
    txVolume: 'Объем транзакций',
    actions: 'Действия',
    approve: 'Одобрить',
    reject: 'Отклонить',
    businessLogin: 'Бизнес-вход',
    registryCode: 'Код регистрации',
    home: 'Главная',
    legalForm: 'Правовая форма',
    registered: 'Зарегистрировано',
    capital: 'Капитал',
    viewDetails: 'Подробнее',
    details: 'Детали',
    address: 'Адрес',
    topMembers: 'Руководство',
    contact: 'Контакты',
    email: 'Email',
    phone: 'Телефон',
    beneficialOwners: 'Бенефициары',
    commercialPledges: 'Коммерческие залоги',
    taxStatus: 'Налоговый статус',
    goodStanding: 'Хорошая репутация',
    taxDebt: 'Налоговая задолженность',
    year: 'Год',
    filedBy: 'Подано',
    visualizer: 'Визуализатор',
    generalInfo: 'Общая инфо',
    governance: 'Управление',
    history: 'История',
    reports: 'Отчеты'
  }
};

const DATA_DICTIONARY: Record<string, Record<string, string>> = {
  'Lion Mountains Mining Ltd': {
    zh: '狮山矿业有限公司',
    fr: 'Mines des Montagnes du Lion Sarl',
    es: 'Minería Montañas del León S.L.',
    hi: 'लायन माउंटेन माइनिंग लिमिटेड',
    ru: 'Lion Mountains Mining Ltd'
  },
  'Salone Tech Innovators': {
    zh: '塞拉利昂科技创新者',
    fr: 'Innovateurs Technologiques Salone',
    es: 'Innovadores Tecnológicos Salone',
    hi: 'सलोन टेक इनोवेटर्स',
    ru: 'Salone Tech Innovators'
  },
  'Bo Agricultural Co-op': {
    zh: '博城农业合作社',
    fr: 'Coopérative Agricole de Bo',
    es: 'Cooperativa Agrícola de Bo',
    hi: 'बो कृषि सहकारी',
    ru: 'Сельскохозяйственный кооператив Бо'
  },
  'Active': { zh: '活跃', fr: 'Actif', es: 'Activo', hi: 'सक्रिय', ru: 'Активный' },
  'Private Limited Company': { zh: '私人有限公司', fr: 'Société à Responsabilité Limitée', es: 'Sociedad de Responsabilidad Limitada', hi: 'प्राइवेट लिमिटेड कंपनी', ru: 'Закрытое акционерное общество' },
  'Public Limited Company': { zh: '股份有限公司', fr: 'Société Anonyme', es: 'Sociedad Anónima', hi: 'पब्लिक लिमिटेड कंपनी', ru: 'Открытое акционерное общество' },
  'Non-Governmental Organization': { zh: '非政府组织', fr: 'Organisation Non Gouvernementale', es: 'Organización No Gubernamental', hi: 'गैर सरकारी संगठन', ru: 'Неправительственная организация' },
  '12 Wilkinson Road, Freetown': { zh: '弗里敦威尔金森路12号', fr: '12 Rue Wilkinson, Freetown', es: 'Calle Wilkinson 12, Freetown', hi: '12 विल्किंसन रोड, फ्रीटाउन', ru: 'Уилкинсон Роуд 12, Фритаун' },
  '45 Siaka Stevens Street, Freetown': { zh: '弗里敦西亚卡史蒂文斯街45号', fr: '45 Rue Siaka Stevens, Freetown', es: 'Calle Siaka Stevens 45, Freetown', hi: '45 सियाका स्टीवंस स्ट्रीट, फ्रीटाउन', ru: 'Улица Сиака Стивенса 45, Фритаун' },
  '5 Bo-Kenema Highway, Bo': { zh: '博城博-凯内马公路5号', fr: '5 Autoroute Bo-Kenema, Bo', es: 'Carretera Bo-Kenema 5, Bo', hi: '5 बो-केनेमा हाईवे, बो', ru: 'Шоссе Бо-Кенема 5, Бо' },
  'Approved': { zh: '已批准', fr: 'Approuvé', es: 'Aprobado', hi: 'स्वीकृत', ru: 'Одобрено' },
  'Missing': { zh: '缺失', fr: 'Manquant', es: 'Faltante', hi: 'लापता', ru: 'Отсутствует' },
  'Draft': { zh: '草案', fr: 'Brouillon', es: 'Borrador', hi: 'मसौदा', ru: 'Черновик' },
  'Submitted': { zh: '已提交', fr: 'Soumis', es: 'Enviado', hi: 'प्रस्तुत', ru: 'Отправлено' },
  'Rejected': { zh: '已拒绝', fr: 'Rejeté', es: 'Rechazado', hi: 'अस्वीकृत', ru: 'Отклонено' }
};

// --- ACCESSIBILITY COMPONENT ---

const SignLanguageInterpreter: React.FC<{ isActive: boolean, isSigning: boolean, hoverText: string }> = ({ isActive, isSigning, hoverText }) => {
  if (!isActive) return null;

  // Helper to map characters to Sign Language image URLs (Wikimedia Commons)
  const getSignImage = (char: string) => {
    const c = char.toLowerCase();
    if (c >= 'a' && c <= 'z') {
      return `https://commons.wikimedia.org/wiki/Special:FilePath/Sign_language_${c.toUpperCase()}.svg`;
    }
    if (c >= '0' && c <= '9') {
       return `https://commons.wikimedia.org/wiki/Special:FilePath/Sign_language_${c}.svg`;
    }
    return null;
  };

  // Render the sentence as a stream of images
  const renderSignSentence = (text: string) => {
    if (!text) return <span className="text-yellow-100/50 text-xs italic">Hover over text to translate...</span>;

    const chars = text.split('');
    return (
      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {chars.map((char, i) => {
          const src = getSignImage(char);
          if (char === ' ') {
            return <div key={i} className="w-4 flex-shrink-0" />; // Spacer
          }
          if (src) {
            return (
              <div key={i} className="flex flex-col items-center flex-shrink-0">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center p-0.5 shadow-sm">
                   <img src={src} alt={`Sign for ${char}`} className="w-full h-full object-contain" />
                </div>
                <span className="text-[6px] text-yellow-100 uppercase mt-0.5 font-mono">{char}</span>
              </div>
            );
          }
          // Fallback for non-alphanumeric (e.g., punctuation or non-latin script)
          return (
             <span key={i} className="text-xs text-yellow-100 font-mono w-4 text-center flex-shrink-0">{char}</span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-24 left-6 z-50 animate-bounce-in transition-all duration-300">
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl border-4 border-yellow-400 w-80">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">BSL/ASL Interpreter</span>
                <div className={`h-2 w-2 rounded-full ${isSigning || hoverText ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            </div>
            {/* Avatar Area */}
            <div className="h-24 bg-slate-800 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden border border-slate-700">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-700 to-slate-800"></div>
                
                {/* Visual Representation of the "Interpreter" */}
                <div className={`relative transition-transform duration-300 flex items-center justify-center ${isSigning || hoverText ? 'scale-100' : 'scale-95 opacity-50'}`}>
                   {/* If we have text, we show the stream below, so here we show a generic signing avatar state */}
                   <User className={`w-12 h-12 text-slate-500 transition-colors ${isSigning || hoverText ? 'text-yellow-100' : ''}`} />
                    {(isSigning || hoverText) && (
                        <>
                            <div className="absolute top-4 -left-4 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-[ping_0.8s_infinite]"></div>
                            <div className="absolute top-4 -right-4 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-[ping_0.8s_infinite_0.4s]"></div>
                        </>
                    )}
                </div>

                <div className="absolute bottom-0 w-full h-1 bg-yellow-400 opacity-50"></div>
                <div className="absolute top-2 right-2 bg-black/50 px-1 rounded text-[8px] flex items-center gap-1">
                    <Video className="w-2 h-2" /> LIVE
                </div>
            </div>
            
            {/* Sign Symbol Stream */}
            <div className="min-h-[60px] bg-slate-800 rounded p-2 border border-slate-700 flex flex-col justify-center">
                 {renderSignSentence(hoverText)}
            </div>
            
            <p className="text-[8px] text-center text-slate-400 uppercase tracking-widest mt-1">
              Visual Sign Translation
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
  const [hoverText, setHoverText] = useState('');

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

  // Translation Helper for UI
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key] || key;

  // Translation Helper for Data (Content)
  const tData = (text: string | number | undefined) => {
    if (text === undefined) return '';
    
    // Handle Numbers
    if (typeof text === 'number') {
        const localeMap: Record<LangCode, string> = { en: 'en-SL', zh: 'zh-CN', fr: 'fr-FR', es: 'es-ES', hi: 'hi-IN', ru: 'ru-RU' };
        return new Intl.NumberFormat(localeMap[lang]).format(text);
    }

    // Handle Strings via Dictionary
    if (lang === 'en') return text;
    const entry = DATA_DICTIONARY[text];
    if (entry && entry[lang]) {
        return entry[lang];
    }
    return text;
  };

  // Currency Formatter Wrapper
  const tCurrency = (amount: number) => {
    const localeMap: Record<LangCode, string> = { en: 'en-SL', zh: 'zh-CN', fr: 'fr-FR', es: 'es-ES', hi: 'hi-IN', ru: 'ru-RU' };
    return formatCurrency(amount, localeMap[lang]);
  };

  // Date Formatter Wrapper
  const tDate = (date: string) => {
    const localeMap: Record<LangCode, string> = { en: 'en-GB', zh: 'zh-CN', fr: 'fr-FR', es: 'es-ES', hi: 'hi-IN', ru: 'ru-RU' };
    return formatDate(date, localeMap[lang]);
  };

  // Global Hover Handler for Sign Language
  const handleGlobalMouseOver = (e: React.MouseEvent) => {
    if (!signLanguageMode) return;
    const target = e.target as HTMLElement;
    // We try to get text from the specific element, or its closest block parent if it's a small inline tag
    if (target.innerText && target.innerText.length > 0) {
        // Clean up text (remove excessive newlines)
        const cleanText = target.innerText.split('\n')[0].trim();
        // Limit text length to prevent flooding the visualizer
        if (cleanText.length > 0 && cleanText.length < 100) {
            setHoverText(cleanText);
        }
    }
  };

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
        const otherReports = c.reports.filter(r => r.year !== year);
        return { ...c, reports: [newReport, ...otherReports] };
    }));
    addAuditLog(companyId, 'REPORT_SUBMITTED', `Annual Report ${year} Submitted for Approval`, currentUser?.name || 'User');
    setView('PORTAL_DASHBOARD');
  };

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

  const handleUpdateCompanyDetails = (companyId: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => {
        if (c.id !== companyId) return c;
        return { ...c, ...updates };
    }));
    
    const changes = Object.keys(updates).map(k => `${k} updated`).join(', ');
    const actor = currentUser?.role === 'BUSINESS' ? 'Business Admin' : 'Registrar Admin';
    const action = currentUser?.role === 'BUSINESS' ? 'BUSINESS_UPDATE' : 'ADMIN_UPDATE';
    
    addAuditLog(companyId, action, `Details Modified: ${changes}`, actor);
    
    if (currentUser?.role === 'BUSINESS') {
        setView('PORTAL_DASHBOARD');
    } else {
        setEditingCompanyId(null);
    }
  };

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
          website: '',
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
             <button 
                onClick={() => setView('SEARCH')}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title={t('home')}
             >
                <Home className="w-5 h-5" />
             </button>

             <button onClick={() => setSignLanguageMode(!signLanguageMode)} className={`p-2 rounded-full transition-colors ${signLanguageMode ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400' : 'text-slate-400 hover:text-slate-600'}`} title="Toggle Sign Language Interpreter">
                <Hand className="w-5 h-5" />
             </button>

            <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1 mr-2">
                {(['en', 'zh', 'fr', 'es', 'hi', 'ru'] as LangCode[]).map((l) => (
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
                <span>Sign Language (BSL) Mode Active: Hover over text to translate</span>
            </div>
        )}
      </div>
    </nav>
  );

  const renderSearch = () => (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
            {t('directoryTitle')}
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
            Official, real-time data on all companies, non-profits, and foundations. 
            Secured by blockchain technology for absolute transparency.
          </p>
          
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-2 flex shadow-xl">
             <div className="flex-grow relative">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none rounded-l-md"
                />
             </div>
             <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors">
               {t('search')}
             </button>
          </div>
          
          <div className="mt-6 flex justify-center gap-4 text-sm text-slate-400">
            <button onClick={() => setShowFilters(!showFilters)} className="hover:text-white underline decoration-dotted underline-offset-4 flex items-center">
              {showFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {showFilters && (
           <SearchFilters 
             searchTerm={searchTerm} setSearchTerm={setSearchTerm}
             selectedForm={selectedForm} setSelectedForm={setSelectedForm}
             minCapital={minCapital} setMinCapital={setMinCapital}
             dateFrom={dateFrom} setDateFrom={setDateFrom}
           />
        )}

        <div className="bg-white shadow-lg rounded-lg border border-slate-200 overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-700">Directory Results</h3>
            <span className="text-xs text-slate-500 bg-white border px-2 py-1 rounded-full">{tData(filteredCompanies.length)} records found</span>
          </div>
          <ul role="list" className="divide-y divide-slate-100">
            {filteredCompanies.map((company) => (
              <li key={company.id} className="hover:bg-blue-50/50 transition-colors">
                <div 
                  onClick={() => handleViewCompany(company.id)}
                  className="block cursor-pointer px-6 py-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0 h-12 w-12 flex items-center justify-center overflow-hidden border border-blue-200">
                        {company.businessLogo ? (
                            <img src={company.businessLogo} alt={company.name} className="h-full w-full object-cover" />
                        ) : (
                            <Building2 className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="text-base font-bold text-blue-900 hover:text-blue-700">{tData(company.name)}</p>
                           <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                company.status === 'Active' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-red-100 text-red-800 border-red-200'
                           }`}>
                                {tData(company.status)}
                           </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">CODE: {company.registryCode}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pl-12">
                    <div>
                      <span className="text-xs text-slate-400 uppercase font-semibold">{t('legalForm')}</span>
                      <p className="text-sm text-slate-700 font-medium">{tData(company.legalForm)}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase font-semibold">{t('registered')}</span>
                      <p className="text-sm text-slate-700">{tDate(company.registrationDate)}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase font-semibold">{t('capital')}</span>
                      <p className="text-sm text-slate-700">{tCurrency(company.capital)}</p>
                    </div>
                     <div className="flex justify-end items-end">
                       <span className="text-blue-600 text-sm font-medium flex items-center hover:underline">
                         {t('viewDetails')} <ChevronRight className="w-4 h-4 ml-1" />
                       </span>
                     </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderCompanyDetail = () => {
    if (!selectedCompany) return null;

    const tabs: {id: Tab, label: string, icon: React.ReactNode}[] = [
        { id: 'GENERAL', label: t('generalInfo'), icon: <Building2 className="w-4 h-4" /> },
        { id: 'GOVERNANCE', label: t('governance'), icon: <AlertTriangle className="w-4 h-4" /> },
        { id: 'REPORTS', label: t('reports'), icon: <FileText className="w-4 h-4" /> },
        { id: 'VISUALIZER', label: t('visualizer'), icon: <Network className="w-4 h-4" /> },
        { id: 'HISTORY', label: t('history'), icon: <History className="w-4 h-4" /> },
    ];

    return (
      <div className="bg-slate-50 min-h-[calc(100vh-64px)] pb-12">
        <div className="bg-white border-b border-slate-200">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <button onClick={() => setView('SEARCH')} className="flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors mb-4">
                <ArrowLeft className="w-4 h-4 mr-1" /> {t('directoryTitle')}
              </button>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div className="flex items-start gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-lg h-20 w-20 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {selectedCompany.businessLogo ? (
                            <img src={selectedCompany.businessLogo} alt={selectedCompany.name} className="h-full w-full object-cover" />
                        ) : (
                            <Building2 className="w-10 h-10 text-slate-300" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{tData(selectedCompany.name)}</h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-1 text-sm">
                            <span className="font-mono text-slate-500">{selectedCompany.registryCode}</span>
                            <span className="hidden sm:inline w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="text-slate-600">{tData(selectedCompany.legalForm)}</span>
                            
                            {selectedCompany.website && (
                                <>
                                    <span className="hidden sm:inline w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <a href={`https://${selectedCompany.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                                        <Globe className="w-3 h-3" />
                                        {selectedCompany.website}
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                 </div>
              </div>

              <div className="flex space-x-1 mt-8 overflow-x-auto scrollbar-hide">
                 {tabs.map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-slate-50 text-blue-600 border border-slate-200 border-b-transparent relative top-[1px]' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                     >
                        {tab.icon}
                        {tab.label}
                     </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-slate-200 p-6 min-h-[400px]">
                {activeTab === 'GENERAL' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">{t('details')}</h3>
                            <dl className="space-y-4">
                                <div className="grid grid-cols-3">
                                    <dt className="text-sm font-medium text-slate-500">{t('legalForm')}</dt>
                                    <dd className="text-sm text-slate-900 col-span-2">{tData(selectedCompany.legalForm)}</dd>
                                </div>
                                <div className="grid grid-cols-3">
                                    <dt className="text-sm font-medium text-slate-500">{t('status')}</dt>
                                    <dd className="text-sm text-slate-900 col-span-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedCompany.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {tData(selectedCompany.status)}
                                        </span>
                                    </dd>
                                </div>
                                <div className="grid grid-cols-3">
                                    <dt className="text-sm font-medium text-slate-500">{t('capital')}</dt>
                                    <dd className="text-sm text-slate-900 col-span-2">{tCurrency(selectedCompany.capital)}</dd>
                                </div>
                                <div className="grid grid-cols-3">
                                    <dt className="text-sm font-medium text-slate-500">{t('address')}</dt>
                                    <dd className="text-sm text-slate-900 col-span-2">{tData(selectedCompany.address)}</dd>
                                </div>
                            </dl>
                        </div>
                        <div>
                             <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">{t('topMembers')}</h3>
                             <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                                <ul className="space-y-3">
                                    {selectedCompany.managementBoard.map((member, i) => (
                                        <li key={i} className="text-sm text-slate-900 flex items-center gap-3">
                                            <div className="bg-white p-1 rounded-full shadow-sm">
                                                <User className="w-4 h-4 text-slate-500" />
                                            </div>
                                            <span className="font-medium">{member}</span>
                                        </li>
                                    ))}
                                    {selectedCompany.managementBoard.length === 0 && <li className="text-sm text-slate-500 italic">No board members listed</li>}
                                </ul>
                             </div>

                             <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">{t('contact')}</h3>
                             <dl className="space-y-4">
                                <div className="grid grid-cols-3">
                                    <dt className="text-sm font-medium text-slate-500">{t('email')}</dt>
                                    <dd className="text-sm text-blue-600 col-span-2">{selectedCompany.contactEmail || 'N/A'}</dd>
                                </div>
                                <div className="grid grid-cols-3">
                                    <dt className="text-sm font-medium text-slate-500">{t('phone')}</dt>
                                    <dd className="text-sm text-slate-900 col-span-2">{selectedCompany.contactPhone || 'N/A'}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                )}

                {activeTab === 'GOVERNANCE' && (
                     <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">{t('beneficialOwners')}</h3>
                                <ul className="space-y-2">
                                    {selectedCompany.beneficialOwners.map((owner, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm bg-slate-50 p-2 rounded">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            {owner}
                                        </li>
                                    ))}
                                    {selectedCompany.beneficialOwners.length === 0 && <li className="text-sm text-slate-500">No data available</li>}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">{t('commercialPledges')}</h3>
                                <div className="flex items-center gap-3">
                                    <div className="bg-yellow-100 p-2 rounded-lg">
                                        <FileText className="w-5 h-5 text-yellow-700" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900">{tData(selectedCompany.commercialPledges)}</p>
                                        <p className="text-xs text-slate-500">Active Pledges</p>
                                    </div>
                                </div>
                            </div>
                         </div>
                         <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">{t('taxStatus')}</h3>
                                {selectedCompany.taxDebt > 0 ? (
                                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
                                        <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-red-900">{t('taxDebt')}</h4>
                                            <p className="text-sm text-red-800 mt-1">
                                                This entity currently has an outstanding tax balance of <span className="font-bold">{tCurrency(selectedCompany.taxDebt)}</span>.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-green-900">{t('goodStanding')}</h4>
                                            <p className="text-sm text-green-800 mt-1">
                                                No tax debts recorded. The entity is in good financial standing with the revenue authority.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                         </div>
                     </div>
                )}

                {activeTab === 'VISUALIZER' && (
                    <div className="animate-fadeIn min-h-[400px] flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-300 via-slate-100 to-slate-200"></div>
                        <div className="relative z-10 text-center w-full max-w-lg">
                            {/* Simple Tree Viz */}
                            <div className="flex flex-col items-center">
                                <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg mb-8 relative">
                                    <Building2 className="w-6 h-6 mx-auto mb-2" />
                                    <span className="font-bold">{tData(selectedCompany.name)}</span>
                                    <div className="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-slate-300"></div>
                                </div>
                                
                                <div className="flex justify-center gap-8 flex-wrap">
                                    {selectedCompany.managementBoard.map((m, i) => (
                                        <div key={i} className="flex flex-col items-center">
                                            <div className="w-0.5 h-8 bg-slate-300 -mt-8 mb-0"></div>
                                            <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm text-sm flex items-center gap-2 mt-4">
                                                <User className="w-4 h-4 text-blue-500" />
                                                {m}
                                                <span className="text-xs text-slate-400 block">(Board)</span>
                                            </div>
                                        </div>
                                    ))}
                                     {selectedCompany.relationships.map((r, i) => (
                                        <div key={'r'+i} className="flex flex-col items-center">
                                            <div className="w-0.5 h-8 bg-slate-300 -mt-8 mb-0"></div>
                                            <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm text-sm flex items-center gap-2 mt-4">
                                                <Briefcase className="w-4 h-4 text-green-500" />
                                                {tData(r.entity)}
                                                <span className="text-xs text-slate-400 block">({r.type})</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {selectedCompany.managementBoard.length === 0 && selectedCompany.relationships.length === 0 && (
                                <p className="text-slate-500">No relationship data available to visualize.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'REPORTS' && (
                    <div className="animate-fadeIn">
                        <table className="min-w-full divide-y divide-slate-300">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900">{t('year')}</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">{t('filedBy')}</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">{t('revenue')}</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">{t('txVolume')}</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">{t('status')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {selectedCompany.reports.map((report) => (
                                    <tr key={report.year}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-slate-900">{tData(report.year)}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{report.filedBy || '-'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{report.revenue ? tCurrency(report.revenue) : '-'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{tData(report.transactionVolume) || '-'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                report.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                report.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {tData(report.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'HISTORY' && (
                    <div className="animate-fadeIn">
                        <div className="flow-root">
                            <ul role="list" className="-mb-8">
                                {selectedCompany.history.map((log, logIdx) => (
                                    <li key={log.id}>
                                        <div className="relative pb-8">
                                            {logIdx !== selectedCompany.history.length - 1 ? (
                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                                            ) : null}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                                        log.action.includes('REGISTRATION') ? 'bg-green-500' : 'bg-blue-500'
                                                    }`}>
                                                        <History className="h-4 w-4 text-white" aria-hidden="true" />
                                                    </span>
                                                </div>
                                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{log.action}</p>
                                                        <p className="text-sm text-slate-600 mt-1">{log.details}</p>
                                                        <p className="text-xs text-slate-400 font-mono mt-0.5">Hash: {log.hash}</p>
                                                    </div>
                                                    <div className="whitespace-nowrap text-right text-xs text-slate-500">
                                                        <time dateTime={log.timestamp}>{tDate(log.timestamp)}</time>
                                                        <p className="mt-1 font-medium text-slate-600">{log.actor}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    );
  };

  const renderNameCheckView = () => (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full text-center">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t('checkName')}</h2>
        <p className="text-slate-500 mb-8">Ensure your desired business name is available before registration.</p>
        
        <div className="relative mb-6">
           <input 
              type="text" 
              value={nameCheckValue}
              onChange={(e) => setNameCheckValue(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter proposed name..."
           />
           {nameAvailability === 'CHECKING' && (
             <div className="absolute right-3 top-3">
               <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
             </div>
           )}
        </div>

        <button 
           onClick={() => checkNameAvailability(nameCheckValue)}
           disabled={!nameCheckValue.trim() || nameAvailability === 'CHECKING'}
           className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          Check Availability
        </button>

        {nameAvailability === 'AVAILABLE' && (
           <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2 justify-center">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold">Name is available!</span>
           </div>
        )}

        {nameAvailability === 'TAKEN' && (
           <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2 justify-center">
              <XCircle className="w-5 h-5" />
              <span className="font-bold">Name is already taken.</span>
           </div>
        )}
      </div>
    </div>
  );

  const renderOpenData = () => (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] p-8">
       <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
             <div className="p-8 bg-slate-900 text-white">
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                   <Database className="w-8 h-8" />
                   Open Data Portal
                </h2>
                <p className="text-slate-300 text-lg">
                   Access bulk registry data in machine-readable formats. 
                   Promoting transparency and economic research.
                </p>
             </div>
             <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <button onClick={() => downloadData('JSON')} className="flex flex-col items-center p-6 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                   <FileCode className="w-12 h-12 text-slate-400 group-hover:text-blue-600 mb-4" />
                   <span className="font-bold text-lg">JSON Format</span>
                   <span className="text-sm text-slate-500 mt-2">Full structured data</span>
                   <span className="mt-4 text-blue-600 text-sm font-bold flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      Download <Download className="w-3 h-3 ml-1" />
                   </span>
                </button>

                <button onClick={() => downloadData('CSV')} className="flex flex-col items-center p-6 border-2 border-slate-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group">
                   <FileSpreadsheet className="w-12 h-12 text-slate-400 group-hover:text-green-600 mb-4" />
                   <span className="font-bold text-lg">CSV Format</span>
                   <span className="text-sm text-slate-500 mt-2">Spreadsheet compatible</span>
                   <span className="mt-4 text-green-600 text-sm font-bold flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      Download <Download className="w-3 h-3 ml-1" />
                   </span>
                </button>

                <button onClick={() => downloadData('XML')} className="flex flex-col items-center p-6 border-2 border-slate-100 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group">
                   <FileText className="w-12 h-12 text-slate-400 group-hover:text-orange-600 mb-4" />
                   <span className="font-bold text-lg">XML Format</span>
                   <span className="text-sm text-slate-500 mt-2">Legacy systems</span>
                   <span className="mt-4 text-orange-600 text-sm font-bold flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      Download <Download className="w-3 h-3 ml-1" />
                   </span>
                </button>
             </div>
             <div className="bg-slate-50 p-6 border-t border-slate-200 text-center text-sm text-slate-500">
                Data is updated daily at 00:00 GMT. Last update: {new Date().toLocaleDateString()}
             </div>
          </div>
       </div>
    </div>
  );

  const renderLogin = () => (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="flex border-b border-slate-200">
             <button 
                onClick={() => setLoginTab('PERSONAL')}
                className={`flex-1 py-4 text-sm font-bold ${loginTab === 'PERSONAL' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-500'}`}
             >
                Personal / Admin
             </button>
             <button 
                onClick={() => setLoginTab('BUSINESS')}
                className={`flex-1 py-4 text-sm font-bold ${loginTab === 'BUSINESS' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-500'}`}
             >
                Business Entity
             </button>
          </div>
          
          <div className="p-8">
             {loginTab === 'PERSONAL' ? (
                <div className="space-y-4">
                   <p className="text-sm text-slate-600 mb-6">Log in to manage your filings or access administrative tools.</p>
                   <button onClick={() => handleLogin('USER')} className="w-full bg-white border border-slate-300 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                      <User className="w-4 h-4" /> Login as Citizen
                   </button>
                   <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-slate-300"></div>
                      <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">OFFICIAL USE ONLY</span>
                      <div className="flex-grow border-t border-slate-300"></div>
                   </div>
                   <button onClick={() => handleLogin('ADMIN')} className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Login as Registrar
                   </button>
                </div>
             ) : (
                <div className="space-y-4">
                   <p className="text-sm text-slate-600 mb-6">Enter your Business Registry Code to access your company portal.</p>
                   <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Registry Code</label>
                      <input 
                         type="text" 
                         value={businessIdInput}
                         onChange={(e) => setBusinessIdInput(e.target.value)}
                         placeholder="e.g. SL-2023-001245"
                         className="w-full mt-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                   </div>
                   <button onClick={handleBusinessLogin} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                      Access Portal
                   </button>
                </div>
             )}
          </div>
       </div>
    </div>
  );

  const renderPortalDashboard = () => {
    if (!currentUser) return null;

    // For Business Users
    if (currentUser.role === 'BUSINESS') {
        const myCompany = companies.find(c => c.id === currentUser.companyId);
        if (!myCompany) return <div>Error: Company not found</div>;

        return (
            <div className="bg-slate-50 min-h-[calc(100vh-64px)] p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                           <h1 className="text-2xl font-bold text-slate-900">Business Portal</h1>
                           <p className="text-slate-500">Welcome back, {myCompany.name}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                           <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Compliance Status</h3>
                           <div className="flex items-center gap-2">
                              {myCompany.reports.some(r => r.status === 'Missing') || myCompany.taxDebt > 0 ? (
                                  <>
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                    <span className="text-xl font-bold text-red-700">Action Required</span>
                                  </>
                              ) : (
                                  <>
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                    <span className="text-xl font-bold text-green-700">Compliant</span>
                                  </>
                              )}
                           </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Next Report Due</h3>
                            <p className="text-xl font-bold text-slate-900">31 Mar 2024</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                             <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Quick Actions</h3>
                             <div className="flex gap-2">
                                <button onClick={() => { setReportingCompanyId(myCompany.id); setView('PORTAL_FILE_REPORT'); }} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-bold hover:bg-blue-200">File Report</button>
                                <button onClick={() => { setReportingCompanyId(myCompany.id); setView('PORTAL_EDIT_DETAILS'); }} className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-sm font-bold hover:bg-slate-200">Edit Info</button>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } 

    // For Personal Users
    const myCompanies = companies.filter(c => c.managementBoard.includes(currentUser.name));

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-64px)] p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">User Dashboard</h1>
                    <p className="text-slate-500">Managing filings for {currentUser.name}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 bg-slate-50">
                        <h2 className="font-bold text-lg">My Managed Entities</h2>
                    </div>
                    {myCompanies.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {myCompanies.map(company => (
                                <div key={company.id} className="p-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{company.name}</h3>
                                        <p className="text-sm text-slate-500">{company.registryCode} • {company.legalForm}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                         <span className={`px-2 py-1 rounded text-xs font-bold ${company.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{company.status}</span>
                                         <button onClick={() => { setReportingCompanyId(company.id); setView('PORTAL_FILE_REPORT'); }} className="text-blue-600 hover:text-blue-800 font-medium text-sm">File Report</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-500">
                            <p>You are not listed as a director or manager for any registered entity.</p>
                        </div>
                    )}
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
                    <p className="font-bold">{tData(company.name)}</p>
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

  const renderEditCompanyDetails = () => {
    if (!reportingCompanyId) return null; // Reuse this state variable for the company ID to edit
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
                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{tData(company.name)}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tData(report.year)}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tCurrency(report.revenue || 0)}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tData(report.transactionVolume)}</td>
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
                                <div className="text-sm font-medium text-slate-900">{tData(c.name)}</div>
                                <div className="text-xs text-slate-500">{c.registryCode}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {tData(c.status)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tData(c.reports[0]?.year) || 'None'}</td>
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
                                    <h2 className="text-xl font-bold">Manage Status: {tData(target.name)}</h2>
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

  // --- RENDER RETURN ---

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900" onMouseOver={handleGlobalMouseOver}>
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
      <SignLanguageInterpreter isActive={signLanguageMode} isSigning={isAIThinking} hoverText={hoverText} />
    </div>
  );
}
