// Tunduk Kurulush — landing page app
const { useState, useEffect, useRef, useMemo } = React;

// ----- helpers -----
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  const [overImage, setOverImage] = useState(true);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      // hero is roughly 100vh; switch chrome around it
      setOverImage(window.scrollY < window.innerHeight - 100);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return { scrolled, overImage };
}

// Compute build progress 0..1 across the post-hero region
function useBuildProgress() {
  const [state, setState] = useState({ progress: 0, visible: false });
  useEffect(() => {
    let raf = null;
    const update = () => {
      raf = null;
      const wrap = document.querySelector('.post-hero');
      const finalEl = document.querySelector('.final-cta');
      if (!wrap || !finalEl) return;
      const startY = wrap.offsetTop - window.innerHeight * 0.5;
      const endY = finalEl.offsetTop + finalEl.offsetHeight * 0.4 - window.innerHeight * 0.5;
      const y = window.scrollY;
      const p = Math.max(0, Math.min(1, (y - startY) / Math.max(1, endY - startY)));
      const visible = y > window.innerHeight * 0.35;
      setState((prev) => (prev.progress === p && prev.visible === visible ? prev : { progress: p, visible }));
    };
    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return state;
}

// Scaffolding SVG — vertical posts + horizontal cross-beams + diagonal braces
function ScaffoldSvg() {
  const posts = [8, 22, 36, 50, 64, 78, 92];
  const beams = [12, 30, 52, 74];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      <g stroke="rgba(201,163,106,0.55)" strokeWidth="0.18" fill="none" vectorEffect="non-scaling-stroke">
        {posts.map((x, i) => (
          <line key={`p${i}`} x1={x} y1="-2" x2={x} y2="102"/>
        ))}
        {beams.map((y, i) => (
          <line key={`b${i}`} x1="2" y1={y} x2="98" y2={y}/>
        ))}
        {/* diagonal braces forming X-pattern between beams */}
        {beams.slice(0, -1).map((y, i) => {
          const y2 = beams[i + 1];
          return posts.slice(0, -1).map((x, j) => {
            const x2 = posts[j + 1];
            return (
              <g key={`d${i}-${j}`}>
                <line x1={x} y1={y} x2={x2} y2={y2}/>
                <line x1={x2} y1={y} x2={x} y2={y2}/>
              </g>
            );
          });
        })}
      </g>
      {/* crane silhouette extending out the top */}
      <g stroke="rgba(201,163,106,0.5)" strokeWidth="0.22" fill="none" vectorEffect="non-scaling-stroke">
        <line x1="80" y1="100" x2="80" y2="-20"/>
        <line x1="35" y1="-15" x2="92" y2="-15"/>
        <line x1="80" y1="-20" x2="35" y2="-15"/>
        <line x1="80" y1="-20" x2="92" y2="-15"/>
        <line x1="50" y1="-15" x2="50" y2="-8"/>
        <rect x="47" y="-8" width="6" height="4" fill="rgba(201,163,106,0.22)" stroke="none"/>
      </g>
    </svg>
  );
}

function ConstructionSparks() {
  const sparks = useMemo(() => Array.from({ length: 12 }, () => ({
    left: 5 + Math.random() * 90,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 2,
  })), []);
  return (
    <div className="cbg-sparks" aria-hidden>
      {sparks.map((s, i) => (
        <span
          key={i}
          className="spark"
          style={{
            left: `${s.left}%`,
            top: `calc(36% + 58% * (1 - var(--p, 0)))`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function ConstructionBackdrop({ lang }) {
  const { progress, visible } = useBuildProgress();
  const t = window.T[lang];
  const stageIdx = Math.min(t.buildStages.length - 1, Math.floor(progress * t.buildStages.length));
  return (
    <React.Fragment>
      <div
        className={`construction-bg ${visible ? 'visible' : ''}`}
        style={{ '--p': progress.toFixed(4) }}
        aria-hidden
      >
        <div className="cbg-image"/>
        <div className="cbg-darken"/>
        <div className="cbg-warmth"/>
        <div className="cbg-construction">
          <div className="cbg-blueprint"/>
          <div className="cbg-scaffold"><ScaffoldSvg/></div>
          <div className="cbg-stage">
            <span className="stage-eyebrow">{t.buildEyebrow}</span>
            <span className="stage-num">
              {String(stageIdx + 1).padStart(2, '0')}<span style={{ opacity: .4 }}> / {String(t.buildStages.length).padStart(2, '0')}</span>
            </span>
            <span className="stage-name">{t.buildStages[stageIdx]}</span>
          </div>
          <div className="cbg-progress"/>
        </div>
        <div className="cbg-line"/>
        <ConstructionSparks/>
        <div className="cbg-grain"/>
      </div>
    </React.Fragment>
  );
}

// ----- Logo mark (tunduk) -----
function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="20" cy="20" r="13"/>
      <circle cx="20" cy="20" r="5"/>
      <path d="M20 7v6.5M20 26.5V33M7 20h6.5M26.5 20H33"/>
      <path d="M11 11l4.5 4.5M24.5 24.5L29 29M29 11l-4.5 4.5M15.5 24.5L11 29"/>
    </svg>
  );
}

// ----- Mist SVG (drifting clouds over peaks) -----
function HeroMist() {
  return (
    <div className="hero-mist" aria-hidden>
      <svg viewBox="0 0 1600 400" preserveAspectRatio="none">
        <defs>
          <radialGradient id="cloud" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9"/>
            <stop offset="60%" stopColor="#fff" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <g className="mist-band">
          <ellipse cx="200" cy="200" rx="280" ry="50" fill="url(#cloud)"/>
          <ellipse cx="700" cy="170" rx="330" ry="55" fill="url(#cloud)"/>
          <ellipse cx="1300" cy="220" rx="300" ry="48" fill="url(#cloud)"/>
        </g>
        <g className="mist-band b">
          <ellipse cx="400" cy="260" rx="250" ry="40" fill="url(#cloud)"/>
          <ellipse cx="1000" cy="290" rx="280" ry="42" fill="url(#cloud)"/>
          <ellipse cx="1500" cy="260" rx="240" ry="38" fill="url(#cloud)"/>
        </g>
      </svg>
    </div>
  );
}

function Motes() {
  // 18 dust particles randomized once
  const motes = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    left: Math.random() * 100,
    top: 30 + Math.random() * 60,
    delay: Math.random() * 18,
    duration: 14 + Math.random() * 10,
    scale: 0.5 + Math.random() * 1.4,
  })), []);
  return (
    <div className="motes" aria-hidden>
      {motes.map((m, i) => (
        <span
          key={i}
          className="mote"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
            transform: `scale(${m.scale})`,
          }}
        />
      ))}
    </div>
  );
}

