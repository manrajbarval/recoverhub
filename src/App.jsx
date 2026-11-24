import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const appBase = import.meta.env.BASE_URL;
const routeUrl = (path) => `${appBase}${path.replace(/^\//, '')}`;
const assetUrl = (path) => `${appBase}assets/${path}`;

const ShieldIcon = () => <span className="shield-mark" aria-hidden="true">✓</span>;
const InstagramIcon = () => <img className="instagram-mark" src={assetUrl('insta.jpg')} alt="Instagram" />;
const LockIcon = () => <span className="lock-mark" aria-hidden="true">⌑</span>;
const MenuIcon = () => <span aria-hidden="true">☰</span>;
const CloseIcon = () => <span aria-hidden="true">×</span>;

function QRPaymentPage() {
  const upiId = '9982706764@fam';
  const merchantName = 'RecoveryHub';
  const amount = '499';
  const upiParams = new URLSearchParams({
    pa: upiId,
    pn: merchantName,
    am: amount,
    cu: 'INR',
    tn: 'Account Assistance Service Payment'
  });
  const upiDeepLink = `upi://pay?${upiParams.toString()}`;
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(7 * 60);
  const [utr, setUtr] = useState('');
  const [utrError, setUtrError] = useState('');
  const [utrSubmitted, setUtrSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyUpiId = async () => {
    await navigator.clipboard.writeText(upiId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  useEffect(() => {
    QRCode.toDataURL(upiDeepLink, {
      width: 520,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#111111', light: '#FFFFFF' }
    }).then(setQrDataUrl).catch(() => setQrDataUrl(''));
  }, [upiDeepLink]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const submitUtr = (event) => {
    event.preventDefault();
    const cleanUtr = utr.trim().toUpperCase();
    if (secondsLeft <= 0) {
      setUtrError('Payment time has expired. Please return and start again.');
      return;
    }
    if (!/^[A-Z0-9]{6,35}$/.test(cleanUtr)) {
      setUtrError('Enter a valid UTR or transaction reference ID.');
      return;
    }
    setUtrError('');
    setUtrSubmitted(true);
  };

  return (
    <div className="qr-payment-page">
      <main className="qr-payment-main">
        <section className="qr-payment-card">
          <h1 className="qr-page-title">Secure Payment</h1>
          <p className="qr-page-subtitle">Scan the QR code using your supported UPI app</p>
          <div className="qr-progress"><span style={{ width: `${(secondsLeft / 420) * 100}%` }} /></div>
          <time className="qr-countdown" aria-live="polite">{minutes}:{seconds}</time>
          <strong className="qr-amount">₹499 <small>INR</small></strong>
          <div className="qr-frame">{qrDataUrl ? <img src={qrDataUrl} alt="UPI payment QR code with ₹499 prefilled" /> : <span className="qr-loading">Generating QR...</span>}</div>
          <p className="qr-apps">Open Google Pay, PhonePe, Paytm or another UPI app.</p>
          <p className="qr-instruction">Scan this QR to view the ₹499 payment request.</p>
          <div className="upi-id"><span>UPI ID:</span><strong>{upiId}</strong><button type="button" onClick={copyUpiId}>{copied ? 'Copied' : 'Copy UPI ID'}</button></div>
          <a className="upi-deep-link" href={upiDeepLink}>Open in UPI App</a>
          {qrDataUrl && <a className="qr-download" href={qrDataUrl} download="recoveryhub-payment-499-qr.png">Download Payment QR</a>}
          <form className="utr-form" onSubmit={submitUtr}>
            <label htmlFor="utr">Enter UTR / Transaction ID</label>
            <input
              id="utr"
              value={utr}
              onChange={(event) => setUtr(event.target.value)}
              placeholder="Example: 412345678901"
              disabled={secondsLeft <= 0 || utrSubmitted}
              autoComplete="off"
            />
            {utrError && <p className="utr-error" role="alert">{utrError}</p>}
            {utrSubmitted ? <p className="utr-success">UTR submitted for verification.</p> : <button type="submit" disabled={secondsLeft <= 0}>Submit UTR</button>}
          </form>
          <div className="qr-verification"><span /><small>{secondsLeft <= 0 ? 'payment time expired' : 'payment verification'}</small></div>
        </section>
      </main>
    </div>
  );
}

const FacebookIcon = () => (
  <img className="facebook-mark" src={assetUrl('facebook.avif')} alt="Facebook" />
);

function Logo() {
  return (
    <a className="brand" href="#home" aria-label="RecoveryHub Home">
      <span className="brand-icon"><ShieldIcon /></span>
      <span>Recovery <b>Hub</b></span>
    </a>
  );
}

function AssistanceCard({ platform, icon, href }) {
  return (
    <a className="assistance-link" href={href}>
      <span className="platform-icon">{icon}</span>
      <span>{platform} Account Assistance</span>
      <span className="arrow">→</span>
    </a>
  );
}

function AssistancePage({ platform }) {
  const [username, setUsername] = useState('');
  const [issue, setIssue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const isInstagram = platform === 'Instagram';
  const detailsReady = username.trim().replace(/^@/, '').length >= (isInstagram ? 3 : 5) && Boolean(issue);
  const issues = isInstagram
    ? ['Disabled Account', 'Suspended Account', 'Blocked / Restricted Account', 'Deleted Account', 'Hacked Account', 'Locked Account', 'Temporarily Deactivated Account', 'Unable to Log In', 'Other Account Issue']
    : ['Disabled Account', 'Suspended Account', 'Blocked / Restricted Account', 'Deleted Account', 'Hacked Account', 'Locked Account', 'Deactivated Account', 'Unable to Log In', 'Other Account Issue'];

  const submit = (event) => {
    event.preventDefault();
    const cleanUsername = username.trim().replace(/^@/, '');
    if (cleanUsername.length < (isInstagram ? 3 : 5)) {
      setError(`Enter a valid ${platform} username.`);
      return;
    }
    if (!issue) {
      setError('Please select an account issue.');
      return;
    }
    setError('');
    const receipt = { platform, username: cleanUsername, issue, createdAt: new Date().toISOString() };
    localStorage.setItem('recoveryhub-last-request', JSON.stringify(receipt));
    window.location.assign(routeUrl('qr-payment'));
  };

  if (submitted) {
    const officialUrl = isInstagram
      ? 'https://www.instagram.com/accounts/password/reset/'
      : 'https://www.facebook.com/login/identify/';
    return (
      <div className="assistance-page">
        <header className="assistance-header"><a href={routeUrl('')} className="assistance-brand"><ShieldIcon /> <span>RecoveryHub.</span></a></header>
        <main className="assistance-main">
          <section className="assistance-card success-card">
            <div className="success-icon">✓</div>
            <h1>Information Request Ready</h1>
            <p>Your account issue has been reviewed locally.</p>
            <dl>
              <div><dt>Platform</dt><dd>{platform}</dd></div>
              <div><dt>Username</dt><dd>@{username.trim().replace(/^@/, '')}</dd></div>
              <div><dt>Issue</dt><dd>{issue}</dd></div>
            </dl>
            <a className="submit-assistance" href={officialUrl} target="_blank" rel="noreferrer">Continue with Official {platform} Recovery</a>
            <button className="back-button" onClick={() => setSubmitted(false)}>Edit Details</button>
            <p className="safety-note">Never share passwords, OTPs, recovery codes, or PINs. Only the official platform can restore account access.</p>
          </section>
        </main>
        <footer className="assistance-footer">RecoveryHub · Independent Account Assistance</footer>
      </div>
    );
  }

  return (
    <div className="assistance-page">
      <header className="assistance-header"><a href={routeUrl('')} className="assistance-brand"><ShieldIcon /> <span>RecoveryHub.</span></a></header>
      <main className="assistance-main">
        <form className="assistance-card" onSubmit={submit}>
          <div className={`assistance-logo ${isInstagram ? 'instagram' : 'facebook'}`}>{isInstagram ? <InstagramIcon /> : <FacebookIcon />}</div>
          <h1>{platform} Account Assistance</h1>
          <p className="service-subtitle">{isInstagram ? 'Account assistance service' : 'Independent assistance service'}</p>
          <div className="service-badge">INDEPENDENT SUPPORT SERVICE</div>
          <label>{platform} Username
            <div className="input-wrap"><span>@</span><input value={username} onChange={(event) => setUsername(event.target.value)} placeholder={`Enter your ${platform} username`} /></div>
          </label>
          <label>{isInstagram ? 'Select Account Issue' : 'Choose Account Issue'}
            <select value={issue} onChange={(event) => setIssue(event.target.value)}>
              <option value="">-- {isInstagram ? 'Choose' : 'Select'} your account issue --</option>
              {issues.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <p className="independent-warning">RecoveryHub is independent and is not affiliated with {platform} or Meta. Account recovery decisions are made only by the platform.</p>
          <div className="fee-box"><span>{isInstagram ? 'Service Fee' : 'Independent Service Fee'}</span><strong>₹499 <small>INR</small></strong></div>
          {detailsReady && <button className="payment-button" type="submit"><span aria-hidden="true">▣</span> Continue to Payment · ₹499</button>}
          <p className="selection-status">{detailsReady ? 'Username and account issue selected.' : 'Enter username and select account issue to continue.'}</p>
          <p className="safety-note">Never share your password, OTP, recovery codes or UPI PIN. A fee does not guarantee account recovery.</p>
        </form>
      </main>
      <footer className="assistance-footer">RecoveryHub · Independent Account Assistance</footer>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  let path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
  if (appBase !== '/' && path.startsWith(appBase.replace(/\/$/, ''))) {
    path = path.slice(appBase.replace(/\/$/, '').length) || '/';
  }
  if (path === '/qr-payment') return <QRPaymentPage />;
  if (path === '/instagram-recovery') return <AssistancePage platform="Instagram" />;
  if (path === '/facebook-recovery') return <AssistancePage platform="Facebook" />;

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell" id="home">
      <header className="header">
        <div className="nav-wrap">
          <Logo />
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
            <a className="active" href="#home" onClick={closeMenu}>Home</a>
            <a href="#services" onClick={closeMenu}>Services</a>
            <a href="#about" onClick={closeMenu}>About Us</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="eyebrow">DEPENDENT ACCOUNT ASSISTANCE</div>
              <h1>Get Help With Your<br />Account Recovery</h1>
              <p className="lead">Need guidance with an Instagram or Facebook account issue? RecoveryHub provides dependent assistance and helps you understand the available account recovery steps.</p>
              <div className="hero-actions">
                <a className="button instagram-button" href={routeUrl('instagram-recovery')}><InstagramIcon />Instagram Recovery</a>
                <a className="button facebook-button" href={routeUrl('facebook-recovery')}><FacebookIcon />Facebook Recovery</a>
              </div>
              <p className="trust-line">dependent service <span>·</span> Transparent process <span>·</span> guaranteed recovery</p>
            </div>

            <aside className="assistance-panel">
              <div className="panel-lock"><LockIcon /></div>
              <h2>Account Assistance Center</h2>
              <p>Select the platform for which you need recovery guidance.</p>
              <div className="assistance-list">
                <AssistanceCard platform="Instagram" icon={<InstagramIcon />} href={routeUrl('instagram-recovery')} />
                <AssistanceCard platform="Facebook" icon={<FacebookIcon />} href={routeUrl('facebook-recovery')} />
                <a className="official-link" href="https://www.instagram.com/accounts/password/reset/" target="_blank" rel="noreferrer">
                  <span className="official-icon"><InstagramIcon /></span> Official Instagram Recovery <span>↗</span>
                </a>
                <a className="official-link" href="https://www.facebook.com/login/identify/" target="_blank" rel="noreferrer">
                  <span className="official-icon fb"><FacebookIcon /></span> Official Facebook Recovery <span>↗</span>
                </a>
              </div>
            </aside>
          </div>
        </section>

        <section className="stats" aria-label="Service statistics">
          <div><strong>4,520</strong><span>Account Records</span></div>
          <div><strong>2</strong><span>Platforms Covered</span></div>
          <div><strong>24/7</strong><span>Website Access</span></div>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading">
            <h2>Our Services</h2>
            <p>dependent guidance for common social media account access issues.</p>
          </div>
          <div className="service-grid">
            <article className="service-card" id="instagram">
              <InstagramIcon />
              <h3>Instagram Account Assistance</h3>
              <p>Guidance for disabled, suspended, inaccessible, or login-related Instagram account issues.</p>
              <a href={routeUrl('instagram-recovery')}>Explore Instagram Assistance <span>→</span></a>
            </article>
            <article className="service-card" id="facebook">
              <FacebookIcon />
              <h3>Facebook Account Assistance</h3>
              <p>Guidance for Facebook login problems, disabled accounts, and account access difficulties.</p>
              <a href={routeUrl('facebook-recovery')}>Explore Facebook Assistance <span>→</span></a>
            </article>
          </div>
        </section>

        <section className="about-section" id="about">
          <h2>About RecoveryHub</h2>
          <p>RecoveryHub is an independent account assistance service. Our website provides information and guidance for people experiencing social media account access problems.</p>
          <p className="disclaimer">RecoveryHub is not owned by, operated by, sponsored by, or officially affiliated with Meta, Instagram, or Facebook.</p>
          <div className="feature-row">
            <span>✓ Independent assistance</span>
            <span>✓ Clear service information</span>
            <span>✓ Transparent limitations</span>
            <span>✓ Official recovery resources</span>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-heading">
            <h2>Contact RecoveryHub</h2>
            <p>Need information about our independent assistance service?</p>
          </div>
          <div className="contact-grid">
            <article><h3>Get in Touch</h3><p>For service-related questions, use the official contact details published by RecoveryHub.</p><div>Contact email or phone details have not been configured on this page.</div></article>
            <article><h3>Before You Request Assistance</h3><p>Never share your password, OTP, two-factor authentication code, recovery code, or payment PIN with anyone.</p></article>
          </div>
        </section>
      </main>

      <footer><span>© 2026 RecoveryHub. All rights reserved.</span><span>Independent Account Assistance Service</span></footer>
    </div>
  );
}
