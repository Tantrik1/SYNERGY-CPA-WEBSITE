/**
 * SYNERGY CPA - Interactive Web Application Logic
 * Precision Financial Tools, Modals, Dynamic Filtering, and Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSimulator();
  initServices();
  initModals();
  initInsights();
  initForms();
  initTestimonials();
});

/* ==========================================================================
   1. NAVIGATION & STICKY HEADER
   ========================================================================== */

function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .mega-item, .footer-nav-list a');

  // Sticky header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileDrawer.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close mobile menu when clicking links
    document.querySelectorAll('.mobile-drawer a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  // Desktop Services dropdown click handling
  const servicesDropdownItem = document.querySelector('.nav-link-item');
  const servicesBtn = servicesDropdownItem ? servicesDropdownItem.querySelector('.nav-link') : null;
  
  if (servicesBtn && servicesDropdownItem) {
    servicesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      servicesDropdownItem.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!servicesDropdownItem.contains(e.target)) {
        servicesDropdownItem.classList.remove('open');
      }
    });

    // Close dropdown when clicking any item inside mega-menu
    document.querySelectorAll('.mega-item, .mega-footer a').forEach(item => {
      item.addEventListener('click', () => {
        servicesDropdownItem.classList.remove('open');
      });
    });
  }

  // Smooth scroll offset handling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.startsWith('#!')) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   2. INTERACTIVE FINANCIAL CLARITY & RUNWAY SIMULATOR
   ========================================================================== */