// ----- Welcome -----
function Welcome({ lang }) {
  const t = window.T[lang];
  const vidRef = useRef(null);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  return (
    <section className="welcome" id="welcome">
      <div className="welcome-stage" aria-hidden>
        <video
          ref={vidRef}
          className="welcome-video"
          autoPlay muted loop playsInline
          webkit-playsinline="true"
          poster="images/hero-house.png"
        >
          <source src="uploads/c7d64b1c-6673-47fa-8966-16221c5831a2.mp4" type="video/mp4"/>
        </video>
        <div className="welcome-overlay"/>
        <div className="welcome-grain"/>
      </div>
      <div className="welcome-content">
        <LogoMark className="welcome-logo"/>
        <h1 className="welcome-name">{t.brand.name}</h1>
        <p className="welcome-tagline">{t.brand.desc}</p>
        <div className="welcome-divider"/>
      </div>
    </section>
  );
}

// ----- Mobile Nav (rendered outside header to avoid backdrop-filter containing block) -----
function MobileNav({ menuOpen, setMenuOpen, lang, setLang }) {
  const t = window.T[lang];
  const close = () => setMenuOpen(false);
  return (
    <div className={`mobile-nav${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
      <div className="mobile-nav-inner">
        <button className="mobile-nav-close" onClick={close} aria-label="Close menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>
          </svg>
        </button>
        <nav className="mobile-nav-links">
          <a href="#services" onClick={close}>{t.nav.services}</a>
          <a href="#why" onClick={close}>{t.nav.why}</a>
          <a href="#process" onClick={close}>{t.nav.process}</a>
          <a href="#transparency" onClick={close}>{t.nav.transparency}</a>
          <a href="#contacts" onClick={close}>{t.nav.contacts}</a>
        </nav>
        <div className="mobile-nav-foot">
          <a href="tel:+996990001755" className="mobile-phone">
            <window.I.phone width="18" height="18"/>+996 990 001 755
          </a>
          <div className="mobile-nav-socials">
            <a href="https://wa.me/996990001755" className="icon-link" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><window.I.wa width="18" height="18"/></a>
            <a href="https://t.me/askarbek_mamatair" className="icon-link" aria-label="Telegram" target="_blank" rel="noopener noreferrer"><window.I.tg width="18" height="18"/></a>
            <a href="https://www.instagram.com/tunduk_kurulush" className="icon-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><window.I.ig width="18" height="18"/></a>
          </div>
          <a href="#form" className="btn btn-primary" onClick={close} style={{ width: '100%', justifyContent: 'center' }}>{t.nav.cta}</a>
          <div className="lang-switch" role="tablist">
            <button className={lang === 'ru' ? 'active' : ''} onClick={() => setLang('ru')}>РУ</button>
            <button className={lang === 'ky' ? 'active' : ''} onClick={() => setLang('ky')}>КЫР</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----- Header -----
function Header({ lang, setLang, menuOpen, setMenuOpen }) {
  const { scrolled, overImage } = useScrolled();
  const t = window.T[lang];
  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${overImage && !menuOpen ? 'on-image' : ''}`}>
      <div className="container header-inner">
        <a href="#top" className="logo" onClick={() => setMenuOpen(false)}>
          <LogoMark className="logo-mark"/>
          <div className="logo-text">
            <span className="name">{t.brand.name}</span>
            <span className="desc">{t.brand.desc}</span>
          </div>
        </a>
        <nav className="nav">
          <a href="#services">{t.nav.services}</a>
          <a href="#why">{t.nav.why}</a>
          <a href="#process">{t.nav.process}</a>
          <a href="#transparency">{t.nav.transparency}</a>
          <a href="#contacts">{t.nav.contacts}</a>
        </nav>
        <div className="header-right">
          <div className="lang-switch" role="tablist">
            <button className={lang === 'ru' ? 'active' : ''} onClick={() => setLang('ru')}>РУ</button>
            <button className={lang === 'ky' ? 'active' : ''} onClick={() => setLang('ky')}>КЫР</button>
          </div>
          <a className="phone" href="tel:+996990001755">
            <window.I.phone width="16" height="16"/>+996 990 001 755
          </a>
          <a className="icon-link" href="https://wa.me/996990001755" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><window.I.wa width="16" height="16"/></a>
          <a className="icon-link" href="https://t.me/askarbek_mamatair" aria-label="Telegram" target="_blank" rel="noopener noreferrer"><window.I.tg width="16" height="16"/></a>
          <a href="#form" className="btn btn-primary" style={{ height: 44, minHeight: 44, padding: '0 22px', fontSize: 14 }}>{t.nav.cta}</a>
          <button className="burger" aria-label="Toggle menu" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen
              ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="4" y1="4" x2="16" y2="16"/><line x1="16" y1="4" x2="4" y2="16"/></svg>
              : <window.I.burger width="20" height="20"/>
            }
          </button>
        </div>
      </div>
    </header>
  );
}

