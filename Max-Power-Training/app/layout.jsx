function AppShell({ children, isLoggedIn, user, navigateTo, onLogout, currentPage,
                    activeLang, langs, switchLang, dir, schema }) {
  const t = {
    header   : "fixed inset-x-0 top-0 z-50 transition-all duration-300",
    headSolid: "bg-sidebar-bg border-b border-sidebar-border",
    headClear: "bg-gradient-to-b from-black/60 to-transparent border-b border-transparent",
    bar      : "mx-auto flex h-16 md:h-20 max-w-[1200px] items-center justify-between gap-6 px-5 md:px-8",
    brand    : "flex items-center gap-3 font-heading text-xl md:text-2xl uppercase leading-none tracking-wide text-sidebar-text-active focus-visible:outline-primary",
    brandHi  : "text-primary",
    navWrap  : "hidden md:flex items-center gap-8 lg:gap-10",
    link     : "relative py-2 text-sm font-bold uppercase tracking-[0.14em] text-sidebar-text-active transition-colors hover:text-primary",
    linkOn   : "text-primary",
    underline: "absolute inset-x-0 -bottom-0.5 h-[3px] bg-primary",
    cta      : "inline-flex min-h-11 items-center gap-2 rounded-xs bg-primary px-5 py-2.5 text-sm font-extrabold uppercase tracking-wider text-primary-text shadow-[4px_4px_0_0_var(--primary-hover)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--primary-hover)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_var(--primary-hover)]",
    ctaBig   : "inline-flex min-h-14 w-full items-center justify-between gap-3 rounded-xs bg-primary px-6 py-4 font-heading text-2xl uppercase tracking-wide text-primary-text shadow-[6px_6px_0_0_var(--primary-hover)] transition hover:bg-primary-hover",
    burger   : "md:hidden inline-flex h-11 w-11 items-center justify-center rounded-xs border-2 border-primary text-primary transition hover:bg-primary hover:text-primary-text",
    lang     : "text-xs font-bold uppercase tracking-widest text-sidebar-text transition hover:text-primary",
    langOn   : "text-xs font-bold uppercase tracking-widest text-primary",
    progress : "absolute bottom-0 start-0 h-[3px] bg-primary transition-[width] duration-100",
    overlay  : "fixed inset-0 z-40 flex flex-col overflow-y-auto bg-sidebar-bg px-6 pb-8 pt-24",
    bigLink  : "group flex min-h-12 items-baseline gap-4 border-b border-sidebar-border py-3 text-start font-heading text-6xl uppercase leading-none tracking-tight text-sidebar-text-active transition-colors hover:text-primary",
    bigLinkOn: "text-primary",
    idx      : "font-sans text-xs font-bold tracking-widest text-primary",
    wa       : "fixed bottom-5 end-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-text shadow-[4px_4px_0_0_var(--sidebar-bg)] transition hover:scale-105 hover:bg-primary-hover focus-visible:outline-primary",
    waPing   : "absolute inset-0 -z-10 animate-ping rounded-full bg-primary opacity-40",
    footer   : "relative bg-sidebar-bg text-sidebar-text",
    slashOuter: "overflow-hidden bg-background py-8 md:py-12",
    slash    : "-ms-[5%] w-[110%] -rotate-2 overflow-hidden bg-primary py-3 md:py-4 shadow-[0_8px_0_0_var(--sidebar-bg)]",
    slashTxt : "flex w-max items-center whitespace-nowrap font-heading text-2xl md:text-4xl uppercase tracking-wide text-primary-text",
    fWrap    : "mx-auto max-w-[1200px] px-5 md:px-8",
    fGrid    : "grid gap-12 py-14 md:grid-cols-12 md:py-20",
    fHead    : "font-heading text-5xl md:text-7xl uppercase leading-[1] tracking-tight text-sidebar-text-active",
    eyebrow  : "text-xs font-bold uppercase tracking-[0.25em] text-primary",
    fLink    : "min-h-8 text-start text-base font-semibold uppercase tracking-wider text-sidebar-text transition hover:text-primary",
    fBottom  : "flex flex-col gap-3 border-t border-sidebar-border py-6 text-sm md:flex-row md:items-center md:justify-between"
  };

  const WHATSAPP_NUMBER = "";
  const pages = (schema && schema.pages) || [];
  const homePage = pages.find(p => p.home);
  const homeName = homePage ? homePage.name : "Home";
  const isHome = currentPage === homeName;
  const title = (schema && schema.title) || "";
  const words = title.split(" ");
  const lastWord = words.length > 1 ? words[words.length - 1] : "";
  const firstWords = words.length > 1 ? words.slice(0, -1).join(" ") : title;

  const sections = [
    { id: "about", label: "About" },
    { id: "programs", label: "Programs" },
    { id: "results", label: "Results" },
    { id: "faq", label: "FAQ" }
  ];
  const extraPages = navigation(pages, activeLang).filter(i => !i.home && (!i.auth || isLoggedIn));
  const langList = (langs || []).map(l => typeof l === "string" ? l : (l && l.code));

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");

  const findEl = id => document.getElementById(id) || document.querySelector('[data-section="' + id + '"]');

  useEffect(() => {
    const onScroll = () => {
      const y = window.pageYOffset;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (y / max) * 100) : 0);
      let cur = "";
      ["about", "programs", "results", "faq", "signup"].forEach(id => {
        const el = findEl(id);
        if (el && el.getBoundingClientRect().top <= 140) cur = id;
      });
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [currentPage]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = e => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => { setOpen(false); }, [currentPage]);

  const go = id => {
    const doScroll = () => {
      const el = findEl(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 72, behavior: "smooth" });
    };
    setOpen(false);
    if (!isHome) {
      navigateTo(homeName);
      setTimeout(doScroll, 450);
    } else {
      setTimeout(doScroll, 80);
    }
  };

  const goHome = () => {
    setOpen(false);
    if (isHome) window.scrollTo({ top: 0, behavior: "smooth" });
    else navigateTo(homeName);
  };

  const solid = scrolled || !isHome || open;
  const marquee = ["Strength", "Fat loss", "Mobility", "Discipline"];
  const strip = Array.from({ length: 8 }).flatMap((_, r) =>
    marquee.map((w, i) => ({ k: r + "-" + i, w }))
  );

  const Brand = (
    <button type="button" onClick={goHome} className={t.brand} aria-label={title}>
      {schema && schema.icon ? <img src={schema.icon} alt={title} className="h-8 w-auto" /> : null}
      <span>
        {firstWords}
        {lastWord ? <span className={t.brandHi}>{" " + lastWord}</span> : null}
      </span>
    </button>
  );

  const LangSwitch = langList.length > 1 ? (
    <div className="flex items-center gap-3">
      {langList.map(code => (
        <button key={code} type="button" onClick={() => switchLang(code)}
          className={code === activeLang ? t.langOn : t.lang}>{code}</button>
      ))}
    </div>
  ) : null;

  const waText = "Hi Max, I'd like to book a free session";
  const waIcon = <MessageCircle size={26} />;
  const waButton = WHATSAPP_NUMBER
    ? <a href={"https://wa.me/" + WHATSAPP_NUMBER.replace(/\D/g, "") + "?text=" + encodeURIComponent(waText)}
         target="_blank" rel="noopener noreferrer" className={t.wa} aria-label="WhatsApp">
        <span className={t.waPing} />{waIcon}
      </a>
    : <button type="button" onClick={() => go("signup")} className={t.wa} aria-label="WhatsApp">
        <span className={t.waPing} />{waIcon}
      </button>;

  const footerLinks = sections.map(s => ({ key: s.id, label: s.label, onClick: () => go(s.id) }))
    .concat(extraPages.map(i => ({ key: i.name, label: i.label, onClick: () => navigateTo(i.name) })));

  return (
    <div dir={dir} className="min-h-screen bg-background text-text">
      <header className={t.header + " " + (solid ? t.headSolid : t.headClear)}>
        <div className={t.bar}>
          {Brand}

          <nav className={t.navWrap} aria-label="Main">
            {sections.map(s => (
              <button key={s.id} type="button" onClick={() => go(s.id)}
                className={t.link + (active === s.id && isHome ? " " + t.linkOn : "")}>
                {s.label}
                {active === s.id && isHome
                  ? <motion.span layoutId="nav-underline" className={t.underline} />
                  : null}
              </button>
            ))}
            {extraPages.map(i => (
              <button key={i.name} type="button" onClick={() => navigateTo(i.name)}
                className={t.link + (currentPage === i.name ? " " + t.linkOn : "")}>
                {i.label}
                {currentPage === i.name ? <motion.span layoutId="nav-underline" className={t.underline} /> : null}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">{LangSwitch}</div>
            <button type="button" onClick={() => go("signup")} className={t.cta + " hidden sm:inline-flex"}>
              Free Session <ArrowRight size={16} className={dir === "rtl" ? "rotate-180" : ""} />
            </button>
            <button type="button" className={t.burger} onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {solid && !open ? <div className={t.progress} style={{ width: progress + "%" }} /> : null}
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div key="overlay" className={t.overlay} role="dialog" aria-modal="true"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}>
            <nav className="flex flex-1 flex-col" aria-label="Mobile">
              {sections.map((s, i) => (
                <motion.button key={s.id} type="button" onClick={() => go(s.id)}
                  className={t.bigLink + (active === s.id && isHome ? " " + t.bigLinkOn : "")}
                  initial={{ opacity: 0, x: dir === "rtl" ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + i * 0.07, duration: 0.35 }}>
                  <span className={t.idx}>{"0" + (i + 1)}</span>
                  {s.label}
                </motion.button>
              ))}
              {extraPages.map((i, n) => (
                <motion.button key={i.name} type="button" onClick={() => { setOpen(false); navigateTo(i.name); }}
                  className={t.bigLink + (currentPage === i.name ? " " + t.bigLinkOn : "")}
                  initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + (sections.length + n) * 0.07 }}>
                  <span className={t.idx}>{"0" + (sections.length + n + 1)}</span>
                  {i.label}
                </motion.button>
              ))}
            </nav>
            <motion.div className="mt-10 flex flex-col gap-6"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.35 }}>
              <button type="button" onClick={() => go("signup")} className={t.ctaBig}>
                Get your free session
                <ArrowRight size={26} className={dir === "rtl" ? "rotate-180" : ""} />
              </button>
              {LangSwitch}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className={isHome ? "" : "pt-16 md:pt-20"}>{children}</main>

      <footer className={t.footer}>
        <div className={t.slashOuter}>
          <div className={t.slash} aria-hidden="true">
            <motion.div className={t.slashTxt}
              animate={{ x: dir === "rtl" ? ["0%", "50%"] : ["0%", "-50%"] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
              {[0, 1].map(copy => (
                <div key={copy} className="flex shrink-0 items-center">
                  {strip.slice(0, 16).map(s => (
                    <span key={copy + s.k} className="flex items-center">
                      <span className="px-5 md:px-8">{s.w}</span>
                      <span>•</span>
                    </span>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className={t.fWrap}>
          <div className={t.fGrid}>
            <div className="md:col-span-7">
              <p className={t.eyebrow}>Let's go</p>
              <h2 className={t.fHead + " mt-4"}>
                Your first session is <span className="text-primary">free.</span>
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed">
                Strength, fat loss, mobility and discipline — built around you, one rep at a time.
              </p>
              <button type="button" onClick={() => go("signup")} className={t.cta + " mt-8"}>
                Get your free session <ArrowRight size={16} className={dir === "rtl" ? "rotate-180" : ""} />
              </button>
            </div>
            <div className="md:col-span-5 md:ps-10">
              <p className={t.eyebrow}>Explore</p>
              <ul className="mt-5 flex flex-col gap-1">
                {footerLinks.map(l => (
                  <li key={l.key}>
                    <button type="button" onClick={l.onClick} className={t.fLink}>{l.label}</button>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={() => go("signup")} className={t.fLink + " text-primary"}>Free Session</button>
                </li>
              </ul>
            </div>
          </div>
          <div className={t.fBottom}>
            <span className="font-heading text-lg uppercase tracking-wide text-sidebar-text-active">{title}</span>
            <span>© {new Date().getFullYear()} {title}. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {open ? null : waButton}
    </div>
  );
}