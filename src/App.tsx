import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Users,
  CheckCircle2,
  ChevronDown,
  ArrowUpRight,
  Calculator,
  Lock,
  Download,
  Share2,
  Scale,
  Database,
  Building2,
  BookOpen,
  Briefcase,
  HelpCircle,
  FileCheck2,
  AlertCircle,
  Landmark,
  CreditCard,
  Copy,
  Check
} from 'lucide-react';

import heroCourtBuilding from './assets/images/hero_court_building_1793169998317.jpg';
import libraryLawBooks from './assets/images/library_law_books_1793169998353.jpg';
import advocateChambersRoom from './assets/images/advocate_chambers_room_1793169998328.jpg';

interface FeeItem {
  id: string;
  description: string;
  basis: 'day' | 'hr' | 'flat';
  quantity: number;
  rate: number;
}

type FeeNoteStatus = 'DRAFT' | 'SENT' | 'PARTIAL' | 'PAID' | 'OVERDUE';

export default function App() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeRoleTab, setActiveRoleTab] = useState<'advocate' | 'secretary'>('advocate');
  const [vatRegistered, setVatRegistered] = useState(true);
  const [allocatedPayment, setAllocatedPayment] = useState<number>(8000);
  const [feeNoteStatus, setFeeNoteStatus] = useState<FeeNoteStatus>('PARTIAL');
  const [activeLegalTab, setActiveLegalTab] = useState<'terms' | 'privacy' | 'sovereignty' | 'subscriptions'>('terms');

  // Interactive Fee Note Simulator State
  const [matterName, setMatterName] = useState('Premier Foods v. Logistics Direct (Pty) Ltd');
  const [attorneyFirm, setAttorneyFirm] = useState('Doe Inc.');
  const [advocateTitle] = useState('Adv. John Doe, SC');
  const [invoiceNumber] = useState('INV-2026-0042');

  // Document View: Invoice / Fee Note vs Instructing Firm Statement
  const [activeDocView, setActiveDocView] = useState<'invoice' | 'statement'>('invoice');

  // Banking Particulars State (Required on both Invoice & Statements)
  const [bankingParticulars, setBankingParticulars] = useState({
    bankName: 'Investec Bank Ltd',
    accountHolder: 'Adv. John Doe (Chambers Practice Account)',
    accountNumber: '1001 2498 332',
    branchCode: '580-105',
    branchName: '100 Grayston Drive, Sandton',
    accountType: 'Cheque / Current Account',
    swiftCode: 'IVESZAJJ',
  });
  const [showBankSettings, setShowBankSettings] = useState(false);
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedBankField(fieldName);
    setTimeout(() => setCopiedBankField(null), 2000);
  };

  const [feeItems, setFeeItems] = useState<FeeItem[]>([
    { id: '1', description: 'Day fee: Appearance in Gauteng High Court, Johannesburg', basis: 'day', quantity: 1, rate: 18000 },
    { id: '2', description: 'Drafting Heads of Argument and Authorities Bundle', basis: 'hr', quantity: 4.5, rate: 2400 },
    { id: '3', description: 'Settling Plaintiff’s Expert Notice & Summary', basis: 'flat', quantity: 1, rate: 4500 },
  ]);

  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({
    0: true,
  });

  const toggleFaq = (idx: number) => {
    setFaqOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Calculations for Fee Note
  const subtotal = feeItems.reduce((acc, item) => acc + item.quantity * item.rate, 0);
  const vatRate = 0.15;
  const vatAmount = vatRegistered ? Math.round(subtotal * vatRate * 100) / 100 : 0;
  const grandTotal = subtotal + vatAmount;
  const balanceDue = Math.max(0, grandTotal - allocatedPayment);

  const formatZAR = (centsOrRand: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(centsOrRand);
  };

  const statusConfig: Record<
    FeeNoteStatus,
    {
      label: string;
      badgeCls: string;
      dotCls: string;
      note: string;
      docNumber: string;
      headerNote: string;
      watermarkText: string;
      watermarkCls: string;
    }
  > = {
    DRAFT: {
      label: 'Draft',
      badgeCls: 'bg-[#FEF7E8] text-[#925C13] border-[#F2D797]',
      dotCls: 'bg-[#B4751C]',
      note: 'Provisional draft · Not yet submitted to instructing attorney',
      docNumber: 'DRAFT-PREVIEW',
      headerNote: 'Awaiting Counsel approval before serial tax invoice issue',
      watermarkText: 'PROVISIONAL DRAFT',
      watermarkCls: 'border-amber-600/35 text-amber-700/50',
    },
    SENT: {
      label: 'Sent',
      badgeCls: 'bg-[#EBF3FB] text-[#1B5697] border-[#B8D6F4]',
      dotCls: 'bg-[#2563EB]',
      note: 'Issued & dispatched · Awaiting payment within 30 days net',
      docNumber: invoiceNumber,
      headerNote: 'Issued Tax Invoice · 30 Days Net Terms',
      watermarkText: 'ISSUED & DISPATCHED',
      watermarkCls: 'border-blue-600/35 text-blue-700/50',
    },
    PARTIAL: {
      label: 'Partial Payment',
      badgeCls: 'bg-[#FFF3EB] text-[#BA5316] border-[#FCD2B3]',
      dotCls: 'bg-[#EA580C]',
      note: 'Partially settled · Balance carried forward in debtor statements',
      docNumber: invoiceNumber,
      headerNote: 'Part-Settled Tax Invoice · Balance Outstanding',
      watermarkText: 'PARTIAL RECEIPT APPLIED',
      watermarkCls: 'border-orange-600/35 text-orange-700/50',
    },
    PAID: {
      label: 'Paid / Settled',
      badgeCls: 'bg-[#EBF7EE] text-[#166432] border-[#B9E5C4]',
      dotCls: 'bg-[#16A34A]',
      note: 'Settled in full · Reconciled in chambers trust/business ledger',
      docNumber: invoiceNumber,
      headerNote: 'Settled in Full · Official Payment Receipt',
      watermarkText: '✓ PAID IN FULL',
      watermarkCls: 'border-emerald-600/50 text-emerald-700/70',
    },
    OVERDUE: {
      label: 'Overdue',
      badgeCls: 'bg-[#FDF0ED] text-[#A62F1E] border-[#F8C8BD]',
      dotCls: 'bg-[#DC2626]',
      note: 'Exceeds 30-day Bar terms · Follow-up debtor statement generated',
      docNumber: invoiceNumber,
      headerNote: 'Overdue Tax Invoice · Immediate Settlement Requested',
      watermarkText: 'OVERDUE · 45 DAYS',
      watermarkCls: 'border-rose-600/40 text-rose-700/60',
    },
  };

  const handleStatusChange = (newStatus: FeeNoteStatus) => {
    setFeeNoteStatus(newStatus);
    if (newStatus === 'PAID') {
      setAllocatedPayment(grandTotal);
    } else if (newStatus === 'DRAFT' || newStatus === 'SENT') {
      if (allocatedPayment > 0) setAllocatedPayment(0);
    } else if (newStatus === 'PARTIAL') {
      if (allocatedPayment === 0 || allocatedPayment >= grandTotal) {
        setAllocatedPayment(Math.round(grandTotal * 0.45));
      }
    } else if (newStatus === 'OVERDUE') {
      if (allocatedPayment >= grandTotal) {
        setAllocatedPayment(Math.round(grandTotal * 0.2));
      }
    }
  };

  const handlePaymentChange = (val: number) => {
    setAllocatedPayment(val);
    if (val >= grandTotal) {
      setFeeNoteStatus('PAID');
    } else if (val > 0) {
      setFeeNoteStatus('PARTIAL');
    } else if (feeNoteStatus === 'PAID' || feeNoteStatus === 'PARTIAL') {
      setFeeNoteStatus('SENT');
    }
  };

  const updateItem = (id: string, field: keyof FeeItem, val: string | number) => {
    setFeeItems((items) =>
      items.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const addItem = () => {
    const newItem: FeeItem = {
      id: String(Date.now()),
      description: 'Consultation with Instructing Attorney',
      basis: 'hr',
      quantity: 1,
      rate: 2200,
    };
    setFeeItems([...feeItems, newItem]);
  };

  const removeItem = (id: string) => {
    if (feeItems.length > 1) {
      setFeeItems(feeItems.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-[#16241D] antialiased selection:bg-[#204938] selection:text-white">
      {/* 1. TOP BAR */}
      <header className="sticky top-0 z-50 bg-[#0B1A14]/90 backdrop-blur-md border-b border-[#21382F] px-6 lg:px-12 py-3.5 transition-all text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a href="#" className="flex items-center gap-2 group shrink-0">
            <span className="w-8 h-8 rounded bg-[#D8C398] text-[#0B1A14] flex items-center justify-center font-serif-legal font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
              L
            </span>
            <div className="flex flex-col">
              <span className="font-serif-legal text-lg font-bold tracking-tight text-white leading-none">
                LexChamber<sup className="text-[9px] font-sans ml-0.5 text-[#A5BCB0]">©</sup>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#D8C398] font-medium mt-0.5">
                Practice Finance
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#C0D4C9]">
            <a href="#overview" className="hover:text-white transition-colors whitespace-nowrap">
              The Chambers
            </a>
            <a href="#simulator" className="hover:text-white transition-colors whitespace-nowrap">
              Fee Note Demo
            </a>
            <a href="#sovereignty" className="hover:text-white transition-colors whitespace-nowrap">
              Data Sovereignty
            </a>
            <a href="#pricing" className="hover:text-white transition-colors whitespace-nowrap">
              Plans &amp; Pricing
            </a>
            <a href="#legal" className="hover:text-white transition-colors whitespace-nowrap">
              Legal &amp; Terms
            </a>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="/lexchamber-code.zip"
              download="lexchamber-code.zip"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#D8C398] bg-[#162D24] hover:bg-[#1F3D30] rounded-lg transition-colors whitespace-nowrap border border-[#2E5140] shadow-xs"
              title="Download offline backup ZIP of the entire codebase"
            >
              <Download className="w-3.5 h-3.5 text-[#D8C398]" />
              <span className="hidden sm:inline">Download</span><span> Code (.ZIP)</span>
            </a>
            <a
              href="#pricing"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1A3329] hover:bg-[#254538] rounded-lg transition-colors whitespace-nowrap border border-[#2B4E3E]"
            >
              Sign In
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0B1A14] bg-[#D8C398] hover:bg-[#E8D6B0] rounded-lg shadow-sm transition-all whitespace-nowrap"
            >
              <span>Try Free for 7 Days</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION WITH PROMINENT COURT BACKGROUND PHOTO & LIGHT EXECUTIVE SCRIM */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-[#F7FAF8] border-b border-[#D8E3DC]">
        {/* Background photo of High Court clearly returned and visible */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroCourtBuilding}
            alt="Neoclassical High Court Building Architecture"
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
            referrerPolicy="no-referrer"
          />
          {/* Luminous light scrim overlay: preserves full photographic visibility of court architecture while providing high reading contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7FAF8]/95 via-[#F7FAF8]/85 to-[#F7FAF8]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7FAF8] via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-[#10221A]">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E5EFE8] border border-[#BFD5C7] text-[#16402E] text-xs font-semibold shadow-xs">
                <Scale className="w-3.5 h-3.5 text-[#1D513B]" />
                <span>Advocates of the South African High Court</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-legal font-bold tracking-tight leading-[1.08] text-[#10221A] text-balance">
                Your practice. <br />
                Your fees. <br />
                <span className="text-[#8D6B28] italic">Your control.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#3B4F43] leading-relaxed max-w-xl">
                Spend your hours mastering the brief—not wrestling spreadsheets. Prepare professional fee notes, allocate payments, and keep chambers accounts in precise order without surrendering client data.
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <a
                  href="#simulator"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-[#10281E] hover:bg-[#1A3D2F] shadow-md hover:shadow-lg transition-all"
                >
                  <Calculator className="w-4 h-4 text-[#D8C398]" />
                  <span>Test Fee Note Simulator</span>
                </a>
                <a
                  href="/lexchamber-code.zip"
                  download="lexchamber-code.zip"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold text-[#16402E] bg-[#E5EFE8] border border-[#BFD5C7] hover:bg-[#D5E5DB] shadow-xs transition-colors"
                  title="Download offline backup ZIP of codebase"
                >
                  <Download className="w-4 h-4 text-[#1D513B]" />
                  <span>Download Code (.ZIP)</span>
                </a>
                <a
                  href="#sovereignty"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold text-[#10221A] bg-white border border-[#CCD7CE] hover:bg-[#F2F6F3] shadow-xs transition-colors"
                >
                  <Database className="w-4 h-4 text-[#1D513B]" />
                  <span>How Google Sheets Sync Works</span>
                </a>
              </div>

              {/* Zero-Pill Unboxed Trust Metadata */}
              <div className="pt-6 border-t border-[#DFE7E1] flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-[#52685B]">
                <span className="font-semibold text-[#16402E]">Zero automatic charge</span>
                <span aria-hidden="true" className="text-[#ADC0B4]">·</span>
                <span>Practise with full ownership</span>
                <span aria-hidden="true" className="text-[#ADC0B4]">·</span>
                <span>LPC-compliant fee tracking</span>
                <span aria-hidden="true" className="text-[#ADC0B4]">·</span>
                <span>South African VAT (15%)</span>
              </div>
            </div>

            {/* Right Column: Hero Visual Card (Chambers Snapshot) - Mobile-Optimized */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-[#CCD8CE] shadow-xl p-4 sm:p-6 lg:p-7 relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 sm:pb-5 border-b border-[#E5ECE7]">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#63796D] block">Chambers Workspace</span>
                    <h3 className="font-serif-legal font-bold text-base sm:text-lg text-[#10221A]">{advocateTitle}</h3>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-[#16402E] bg-[#EBF3EE] rounded-md border border-[#C5D8CC] shrink-0">
                    High Court Practice
                  </span>
                </div>

                <div className="py-4 sm:py-5 space-y-3.5 sm:space-y-4">
                  {/* Metric Tiles: Stack on mobile to give full width for numbers, side-by-side on sm+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="p-3 sm:p-3.5 bg-[#F6F9F7] rounded-xl border border-[#DFE7E1] overflow-hidden flex sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-1">
                      <div className="min-w-0">
                        <span className="text-[11px] text-[#556B5F] block truncate">Billed This Month</span>
                        <span className="text-lg sm:text-xl font-bold font-mono-num text-[#10221A] mt-0.5 block tracking-tight">
                          R142,500.00
                        </span>
                      </div>
                      <span className="text-[10px] text-[#1D513B] font-semibold bg-[#E4EFE8] px-2 py-0.5 rounded sm:bg-transparent sm:p-0 sm:mt-1 shrink-0">
                        8 matters active
                      </span>
                    </div>

                    <div className="p-3 sm:p-3.5 bg-[#FDF7F6] rounded-xl border border-[#F3DBD7] overflow-hidden flex sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-1">
                      <div className="min-w-0">
                        <span className="text-[11px] text-[#7A534D] block truncate">Outstanding Debtors</span>
                        <span className="text-lg sm:text-xl font-bold font-mono-num text-[#B83824] mt-0.5 block tracking-tight">
                          R38,250.00
                        </span>
                      </div>
                      <span className="text-[10px] text-[#7A534D] font-medium bg-[#FDEAE7] px-2 py-0.5 rounded sm:bg-transparent sm:p-0 sm:mt-1 shrink-0">
                        Within 30 days
                      </span>
                    </div>
                  </div>

                  {/* Recent Fee Note Issued */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="text-xs font-semibold text-[#3B4F43] flex items-center justify-between">
                      <span>Recent Fee Note Issued</span>
                      <span className="text-[11px] font-mono-num text-[#63796D]">27 Oct 2026</span>
                    </div>
                    <div className="p-3 bg-[#F6F9F7] rounded-lg border border-[#DFE7E1] text-xs space-y-1.5 overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2 font-medium text-[#10221A]">
                        <span className="truncate max-w-full">Edward Nathan Sonnenbergs</span>
                        <span className="font-mono-num font-bold text-[#10221A] text-sm shrink-0">R24,150.00</span>
                      </div>
                      <div className="text-[11px] text-[#556B5F] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                        <span className="truncate">Matter: Commercial Injunction</span>
                        <span className="text-[#196B47] font-semibold shrink-0">PDF Generated &amp; Sent</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3.5 sm:pt-4 border-t border-[#E5ECE7] flex flex-wrap items-center justify-between gap-2 text-xs text-[#556B5F]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#196B47] shrink-0" />
                    <span className="text-[11px] sm:text-xs">Google Sheets synchronized</span>
                  </span>
                  <a href="#simulator" className="text-[#16402E] font-semibold hover:underline inline-flex items-center gap-0.5 text-xs">
                    <span>View demo</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PHOTO BANNER: ADVOCATE STUDY & LAW REPORTS */}
      <section id="overview" className="relative py-16 bg-[#0E1E17] text-white overflow-hidden border-b border-[#21382F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D8C398] block">
              01 / The Business of Being an Advocate
            </span>
            <h2 className="text-3xl font-serif-legal font-bold leading-tight">
              A fee note should be the easiest part of your day.
            </h2>
            <p className="text-sm text-[#B4C9BE] leading-relaxed">
              No disconnected invoices, no unallocated receipts, and no mystery balances when preparing tax year-end returns. LexChamber keeps instructing attorneys, active briefs, counsel appearance fees, and payment allocations aligned directly with the underlying accounts.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-[#27483B] shadow-xl relative aspect-[16/9]">
            <img
              src={advocateChambersRoom}
              alt="Advocate Chambers Consultation Room with Brief and Fountain Pen"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1E17]/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 text-xs text-[#D8C398] font-serif-legal">
              Chambers of {advocateTitle} · High Court of South Africa
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE FEE NOTE SIMULATOR */}
      <section id="simulator" className="py-20 lg:py-28 px-6 lg:px-12 max-w-7xl mx-auto scroll-mt-12">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-wider text-[#2D634E] mb-2">
            Interactive Chambers Workbench
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif-legal font-bold text-[#0D1F18] tracking-tight">
            Tax invoices &amp; account statements with bank particulars.
          </h2>
          <p className="text-sm sm:text-base text-[#465950] mt-3">
            In South African advocacy, prompt payment relies on clear, verified banking details and exact matter references. Toggle between a single-matter Tax Invoice and an Instructing Firm Statement of Account below to see how LexChamber embeds your verified banking particulars on every document.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#D5DFD7] shadow-sm p-6 space-y-6">
            
            {/* View Selection & Parameters Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E8E3]">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#204938]" />
                <h3 className="font-bold text-sm text-[#0F221B]">Practice &amp; Document Controls</h3>
              </div>
              <label className="flex items-center gap-2 text-xs text-[#3D5247] cursor-pointer">
                <input
                  type="checkbox"
                  checked={vatRegistered}
                  onChange={(e) => setVatRegistered(e.target.checked)}
                  className="rounded text-[#204938] focus:ring-[#204938]"
                />
                <span className="font-medium">VAT (15%)</span>
              </label>
            </div>

            {/* Document View Switcher (Controls which document is simulated) */}
            <div>
              <label className="text-xs font-semibold text-[#3D5247] mb-1.5 block">Document Being Simulated</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#F1F5F2] rounded-xl border border-[#CCD8CE]">
                <button
                  type="button"
                  onClick={() => setActiveDocView('invoice')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-lg transition-all ${
                    activeDocView === 'invoice'
                      ? 'bg-[#10271E] text-white shadow-xs'
                      : 'text-[#485D51] hover:text-[#10271E]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Tax Invoice / Fee Note</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDocView('statement')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-lg transition-all ${
                    activeDocView === 'statement'
                      ? 'bg-[#10271E] text-white shadow-xs'
                      : 'text-[#485D51] hover:text-[#10271E]'
                  }`}
                >
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Firm Statement</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Fee Note Dynamic Status Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#3D5247] flex items-center gap-1.5">
                    <span>Invoice Status Toggle</span>
                  </label>
                  <span className="text-[11px] font-bold text-[#10271E] font-mono-num">
                    {statusConfig[feeNoteStatus].label}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-[#F1F5F2] rounded-xl border border-[#CCD8CE]">
                  {(['DRAFT', 'SENT', 'PARTIAL', 'PAID', 'OVERDUE'] as FeeNoteStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`py-1.5 px-1 text-[11px] font-bold rounded-lg transition-all text-center truncate ${
                        feeNoteStatus === st
                          ? 'bg-[#10271E] text-white shadow-xs'
                          : 'text-[#465B50] hover:bg-white hover:text-[#10271E]'
                      }`}
                    >
                      {st === 'PARTIAL' ? 'Partial' : st === 'OVERDUE' ? 'Overdue' : st.charAt(0) + st.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#55695D]">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${statusConfig[feeNoteStatus].dotCls}`} />
                  <span>{statusConfig[feeNoteStatus].note}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D5247] mb-1">Instructing Attorney Firm</label>
                <input
                  type="text"
                  value={attorneyFirm}
                  onChange={(e) => setAttorneyFirm(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CCD8CE] focus:outline-none focus:border-[#204938] bg-[#F9FBFA]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D5247] mb-1">Matter Reference / Case Name</label>
                <input
                  type="text"
                  value={matterName}
                  onChange={(e) => setMatterName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CCD8CE] focus:outline-none focus:border-[#204938] bg-[#F9FBFA]"
                />
              </div>

              {/* Line Items Table */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#52655B]">Professional Services</span>
                  <button
                    onClick={addItem}
                    className="text-xs font-semibold text-[#204938] hover:underline"
                  >
                    + Add Fee Line
                  </button>
                </div>

                <div className="space-y-2.5">
                  {feeItems.map((item) => (
                    <div key={item.id} className="p-3 bg-[#F6F8F6] rounded-xl border border-[#E3E9E4] text-xs space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="w-full text-xs font-medium bg-transparent border-b border-transparent hover:border-[#CCD8CE] focus:border-[#204938] focus:outline-none py-0.5"
                        />
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#993425] hover:text-[#5E1E14] text-xs px-1"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <label className="text-[#64796D] block">Basis</label>
                          <select
                            value={item.basis}
                            onChange={(e) => updateItem(item.id, 'basis', e.target.value as any)}
                            className="w-full p-1 rounded border border-[#CCD8CE] bg-white text-xs"
                          >
                            <option value="day">Court Day</option>
                            <option value="hr">Hourly</option>
                            <option value="flat">Fixed Brief</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[#64796D] block">Qty</label>
                          <input
                            type="number"
                            step="0.25"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full p-1 rounded border border-[#CCD8CE] bg-white text-xs font-mono-num"
                          />
                        </div>
                        <div>
                          <label className="text-[#64796D] block">Rate (R)</label>
                          <input
                            type="number"
                            step="100"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full p-1 rounded border border-[#CCD8CE] bg-white text-xs font-mono-num"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Allocation Slider / Input */}
              <div className="pt-3 border-t border-[#E3E8E3]">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#3D5247]">Payment Allocated (R)</label>
                  <span className="text-xs font-mono-num font-bold text-[#204938]">{formatZAR(allocatedPayment)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={grandTotal}
                  step="500"
                  value={allocatedPayment}
                  onChange={(e) => handlePaymentChange(parseFloat(e.target.value))}
                  className="w-full accent-[#204938]"
                />
              </div>

              {/* Banking Particulars Customization Card */}
              <div className="pt-4 border-t border-[#E3E8E3]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#11241C]">
                    <Landmark className="w-3.5 h-3.5 text-[#204938]" />
                    <span>Chambers Banking Particulars</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBankSettings(!showBankSettings)}
                    className="text-[11px] font-semibold text-[#204938] hover:underline"
                  >
                    {showBankSettings ? 'Close' : 'Customise'}
                  </button>
                </div>

                {showBankSettings ? (
                  <div className="p-3 bg-[#F6F9F7] rounded-xl border border-[#CCD8CE] space-y-2.5 text-xs">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#55695D] block mb-0.5">Financial Institution (Bank)</label>
                      <select
                        value={bankingParticulars.bankName}
                        onChange={(e) => {
                          const val = e.target.value;
                          const presets: Record<string, { code: string; swift: string }> = {
                            'Investec Bank Ltd': { code: '580-105', swift: 'IVESZAJJ' },
                            'Standard Bank of South Africa': { code: '051-001', swift: 'SBZAJJ' },
                            'First National Bank (FNB)': { code: '250-655', swift: 'FIRNZAJJ' },
                            'Nedbank': { code: '198-765', swift: 'NEDSZAJJ' },
                            'ABSA Bank': { code: '632-005', swift: 'ABSAZAJJ' },
                          };
                          setBankingParticulars({
                            ...bankingParticulars,
                            bankName: val,
                            branchCode: presets[val]?.code || bankingParticulars.branchCode,
                            swiftCode: presets[val]?.swift || bankingParticulars.swiftCode,
                          });
                        }}
                        className="w-full p-1.5 rounded border border-[#CCD8CE] bg-white text-xs font-medium"
                      >
                        <option value="Investec Bank Ltd">Investec Bank Ltd</option>
                        <option value="Standard Bank of South Africa">Standard Bank of South Africa</option>
                        <option value="First National Bank (FNB)">First National Bank (FNB)</option>
                        <option value="Nedbank">Nedbank</option>
                        <option value="ABSA Bank">ABSA Bank</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="text-[10px] text-[#55695D] block">Account Number</label>
                        <input
                          type="text"
                          value={bankingParticulars.accountNumber}
                          onChange={(e) => setBankingParticulars({ ...bankingParticulars, accountNumber: e.target.value })}
                          className="w-full p-1.5 rounded border border-[#CCD8CE] bg-white font-mono-num text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#55695D] block">Branch Code</label>
                        <input
                          type="text"
                          value={bankingParticulars.branchCode}
                          onChange={(e) => setBankingParticulars({ ...bankingParticulars, branchCode: e.target.value })}
                          className="w-full p-1.5 rounded border border-[#CCD8CE] bg-white font-mono-num text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#55695D] block">Account Holder Name</label>
                      <input
                        type="text"
                        value={bankingParticulars.accountHolder}
                        onChange={(e) => setBankingParticulars({ ...bankingParticulars, accountHolder: e.target.value })}
                        className="w-full p-1.5 rounded border border-[#CCD8CE] bg-white text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-[#F6F9F7] rounded-xl border border-[#CCD8CE] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#11241C] block">{bankingParticulars.bankName}</span>
                      <span className="text-[11px] text-[#5C7065] font-mono-num">
                        Acc: {bankingParticulars.accountNumber} · Code: {bankingParticulars.branchCode}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#204938] bg-[#E2ECE5] px-2 py-0.5 rounded border border-[#CCD8CE]">
                      <Lock className="w-2.5 h-2.5" />
                      Locked on Docs
                    </span>
                  </div>
                )}
                <p className="mt-1.5 text-[10px] text-[#697E72] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#204938] shrink-0" />
                  <span>Bank particulars automatically print on both Invoices &amp; Statements.</span>
                </p>
              </div>

            </div>
          </div>

          {/* Right Column: Live Rendered Document (Fee Note or Statement of Account) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#CCD8CE] shadow-lg p-6 sm:p-8 relative font-sans overflow-hidden">
            
            {/* View Tab Indicator in Document Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E3E8E3]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#10271E] text-white text-[10px] font-bold uppercase tracking-wider rounded">
                  {activeDocView === 'invoice' ? 'Document 1 of 2: Fee Note / Tax Invoice' : 'Document 2 of 2: Attorney Debtor Statement'}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#204938] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Bank particulars embedded</span>
              </span>
            </div>

            {activeDocView === 'invoice' ? (
              /* ==================== 1. TAX INVOICE / FEE NOTE VIEW ==================== */
              <div>
                {/* Dynamic Watermark Stamp based on Status */}
                <div
                  className={`absolute top-36 right-8 pointer-events-none select-none border-2 font-serif-legal font-bold text-xs uppercase px-3 py-1 rounded tracking-widest rotate-[-12deg] z-10 transition-all ${statusConfig[feeNoteStatus].watermarkCls}`}
                >
                  {statusConfig[feeNoteStatus].watermarkText}
                </div>

                <div className="flex justify-between items-start pb-6 border-b border-[#E3E8E3]">
                  <div>
                    <span className="text-[11px] font-bold tracking-widest uppercase text-[#54685E] block">
                      {statusConfig[feeNoteStatus].headerNote}
                    </span>
                    <h4 className="font-serif-legal font-bold text-xl text-[#0D1F18] mt-0.5">{advocateTitle}</h4>
                    <p className="text-xs text-[#5C7065] mt-1">Member of the Johannesburg Bar · High Court Chambers</p>
                    <p className="text-[11px] text-[#6E8278]">VAT Registration: 4910284719</p>
                  </div>
                  <div className="text-right space-y-1.5">
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="inline-block px-2.5 py-1 bg-[#10271E] text-[#D8C398] text-[10px] font-mono-num font-bold tracking-wider rounded">
                        {statusConfig[feeNoteStatus].docNumber}
                      </span>
                      {/* Dynamic Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-md border ${statusConfig[feeNoteStatus].badgeCls}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[feeNoteStatus].dotCls}`} />
                        <span>{statusConfig[feeNoteStatus].label}</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5C7065] mt-1 font-mono-num">Date: 27 Oct 2026</p>
                    <p className="text-[11px] text-[#5C7065] font-mono-num">Terms: 30 Days Net</p>
                  </div>
                </div>

                <div className="py-4 border-b border-[#E3E8E3] text-xs">
                  <span className="text-[10px] uppercase font-bold text-[#6F8278] block">Instructing Attorney</span>
                  <p className="font-bold text-[#11241C] text-sm mt-0.5">{attorneyFirm}</p>
                  <p className="text-[#4E6257] mt-0.5">Matter: <strong className="text-[#1A3328]">{matterName}</strong></p>
                </div>

                {/* Document Lines */}
                <div className="py-4 space-y-2 border-b border-[#E3E8E3]">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-[#6F8278] pb-1">
                    <span>Description of Services</span>
                    <span>Amount</span>
                  </div>
                  {feeItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs py-1 border-b border-dashed border-[#EDF2EE]">
                      <div className="max-w-[75%]">
                        <p className="font-medium text-[#13271F]">{item.description}</p>
                        <span className="text-[10px] text-[#64796D] font-mono-num">
                          {item.quantity} {item.basis === 'day' ? 'day(s)' : item.basis === 'hr' ? 'hr(s)' : 'item'} @ {formatZAR(item.rate)}
                        </span>
                      </div>
                      <span className="font-mono-num font-semibold text-[#13271F]">
                        {formatZAR(item.quantity * item.rate)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial Totals */}
                <div className="pt-4 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#4D6257]">
                    <span>Fees Subtotal:</span>
                    <span className="font-mono-num font-medium text-[#11241C]">{formatZAR(subtotal)}</span>
                  </div>
                  {vatRegistered && (
                    <div className="flex justify-between text-[#4D6257]">
                      <span>VAT @ 15%:</span>
                      <span className="font-mono-num font-medium text-[#11241C]">{formatZAR(vatAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-[#0D1F18] pt-2 border-t border-[#E3E8E3]">
                    <span>Total Invoiced:</span>
                    <span className="font-mono-num text-base">{formatZAR(grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-800 font-medium pt-1">
                    <span>Allocated Payment Received:</span>
                    <span className="font-mono-num font-bold">− {formatZAR(allocatedPayment)}</span>
                  </div>
                  <div
                    className={`flex justify-between items-center p-3 mt-2 rounded-xl border transition-colors ${
                      balanceDue === 0
                        ? 'bg-[#EBF7EE] border-[#B9E5C4] text-[#166432]'
                        : feeNoteStatus === 'OVERDUE'
                        ? 'bg-[#FDF0ED] border-[#F8C8BD] text-[#A62F1E]'
                        : 'bg-[#F6F8F6] border-[#CCD8CE] text-[#0D1F18]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {balanceDue === 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Scale className="w-4 h-4 text-[#455B4F]" />
                      )}
                      <span className="font-bold">
                        {balanceDue === 0 ? 'Account Settled in Full:' : 'Balance Outstanding:'}
                      </span>
                    </div>
                    <span className="font-mono-num font-bold text-lg">
                      {formatZAR(balanceDue)}
                    </span>
                  </div>
                </div>

                {/* BANK PARTICULARS ON INVOICE */}
                <div className="mt-5 p-4 rounded-xl bg-[#F6F9F7] border border-[#CCD8CE] text-xs space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D8E3DC]">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-[#204938]" />
                      <span className="font-bold uppercase tracking-wider text-[11px] text-[#132A20]">
                        Banking Particulars for Settlement (EFT)
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#204938] bg-[#E2ECE5] px-2 py-0.5 rounded border border-[#CCD8CE]">
                      <Lock className="w-2.5 h-2.5 text-[#204938]" />
                      Official Chambers Bank Details
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                    <div>
                      <span className="text-[#64796E] block text-[10px]">Bank</span>
                      <span className="font-semibold text-[#11241C]">{bankingParticulars.bankName}</span>
                    </div>
                    <div>
                      <span className="text-[#64796E] block text-[10px]">Account Name</span>
                      <span className="font-semibold text-[#11241C] truncate block" title={bankingParticulars.accountHolder}>
                        {bankingParticulars.accountHolder}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64796E] block text-[10px]">Account Number</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono-num font-bold text-[#11241C]">{bankingParticulars.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(bankingParticulars.accountNumber, 'acc')}
                          className="text-[#55695D] hover:text-[#10271E]"
                          title="Copy account number"
                        >
                          {copiedBankField === 'acc' ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-[#64796E] block text-[10px]">Universal Branch Code</span>
                      <span className="font-mono-num font-semibold text-[#11241C]">{bankingParticulars.branchCode}</span>
                    </div>
                    <div>
                      <span className="text-[#64796E] block text-[10px]">Account Type</span>
                      <span className="font-medium text-[#11241C]">{bankingParticulars.accountType}</span>
                    </div>
                    <div className="p-1.5 bg-[#EBF3EE] rounded-lg border border-[#BBD4C3]">
                      <span className="text-[#204938] font-bold block text-[10px]">Required Payment Reference</span>
                      <span className="font-mono-num font-bold text-[#0F261C]">{statusConfig[feeNoteStatus].docNumber}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#D8E3DC] flex flex-wrap items-center justify-between gap-1 text-[10px] text-[#55695D]">
                    <span>Please email payment confirmation (POP) to: <strong className="text-[#1A3328]">accounts@lexchamber.co.za</strong></span>
                    <span>Swift / BIC: <strong className="font-mono-num text-[#1A3328]">{bankingParticulars.swiftCode}</strong></span>
                  </div>
                </div>
              </div>
            ) : (
              /* ==================== 2. INSTRUCTING FIRM STATEMENT OF ACCOUNT VIEW ==================== */
              <div>
                <div className="flex justify-between items-start pb-6 border-b border-[#E3E8E3]">
                  <div>
                    <span className="text-[11px] font-bold tracking-widest uppercase text-[#54685E] block">
                      STATEMENT OF ACCOUNT · DEBTOR LEDGER
                    </span>
                    <h4 className="font-serif-legal font-bold text-xl text-[#0D1F18] mt-0.5">{advocateTitle}</h4>
                    <p className="text-xs text-[#5C7065] mt-1">High Court Chambers · Member of the Johannesburg Bar</p>
                    <p className="text-[11px] text-[#6E8278]">VAT Registration: 4910284719</p>
                  </div>
                  <div className="text-right space-y-1.5">
                    <span className="inline-block px-2.5 py-1 bg-[#10271E] text-[#D8C398] text-[10px] font-mono-num font-bold tracking-wider rounded">
                      STMT-2026-10-DOE
                    </span>
                    <p className="text-[11px] text-[#5C7065] mt-1 font-mono-num">Statement Date: 27 Oct 2026</p>
                    <p className="text-[11px] text-[#5C7065] font-mono-num">Period: LPC Financial Year</p>
                  </div>
                </div>

                <div className="py-4 border-b border-[#E3E8E3] text-xs">
                  <span className="text-[10px] uppercase font-bold text-[#6F8278] block">Account Debtor / Firm</span>
                  <p className="font-bold text-[#11241C] text-sm mt-0.5">{attorneyFirm}</p>
                  <p className="text-[#55695D] mt-0.5">Account Code: <strong className="text-[#1A3328] font-mono-num">DOE-0042</strong> · Attention: Finance &amp; Accounts Payable</p>
                </div>

                {/* Debtor Matters Breakdown */}
                <div className="py-4 space-y-2 border-b border-[#E3E8E3]">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-[#6F8278] pb-1">
                    <span>Date / Matter Brief / Tax Invoice Ref</span>
                    <span>Balance Due</span>
                  </div>

                  {/* Active Simulator Matter */}
                  <div className="p-2.5 bg-[#FAFBF9] rounded-lg border border-[#E3E8E3] space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-[#11241C]">{matterName}</span>
                        <div className="text-[10px] text-[#55695D] flex items-center gap-2 mt-0.5">
                          <span>27 Oct 2026</span>
                          <span>·</span>
                          <span className="font-mono-num font-semibold text-[#18392C]">{statusConfig[feeNoteStatus].docNumber}</span>
                          <span>·</span>
                          <span className="text-blue-700 font-medium">Invoiced: {formatZAR(grandTotal)}</span>
                          <span>·</span>
                          <span className="text-emerald-700 font-medium">Paid: {formatZAR(allocatedPayment)}</span>
                        </div>
                      </div>
                      <span className="font-mono-num font-bold text-sm text-[#11241C]">
                        {formatZAR(balanceDue)}
                      </span>
                    </div>
                  </div>

                  {/* Prior Matter 1: Overdue */}
                  <div className="p-2.5 bg-[#FAFBF9] rounded-lg border border-[#E3E8E3] space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-[#11241C]">Standard Bank v. Ndlovu Enterprises</span>
                        <div className="text-[10px] text-[#55695D] flex items-center gap-2 mt-0.5">
                          <span>15 Sep 2026</span>
                          <span>·</span>
                          <span className="font-mono-num font-semibold text-[#18392C]">INV-2026-0036</span>
                          <span>·</span>
                          <span className="text-blue-700 font-medium">Invoiced: R18,500.00</span>
                          <span>·</span>
                          <span className="text-amber-700 font-medium">Age: 42 Days (30-60 Days)</span>
                        </div>
                      </div>
                      <span className="font-mono-num font-bold text-sm text-[#B44026]">
                        R18,500.00
                      </span>
                    </div>
                  </div>

                  {/* Prior Matter 2: Settled */}
                  <div className="p-2.5 bg-[#FAFBF9] rounded-lg border border-[#E3E8E3] space-y-1 opacity-75">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-medium text-[#11241C]">Mthethwa &amp; Another v. Minister of Police</span>
                        <div className="text-[10px] text-[#55695D] flex items-center gap-2 mt-0.5">
                          <span>08 Aug 2026</span>
                          <span>·</span>
                          <span className="font-mono-num font-semibold text-[#18392C]">INV-2026-0028</span>
                          <span>·</span>
                          <span className="text-emerald-700 font-semibold">✓ Settled in Full</span>
                        </div>
                      </div>
                      <span className="font-mono-num font-semibold text-sm text-emerald-800">
                        R0.00
                      </span>
                    </div>
                  </div>
                </div>

                {/* Aging Summary Grid */}
                <div className="pt-4 space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-[#F6F8F6] rounded-lg border border-[#CCD8CE]">
                      <span className="text-[10px] text-[#55695D] block">Current (0-30d)</span>
                      <span className="font-mono-num font-bold text-[#11241C] mt-0.5 block">{formatZAR(balanceDue)}</span>
                    </div>
                    <div className="p-2 bg-[#FFF6F3] rounded-lg border border-[#F6D0C5]">
                      <span className="text-[10px] text-[#8C3A27] block">31 - 60 Days</span>
                      <span className="font-mono-num font-bold text-[#A62F1E] mt-0.5 block">R18,500.00</span>
                    </div>
                    <div className="p-2 bg-[#F6F8F6] rounded-lg border border-[#CCD8CE]">
                      <span className="text-[10px] text-[#55695D] block">61 - 90 Days</span>
                      <span className="font-mono-num font-bold text-[#11241C] mt-0.5 block">R0.00</span>
                    </div>
                    <div className="p-2 bg-[#F6F8F6] rounded-lg border border-[#CCD8CE]">
                      <span className="text-[10px] text-[#55695D] block">90+ Days</span>
                      <span className="font-mono-num font-bold text-[#11241C] mt-0.5 block">R0.00</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-[#0D1F18] text-white">
                    <div>
                      <span className="text-[11px] text-[#A5BCB0] block uppercase tracking-wider font-bold">Total Statement Balance Outstanding</span>
                      <span className="text-xs text-[#D8C398]">Payable strictly under Bar 30-day terms</span>
                    </div>
                    <span className="font-mono-num font-bold text-xl text-[#D8C398]">
                      {formatZAR(balanceDue + 18500)}
                    </span>
                  </div>
                </div>

                {/* BANK PARTICULARS ON STATEMENT */}
                <div className="mt-5 p-4 rounded-xl bg-[#F6F9F7] border border-[#CCD8CE] text-xs space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D8E3DC]">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-[#204938]" />
                      <span className="font-bold uppercase tracking-wider text-[11px] text-[#132A20]">
                        Remittance Banking Particulars
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#204938] bg-[#E2ECE5] px-2 py-0.5 rounded border border-[#CCD8CE]">
                      <Lock className="w-2.5 h-2.5 text-[#204938]" />
                      Verified Advocate Remittance Account
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                    <div>
                      <span className="text-[#64796E] block text-[10px]">Bank</span>
                      <span className="font-semibold text-[#11241C]">{bankingParticulars.bankName}</span>
                    </div>
                    <div>
                      <span className="text-[#64796E] block text-[10px]">Account Name</span>
                      <span className="font-semibold text-[#11241C] truncate block" title={bankingParticulars.accountHolder}>
                        {bankingParticulars.accountHolder}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64796E] block text-[10px]">Account Number</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono-num font-bold text-[#11241C]">{bankingParticulars.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(bankingParticulars.accountNumber, 'stmt-acc')}
                          className="text-[#55695D] hover:text-[#10271E]"
                          title="Copy account number"
                        >
                          {copiedBankField === 'stmt-acc' ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-[#64796E] block text-[10px]">Branch Code</span>
                      <span className="font-mono-num font-semibold text-[#11241C]">{bankingParticulars.branchCode}</span>
                    </div>
                    <div>
                      <span className="text-[#64796E] block text-[10px]">Account Type</span>
                      <span className="font-medium text-[#11241C]">{bankingParticulars.accountType}</span>
                    </div>
                    <div className="p-1.5 bg-[#EBF3EE] rounded-lg border border-[#BBD4C3]">
                      <span className="text-[#204938] font-bold block text-[10px]">Remittance Reference</span>
                      <span className="font-mono-num font-bold text-[#0F261C]">DOE-INC</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#D8E3DC] text-[10px] text-[#55695D] leading-relaxed">
                    Remittances without specific matter earmarking will be allocated sequentially against the oldest outstanding invoices. Please email proof of remittance to <strong className="text-[#1A3328]">accounts@lexchamber.co.za</strong>.
                  </div>
                </div>
              </div>
            )}

            {/* Actions Bar for Rendered Document */}
            <div className="mt-6 pt-4 border-t border-[#E3E8E3] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`In LexChamber, clicking this generates a pixel-perfect, court-ready ${activeDocView === 'invoice' ? 'Fee Note Tax Invoice' : 'Firm Statement of Account'} PDF with verified banking particulars.`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CCD8CE] hover:bg-[#F2F6F3] font-semibold text-[#18392C]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download {activeDocView === 'invoice' ? 'Invoice' : 'Statement'} PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert(`In LexChamber, clicking this prepares a formatted WhatsApp dispatch for ${attorneyFirm} including banking details and balance breakdown.`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CCD8CE] hover:bg-[#F2F6F3] font-semibold text-[#18392C]"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp Dispatch</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. DATA SOVEREIGNTY SECTION WITH LAW BOOKS BACKGROUND PHOTO */}
      <section id="sovereignty" className="relative py-24 lg:py-32 overflow-hidden text-white border-y border-[#21382F] scroll-mt-12">
        {/* Background photo of law books with deep forest green gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src={libraryLawBooks}
            alt="Law Reports and Jurisprudence Books on Dark Oak Shelves"
            className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.15]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071711] via-[#091F17]/95 to-[#071711]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-14">
            <p className="text-xs font-bold uppercase tracking-wider text-[#D8C398] mb-2">
              Uncompromising Client Confidentiality &amp; POPIA Compliance
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif-legal font-bold tracking-tight text-white">
              Your financial records stay in your own Google Sheet.
            </h2>
            <p className="text-sm sm:text-base text-[#CCDCD3] mt-3">
              Most practice software locks your matters and invoices into closed proprietary databases. If you cancel your subscription, you lose your tools or pay ransom for your data. With LexChamber, your accounting records live in your private Google Drive and Google Sheets.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#0B1E17]/85 p-7 rounded-2xl border border-[#214334] shadow-lg space-y-3 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#193B2D] flex items-center justify-center text-[#D8C398]">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">01. Client-Owned Storage</h3>
              <p className="text-xs text-[#B1C7BC] leading-relaxed">
                Matters, debtors, bank reconciliations, and issued invoices write directly to your own Google Sheet. You retain unrestricted spreadsheet access 24/7, even without LexChamber.
              </p>
            </div>

            <div className="bg-[#0B1E17]/85 p-7 rounded-2xl border border-[#214334] shadow-lg space-y-3 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#193B2D] flex items-center justify-center text-[#D8C398]">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">02. Signed HMAC-SHA256 Protocol</h3>
              <p className="text-xs text-[#B1C7BC] leading-relaxed">
                Requests between the secure web app and your Apps Script backend are digitally signed with a shared cryptographic secret and 2-minute replay protection nonces.
              </p>
            </div>

            <div className="bg-[#0B1E17]/85 p-7 rounded-2xl border border-[#214334] shadow-lg space-y-3 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#193B2D] flex items-center justify-center text-[#D8C398]">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">03. Immutable PDF Snapshots</h3>
              <p className="text-xs text-[#B1C7BC] leading-relaxed">
                Once an invoice is approved, the original issued PDF is saved to your private Google Drive folder with a SHA-256 fingerprint. No accidental overrides, no missing audit trails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ADVOCATE VS SECRETARY ROLE DELEGATION */}
      <section className="py-20 lg:py-28 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-[#2D634E] mb-2">
            Chambers Delegation Model
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif-legal font-bold text-[#0D1F18] tracking-tight">
            Delegate routine admin. Retain statutory authority.
          </h2>
          <p className="text-sm sm:text-base text-[#465950] mt-3">
            In an advocate’s practice, a secretary plays a crucial role in drafting fee notes and logging attorney payments. LexChamber gives your secretary a verified, restricted login—without letting them see private financial positions, bank transactions, or personal tax settings.
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="inline-flex p-1 bg-[#E8EFEA] rounded-xl border border-[#CCD8CE] mb-8">
          <button
            onClick={() => setActiveRoleTab('advocate')}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeRoleTab === 'advocate'
                ? 'bg-[#10271E] text-white shadow-xs'
                : 'text-[#3E5247] hover:text-[#10271E]'
            }`}
          >
            Advocate (Full Practice Owner)
          </button>
          <button
            onClick={() => setActiveRoleTab('secretary')}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeRoleTab === 'secretary'
                ? 'bg-[#10271E] text-white shadow-xs'
                : 'text-[#3E5247] hover:text-[#10271E]'
            }`}
          >
            Secretary (Restricted Operations)
          </button>
        </div>

        {/* Dynamic Comparison Panel */}
        <div className="grid md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl border border-[#D5DFD7]">
          <div>
            <h4 className="font-serif-legal font-bold text-lg text-[#0D1F18] mb-4">
              {activeRoleTab === 'advocate' ? 'Advocate Capabilities' : 'Secretary Allowed Tasks'}
            </h4>
            <ul className="space-y-3 text-xs text-[#3A4E43]">
              {activeRoleTab === 'advocate' ? (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#204938] shrink-0" />
                    <span><strong>Approve &amp; Issue Final Tax Invoices</strong> — Numbers assigned only on final advocate sign-off</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#204938] shrink-0" />
                    <span><strong>Full Income &amp; Expense Control</strong> — View practice expenses, drawings, and banking statements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#204938] shrink-0" />
                    <span><strong>LPC Financial Year Reports</strong> — Run comprehensive reports from 1 March to 28 February</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#204938] shrink-0" />
                    <span><strong>Link &amp; Revoke Staff</strong> — Add up to 5 verified secretary accounts at any time</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#204938] shrink-0" />
                    <span><strong>Create &amp; Maintain Matters</strong> — Add instructing attorneys, firm contacts, and case references</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#204938] shrink-0" />
                    <span><strong>Prepare Draft Fee Notes</strong> — Enter services, hours, court days, and disbursements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#204938] shrink-0" />
                    <span><strong>Record Attorney Receipts</strong> — Allocate incoming payments against issued invoices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#204938] shrink-0" />
                    <span><strong>WhatsApp &amp; Email Preparation</strong> — Generate draft dispatch messages for counsel review</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="bg-[#FAFBF9] p-6 rounded-xl border border-[#E3EAE4]">
            <h4 className="font-serif-legal font-bold text-sm text-[#0D1F18] mb-3">
              {activeRoleTab === 'advocate' ? 'Security & Governance Guarantee' : 'Strict Redaction Boundaries'}
            </h4>
            <p className="text-xs text-[#52665B] leading-relaxed">
              {activeRoleTab === 'advocate'
                ? 'Your practice is governed by your primary verified email address. Secretary invitations require mutual confirmation in Clerk, and can be revoked instantaneously with a single click in your Settings tab.'
                : 'The server actively redacts your bank account sheets, transactions, and private financial position before the data packet leaves the edge. Even if a secretary modifies client code, the server rejects unauthorized mutations with HTTP 403.'}
            </p>
          </div>
        </div>
      </section>

      {/* 8. PRICING & PLANS */}
      <section id="pricing" className="py-20 lg:py-28 px-6 lg:px-12 bg-[#F2F6F3] border-t border-[#D9E2DA] scroll-mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-[#2D634E] mb-2">
              Transparent, Professional Subscriptions
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif-legal font-bold text-[#0D1F18] tracking-tight">
              Choose how you practise.
            </h2>
            <p className="text-sm text-[#495D52] mt-2">
              Start with 7 days to explore your connected workspace. No payment taken at signup.
            </p>

            {/* Monthly vs Annual Toggle */}
            <div className="inline-flex items-center gap-3 p-1.5 bg-white rounded-xl border border-[#CCD8CE] mt-6 shadow-xs">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-[#10271E] text-white shadow-xs'
                    : 'text-[#4A5E53] hover:text-[#10271E]'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-[#10271E] text-white shadow-xs'
                    : 'text-[#4A5E53] hover:text-[#10271E]'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] font-bold text-[#D8C398] bg-[#1C3E31] px-1.5 py-0.5 rounded">
                  Save 15%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl border border-[#D5DFD7] p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4E6257]">Starter</span>
                  <span className="text-[11px] font-semibold text-[#18392C] bg-[#EAF0EC] px-2 py-0.5 rounded">Billing Essentials</span>
                </div>
                <h3 className="font-serif-legal font-bold text-2xl text-[#0D1F18]">Get your billing in order.</h3>
                <p className="text-xs text-[#52655B] mt-2">
                  Everything an advocate needs for fast, accurate fee notes, payment tracking, and debtors statements.
                </p>

                <div className="mt-6 mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono-num text-[#0F221B]">
                      {billingCycle === 'annual' ? 'R509.15' : 'R599.00'}
                    </span>
                    <span className="text-xs text-[#5C7065]">/ month</span>
                  </div>
                  <p className="text-[11px] text-[#6E8278] mt-1 font-mono-num">
                    {billingCycle === 'annual'
                      ? 'R6,109.80 billed annually (Save 15%)'
                      : 'Billed monthly · Cancel anytime'}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F6F8F6] border border-[#E3EAE4] text-xs text-[#204938] font-semibold flex items-center gap-2 mb-6">
                  <CheckCircle2 className="w-4 h-4 text-[#204938]" />
                  <span>7-Day Free Trial · No automatic charge</span>
                </div>

                <ul className="space-y-2.5 text-xs text-[#394D42] mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#204938] shrink-0" />
                    <span>Instructing firms and matters management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#204938] shrink-0" />
                    <span>Fee notes, court PDFs, and statements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#204938] shrink-0" />
                    <span>Payment allocation and outstanding debtor tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#204938] shrink-0" />
                    <span>Email &amp; WhatsApp document sharing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#204938] shrink-0" />
                    <span>Restricted secretary access accounts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#204938] shrink-0" />
                    <span>Your own Google Sheets practice backend</span>
                  </li>
                </ul>
              </div>

              <a
                href="mailto:info@lexchamber.co.za?subject=LexChamber%20Starter%20Trial"
                className="w-full py-3 rounded-lg text-center text-xs font-bold text-[#10271E] bg-[#E5EDE7] hover:bg-[#D5E2D8] transition-colors"
              >
                Start Starter Free Trial ↗
              </a>
            </div>

            {/* Pro Plan (Featured) */}
            <div className="bg-[#10271E] text-white rounded-2xl border border-[#27483B] p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#D8C398] text-[#10271E] font-bold text-[10px] tracking-wider uppercase py-1 px-3 rounded-bl-lg">
                Recommended
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A5BCB1]">Pro</span>
                  <span className="text-[11px] font-semibold text-[#D8C398] bg-[#1C3E30] px-2 py-0.5 rounded">Full Chambers Finance</span>
                </div>
                <h3 className="font-serif-legal font-bold text-2xl text-white">Bring your practice finances together.</h3>
                <p className="text-xs text-[#B2C7BC] mt-2">
                  Complete income, expenses, bank statement uploads, reconciliation, and LPC financial year reporting.
                </p>

                <div className="mt-6 mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono-num text-white">
                      {billingCycle === 'annual' ? 'R679.15' : 'R799.00'}
                    </span>
                    <span className="text-xs text-[#A5BCB1]">/ month</span>
                  </div>
                  <p className="text-[11px] text-[#A5BCB1] mt-1 font-mono-num">
                    {billingCycle === 'annual'
                      ? 'R8,149.80 billed annually (Save 15%)'
                      : 'Billed monthly · Cancel anytime'}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#18392C] border border-[#2B5442] text-xs text-[#D8C398] font-semibold flex items-center gap-2 mb-6">
                  <CheckCircle2 className="w-4 h-4 text-[#D8C398]" />
                  <span>7-Day Free Trial · Full feature access</span>
                </div>

                <ul className="space-y-2.5 text-xs text-[#C5D7CD] mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D8C398] shrink-0" />
                    <span><strong>Everything in Starter, plus:</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D8C398] shrink-0" />
                    <span>Income and practice expense categorization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D8C398] shrink-0" />
                    <span>Bank statement PDF and CSV upload parser</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D8C398] shrink-0" />
                    <span>Cheque, savings, and credit card account registers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D8C398] shrink-0" />
                    <span>LPC Annual Fees Register &amp; draft financial statements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D8C398] shrink-0" />
                    <span>Priority migration support for existing fee books</span>
                  </li>
                </ul>
              </div>

              <a
                href="mailto:info@lexchamber.co.za?subject=LexChamber%20Pro%20Trial"
                className="w-full py-3 rounded-lg text-center text-xs font-bold text-[#10271E] bg-[#D8C398] hover:bg-[#C9B384] transition-colors shadow-sm"
              >
                Start Pro Free Trial ↗
              </a>
            </div>

          </div>

          <p className="text-center text-[11px] text-[#697E72] mt-8 max-w-xl mx-auto">
            Your 7-day free trial activates once your backend connection is confirmed. No payment is taken upfront. Contact <a href="mailto:info@lexchamber.co.za" className="underline text-[#10271E]">info@lexchamber.co.za</a> for practice setup assistance.
          </p>
        </div>
      </section>

      {/* 9. LEGAL SECTION & TERMS OF USE (DEDICATED) */}
      <section id="legal" className="py-20 lg:py-28 px-6 lg:px-12 max-w-5xl mx-auto scroll-mt-12 border-t border-[#D9E2DA]">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E3E31] text-xs font-semibold mb-3">
            <FileCheck2 className="w-3.5 h-3.5 text-[#204938]" />
            <span>Governance, Terms &amp; Compliance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-legal font-bold text-[#0D1F18] tracking-tight">
            Legal Notices &amp; Terms of Use
          </h2>
          <p className="text-xs sm:text-sm text-[#4E6257] mt-2 max-w-2xl mx-auto">
            Clear contractual terms, privacy disclosures, and professional boundaries for advocates practising in South Africa.
          </p>
        </div>

        {/* Legal Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 border-b border-[#CCD8CE] pb-4">
          {[
            { id: 'terms', label: '01. Terms of Use' },
            { id: 'privacy', label: '02. Privacy & POPIA' },
            { id: 'sovereignty', label: '03. Client-Owned Data' },
            { id: 'subscriptions', label: '04. Subscriptions & Trial' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveLegalTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeLegalTab === tab.id
                  ? 'bg-[#10271E] text-white shadow-xs'
                  : 'text-[#485C51] hover:bg-[#E8EFEA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl border border-[#D5DFD7] p-8 shadow-xs text-xs text-[#3E5247] leading-relaxed space-y-4">
          {activeLegalTab === 'terms' && (
            <div className="space-y-4">
              <h3 className="font-serif-legal font-bold text-base text-[#0D1F18]">
                1. Service Scope &amp; Professional Advice Disclaimer
              </h3>
              <p>
                LexChamber is specialized administrative and financial recording software supplied by <strong>QAGA Data</strong>. LexChamber does not provide legal, tax, auditing, or investment advice.
              </p>
              <p>
                Reports, summaries, fee notes, and draft financial statements generated by LexChamber require independent professional review by the practitioner. You, as the admitted advocate or legal practitioner, remain solely responsible for the accuracy of all invoice particulars, VAT treatments, payment allocations, SARS submissions, and strict compliance with the Legal Practice Act, 2014, and applicable Bar Council rules.
              </p>
              <div className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E3EAE4] space-y-2">
                <span className="font-bold text-[#10271E] block">Key Practice Invariants:</span>
                <ul className="list-disc list-inside space-y-1 text-[#4F6358]">
                  <li>You maintain full control of your instructing attorney records and brief descriptions.</li>
                  <li>Invoices issued receive sequential serial numbers only upon explicit advocate confirmation.</li>
                  <li>WhatsApp sharing and Brevo transactional dispatch require final user confirmation before sending.</li>
                </ul>
              </div>
            </div>
          )}

          {activeLegalTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="font-serif-legal font-bold text-base text-[#0D1F18]">
                2. Privacy Notice &amp; POPIA Compliance (Act 4 of 2013)
              </h3>
              <p>
                In compliance with the South African Protection of Personal Information Act (POPIA), QAGA Data upholds the principle of data minimization and purpose specification.
              </p>
              <p>
                Your practice accounting records and matter details are stored exclusively inside your configured Google Sheets spreadsheet and private Google Drive folder. LexChamber operates as an edge broker and does not persist your client names, briefing attorneys, or financial amounts on persistent QAGA Data servers.
              </p>
              <p>
                Authentication credentials and email verifications are handled via Clerk with enterprise-grade session encryption. Session tokens and temporary client-side sync caches stored in your local browser are encrypted to ensure offline resilience and rapid reopening.
              </p>
              <p className="text-[11px] text-[#697E72]">
                For data privacy requests or information officer inquiries, contact: <a href="mailto:info@lexchamber.co.za" className="text-[#10271E] underline">info@lexchamber.co.za</a>.
              </p>
            </div>
          )}

          {activeLegalTab === 'sovereignty' && (
            <div className="space-y-4">
              <h3 className="font-serif-legal font-bold text-base text-[#0D1F18]">
                3. Client-Owned Data Sovereignty &amp; Zero Lock-in
              </h3>
              <p>
                You retain complete, unfettered legal ownership of all data entered into your practice workspace. Because records are written directly to your own Google Workspace or Google Sheets account, you maintain 24/7 direct access to raw spreadsheets, formulas, and backups without requiring active software access.
              </p>
              <p>
                Google Apps Script requests are cryptographically authenticated via an HMAC-SHA256 signature generated by your browser session and verified against your Apps Script secret. QAGA Data does not possess master credentials to your Google Drive.
              </p>
              <p>
                Should you decide to cease using LexChamber, your data remains fully intact in your spreadsheet, exportable at any time to standard CSV, Excel, or PDF formats.
              </p>
            </div>
          )}

          {activeLegalTab === 'subscriptions' && (
            <div className="space-y-4">
              <h3 className="font-serif-legal font-bold text-base text-[#0D1F18]">
                4. Subscriptions, Trials &amp; Cancellation Conditions
              </h3>
              <p>
                Both Starter and Pro tiers include a full 7-day free trial. Your trial duration begins only after your backend Google Sheets connection is verified. No credit card or automated charge is required to register.
              </p>
              <p>
                At the conclusion of the 7-day trial, your practice records remain preserved in your Google Sheet. To continue issuing invoices and syncing records through LexChamber, an active monthly or annual plan must be activated.
              </p>
              <p>
                Annual billing plans include a 15% discount (Starter at R6,109.80/year; Pro at R8,149.80/year) paid upfront. Monthly plans may be cancelled at any time without penalty. All quoted prices exclude South African VAT where applicable.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-20 lg:py-28 px-6 lg:px-12 max-w-4xl mx-auto scroll-mt-12">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-[#2D634E] mb-2">
            Clear Guidance for Practice Setup
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif-legal font-bold text-[#0D1F18] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'Can my secretary use LexChamber without seeing my private finances?',
              a: 'Yes. Your secretary creates a verified Clerk account, which you link under Team Access in your workspace. Secretary accounts are strictly restricted to matter creation, draft fee note generation, and logging payment receipts. They are completely blocked from viewing your bank statements, expense registers, drawings, and tax settings.',
            },
            {
              q: 'Are my bank particulars automatically included on invoices and statements?',
              a: 'Yes. Every generated fee note, tax invoice, and instructing attorney statement embeds your official South African banking particulars (Bank Name, Account Holder, Account Number, Universal Branch Code, Account Type, Swift/BIC, and exact matter payment references). To protect against EFT invoice fraud, bank particulars are secured under advocate-only credentials and cannot be altered by secretarial staff.',
            },
            {
              q: 'Where are my advocate practice records and invoices stored?',
              a: 'In a Google Sheets spreadsheet and Google Drive folder owned and controlled exclusively by your practice. LexChamber never stores your financial books in a proprietary third-party database. If you ever stop using the web app, your accounting records and PDFs remain yours in your Google Drive.',
            },
            {
              q: 'Can I migrate my existing debtor books and past invoices from Excel or LegalSuite?',
              a: 'Yes. LexChamber includes a dedicated CSV migration workspace. You can preview and validate firms, matters, and unpaid opening balances. Unpaid balances are imported as opening debtors without falsifying historic tax invoices or duplicating receipts.',
            },
            {
              q: 'How does WhatsApp sharing work with Instructing Attorneys?',
              a: 'LexChamber prepares the fee note summary message and formats the international phone number (e.g., converting 082 to +2782). The PDF and message are handed to your WhatsApp application, allowing you to review the recipient and preview the attachment before sending.',
            },
            {
              q: 'Is LexChamber compliant with South African Legal Practice Council (LPC) standards?',
              a: 'LexChamber handles proper South African tax invoice specifics, 15% VAT calculation, sequential numbering rules, 30-day debtors ageing, and March-to-February legal financial years required for annual audit submissions.',
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-[#D5DFD7] overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-bold text-[#10271E] hover:bg-[#F9FBFA] transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#596D61] transition-transform ${
                    faqOpen[idx] ? 'rotate-180 text-[#10271E]' : ''
                  }`}
                />
              </button>
              {faqOpen[idx] && (
                <div className="px-6 pb-4 text-xs text-[#4E6257] leading-relaxed border-t border-[#EDF2EE] pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 11. CLOSING SECTION */}
      <section className="bg-[#0B1A14] text-white py-20 px-6 lg:px-12 text-center border-t border-[#1C362B]">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#D8C398]">
            Your Next Brief Is Waiting
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif-legal font-bold tracking-tight text-white">
            Make room for the work that <span className="text-[#D8C398] italic">matters.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#BFD4C8] max-w-xl mx-auto">
            Join South African advocates who have eliminated billing friction and brought clarity to their chambers.
          </p>
          <div className="pt-2">
            <a
              href="mailto:info@lexchamber.co.za?subject=LexChamber%20Free%20Trial%20Enquiry"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-[#0B1A14] bg-[#D8C398] hover:bg-[#E8D6B0] shadow-lg transition-transform hover:scale-105"
            >
              <span>Start Your 7-Day Free Trial</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 12. QUIET FOOTER */}
      <footer className="bg-[#FAFBFC] border-t border-[#E3E8E3] py-12 px-6 lg:px-12 text-xs text-[#52655B]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif-legal font-bold text-sm text-[#0D1F18]">
              LexChamber<sup className="text-[8px] font-sans ml-0.5">©</sup>
            </span>
            <span aria-hidden="true" className="text-[#A5B8AC]">·</span>
            <span>A Product of QAGA Data</span>
            <span aria-hidden="true" className="text-[#A5B8AC]">·</span>
            <span className="text-[#6C8074]">Connected data. Clear action.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="/lexchamber-code.zip"
              download="lexchamber-code.zip"
              className="inline-flex items-center gap-1.5 text-[#16402E] font-semibold hover:text-[#0B1A14] transition-colors"
              title="Download offline backup ZIP of codebase"
            >
              <Download className="w-3.5 h-3.5 text-[#1D513B]" />
              <span>Download Code (.ZIP)</span>
            </a>
            <span aria-hidden="true" className="text-[#A5B8AC]">·</span>
            <a href="mailto:info@lexchamber.co.za" className="hover:text-[#10271E] transition-colors">
              info@lexchamber.co.za
            </a>
            <span aria-hidden="true" className="text-[#A5B8AC]">·</span>
            <a href="#legal" className="hover:text-[#10271E] transition-colors">
              Legal &amp; Terms
            </a>
            <span aria-hidden="true" className="text-[#A5B8AC]">·</span>
            <span>South African Jurisdiction</span>
            <span aria-hidden="true" className="text-[#A5B8AC]">·</span>
            <span>POPIA Aligned</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