function initSimulator() {
  const revSlider = document.getElementById('sim-revenue');
  const expSlider = document.getElementById('sim-expenses');
  const revDisplay = document.getElementById('sim-rev-val');
  const expDisplay = document.getElementById('sim-exp-val');
  const runwayDisplay = document.getElementById('sim-res-runway');
  const taxDisplay = document.getElementById('sim-res-tax');
  const tierDisplay = document.getElementById('sim-res-tier');
  const marginDisplay = document.getElementById('sim-res-margin');
  const stageBtns = document.querySelectorAll('.sim-stage-btn');

  if (!revSlider || !expSlider) return;

  let currentStage = 'scaling'; // 'bootstrapped', 'scaling', 'established'

  stageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stageBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStage = btn.dataset.stage;

      // Smart preset for each stage
      if (currentStage === 'bootstrapped') {
        revSlider.value = 18000;
        expSlider.value = 12000;
      } else if (currentStage === 'scaling') {
        revSlider.value = 80000;
        expSlider.value = 55000;
      } else if (currentStage === 'established') {
        revSlider.value = 220000;
        expSlider.value = 140000;
      }

      revDisplay.textContent = formatCurrency(Number(revSlider.value));
      expDisplay.textContent = formatCurrency(Number(expSlider.value));
      calculateSimulator();
    });
  });

  revSlider.addEventListener('input', () => {
    revDisplay.textContent = formatCurrency(Number(revSlider.value));
    calculateSimulator();
  });

  expSlider.addEventListener('input', () => {
    expDisplay.textContent = formatCurrency(Number(expSlider.value));
    calculateSimulator();
  });

  function calculateSimulator() {
    const rev = Number(revSlider.value);
    const exp = Number(expSlider.value);
    const net = rev - exp;
    
    // Calculate Margin
    const margin = rev > 0 ? Math.round((net / rev) * 100) : 0;
    if (marginDisplay) {
      marginDisplay.textContent = `${margin >= 0 ? '+' : ''}${margin}%`;
      marginDisplay.style.color = margin >= 15 ? 'var(--brand-700)' : (margin >= 0 ? 'var(--ink-800)' : '#ef4444');
    }

    // Calculate Projected Cash Runway / Working Capital Score
    if (runwayDisplay) {
      if (net >= 0) {
        runwayDisplay.textContent = 'Profitable / Positive';
        runwayDisplay.style.color = 'var(--brand-700)';
      } else {
        const burnMonths = Math.abs(Math.round((rev * 3) / Math.abs(net)));
        runwayDisplay.textContent = `~${Math.max(1, burnMonths)} Mo Buffer`;
        runwayDisplay.style.color = '#ef4444';
      }
    }

    // Calculate Estimated Annual Tax & Deductions Planning Potential
    if (taxDisplay) {
      let taxPotential = 0;
      if (currentStage === 'bootstrapped' || rev < 25000) {
        taxPotential = Math.round(rev * 12 * 0.045); // SBD + write-offs
      } else if (currentStage === 'scaling' || rev < 120000) {
        taxPotential = Math.round(rev * 12 * 0.068); // Cross-border, R&D credits, compensation split
      } else {
        taxPotential = Math.round(rev * 12 * 0.085); // Corporate restructuring, holding co, dividend optimization
      }
      taxDisplay.textContent = `$${(taxPotential / 1000).toFixed(1)}k / yr`;
    }

    // Recommended Engagement Tier (Includes Bookkeeping)
    if (tierDisplay) {
      if (currentStage === 'bootstrapped' || rev <= 25000) {
        tierDisplay.textContent = 'Monthly Bookkeeping & Clean Books';
      } else if (rev <= 60000) {
        tierDisplay.textContent = 'Core Accounting & Corporate Tax';
      } else if (rev <= 140000) {
        tierDisplay.textContent = 'Fractional CFO + Monthly Close';
      } else {
        tierDisplay.textContent = 'Executive CFO + Corporate Strategy';
      }
    }
  }

  function formatCurrency(val) {
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(0)}k/mo`;
    }
    return `$${val}/mo`;
  }

  // Initial calculation
  calculateSimulator();
}

/* ==========================================================================
   3. SERVICES DATA & FILTERING
   ========================================================================== */

const SERVICES_DATA = [
  {
    id: 'fractional-cfo',
    srvCode: 'SRV · 01',
    category: 'cfo-advisory',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>`,
    title: 'Fractional CFO Services',
    tagline: 'Strategic financial leadership without a full-time CFO.',
    description: 'We blend disciplined compliance with executive-level financial strategy. From forward-looking scenario modeling to investor and board reporting, get high-level CFO leadership tailored to your growth trajectory.',
    bullets: [
      'Financial strategy, cash flow modeling & scenario forecasting',
      'KPI dashboards and executive management reporting',
      'Capital allocation, debt financing & bank relationship management',
      'Board advisory, audit committee support & investor updates'
    ],
    idealFor: 'Growing Canadian companies ($1M - $25M revenue) needing strategic CFO direction without full-time executive payroll.'
  },
  {
    id: 'accounting-bookkeeping',
    srvCode: 'SRV · 02',
    category: 'accounting-tax',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/><path d="M6 14h6"/></svg>`,
    title: 'Accounting & Bookkeeping',
    tagline: 'Clean books. Clear visibility. Better decisions.',
    description: 'Accurate, timely monthly bookkeeping that transforms scattered receipts and bank statements into reliable, decision-grade financial statements. We set up clean cloud accounting workflows on QuickBooks Online or Xero.',
    bullets: [
      'Monthly bookkeeping & multi-account bank reconciliations',
      'Cloud accounting system implementation (QuickBooks Online, Xero, Dext)',
      'Notice to Reader (Compilation Engagement) financial statements',
      'Year-end audit and review package preparation'
    ],
    idealFor: 'Businesses that have outgrown basic spreadsheets and require clean, audit-ready financial records.'
  },
  {
    id: 'tax-planning-compliance',
    srvCode: 'SRV · 03',
    category: 'accounting-tax',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>`,
    title: 'Tax Planning & Compliance',
    tagline: 'Tax should be planned — not discovered.',
    description: 'We believe most tax stress comes from waiting until deadlines. Our proactive planning analyzes your corporate and personal posture months ahead to legally minimize liabilities and ensure zero CRA surprises.',
    bullets: [
      'Corporate tax preparation & filing (T2 Returns)',
      'Personal & owner-manager tax optimization (T1 Returns)',
      'Salary vs dividend optimization and shareholder loan management',
      'CRA audit defense, voluntary disclosures, and representation'
    ],
    idealFor: 'Business owners seeking strategic, proactive tax structuring rather than reactive annual filing.'
  },
  {
    id: 'payroll-outsourcing',
    srvCode: 'SRV · 04',
    category: 'operations',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    title: 'Payroll & Accounting Outsourcing',
    tagline: 'Reduce owner dependency. Improve reliability.',
    description: 'Eliminate the administrative burden of running payroll and day-to-day accounts payable/receivable. We handle full-cycle payroll, employee vs contractor compliance, source deductions, and ROE filings accurately on time.',
    bullets: [
      'Complete payroll processing and direct deposits',
      'CRA source deductions (CPP, EI, Income Tax) remittances',
      'T4, T4A, T5 summary filings and Records of Employment (ROE)',
      'Contractor classification reviews and automated AP/AR workflows'
    ],
    idealFor: 'Companies with 2 to 100+ team members seeking automated, error-free Canadian payroll operations.'
  },
  {
    id: 'cash-flow-forecasting',
    srvCode: 'SRV · 05',
    category: 'cfo-advisory',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    title: 'Cash Flow Planning & Forecasting',
    tagline: 'Profit doesn’t pay bills — cash does.',
    description: 'A business can be profitable on paper and still run out of cash. We build dynamic 13-week rolling cash flow models that give you visibility into collections, payroll peaks, inventory cycles, and tax obligations.',
    bullets: [
      '13-week dynamic rolling cash flow models',
      'GST/HST and corporate instalment timing planning',
      'Working capital optimization & receivables acceleration',
      'Scenario testing for major hires, Capex, and seasonal dips'
    ],
    idealFor: 'Founders managing rapid scaling, inventory purchases, or seasonal revenue variations.'
  },
  {
    id: 'business-advisory',
    srvCode: 'SRV · 06',
    category: 'cfo-advisory',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>`,
    title: 'Business Advisory & Growth Planning',
    tagline: 'Structure first. Growth second.',
    description: 'Sustainable expansion requires solid operational foundations. We advise on corporate structure, shareholder agreements, international expansion into Canada, and strategic business model enhancements.',
    bullets: [
      'Growth readiness & scalable financial architecture assessments',
      'Partnership, holding company & shareholder structure clarity',
      'Cross-border expansion into the Canadian market (UK, US, UAE, Nepal)',
      'Pricing model review, unit economics, and margin optimization'
    ],
    idealFor: 'Entrepreneurs scaling operations, bringing on partners, or entering the Canadian market.'
  },
  {
    id: 'budgeting-performance',
    srvCode: 'SRV · 07',
    category: 'cfo-advisory',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="8" x2="16" y1="10" y2="10"/><line x1="8" x2="12" y1="14" y2="14"/></svg>`,
    title: 'Budgeting & Performance Review',
    tagline: 'Budgets that protect — not restrict.',
    description: 'We turn budgets from rigid spreadsheets into agile management tools. Track department targets, identify cost overruns early, and align your leadership team around measurable financial goals.',
    bullets: [
      'Annual master operating budgets and rolling departmental forecasts',
      'Monthly actual-vs-budget variance reporting & analysis',
      'Cost center profitability and overhead optimization',
      'Team KPI tracking tied directly to bottom-line results'
    ],
    idealFor: 'Management teams wanting accountability and clear financial boundaries as headcount grows.'
  },
  {
    id: 'internal-controls',
    srvCode: 'SRV · 08',
    category: 'operations',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    title: 'Internal Controls & Risk Reviews',
    tagline: 'Small gaps become big problems when ignored.',
    description: 'Protect your enterprise from internal fraud, payment leakage, and compliance penalties. We audit your financial processes, establish segregation of duties, and implement secure approval workflows.',
    bullets: [
      'Comprehensive financial process & control reviews',
      'Segregation of duties and banking authorization protocols',
      'Vendor verification and payment fraud prevention checks',
      'Documentation of standard operating procedures (SOPs)'
    ],
    idealFor: 'Companies delegating financial authority to managers or preparing for institutional financing.'
  },
  {
    id: 'valuation-due-diligence',
    srvCode: 'SRV · 09',
    category: 'cfo-advisory',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/><path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17"/><circle cx="12" cy="12" r="10"/></svg>`,
    title: 'Valuation & Due Diligence',
    tagline: 'When decisions are expensive, clarity matters.',
    description: 'Whether acquiring a competitor, taking on private equity, or preparing for succession, our due diligence and valuation support ensures you enter negotiations with complete data clarity.',
    bullets: [
      'Business valuation analysis and normalization of earnings (EBITDA)',
      'Financial & tax due diligence for acquisitions and divestitures',
      'Deal structuring guidance to optimize Canadian capital gains exemptions (LCGE)',
      'Post-transaction integration planning and closing balance sheet audits'
    ],
    idealFor: 'Founders preparing for M&A, capital raises, shareholder buyouts, or retirement exits.'
  }
];

