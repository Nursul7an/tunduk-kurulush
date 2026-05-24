// Tabler-style outline icons + tunduk mark
const I = {
  hammer: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11.414 10l-7.383 7.418a2.091 2.091 0 0 0 2.953 2.962l7.461 -7.4"/>
      <path d="M9 6l3 -3l9 9l-3 3"/>
      <path d="M14.5 5.5l4 4"/>
      <path d="M12 8l-5 5"/>
      <path d="M7 8l-1.886 1.943a2.171 2.171 0 0 0 0 3.114a2.171 2.171 0 0 0 3.114 0l1.886 -1.943"/>
    </svg>
  ),
  file: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
      <path d="M9 13l2 2l4 -4"/>
    </svg>
  ),
  shield: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"/>
      <path d="M9 12l2 2l4 -4"/>
    </svg>
  ),
  eye: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="2"/>
      <path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"/>
    </svg>
  ),
  phone: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"/>
    </svg>
  ),
  wa: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"/>
      <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"/>
    </svg>
  ),
  tg: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4"/>
    </svg>
  ),
  mail: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <path d="M3 7l9 6l9 -6"/>
    </svg>
  ),
  ig: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4"/>
      <circle cx="12" cy="12" r="3"/>
      <circle cx="16.5" cy="7.5" r="0.6" fill="currentColor" stroke="none"/>
    </svg>
  ),
  check: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12l5 5l10 -10"/>
    </svg>
  ),
  arrow: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14"/>
      <path d="M13 6l6 6l-6 6"/>
    </svg>
  ),
  burger: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 8h16"/>
      <path d="M4 16h16"/>
    </svg>
  ),
  fundament: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="14" width="18" height="6" rx="1"/><path d="M6 14v-4"/><path d="M12 14v-4"/><path d="M18 14v-4"/><path d="M5 10h14"/></svg>,
  wall: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="16"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 4v5"/><path d="M15 9v6"/><path d="M9 15v5"/></svg>,
  roof: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12l9 -7l9 7"/><path d="M5 11v8h14v-8"/><path d="M10 19v-4h4v4"/></svg>,
  bolt: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 3l-10 12h9l-1 6l10 -12h-9l1 -6z"/></svg>,
  drop: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l5 8a5 5 0 1 1 -10 0z"/></svg>,
  wind: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 8h8.5a2.5 2.5 0 1 0 -2.45 -3"/><path d="M3 12h15.5a2.5 2.5 0 1 1 -2.45 3"/><path d="M4 16h5.5a2.5 2.5 0 1 1 -2.45 3"/></svg>,
  brush: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 11l3 3l8 -8a2.828 2.828 0 1 0 -4 -4l-8 8z"/><path d="M9 11l-3.213 3.213a2.7 2.7 0 0 0 0 3.825l1.175 1.175a2.7 2.7 0 0 0 3.825 0l3.213 -3.213"/></svg>,
  tree: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 13l-4 -4l4 -5l4 5l-4 4"/><path d="M12 13l5 5h-10z"/><path d="M12 18v3"/></svg>,
  // tunduk — yurt crown motif
  tunduk: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="3.5"/>
      <path d="M12 3v3.5"/>
      <path d="M12 17.5v3"/>
      <path d="M3 12h3.5"/>
      <path d="M17.5 12h3"/>
      <path d="M5.6 5.6l2.5 2.5"/>
      <path d="M15.9 15.9l2.5 2.5"/>
      <path d="M18.4 5.6l-2.5 2.5"/>
      <path d="M8.1 15.9l-2.5 2.5"/>
    </svg>
  ),
};

window.I = I;