// ----- Hero -----
function Hero({ lang }) {
  const t = window.T[lang].hero;
  return (
    <section className="hero" id="top" data-screen-label="01 Hero">
      <div className="hero-stage" aria-hidden>
        <div className="hero-image"/>
        <div className="hero-sunray"/>
        <HeroMist/>
        <div className="hero-warmth"/>
        <Motes/>
        <div className="hero-vignette"/>
        <div className="hero-grain"/>
      </div>
      <div className="container hero-content">
        <div className="hero-top">
          <span className="hero-eyebrow">
            <span className="line"/> {t.eyebrow}
          </span>
        </div>
        <h1 className="hero-title serif" key={lang + '-title'}>
          {t.title.map((w, i) => (
            <React.Fragment key={i}>
              <span className="word"><span>{w}</span></span>
              {i < t.title.length - 1 ? ' ' : ''}
            </React.Fragment>
          ))}
        </h1>
        <p className="hero-sub lang-fade" key={lang + '-sub'}>{t.sub}</p>
        <div className="hero-badges lang-fade" key={lang + '-badges'}>
          {t.badges.map((b, i) => (
            <span className="hero-badge" key={i}>
              <window.I.check width="14" height="14" className="check"/> {b}
            </span>
          ))}
        </div>
        <div className="hero-ctas">
          <a href="#form" className="btn btn-primary">
            {t.ctaPrimary} <window.I.arrow width="18" height="18" className="arrow"/>
          </a>
          <a href="#services" className="btn btn-ghost on-dark">{t.ctaSecondary}</a>
        </div>
        <div className="hero-bottom">
          {t.stats.map((s, i) => (
            <div className="hero-stat" key={i}>
              <span className="num serif">{s.num}<span className="plus">{s.plus}</span></span>
              <span className="lbl">{s.lbl}</span>
            </div>
          ))}
          <div className="hero-scroll">
            <span>{t.scroll}</span>
            <span className="bar"/>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- Trust Strip -----
function TrustStrip({ lang }) {
  const t = window.T[lang].trust;
  const icons = { hammer: window.I.hammer, file: window.I.file, shield: window.I.shield, eye: window.I.eye };
  return (
    <section className="trust" data-screen-label="02 Trust">
      <div className="container">
        <div className="trust-grid">
          {t.items.map((it, i) => {
            const Ico = icons[it.icon];
            return (
              <div className={`trust-card reveal d${i}`} key={i}>
                <Ico className="trust-icon"/>
                <h3 className="serif">{it.title}</h3>
                <p>{it.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ----- Services -----
function Services({ lang }) {
  const t = window.T[lang].services;
  const workIcons = [I.fundament, I.wall, I.roof, I.bolt, I.drop, I.wind, I.brush, I.tree];
  return (
    <section className="section" id="services" data-screen-label="03 Services">
      <div className="container">
        <div className="section-head reveal">
          <div className="left">
            <div className="eyebrow"><span className="dot"/>{t.eyebrow}</div>
            <h2>{t.title}</h2>
          </div>
          <div className="right">{t.intro}</div>
        </div>

        <div className="services-pair">
          {t.pair.map((p, i) => (
            <div className={`service-card reveal d${i}`} key={i}>
              <div className="bg" style={{ backgroundImage: `url(${i === 0 ? 'uploads/Villa.png' : 'uploads/Warehouse.png'})` }}/>
              <div className="inner">
                <h3 className="serif">{p.name}</h3>
                <p className="desc">{p.desc}</p>
                <div className="meta">
                  {p.meta.map((m, j) => (
                    <span className="meta-item" key={j}><span className="dot"/>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="works-head reveal">
          <h3 className="serif">{t.worksTitle}</h3>
          <p>{t.worksSub}</p>
        </div>
        <div className="works-grid reveal">
          {t.works.map((name, i) => {
            const Ico = workIcons[i];
            return (
              <div className="work-cell" key={i}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <span className="name serif">{name}</span>
                <Ico className="icon"/>
              </div>
            );
          })}
        </div>

        <div className="services-cta reveal">
          <div>
            <h3 className="serif">{t.ctaTitle}</h3>
            <p>{t.ctaBody}</p>
          </div>
          <div className="actions">
            <a href="#form" className="btn btn-primary">
              {t.ctaBtn} <window.I.arrow width="18" height="18" className="arrow"/>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- Why -----
function Why({ lang }) {
  const t = window.T[lang].why;
  return (
    <section className="section why" id="why" data-screen-label="04 Why us">
      <div className="container">
        <div className="section-head reveal">
          <div className="left">
            <div className="eyebrow"><span className="dot"/>{t.eyebrow}</div>
            <h2>{t.title}</h2>
          </div>
          <div className="right">{t.intro}</div>
        </div>
        <div className="why-grid">
          {t.items.map((it, i) => (
            <div className={`why-cell reveal d${i % 3}`} key={i}>
              <span className="index">{String(i + 1).padStart(2, '0')} ·</span>
              <h3 className="serif">{it.t}</h3>
              <span className="underline"/>
              <p>{it.b}</p>
            </div>
          ))}
        </div>
        <div className="why-footer reveal">
          <p>{t.quote}</p>
          <a href="#form" className="btn btn-light">
            {t.btn} <window.I.arrow width="18" height="18" className="arrow"/>
          </a>
        </div>
      </div>
    </section>
  );
}

// ----- Process -----
function Process({ lang }) {
  const t = window.T[lang].process;
  return (
    <section className="section process" id="process" data-screen-label="05 Process">
      <div className="container">
        <div className="section-head reveal">
          <div className="left">
            <div className="eyebrow"><span className="dot"/>{t.eyebrow}</div>
            <h2>{t.title}</h2>
          </div>
          <div className="right">{t.intro}</div>
        </div>
        <div className="process-track">
          {t.steps.map((s, i) => (
            <div className={`process-step reveal d${i}`} key={i}>
              <div className="ring">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="serif">{s.t}</h3>
              <p>{s.b}</p>
              <span className="badge">{s.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----- Form -----
function FormSection({ lang }) {
  const t = window.T[lang].form;
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(`Здравствуйте! Меня зовут ${name}. Мой номер: ${phone}. Прошу рассчитать стоимость.`);
    window.open(`https://wa.me/996990001755?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <section className="section form-section" id="form" data-screen-label="06 Form">
      <div className="container">
        <div className="section-head reveal">
          <div className="left">
            <div className="eyebrow"><span className="dot"/>{t.eyebrow}</div>
            <h2>{t.title}</h2>
          </div>
          <div className="right">{t.intro}</div>
        </div>

        <div className="form-wrap">
          <div className="form-perks reveal">
            {t.perks.map((p, i) => (
              <div className="form-perk" key={i}>
                <window.I.check className="icon"/>
                <div>
                  <h4>{p.t}</h4>
                  <p>{p.b}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="form-card reveal d2">
            {!submitted ? (
              <React.Fragment>
                <div className="form-eyebrow">{t.formEyebrow}</div>
                <h3 className="serif">{t.formTitle}</h3>
                <form onSubmit={onSubmit}>
                  <div className="field">
                    <label>{t.nameLabel}</label>
                    <input type="text" placeholder={t.namePlaceholder} value={name} onChange={e => setName(e.target.value)} required/>
                  </div>
                  <div className="field">
                    <label>{t.phoneLabel}</label>
                    <input type="tel" placeholder={t.phonePlaceholder} value={phone} onChange={e => setPhone(e.target.value)} required/>
                  </div>
                  <button type="submit" className="btn btn-primary form-submit">
                    {t.submit} <window.I.arrow width="18" height="18" className="arrow"/>
                  </button>
                  <div className="form-foot">
                    {t.foot.map((f, i) => (
                      <span key={i}><window.I.check width="14" height="14" className="check"/> {f}</span>
                    ))}
                  </div>
                </form>
                <div className="form-alt">
                  {t.alt}
                  <div className="msg-btns">
                    <a className="msg-btn" href="https://wa.me/996990001755" target="_blank" rel="noopener noreferrer"><window.I.wa width="14" height="14"/> WhatsApp</a>
                    <a className="msg-btn" href="#"><window.I.tg width="14" height="14"/> Telegram</a>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <div className="thanks-screen">
                <window.I.check className="icon"/>
                <h3 className="serif">{t.thanksTitle}</h3>
                <p>{t.thanksBody}</p>
                <div className="thanks-actions">
                  {t.thanksBtns.map((b, i) => (
                    <a key={i} className="btn btn-ghost" href="#" style={{ height: 42, minHeight: 42, fontSize: 13, padding: '0 18px' }}>{b}</a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- Transparency -----
function Transparency({ lang }) {
  const t = window.T[lang].transparency;
  return (
    <section className="section transparency" id="transparency" data-screen-label="07 Transparency">
      <div className="container">
        <div className="transparency-head reveal">
          <div className="eyebrow"><span className="dot"/>{t.eyebrow}</div>
          <h2>{t.title}</h2>
          <p>{t.intro}</p>
          <div className="tunduk-divider" style={{ justifyContent: 'center', maxWidth: 280, margin: '32px auto 0' }}>
            <span className="line"/>
            <window.I.tunduk/>
            <span className="line"/>
          </div>
        </div>
        <div className="transparency-grid">
          {t.items.map((it, i) => (
            <div className={`trans-card reveal d${i % 2}`} key={i}>
              <div className="num serif">{i + 1}</div>
              <div>
                <h3 className="serif">{it.t}</h3>
                <p>{it.b}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="transparency-quote reveal">
          <blockquote>{t.quote}</blockquote>
          <cite>— {t.quoteAttr}</cite>
        </div>
      </div>
    </section>
  );
}

// ----- Final CTA -----
function FinalCta({ lang }) {
  const t = window.T[lang].finalCta;
  return (
    <section className="final-cta" data-screen-label="08 Final CTA">
      <div className="final-bg" aria-hidden/>
      <div className="final-overlay" aria-hidden/>
      <div className="container final-content">
        <div className="eyebrow reveal" style={{ color: 'rgba(251,248,241,.7)' }}>
          <span className="dot" style={{ background: 'var(--gold)' }}/>{t.eyebrow}
        </div>
        <h2 className="reveal d1" style={{ marginTop: 14 }}>{t.title}</h2>
        <p className="reveal d2">{t.intro}</p>
        <div className="final-list reveal d3">
          {t.list.map((x, i) => (
            <div className="item" key={i}>
              <window.I.check width="18" height="18" className="check"/> {x}
            </div>
          ))}
        </div>
        <div className="final-actions reveal d4">
          <a href="#form" className="btn btn-primary">
            {t.primary} <window.I.arrow width="18" height="18" className="arrow"/>
          </a>
          <a href="https://wa.me/996990001755" className="btn btn-ghost on-dark" target="_blank" rel="noopener noreferrer">
            <window.I.wa width="16" height="16"/> {t.secondary}
          </a>
        </div>
        <div className="final-foot reveal d4">{t.foot}</div>
      </div>
    </section>
  );
}

// ----- Footer -----
function Footer({ lang }) {
  const t = window.T[lang];
  const ic = { phone: window.I.phone, wa: window.I.wa, tg: window.I.tg, mail: window.I.mail, ig: window.I.ig };
  return (
    <footer className="footer" id="contacts" data-screen-label="09 Contacts">
      <div className="container">
        <div className="section-head" style={{ color: 'var(--cream)' }}>
          <div className="left">
            <div className="eyebrow" style={{ color: 'rgba(251,248,241,.6)' }}>
              <span className="dot" style={{ background: 'var(--terra-soft)' }}/>{t.contacts.eyebrow}
            </div>
            <h2>{t.contacts.title}</h2>
          </div>
          <div className="right" style={{ color: 'rgba(251,248,241,.7)' }}>
            <strong style={{ color: 'var(--cream)', display: 'block', marginBottom: 8 }}>{t.contacts.office.title}</strong>
            <a href="https://2gis.kg/bishkek/geo/70000001095170045/74.612472,42.870582" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3, opacity: .85 }}>{t.contacts.office.addr}</a>
            <div style={{ marginTop: 10, fontSize: 13.5, opacity: .85 }}>
              {t.contacts.office.hours.map((h, i) => <div key={i}>{h}</div>)}
            </div>
          </div>
        </div>

        <div className="contact-cards">
          {t.contacts.cards.map((c, i) => {
            const Ico = ic[c.icon];
            const hrefs = {
              phone: 'tel:+996990001755',
              wa: 'https://wa.me/996990001755',
              tg: 'https://t.me/askarbek_mamatair',
              ig: 'https://www.instagram.com/tunduk_kurulush',
            };
            return (
              <a className="contact-card" href={hrefs[c.icon]} key={i} target={c.icon !== 'phone' ? '_blank' : undefined} rel="noopener noreferrer">
                <Ico className="icon"/>
                <span className="label">{c.lbl}</span>
                <span className="val serif">{c.val}</span>
                <span className="note">{c.note}</span>
              </a>
            );
          })}
        </div>

        <div className="footer-main">
          <div className="footer-brand">
            <div className="logo" style={{ color: 'var(--cream)' }}>
              <LogoMark className="logo-mark"/>
              <div className="logo-text">
                <span className="name serif">{t.brand.name}</span>
                <span className="desc" style={{ color: 'rgba(251,248,241,.55)' }}>{t.brand.desc}</span>
              </div>
            </div>
            <p className="desc">{t.footer.brand}</p>
          </div>
          {t.footer.cols.map((col, i) => {
            const hrefs = [
              ['#services', '#services', '#services', '#services', '#services'],
              ['#process', '#why', '#transparency', '#form'],
              ['tel:+996990001755', 'https://wa.me/996990001755', 'https://t.me/askarbek_mamatair', 'https://www.instagram.com/tunduk_kurulush'],
            ];
            const targets = [
              [null, null, null, null, null],
              [null, null, null, null],
              [null, '_blank', '_blank', '_blank'],
            ];
            return (
              <div className="footer-col" key={i}>
                <h4>{col.title}</h4>
                <ul>
                  {col.items.map((it, j) => (
                    <li key={j}><a href={hrefs[i][j]} target={targets[i][j]} rel="noopener noreferrer">{it}</a></li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="footer-bottom">
          <span>{t.footer.copy}</span>
          <div className="links">
            {t.footer.links.map((l, i) => <a href="#" key={i}>{l}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ----- App -----
function App() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('tk-lang') || 'ru'; } catch { return 'ru'; }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    try { localStorage.setItem('tk-lang', lang); } catch {}
    document.documentElement.lang = lang === 'ky' ? 'ky' : 'ru';
  }, [lang]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);
  useScrollReveal();

  return (
    <React.Fragment>
      <Welcome lang={lang}/>
      <Header lang={lang} setLang={setLang} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
      <MobileNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} lang={lang} setLang={setLang}/>
      <ConstructionBackdrop lang={lang}/>
      <main>
        <Hero lang={lang}/>
        <div className="post-hero">
          <TrustStrip lang={lang}/>
          <Services lang={lang}/>
          <Why lang={lang}/>
          <Process lang={lang}/>
          <FormSection lang={lang}/>
          <Transparency lang={lang}/>
          <FinalCta lang={lang}/>
          <Footer lang={lang}/>
        </div>
      </main>
      <a href="https://wa.me/996990001755" className="fab-wa" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
        <window.I.wa width="26" height="26"/>
      </a>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