function initServices() {
  const container = document.getElementById('services-grid-container');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!container) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      const cards = container.querySelectorAll('.service-card');
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. MODALS (SERVICE DETAILS, INSIGHT READER, COFFEE BOOKING)
   ========================================================================== */

function initModals() {
  const backdrop = document.getElementById('global-modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!backdrop) return;

  closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

function openModal(contentHtml) {
  const backdrop = document.getElementById('global-modal-backdrop');
  const body = document.getElementById('modal-dynamic-body');
  if (!backdrop || !body) return;

  body.innerHTML = contentHtml;
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const backdrop = document.getElementById('global-modal-backdrop');
  if (!backdrop) return;
  backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

function openServiceModal(service) {
  const html = `
    <span class="eyebrow eyebrow-dot modal-eyebrow">${service.srvCode} · Service Deep Dive</span>
    <h2 class="modal-title">${service.title}</h2>
    <div class="modal-tagline">${service.tagline}</div>
    <div class="modal-body-content">
      <p>${service.description}</p>
      
      <h4 style="margin: 20px 0 10px; color: var(--ink-950); font-weight: 700;">What is Included:</h4>
      <ul>
        ${service.bullets.map(b => `<li><strong>${b}</strong></li>`).join('')}
      </ul>

      <div style="background: var(--surface-1); padding: 16px; border-radius: var(--radius-md); margin-top: 20px; border-left: 3px solid var(--brand-700);">
        <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--brand-700); display: block; margin-bottom: 4px;">Ideal Client Profile</span>
        <p style="font-size: 0.8875rem; margin: 0; color: var(--ink-800);">${service.idealFor}</p>
      </div>
    </div>
    
    <div class="modal-cta-box">
      <div>
        <div style="font-size: 0.9375rem; font-weight: 700; color: var(--ink-950);">Ready to discuss this engagement?</div>
        <div style="font-size: 0.8125rem; color: var(--ink-500);">Book a Coffee & Clarity session with our CPA leadership.</div>
      </div>
      <a href="#consult" onclick="closeModal(); document.getElementById('contact-service').value = '${service.title}';" class="cta-base cta-primary cta-sm">Inquire About This Service ↗</a>
    </div>
  `;
  openModal(html);
}

/* ==========================================================================
   5. INSIGHTS & ARTICLES READER
   ========================================================================== */

const ARTICLES_DATA = [
  {
    id: 'first-tax-filing',
    category: 'Newcomers & Community',
    date: 'January 20, 2026',
    readTime: '4 min read',
    title: 'Why Your First Tax Filing in Canada Matters More Than You Think',
    excerpt: 'Your first tax year in Canada is not just another filing. It sets the foundation for CRA records, benefit credits, and compliance for many years ahead.',
    fullContent: `
      <p>Your first tax year in Canada is not just another annual filing. It sets the foundational precedent for many years ahead with the Canada Revenue Agency (CRA).</p>
      <p>At Synergy CPA, we regularly see newcomers and new business owners face complications down the road—not because they did anything intentionally wrong, but because they didn't fully understand how the Canadian tax system works in their inaugural year.</p>
      
      <h4 style="margin: 20px 0 10px; color: var(--ink-950);">Common Challenges We Observe:</h4>
      <ul>
        <li><strong>Confusion around tax residency status:</strong> Deemed resident vs non-resident rules dramatically alter reporting requirements.</li>
        <li><strong>Worldwide income reporting:</strong> Uncertainty about foreign property reporting (Form T1135) and offshore income declaration.</li>
        <li><strong>Missing or incomplete documentation:</strong> Overlooking settlement funds, entry dates, or overseas tax credits.</li>
        <li><strong>Benefit calculation distortions:</strong> Misunderstanding how Canada Child Benefit (CCB) and GST/HST credits are calculated based on prior world income.</li>
      </ul>

      <h4 style="margin: 20px 0 10px; color: var(--ink-950);">Long-Term Impact of Early Errors:</h4>
      <p>Mistakes made in your first year can trigger CRA reviews, retroactive benefit clawbacks, and penalty assessments. Getting your initial structure right is about calm precision, not rushing to submit.</p>
      
      <p><strong>Our approach is simple:</strong> Clarity before compliance. Our <em>Coffee & Clarity</em> conversations help newcomers review their position calmly before filing deadlines arrive.</p>
    `
  },
  {
    id: 'preparing-early',
    category: 'Tax Planning',
    date: 'January 20, 2026',
    readTime: '3 min read',
    title: 'Preparing Early for Tax Season: Why Documents Matter',
    excerpt: 'Tax issues rarely arise because the rules are unclear. They arise because documents arrive late, scattered, or assumed not important.',
    fullContent: `
      <p>One of the biggest reasons tax season becomes stressful is missing or incomplete documents. In our experience, tax problems rarely stem from obscure rules—they arise because information arrives late, is scattered, or is assumed to be "not important."</p>
      <p>January and February represent the ideal window to gather and organize records gradually without pressure.</p>

      <h4 style="margin: 20px 0 10px; color: var(--ink-950);">Essential Checklist to Organize:</h4>
      <ul>
        <li><strong>Income Slips:</strong> T4 (employment), T4A (pension/other), T5 (investment interest/dividends), T3 (trust income), and self-employment records.</li>
        <li><strong>Expense & Deduction Proofs:</strong> RRSP contributions, medical receipts, tuition (T2202), and childcare records.</li>
        <li><strong>Corporate & Business Records:</strong> Clean general ledgers, bank & credit card year-end statements, and GST/HST reconciliation reports.</li>
        <li><strong>Prior-Year Notices of Assessment:</strong> Tracking unused tuition credits, loss carryforwards, and RRSP contribution limits.</li>
      </ul>

      <p>You don’t need to have every calculation completed in January. You just need to identify what will be required so questions can be resolved before deadlines.</p>
    `
  },
  {
    id: 'plan-early-file-calmly',
    category: 'Coffee & Clarity Series',
    date: 'January 20, 2026',
    readTime: '3 min read',
    title: 'Plan Early, File Calmly: January is Planning Season',
    excerpt: 'January often creates artificial pressure around tax filing. But in reality, January is not filing season — it is planning season.',
    fullContent: `
      <p>January often creates unnecessary panic around tax deadlines. In reality, January is not filing season—it is planning season.</p>
      <p>We’ve observed that the best tax outcomes don't occur when rushing in late April. They come from early preparation and structured review months prior.</p>

      <h4 style="margin: 20px 0 10px; color: var(--ink-950);">The Advantages of Early Planning:</h4>
      <ul>
        <li>Review prior-year revenue and expense trends before closing entries are locked.</li>
        <li>Optimize the salary vs. dividend distribution split for corporate owner-managers.</li>
        <li>Ensure maximum utilization of the Small Business Deduction (SBD) and lifetime capital gains exemptions.</li>
        <li>Eliminate the stress of last-minute CRA electronic filing bottlenecks.</li>
      </ul>

      <p>Most tax stress doesn't come from complexity—it comes from waiting too long. Plan early, file calmly.</p>
    `
  }
];

function initInsights() {
  // Articles are pre-rendered statically in index.html for instant display
}

function openArticleModal(article) {
  const html = `
    <span class="eyebrow eyebrow-dot modal-eyebrow">${article.category}</span>
    <h2 class="modal-title">${article.title}</h2>
    <div style="font-size: 0.8125rem; color: var(--ink-400); margin-bottom: 24px; font-family: var(--font-mono);">Published by Synergy CPA · ${article.date}</div>
    <div class="modal-body-content">
      ${article.fullContent}
    </div>
    <div class="modal-cta-box">
      <div>
        <div style="font-size: 0.9375rem; font-weight: 700; color: var(--ink-950);">Have questions regarding your tax posture?</div>
        <div style="font-size: 0.8125rem; color: var(--ink-500);">Join a Coffee & Clarity dialogue with our CPA team.</div>
      </div>
      <a href="#consult" onclick="closeModal();" class="cta-base cta-primary cta-sm">Connect With Our CPAs ↗</a>
    </div>
  `;
  openModal(html);
}

/* ==========================================================================
   6. FORMS HANDLING & VALIDATION
   ========================================================================== */

function initForms() {
  // Main Contact Form
  const contactForm = document.getElementById('main-contact-form');
  const contactFeedback = document.getElementById('contact-form-feedback');

  if (contactForm && contactFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `Sending...`;
      submitBtn.disabled = true;

      setTimeout(() => {
        contactFeedback.classList.add('success');
        contactFeedback.innerHTML = `
          <strong>Thank you! Your message has been received.</strong><br/>
          A partner from Synergy CPA will review your details and reach out within one business day.
        `;
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        setTimeout(() => {
          contactFeedback.classList.remove('success');
        }, 8000);
      }, 900);
    });
  }

  // Coffee & Clarity Quick Form
  const coffeeForm = document.getElementById('coffee-booking-form');
  const coffeeFeedback = document.getElementById('coffee-form-feedback');

  if (coffeeForm && coffeeFeedback) {
    coffeeForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = coffeeForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `Reserving...`;
      submitBtn.disabled = true;

      setTimeout(() => {
        coffeeFeedback.classList.add('success');
        coffeeFeedback.innerHTML = `
          <strong>Session Requested!</strong> We will email you with convenient times for our Coffee & Clarity conversation.
        `;
        coffeeForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        setTimeout(() => {
          coffeeFeedback.classList.remove('success');
        }, 8000);
      }, 800);
    });
  }
}

/* ==========================================================================
   7. TESTIMONIALS & TRUST CAROUSEL
   ========================================================================== */

function initTestimonials() {
  // Auto subtle glow on testimonial hover
  const testCards = document.querySelectorAll('.testimonial-card');
  testCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'var(--brand-300)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = 'var(--line)';
    });
  });
}
