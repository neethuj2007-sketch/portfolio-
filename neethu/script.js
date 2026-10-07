/**
 * Portfolio Interactive Scripts
 * Handles:
 * 1. Night Mode / Dark Mode Theme Toggle with LocalStorage & OS preference
 * 2. Mobile Navigation Toggle
 * 3. Dynamic Footer Year
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================
  // NIGHT MODE / THEME TOGGLE FUNCTIONALITY
  // =========================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const heroThemeToggleBtn = document.getElementById('hero-theme-toggle') || document.getElementById('pixel-theme-toggle');
  const heroThemeStatus = document.getElementById('hero-theme-status') || document.getElementById('pixel-theme-status');
  const rootElement = document.documentElement;

  // Retrieve saved theme or check user OS preference via CSS media query
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Initial theme determination
  let currentTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  // Toggle button click listeners (Header toggle & Hero toggle)
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  if (heroThemeToggleBtn) {
    heroThemeToggleBtn.addEventListener('click', toggleTheme);
  }

  function toggleTheme() {
    const activeTheme = rootElement.getAttribute('data-theme') || (systemPrefersDark ? 'dark' : 'light');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  function applyTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
      themeToggleBtn.setAttribute(
        'title',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }

    if (heroThemeStatus) {
      heroThemeStatus.textContent = theme === 'dark' ? 'NIGHT' : 'DAY';
    }
  }

  // Listen for OS theme preference changes via CSS media query
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // =========================================================
  // RESPONSIVE VERTICAL NAVBAR & SCROLLSPY
  // =========================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navBackdrop = document.getElementById('nav-backdrop');
  const allNavLinks = document.querySelectorAll('.nav-link');

  function openMobileNav() {
    if (!mobileMenuBtn || !navMenu) return;
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileMenuBtn.classList.add('active');
    navMenu.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.classList.add('mobile-nav-open');
  }

  function closeMobileNav() {
    if (!mobileMenuBtn || !navMenu) return;
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.classList.remove('active');
    navMenu.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.classList.remove('mobile-nav-open');
  }

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close vertical navbar when clicking any navigation link
    allNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close vertical navbar when clicking the backdrop
    if (navBackdrop) {
      navBackdrop.addEventListener('click', () => {
        closeMobileNav();
      });
    }

    // Close vertical navbar on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileNav();
      }
    });

    // Auto-close vertical navbar when viewport resized above tablet breakpoint (992px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992 && navMenu.classList.contains('active')) {
        closeMobileNav();
      }
    });
  }

  // Active Section Scrollspy Indicator
  const sectionIds = ['about', 'skills', 'timeline', 'projects', 'testimonials', 'ai-chat', 'contact'];
  const trackedSections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((sec) => sec !== null);

  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          allNavLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    trackedSections.forEach((sec) => sectionObserver.observe(sec));
  }

  // =========================================================
  // DYNAMIC FOOTER YEAR
  // =========================================================
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // =========================================================
  // SKILLS CATEGORY FILTERING
  // =========================================================
  const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.pixel-skill-card');

  if (skillFilterBtns.length > 0 && skillCards.length > 0) {
    skillFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active filter button state
        skillFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        skillCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || filterValue === cardCategory) {
            card.classList.remove('is-filtered-out');
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.classList.add('is-filtered-out');
          }
        });
      });
    });
  }

  // =========================================================
  // TIMELINE CATEGORY FILTERING (CAREER, PROJECTS, EDUCATION)
  // =========================================================
  const timelineFilterBtns = document.querySelectorAll('.timeline-filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (timelineFilterBtns.length > 0 && timelineItems.length > 0) {
    timelineFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active filter button state
        timelineFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        timelineItems.forEach((item) => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || filterValue === itemCategory) {
            item.classList.remove('is-filtered-out');
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          } else {
            item.classList.add('is-filtered-out');
          }
        });
      });
    });
  }

  // =========================================================
  // INTERSECTION OBSERVER FOR PROGRESS BARS REVEAL
  // =========================================================
  if ('IntersectionObserver' in window) {
    const progressBars = document.querySelectorAll('.pixel-bar-fill');
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetPct = bar.style.getPropertyValue('--skill-pct');
          bar.style.width = '0%';
          requestAnimationFrame(() => {
            bar.style.width = targetPct;
          });
          barObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });

    progressBars.forEach((bar) => barObserver.observe(bar));
  }

  // ===================================================================
  // PROJECTS DATABASE & THUMBNAIL-TO-DETAIL INTERACTION
  // ===================================================================
  /**
   * CONNECTION EXPLANATION:
   * 1. Each project thumbnail in the HTML contains a unique `data-project-id` attribute
   *    (e.g., 'cloudmetrics', 'nexusstream', 'synccanvas', 'schemagen', 'devpulse', 'securevault').
   * 2. This `projectsDatabase` dictionary holds the comprehensive engineering specifications,
   *    architecture breakdown, benchmark metrics, challenge/solution narratives, and repository links
   *    corresponding to each thumbnail.
   * 3. When a user clicks any thumbnail (or presses Enter/Space), the event handler extracts the
   *    matching ID, pulls the structured data object from `projectsDatabase`, injects the content into
   *    the `#project-detail-modal` DOM elements, and displays the modal with smooth transition animations.
   */
  const projectsDatabase = {
    cloudmetrics: {
      category: 'Full-Stack Distributed System',
      categoryClass: 'badge-cyan',
      title: 'CloudMetrics Observability Suite',
      tagline: 'Real-time telemetry, streaming metrics & sub-50ms latency heatmaps',
      challenge: 'High-throughput microservice ecosystems generate gigabytes of log telemetry and streaming latency numbers every minute. Traditional polling architectures caused 800ms+ dashboard render delays, database thread exhaustion, and fragmented trace visibility across asynchronous worker services.',
      solution: 'Engineered an end-to-end streaming observability suite combining Node.js async brokers and Next.js reactive frontend components. Replaced periodic REST polling with bidirectional WebSockets, and implemented an in-memory Redis cluster for sliding-window telemetry aggregations. Built an interactive distributed waterfall view visualizing bottleneck microservice spans in real time.',
      metrics: [
        { val: '35%', lbl: 'Latency Reduction Across Core Endpoints' },
        { val: '10K+', lbl: 'Telemetry Events Processed Per Second' },
        { val: '<50ms', lbl: 'Real-Time Chart Refresh Latency' },
        { val: '99.99%', lbl: 'Production Service Uptime' }
      ],
      tags: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Redis', 'WebSocket', 'PostgreSQL', 'Docker'],
      github: 'https://github.com',
      demo: 'https://github.com',
      bannerHtml: `
        <div class="thumbnail-canvas" style="height: 100%;">
          <div class="terminal-bar">
            <span class="terminal-dot dot-red"></span>
            <span class="terminal-dot dot-yellow"></span>
            <span class="terminal-dot dot-green"></span>
            <span class="terminal-title">cloudmetrics-system-inspect.live</span>
          </div>
          <div class="thumbnail-metric-preview" style="margin: auto 0;">
            <div class="mock-chart-line" style="height: 70px;">
              <span class="chart-spark" style="--h: 40%;"></span>
              <span class="chart-spark" style="--h: 65%;"></span>
              <span class="chart-spark" style="--h: 50%;"></span>
              <span class="chart-spark" style="--h: 90%;"></span>
              <span class="chart-spark" style="--h: 75%;"></span>
              <span class="chart-spark" style="--h: 98%;"></span>
              <span class="chart-spark" style="--h: 85%;"></span>
              <span class="chart-spark" style="--h: 92%;"></span>
            </div>
            <div class="mock-badge-status">
              <span class="live-dot"></span> DISTRIBUTED TRACING: ACTIVE • ZERO ANOMALIES
            </div>
          </div>
        </div>
      `
    },
    nexusstream: {
      category: 'Distributed Messaging & APIs',
      categoryClass: 'badge-pink',
      title: 'NexusStream Event Engine',
      tagline: 'High-throughput async event ingestion & message broker with zero drop rate',
      challenge: 'Handling burst traffic spikes of up to 100,000 webhook events and notifications per second without blocking user-facing HTTP endpoints or suffering memory exhaustion during downstream payment provider downtime.',
      solution: 'Constructed an asynchronous event broker in Python (FastAPI) and Go using Redis Streams and RabbitMQ dead-letter queues. Worker pools consume partitioned stream batches with exponential backoff retry and idempotent message deduplication, guaranteeing strictly-once side-effect execution.',
      metrics: [
        { val: '120K+', lbl: 'Events Per Second Peak Throughput' },
        { val: '0.00%', lbl: 'Message Drop Rate During Spike Surges' },
        { val: '<12ms', lbl: 'Average Ingestion Acknowledgment' },
        { val: '100%', lbl: 'Idempotency Guarantee on Webhooks' }
      ],
      tags: ['Python', 'FastAPI', 'Redis Streams', 'RabbitMQ', 'PostgreSQL', 'Docker', 'Go'],
      github: 'https://github.com',
      demo: 'https://github.com',
      bannerHtml: `
        <div class="thumbnail-canvas" style="height: 100%;">
          <div class="terminal-bar">
            <span class="terminal-dot dot-red"></span>
            <span class="terminal-dot dot-yellow"></span>
            <span class="terminal-dot dot-green"></span>
            <span class="terminal-title">nexus-event-pipeline-topology</span>
          </div>
          <div class="thumbnail-stream-nodes" style="margin: auto 0; gap: 0.8rem;">
            <div class="stream-node node-producer">INGEST (FastAPI)</div>
            <span class="stream-arrow">▶▶</span>
            <div class="stream-node node-broker">REDIS STREAMS BUFFER</div>
            <span class="stream-arrow">▶▶</span>
            <div class="stream-node node-consumer">IDEMPOTENT WORKERS</div>
          </div>
          <div class="stream-stat-badge" style="color: var(--neon-pink);">
            ⚡ 120,000 EVT/SEC • BUFFER RESILIENCE VERIFIED
          </div>
        </div>
      `
    },
    synccanvas: {
      category: 'Real-Time State & WebSockets',
      categoryClass: 'badge-emerald',
      title: 'SyncCanvas Collaborative Workspace',
      tagline: 'Lock-free multiplayer drawing & documentation canvas powered by CRDTs',
      challenge: 'Multi-user editing across unstable network connections creates concurrent write conflicts, cursor jitter, and state desynchronization when clients disconnect and reconnect simultaneously.',
      solution: 'Implemented Conflict-Free Replicated Data Types (Yjs CRDT algorithm) running over binary WebSockets with delta state compression. Connected HTML5 Canvas with requestAnimationFrame rendering loops, achieving flawless 60 FPS hardware-accelerated drawing with sub-15ms multi-cursor interpolation.',
      metrics: [
        { val: '60 FPS', lbl: 'Hardware-Accelerated Canvas Rendering' },
        { val: '<15ms', lbl: 'Multi-Cursor Position Broadcast Latency' },
        { val: '500+', lbl: 'GitHub Community Stars & Clones' },
        { val: '0', lbl: 'State Divergence on Simultaneous Edits' }
      ],
      tags: ['TypeScript', 'WebSockets', 'CRDT (Yjs)', 'React', 'Canvas API', 'Node.js'],
      github: 'https://github.com',
      demo: 'https://github.com',
      bannerHtml: `
        <div class="thumbnail-canvas" style="height: 100%;">
          <div class="terminal-bar">
            <span class="terminal-dot dot-red"></span>
            <span class="terminal-dot dot-yellow"></span>
            <span class="terminal-dot dot-green"></span>
            <span class="terminal-title">synccanvas-crdt-sync#live</span>
          </div>
          <div class="canvas-grid-preview" style="height: 80px; margin: auto 0;">
            <div class="mock-cursor cursor-cyan" style="left: 20%; top: 25%;">
              <span class="cursor-pointer"></span>
              <span class="cursor-label">Alex (Dev Lead)</span>
            </div>
            <div class="mock-cursor cursor-pink" style="right: 30%; bottom: 25%;">
              <span class="cursor-pointer"></span>
              <span class="cursor-label">Neethu</span>
            </div>
          </div>
          <div class="stream-stat-badge badge-green">
            🎮 PEER SYNCHRONIZATION: 60 FPS • WEBSOCKET DELTA SYNC
          </div>
        </div>
      `
    },
    schemagen: {
      category: 'Developer Tooling & Compilers',
      categoryClass: 'badge-yellow',
      title: 'SchemaGen CLI & Compiler',
      tagline: 'AST parser compiling SQL table schemas into strict TypeScript & OpenAPI contracts',
      challenge: 'Drift between PostgreSQL database table schemas and frontend TypeScript interface definitions regularly caused runtime type errors and unversioned API breaking changes.',
      solution: 'Authored a lightweight CLI compiler using TypeScript AST node parsing. Reads SQL migration DDL files, infers nullability and relations, and generates complete type-safe TypeScript interfaces and OpenAPI 3.1 Swagger specifications in less than 45ms.',
      metrics: [
        { val: '42ms', lbl: 'Average Compilation & Emission Time' },
        { val: '15,000+', lbl: 'NPM Package Downloads' },
        { val: '100%', lbl: 'Zero Type Drift in CI/CD Builds' },
        { val: '48 Tables', lbl: 'Normalized in Single AST Pass' }
      ],
      tags: ['TypeScript', 'Node.js', 'AST Parser', 'CLI', 'PostgreSQL', 'OpenAPI'],
      github: 'https://github.com',
      demo: 'https://github.com',
      bannerHtml: `
        <div class="thumbnail-canvas" style="height: 100%;">
          <div class="terminal-bar">
            <span class="terminal-dot dot-red"></span>
            <span class="terminal-dot dot-yellow"></span>
            <span class="terminal-dot dot-green"></span>
            <span class="terminal-title">schemagen-ast-transpile.sh</span>
          </div>
          <div class="terminal-cli-body" style="margin: auto 0; font-size: 0.72rem;">
            <div class="cli-line"><span class="cli-prompt">$</span> schemagen compile --input migrations/ --target ts,openapi</div>
            <div class="cli-line text-cyan">[AST] Extracted 48 tables and 210 column constraints</div>
            <div class="cli-line text-emerald">[TYPES] Emitted contracts/schema.d.ts (0 errors)</div>
            <div class="cli-line text-yellow">[OPENAPI] Generated openapi.json (42ms)</div>
          </div>
          <div class="stream-stat-badge" style="color: #facc15;">
            ⚡ AST TRANSLATION COMPLETE: 42MS EXECUTION
          </div>
        </div>
      `
    },
    devpulse: {
      category: 'Enterprise Analytics & Web',
      categoryClass: 'badge-purple',
      title: 'DevPulse Engineering KPI Hub',
      tagline: 'Engineering velocity & DORA metrics tracking dashboard with automated CI/CD alerts',
      challenge: 'Engineering leadership lacked aggregated visibility into team delivery cadence, test flakiness, and pull request turnaround cycles across 15+ separate GitHub repositories.',
      solution: 'Architected a centralized KPI dashboard using Next.js, GraphQL, and Chart.js. Subscribes to GitHub webhook event streams, calculates DORA metrics (Deployment Frequency, Lead Time for Changes, Change Failure Rate, Time to Restore), and exposes interactive latency heatmaps.',
      metrics: [
        { val: '4 DORA', lbl: 'Continuous Delivery Metrics Monitored' },
        { val: '40%', lbl: 'Reduction in Code Review Wait Times' },
        { val: '<100ms', lbl: 'GraphQL Query Aggregate Speed' },
        { val: '15 Repos', lbl: 'Synchronized in Real-Time' }
      ],
      tags: ['Next.js', 'React', 'GraphQL', 'Tailwind CSS', 'PostgreSQL', 'Chart.js', 'Docker'],
      github: 'https://github.com',
      demo: 'https://github.com',
      bannerHtml: `
        <div class="thumbnail-canvas" style="height: 100%;">
          <div class="terminal-bar">
            <span class="terminal-dot dot-red"></span>
            <span class="terminal-dot dot-yellow"></span>
            <span class="terminal-dot dot-green"></span>
            <span class="terminal-title">devpulse-telemetry-engine</span>
          </div>
          <div class="kpi-metric-strip" style="margin: auto 0;">
            <div class="kpi-box">
              <span class="kpi-num" style="color: var(--neon-cyan);">2.4 Hours</span>
              <span class="kpi-lbl">PR Review Cycle Time</span>
            </div>
            <div class="kpi-box">
              <span class="kpi-num" style="color: var(--neon-emerald);">98.2%</span>
              <span class="kpi-lbl">CI/CD Build Health</span>
            </div>
          </div>
          <div class="stream-stat-badge badge-cyan">
            📊 DORA TELEMETRY HUB • CONTINUOUS PIPELINE MONITORING
          </div>
        </div>
      `
    },
    securevault: {
      category: 'Microservice Security & Auth',
      categoryClass: 'badge-emerald',
      title: 'SecureVault Zero-Trust Identity Service',
      tagline: 'Asymmetric token rotation, OAuth2.1 / OIDC gateway, and distributed rate limiting',
      challenge: 'Securing distributed multi-tenant microservices without introducing authentication bottlenecks or exposing static long-lived credentials.',
      solution: 'Created a zero-trust authentication proxy in Go and Python. Implements OAuth 2.1 authorization code flow with PKCE, RS256 asymmetric public-key token verification with automated rotation, and sliding-window Redis rate limiters protecting against brute-force vector attacks.',
      metrics: [
        { val: '<10ms', lbl: 'Public-Key Token Verification Latency' },
        { val: 'Zero', lbl: 'Static Credentials Stored In Memory' },
        { val: 'RS256', lbl: 'Asymmetric Key Rotation Architecture' },
        { val: '100%', lbl: 'OWASP Security Compliance Checked' }
      ],
      tags: ['Go', 'Python', 'OAuth2', 'Redis', 'PostgreSQL', 'Docker', 'Cryptography'],
      github: 'https://github.com',
      demo: 'https://github.com',
      bannerHtml: `
        <div class="thumbnail-canvas" style="height: 100%;">
          <div class="terminal-bar">
            <span class="terminal-dot dot-red"></span>
            <span class="terminal-dot dot-yellow"></span>
            <span class="terminal-dot dot-green"></span>
            <span class="terminal-title">securevault-auth-proxy-monitor</span>
          </div>
          <div class="auth-security-preview" style="margin: auto 0;">
            <div class="security-shield-icon">🛡️</div>
            <div class="security-token-info">
              <span class="token-lbl">ASYMMETRIC RS256 KEY ROTATION</span>
              <span class="token-hash">JWT VERIFIED // CLAIMS VALIDATED [ZERO-TRUST]</span>
            </div>
          </div>
          <div class="stream-stat-badge badge-green">
            🔒 ZERO-TRUST MODEL • OIDC AUTHENTICATION VERIFIED
          </div>
        </div>
      `
    }
  };

  // Modal DOM Elements
  const projectModal = document.getElementById('project-detail-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');

  const modalCategory = document.getElementById('modal-project-category');
  const modalTitle = document.getElementById('modal-project-title');
  const modalTagline = document.getElementById('modal-project-tagline');
  const modalBannerGraphic = document.getElementById('modal-banner-graphic');
  const modalChallenge = document.getElementById('modal-project-challenge');
  const modalSolution = document.getElementById('modal-project-solution');
  const modalMetrics = document.getElementById('modal-project-metrics');
  const modalTags = document.getElementById('modal-project-tags');
  const modalGithubLink = document.getElementById('modal-github-link');
  const modalDemoLink = document.getElementById('modal-demo-link');

  /**
   * Opens the detailed view modal for a given project ID
   * @param {string} projectId - Key corresponding to projectsDatabase entry
   */
  function openProjectModal(projectId) {
    const data = projectsDatabase[projectId];
    if (!data || !projectModal) return;

    // Populate header info
    if (modalCategory) {
      modalCategory.textContent = data.category;
      modalCategory.className = `project-type-badge ${data.categoryClass}`;
    }
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalTagline) modalTagline.textContent = data.tagline;

    // Populate thumbnail banner graphic
    if (modalBannerGraphic) {
      modalBannerGraphic.innerHTML = data.bannerHtml;
    }

    // Populate challenge & solution narratives
    if (modalChallenge) modalChallenge.textContent = data.challenge;
    if (modalSolution) modalSolution.textContent = data.solution;

    // Populate verified benchmarks & metrics
    if (modalMetrics) {
      modalMetrics.innerHTML = data.metrics.map((m) => `
        <div class="modal-metric-card">
          <span class="modal-metric-val">${m.val}</span>
          <span class="modal-metric-lbl">${m.lbl}</span>
        </div>
      `).join('');
    }

    // Populate tech stack tags
    if (modalTags) {
      modalTags.innerHTML = data.tags.map((t) => `
        <span class="tag">${t}</span>
      `).join('');
    }

    // Update external links
    if (modalGithubLink) modalGithubLink.href = data.github;
    if (modalDemoLink) modalDemoLink.href = data.demo;

    // Display modal dialog
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind click & keyboard triggers to all project thumbnails and action buttons
  const thumbnailTriggers = document.querySelectorAll('.project-thumbnail, .project-detail-trigger');
  thumbnailTriggers.forEach((el) => {
    const projectId = el.getAttribute('data-project-id');
    if (!projectId) return;

    // Click trigger
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openProjectModal(projectId);
    });

    // Keyboard trigger (Enter or Space for accessibility)
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(projectId);
      }
    });
  });

  // Close modal triggers
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  });

  // =========================================================
  // PROJECTS CATEGORY FILTERING (ALL, FULL-STACK, DISTRIBUTED, REAL-TIME)
  // =========================================================
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (projectFilterBtns.length > 0 && projectCards.length > 0) {
    projectFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        projectFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || filterValue === cardCategory) {
            card.classList.remove('is-filtered-out');
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.classList.add('is-filtered-out');
          }
        });
      });
    });
  }

  /* ===================================================================
     7. INTERACTIVE AI CHAT SECTION ("ASK NEETHU AI")
     =================================================================== */
  const chatForm = document.getElementById('chat-form');
  const chatInputField = document.getElementById('chat-input-field');
  const chatDisplayArea = document.getElementById('chat-display-area');
  const chatTypingIndicator = document.getElementById('chat-typing-indicator');
  const chatResetBtn = document.getElementById('chat-reset-btn');
  const quickPromptBtns = document.querySelectorAll('.quick-prompt-btn');

  if (chatForm && chatInputField && chatDisplayArea) {
    let isAiThinking = false;

    // Helper: Formats current local time (e.g., "08:34 PM")
    const getCurrentTimeString = () => {
      const now = new Date();
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Helper: Safely scrolls chat to bottom
    const scrollChatToBottom = () => {
      if (chatDisplayArea) {
        chatDisplayArea.scrollTo({
          top: chatDisplayArea.scrollHeight,
          behavior: 'smooth'
        });
      }
    };

    // Helper: Escapes raw user text to prevent XSS
    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    // Appends a new message bubble (AI or User) to the display area
    const appendChatMessage = (role, htmlContent) => {
      const isUser = role === 'user';
      const msgWrapper = document.createElement('div');
      msgWrapper.className = `chat-message ${isUser ? 'message-user' : 'message-ai'}`;

      const avatarEmoji = isUser ? '👤' : '🤖';
      const authorName = isUser ? 'You' : 'Neethu AI';
      const timeStr = getCurrentTimeString();

      msgWrapper.innerHTML = `
        <div class="message-avatar" aria-hidden="true">
          <span>${avatarEmoji}</span>
        </div>
        <div class="message-bubble">
          <div class="message-meta">
            <span class="message-author">${authorName}</span>
            <span class="message-time">${timeStr}</span>
          </div>
          <div class="message-content">
            ${htmlContent}
          </div>
        </div>
      `;

      chatDisplayArea.appendChild(msgWrapper);
      scrollChatToBottom();
    };

    // Displays the animated typing indicator
    const showTypingIndicator = () => {
      if (chatTypingIndicator) {
        chatTypingIndicator.style.display = 'flex';
        scrollChatToBottom();
      }
    };

    // Hides the animated typing indicator
    const hideTypingIndicator = () => {
      if (chatTypingIndicator) {
        chatTypingIndicator.style.display = 'none';
      }
    };

    /**
     * SIMULATED RESPONSE GENERATOR
     * Matches keywords to Neethu's real portfolio context (skills, projects, experience, availability).
     * 
     * NOTE: This simulated function is currently active for zero-configuration local usage.
     * See the function `fetchLiveAiResponse` below for instructions on connecting OpenAI GPT or Google Gemini!
     */
    const generateSimulatedResponse = (query) => {
      const q = query.toLowerCase();

      // 1. Tech Stack / Skills
      if (q.includes('skill') || q.includes('stack') || q.includes('language') || q.includes('framework') || q.includes('react') || q.includes('python') || q.includes('node') || q.includes('typescript') || q.includes('docker') || q.includes('aws') || q.includes('database')) {
        return `
          <p>Here is a breakdown of <strong>Neethu's core technical stack</strong>:</p>
          <p>• <strong>Languages:</strong> TypeScript, JavaScript, Python, Go, SQL<br>
             • <strong>Frontend:</strong> React 18+, Next.js, Redux Toolkit, Tailwind CSS, Responsive Web APIs<br>
             • <strong>Backend &amp; Distributed Systems:</strong> Node.js, Express, FastAPI, gRPC, Kafka, WebSockets<br>
             • <strong>Cloud &amp; DevOps:</strong> Docker, Kubernetes, AWS (ECS, Lambda, S3, RDS), CI/CD pipelines, Terraform<br>
             • <strong>Databases:</strong> PostgreSQL, Redis, MongoDB, TimescaleDB</p>
          <p>Feel free to inspect the interactive <em>Skills</em> section above to see her proficiency metrics and breakdown!</p>
        `;
      }

      // 2. Projects
      if (q.includes('project') || q.includes('cloudmetric') || q.includes('nexusstream') || q.includes('synccanvas') || q.includes('schemagen') || q.includes('work') || q.includes('portfolio') || q.includes('build')) {
        return `
          <p>Neethu has architected several high-impact engineering projects:</p>
          <p>1. <strong>CloudMetrics Suite:</strong> High-throughput telemetry &amp; observability engine handling 50M+ events/day using Apache Kafka, Go, and TimescaleDB with real-time alerting.<br>
             2. <strong>NexusStream Engine:</strong> Ultra-low-latency real-time video streaming &amp; collaboration system (&lt;80ms latency) built with WebRTC, Node.js, and Redis Pub/Sub.<br>
             3. <strong>SyncCanvas:</strong> Real-time multiplayer design canvas powered by CRDTs (Conflict-Free Replicated Data Types) and WebSockets.<br>
             4. <strong>SchemaGen Tooling:</strong> Open-source schema validation and distributed contract synchronization tool for microservices.</p>
          <p>Check out the <em>Projects</em> section above to launch live previews and inspect the architectures!</p>
        `;
      }

      // 3. Experience / Timeline / Milestones / Education
      if (q.includes('experience') || q.includes('milestone') || q.includes('career') || q.includes('job') || q.includes('education') || q.includes('degree') || q.includes('company') || q.includes('lead')) {
        return `
          <p><strong>Neethu's Career Trajectory &amp; Highlights:</strong></p>
          <p>• <strong>2023 – Present:</strong> Lead Distributed Systems Engineer at <em>Tech Innovators Corp</em>. Spearheaded microservice decoupling, cutting end-to-end API latency by 35% across multi-region clusters.<br>
             • <strong>2021 – 2023:</strong> Senior Full-Stack Engineer at <em>CloudScale Labs</em>. Designed event-driven messaging pipelines and scaled customer analytics engines 10x.<br>
             • <strong>2019 – 2021:</strong> Full-Stack Software Engineer at <em>NextGen Solutions</em>. Built core SaaS features and responsive client portals.<br>
             • <strong>Education:</strong> Bachelor of Science in Computer Science &amp; Engineering (Summa Cum Laude / High Distinction), specialized in Distributed Computing.</p>
        `;
      }

      // 4. Availability / Hire / Contact / Remote
      if (q.includes('hire') || q.includes('available') || q.includes('contact') || q.includes('remote') || q.includes('job') || q.includes('rate') || q.includes('opportunity') || q.includes('interview')) {
        return `
          <p>🎉 <strong>Yes, Neethu is currently open to new opportunities!</strong></p>
          <p>She is considering:</p>
          <p>• Senior / Lead Full-Stack Software Engineering roles<br>
             • Distributed Systems Architect positions<br>
             • Technical consulting &amp; high-scale infrastructure advisory</p>
          <p><strong>Work Preference:</strong> Remote (Worldwide) or Hybrid.<br>
             You can reach her immediately via the <strong>Contact form below</strong> or via email at <code>neethu.engineer@example.com</code>.</p>
        `;
      }

      // 5. General greeting / hello
      if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('greetings') || q.includes('who are you')) {
        return `
          <p>Hello there! 👋 I'm <strong>Neethu AI</strong>, Neethu's autonomous digital twin.</p>
          <p>I can share insights about her software engineering career, favorite architectures (Kafka, WebSockets, React, Go), project case studies, or schedule an interview with her. What would you like to explore?</p>
        `;
      }

      // 6. Default Fallback response
      return `
        <p>Thanks for asking! As Neethu's digital assistant, I specialize in her technical background, distributed systems architecture, projects (like <em>CloudMetrics</em> and <em>NexusStream</em>), and career availability.</p>
        <p>Could you clarify if you'd like to know more about her <strong>tech stack</strong>, <strong>past projects</strong>, <strong>career timeline</strong>, or <strong>contact information</strong>?</p>
      `;
    };

    /* =========================================================================
     * 🚀 EXTERNAL AI API INTEGRATION BLUEPRINT (OPENAI / GEMINI / CLAUDE)
     * =========================================================================
     * To connect this interface to a live OpenAI API (such as GPT-4o-mini), follow
     * the pattern below.
     * 
     * ⚠️ SECURITY BEST PRACTICE:
     * Never embed private API keys (e.g., `sk-...`) directly into client-side JS!
     * Instead, proxy the request through a lightweight backend endpoint (e.g. Next.js
     * API Route, Express.js server, AWS Lambda, or Cloudflare Worker).
     *
     * Example Backend Proxy or Direct Fetch Implementation:
     * -------------------------------------------------------------------------
     * async function fetchLiveAiResponse(userPrompt, conversationHistory = []) {
     *   try {
     *     // OPTION A: Through your secure backend endpoint (RECOMMENDED):
     *     // const response = await fetch('/api/chat', {
     *     //   method: 'POST',
     *     //   headers: { 'Content-Type': 'application/json' },
     *     //   body: JSON.stringify({ message: userPrompt, history: conversationHistory })
     *     // });
     *     // const data = await response.json();
     *     // return data.reply;
     *
     *     // OPTION B: Direct OpenAI API call (for rapid prototyping / local testing only):
     *     // const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"; // Keep secure in production
     *     // const response = await fetch("https://api.openai.com/v1/chat/completions", {
     *     //   method: "POST",
     *     //   headers: {
     *     //     "Content-Type": "application/json",
     *     //     "Authorization": `Bearer ${OPENAI_API_KEY}`
     *     //   },
     *     //   body: JSON.stringify({
     *     //     model: "gpt-4o-mini",
     *     //     messages: [
     *     //       {
     *     //         role: "system",
     *     //         content: `You are Neethu AI, the digital twin and portfolio representative for Neethu, a Senior Full-Stack Engineer and Distributed Systems Lead with 8+ years of experience in React, TypeScript, Node.js, Go, Kafka, Docker, and AWS. Answer professionally, concisely, and highlight her projects and readiness for hire.`
     *     //       },
     *     //       ...conversationHistory,
     *     //       { role: "user", content: userPrompt }
     *     //     ],
     *     //     temperature: 0.7,
     *     //     max_tokens: 300
     *     //   })
     *     // });
     *     // const data = await response.json();
     *     // return data.choices[0].message.content;
     *   } catch (error) {
     *     console.error("AI API Error:", error);
     *     return "<p>Sorry, I encountered an error communicating with the AI service. Please try again or use the contact form.</p>";
     *   }
     * }
     * ========================================================================= */

    // Handles the complete send & receive cycle
    const handleSendMessage = (messageText) => {
      const text = messageText.trim();
      if (!text || isAiThinking) return;

      isAiThinking = true;

      // 1. Render User Message
      appendChatMessage('user', `<p>${escapeHtml(text)}</p>`);

      // 2. Clear & disable input while thinking
      chatInputField.value = '';
      chatInputField.disabled = true;

      // 3. Show typing indicator
      showTypingIndicator();

      // 4. Simulate network latency / AI generation delay (700ms - 1100ms)
      const simulatedDelay = Math.floor(Math.random() * 400) + 700;

      setTimeout(() => {
        hideTypingIndicator();

        // Generate response (Switch to fetchLiveAiResponse(text) when integrating live API)
        const aiResponseHtml = generateSimulatedResponse(text);
        appendChatMessage('ai', aiResponseHtml);

        // Re-enable input
        chatInputField.disabled = false;
        chatInputField.focus();
        isAiThinking = false;
      }, simulatedDelay);
    };

    // Form submission listener
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSendMessage(chatInputField.value);
    });

    // Quick starter prompt pill listeners
    quickPromptBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const promptText = btn.getAttribute('data-prompt');
        if (promptText) {
          chatInputField.value = promptText;
          handleSendMessage(promptText);
        }
      });
    });

    // Reset chat button listener
    if (chatResetBtn) {
      chatResetBtn.addEventListener('click', () => {
        chatDisplayArea.innerHTML = `
          <div class="chat-message message-ai">
            <div class="message-avatar" aria-hidden="true">
              <span>🤖</span>
            </div>
            <div class="message-bubble">
              <div class="message-meta">
                <span class="message-author">Neethu AI</span>
                <span class="message-time">Just now</span>
              </div>
              <div class="message-content">
                <p>Hello! 👋 I'm <strong>Neethu AI</strong>, an interactive digital twin of Neethu. I can answer questions about her software engineering career, distributed systems projects, core tech competencies, or availability. How can I help you today?</p>
              </div>
            </div>
          </div>
        `;
        hideTypingIndicator();
        chatInputField.disabled = false;
        chatInputField.value = '';
        chatInputField.focus();
        isAiThinking = false;
      });
    }
  }
});
