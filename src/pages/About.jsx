import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import {
  ArrowRight, BarChart3, Check, ChevronRight, CreditCard, Globe2,
  Inbox, Layers3, Package, Search, ShoppingBag, Store, Truck, Users
} from 'lucide-react';

const aboutStyles = `
  .about-page { --about-ink:#221510; --about-muted:#6B584C; --about-line:#EAE3D9; --about-paper:#FBF9F5; --about-wash:#F4EEE7; background:var(--about-paper); color:var(--about-ink); overflow:hidden; }
  .about-wrap { width:min(1180px,calc(100% - 48px)); margin:0 auto; }
  .about-hero { padding:148px 0 84px; background:var(--about-paper); }
  .about-hero-grid { display:grid; grid-template-columns:minmax(0,.95fr) minmax(420px,1.05fr); gap:74px; align-items:center; }
  .about-kicker,.about-label { color:#8D5B36; font-size:11px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; }
  .about-kicker { display:inline-flex; align-items:center; gap:9px; margin-bottom:22px; }
  .about-kicker::before { content:''; width:26px; height:1px; background:#8D5B36; }
  .about-hero h1 { max-width:680px; margin:0 0 24px; font-size:clamp(42px,6vw,76px); line-height:.98; letter-spacing:-.055em; }
  .about-lead { max-width:590px; margin:0; color:var(--about-muted); font-size:18px; line-height:1.65; }
  .about-hero-note { display:flex; align-items:center; gap:10px; margin-top:30px; color:#8D5B36; font-size:12px; font-weight:700; }
  .about-hero-note span { width:7px; height:7px; background:#3E8B68; border-radius:50%; box-shadow:0 0 0 5px rgba(62,139,104,.12); }
  .about-flow { min-height:390px; padding:28px; border:1px solid var(--about-line); border-radius:26px; background:#F2ECE4; position:relative; }
  .about-flow::after { content:''; position:absolute; inset:14px; border:1px dashed rgba(141,91,54,.25); border-radius:18px; pointer-events:none; }
  .about-flow-label { position:relative; z-index:1; display:flex; justify-content:space-between; color:#8D5B36; font-size:10px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; }
  .about-flow-stage { min-height:315px; display:flex; align-items:center; justify-content:center; gap:18px; position:relative; z-index:1; }
  .about-social-stack { width:126px; display:grid; gap:9px; transform:rotate(-5deg); }
  .about-message { width:max-content; max-width:100%; padding:11px 12px; border:1px solid rgba(141,91,54,.18); border-radius:9px; background:rgba(255,255,255,.7); box-shadow:0 8px 16px rgba(34,21,16,.05); color:#6B584C; font-size:10px; font-weight:700; overflow:hidden; white-space:nowrap; animation:about-message-in .7s ease both; }
  .about-message:nth-child(1) { animation-delay:.25s; }
  .about-message:nth-child(2) { animation-delay:.7s; }
  .about-message:nth-child(3) { animation-delay:1.15s; }
  .about-message:nth-child(2) { margin-left:14px; background:#FFF8E8; }
  .about-message:nth-child(3) { margin-left:-6px; background:#F5EAE6; }
  .about-flow-arrow { color:#B98D5B; }
  .about-store-window { width:min(100%,285px); overflow:hidden; border:1px solid #DCCFC2; border-radius:14px; background:#FFF; box-shadow:0 18px 30px rgba(34,21,16,.13); animation:about-store-float 5s ease-in-out infinite; }
  .about-store-top { display:flex; align-items:center; justify-content:space-between; padding:10px 13px; border-bottom:1px solid #F0E8DF; font-size:9px; font-weight:800; }
  .about-store-brand { display:flex; align-items:center; gap:5px; color:#6A3E1F; }
  .about-store-brand i { display:block; width:13px; height:13px; border-radius:4px; background:#6A3E1F; }
  .about-store-top small { color:#A48B79; }
  .about-store-body { padding:15px; }
  .about-store-hero { height:66px; padding:12px; border-radius:8px; background:#3B2920; color:#FFF8F0; }
  .about-store-hero b { display:block; max-width:110px; font-size:13px; line-height:1.05; }
  .about-store-hero span { display:block; margin-top:7px; color:#DCCFC2; font-size:7px; }
  .about-store-products { display:grid; grid-template-columns:repeat(3,1fr); gap:7px; margin-top:10px; }
  .about-product-tile { height:74px; padding:7px; border-radius:7px; background:#F2ECE4; animation:about-product-drift 4s ease-in-out infinite; }
  .about-product-tile:nth-child(2) { animation-delay:.45s; }
  .about-product-tile:nth-child(3) { animation-delay:.9s; }
  .about-product-tile div { height:41px; border-radius:5px; background:#D6B69A; }
  .about-product-tile:nth-child(2) div { background:#B4C2B2; }
  .about-product-tile:nth-child(3) div { background:#C8A4A0; }
  .about-product-tile span { display:block; margin-top:5px; color:#6B584C; font-size:7px; }
  .about-section { padding:92px 0; }
  .about-section.wash { background:var(--about-wash); }
  .about-section.dark { background:#2B1B13; color:#FFF9F3; }
  .about-section h2 { max-width:700px; margin:12px 0 20px; font-size:clamp(34px,4.4vw,58px); line-height:1.02; letter-spacing:-.045em; }
  .about-section p { color:var(--about-muted); font-size:16px; line-height:1.7; }
  .about-section.dark p { color:#D7C9BD; }
  .about-problem-head { max-width:650px; }
  .about-problem-head p { max-width:600px; }
  .about-pain-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-top:46px; }
  .about-pain { min-height:132px; padding:20px; border:1px solid var(--about-line); border-radius:12px; background:rgba(255,255,255,.54); display:flex; flex-direction:column; justify-content:space-between; }
  .about-pain strong { font-size:17px; letter-spacing:-.02em; }
  .about-pain span { color:#A48B79; font-size:11px; }
  .about-pain mark { width:fit-content; padding:3px 6px; background:#F2DFD5; color:#995B42; font-size:10px; font-weight:800; }
  .about-reframe { display:grid; grid-template-columns:1fr 1.2fr; gap:70px; align-items:center; margin-top:78px; padding-top:42px; border-top:1px solid var(--about-line); }
  .about-reframe h3 { margin:0; font-size:28px; line-height:1.1; }
  .about-reframe p { margin:0; }
  .about-capabilities-head { display:flex; align-items:end; justify-content:space-between; gap:32px; }
  .about-capabilities-head p { max-width:420px; margin-bottom:4px; }
  .about-capability-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; margin-top:48px; }
  .about-capability { min-height:214px; padding:20px 16px; border:1px solid var(--about-line); border-radius:12px; background:#FFFDFC; }
  .about-capability:nth-child(even) { transform:translateY(18px); background:#F8F1E9; }
  .about-capability-icon { display:grid; place-items:center; width:38px; height:38px; margin-bottom:34px; border-radius:10px; background:#F1E5D9; color:#6A3E1F; }
  .about-capability h3 { margin:0 0 8px; font-size:16px; }
  .about-capability p { font-size:12px; line-height:1.5; }
  .about-belief { display:grid; grid-template-columns:.9fr 1.1fr; gap:90px; align-items:center; }
  .about-belief h2 { margin-bottom:24px; }
  .about-belief-copy { max-width:520px; }
  .about-credibility { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
  .about-credibility-card { min-height:130px; padding:20px; border:1px solid var(--about-line); border-radius:12px; background:#FFFDFC; }
  .about-credibility-card:nth-child(2) { transform:translateY(20px); }
  .about-credibility-card:nth-child(3) { transform:translateY(-12px); }
  .about-credibility-card svg { color:#8D5B36; margin-bottom:24px; }
  .about-credibility-card strong { display:block; font-size:14px; }
  .about-credibility-card span { display:block; margin-top:5px; color:var(--about-muted); font-size:11px; }
  .about-principles { display:grid; grid-template-columns:repeat(4,1fr); gap:0; margin-top:52px; border-top:1px solid rgba(255,255,255,.18); }
  .about-principle { padding:26px 22px 10px 0; border-right:1px solid rgba(255,255,255,.18); }
  .about-principle:not(:first-child) { padding-left:22px; }
  .about-principle:last-child { border-right:0; }
  .about-principle b { color:#D2A77B; font-size:12px; }
  .about-principle h3 { margin:38px 0 10px; color:#FFF9F3; font-size:17px; }
  .about-principle p { font-size:13px; line-height:1.55; }
  .about-vision { display:grid; grid-template-columns:.95fr 1.05fr; gap:80px; align-items:center; }
  .about-vision h2 { color:#FFF9F3; }
  .about-built { display:inline-block; margin-top:26px; color:#D2A77B; font-size:14px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; }
  .about-ecosystem { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; padding:18px; border:1px solid rgba(255,255,255,.18); border-radius:20px; background:rgba(255,255,255,.04); }
  .about-ecosystem-item { min-height:92px; padding:13px; border:1px solid rgba(255,255,255,.12); border-radius:10px; background:rgba(255,255,255,.06); }
  .about-ecosystem-item svg { color:#D2A77B; }
  .about-ecosystem-item span { display:block; margin-top:22px; color:#FFF9F3; font-size:12px; font-weight:700; }
  .about-cta { padding:88px 0 100px; text-align:center; }
  .about-cta h2 { margin:12px auto 16px; }
  .about-cta p { max-width:470px; margin:0 auto 28px; }
  .about-cta a { display:inline-flex; align-items:center; gap:10px; padding:14px 22px; border-radius:9px; background:#6A3E1F; color:#FFF; font-size:14px; font-weight:800; box-shadow:0 10px 20px rgba(106,62,31,.18); transition:transform .2s ease,background .2s ease; }
  .about-cta a:hover { background:#522F16; transform:translateY(-2px); }
  .about-cta small { display:block; margin-top:17px; color:#8D5B36; font-size:11px; font-weight:700; }
  .about-reveal { animation:about-rise .65s ease both; }
  @keyframes about-rise { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes about-message-in { from { opacity:0; width:0; transform:translateX(-10px); } to { opacity:1; width:max-content; transform:translateX(0); } }
  @keyframes about-store-float { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-7px) rotate(.6deg); } }
  @keyframes about-product-drift { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-4px); } }
  @media (prefers-reduced-motion:reduce) { .about-reveal,.about-message,.about-store-window,.about-product-tile { animation:none; } }
  @media (max-width:900px) { .about-hero-grid,.about-belief,.about-vision { grid-template-columns:1fr; gap:44px; } .about-capability-grid { grid-template-columns:repeat(3,1fr); } .about-principles { grid-template-columns:repeat(2,1fr); } .about-principle:nth-child(2) { border-right:0; } .about-principle:nth-child(n+3) { border-top:1px solid rgba(255,255,255,.18); } .about-principle:nth-child(3) { padding-left:0; } }
  @media (max-width:640px) { .about-wrap { width:min(100% - 32px,1180px); } .about-hero { padding:122px 0 58px; } .about-flow { min-height:315px; padding:17px; } .about-flow-stage { min-height:252px; gap:8px; } .about-social-stack { width:90px; } .about-message { padding:8px; font-size:8px; } .about-store-window { width:205px; } .about-store-body { padding:10px; } .about-store-hero { height:54px; } .about-store-hero b { font-size:10px; } .about-product-tile { height:57px; padding:5px; } .about-product-tile div { height:29px; } .about-section { padding:64px 0; } .about-pain-grid,.about-capability-grid { grid-template-columns:repeat(2,1fr); } .about-pain { min-height:112px; padding:14px; } .about-reframe { grid-template-columns:1fr; gap:20px; margin-top:50px; } .about-capabilities-head { display:block; } .about-capabilities-head p { margin-top:18px; } .about-capability:nth-child(even) { transform:none; } .about-capability-icon { margin-bottom:22px; } .about-credibility-card:nth-child(2),.about-credibility-card:nth-child(3) { transform:none; } .about-principles { grid-template-columns:1fr; } .about-principle,.about-principle:not(:first-child) { padding:22px 0; border-right:0; border-top:1px solid rgba(255,255,255,.18); } .about-principle:first-child { border-top:0; } .about-ecosystem { grid-template-columns:repeat(2,1fr); } }
`;

const capabilityItems = [
  { icon: Store, title: 'Store', text: 'A storefront your business can call its own.' },
  { icon: Package, title: 'Products', text: 'A clear place for customers to browse what you sell.' },
  { icon: CreditCard, title: 'Payments', text: 'A simpler path from product interest to payment.' },
  { icon: Inbox, title: 'Orders', text: 'One view for what was bought and what happens next.' },
  { icon: Users, title: 'Customers', text: 'A better buying experience built around real people.' }
];

const principleItems = [
  ['01', 'Own your brand', "Your business shouldn't be hidden behind a marketplace or social media profile."],
  ['02', 'Make buying easy', 'Customers should discover, order and pay without unnecessary back-and-forth.'],
  ['03', 'Build trust', 'A professional online store creates a stronger digital presence for your business.'],
  ['04', 'Grow without the headache', 'Unbley handles the infrastructure so you can focus on products and customers.']
];

const ecosystemItems = [
  [Store, 'Stores'], [CreditCard, 'Payments'], [ShoppingBag, 'Orders'],
  [Users, 'Customers'], [Truck, 'Logistics'], [BarChart3, 'Intelligence']
];

export default function About() {
  return (
    <>
      <SEO title="About Us | Unbley" description="Unbley helps businesses build professional online stores, accept payments, manage orders, and sell with confidence." />
      <Navbar />
      <PageTransition>
        <style dangerouslySetInnerHTML={{ __html: aboutStyles }} />
        <main className="about-page">
          <section className="about-hero"><div className="about-wrap about-hero-grid"><div className="about-reveal"><span className="about-kicker">About Unbley</span><h1>Your business deserves more than a social media page.</h1><p className="about-lead">Unbley gives businesses the tools to build a real online store, accept payments, manage orders, and give customers a better buying experience - without unnecessary complexity.</p><div className="about-hero-note"><span /> Built for the next stage of your business</div></div><div className="about-flow about-reveal" style={{ animationDelay: '.1s' }} aria-label="A visual transition from social selling to an online store"><div className="about-flow-label"><span>From scattered selling</span><span>To one clear system</span></div><div className="about-flow-stage"><div className="about-social-stack"><div className="about-message">How much?</div><div className="about-message">What's your account number?</div><div className="about-message">Can I see your products?</div></div><ArrowRight className="about-flow-arrow" size={22} /><div className="about-store-window"><div className="about-store-top"><span className="about-store-brand"><i /> ZIZZY STORE</span><small><Search size={10} /></small></div><div className="about-store-body"><div className="about-store-hero"><b>Everyday pieces, made yours.</b><span>SHOP THE COLLECTION</span></div><div className="about-store-products"><div className="about-product-tile"><div /><span>Essential tee</span></div><div className="about-product-tile"><div /><span>Canvas tote</span></div><div className="about-product-tile"><div /><span>New season</span></div></div></div></div></div></div></div></section>
          <section className="about-section wash"><div className="about-wrap"><div className="about-problem-head"><span className="about-label">The problem</span><h2>Selling online shouldn't feel this complicated.</h2><p>Too many businesses are running a serious operation through a trail of DMs, transfers, screenshots, spreadsheets, and questions that should have one clear answer.</p></div><div className="about-pain-grid"><div className="about-pain"><mark>DM</mark><strong>How much?</strong><span>Every product becomes a conversation.</span></div><div className="about-pain"><mark>TRANSFER</mark><strong>What's your account number?</strong><span>Payment details get buried in chat.</span></div><div className="about-pain"><mark>FOLLOW UP</mark><strong>Has my order been sent?</strong><span>Updates depend on memory and manual replies.</span></div><div className="about-pain"><mark>DISCOVERY</mark><strong>Can I see your products?</strong><span>Your catalogue is scattered across posts.</span></div></div><div className="about-reframe"><h3>Unbley brings the selling experience together.</h3><p>Your products, payments, orders, and customer experience belong in one dependable place. Not because social media is bad - because your business is ready for more structure behind it.</p></div></div></section>
          <section className="about-section"><div className="about-wrap"><div className="about-capabilities-head"><div><span className="about-label">What Unbley does</span><h2>One place to run your online store.</h2></div><p>Unbley turns the important parts of selling online into a system that feels clear from the first product to the next order.</p></div><div className="about-capability-grid">{capabilityItems.map(({ icon, title, text }) => <article className="about-capability" key={title}><div className="about-capability-icon">{React.createElement(icon, { size: 19 })}</div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
          <section className="about-section wash"><div className="about-wrap about-belief"><div className="about-belief-copy"><span className="about-label">Why we built Unbley</span><h2>We believe African businesses deserve better.</h2><p>Talented business owners are already building serious brands through social media. But a serious business needs infrastructure behind it: a professional storefront, online payments, order management, a better customer experience, and the credibility to match the work.</p><p style={{ marginTop: 18 }}>Unbley is being built to make that next step feel possible.</p></div><div className="about-credibility"><div className="about-credibility-card"><Globe2 size={19} /><strong>Professional storefront</strong><span>A home for your brand beyond the feed.</span></div><div className="about-credibility-card"><CreditCard size={19} /><strong>Online payments</strong><span>A clearer way for customers to complete a purchase.</span></div><div className="about-credibility-card"><Layers3 size={19} /><strong>Order management</strong><span>Less chasing. More visibility into what happens next.</span></div><div className="about-credibility-card"><Check size={19} /><strong>Business credibility</strong><span>Give the quality of your work a proper digital home.</span></div></div></div></section>
          <section className="about-section dark"><div className="about-wrap"><span className="about-label" style={{ color: '#D2A77B' }}>The Unbley philosophy</span><h2 style={{ color: '#FFF9F3' }}>Simple enough to start. Powerful enough to grow.</h2><div className="about-principles">{principleItems.map(([number, title, text]) => <article className="about-principle" key={number}><b>{number}</b><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
          <section className="about-section dark" style={{ paddingTop: 0 }}><div className="about-wrap about-vision"><div><span className="about-label" style={{ color: '#D2A77B' }}>The vision</span><h2>We're building the infrastructure behind Africa's next generation of businesses.</h2><p>Unbley starts by helping businesses get online and sell professionally. Over time, the opportunity is bigger: connecting stores, payments, orders, customers, logistics, and intelligence into infrastructure businesses can grow with.</p><span className="about-built">Built in Nigeria. Designed for Africa.</span></div><div className="about-ecosystem">{ecosystemItems.map(([icon, label]) => <div className="about-ecosystem-item" key={label}>{React.createElement(icon, { size: 18 })}<span>{label}</span></div>)}</div></div></section>
          <section className="about-cta"><div className="about-wrap"><span className="about-label">Start with what you sell</span><h2>Your business is ready for more.</h2><p>Turn your brand into a business customers can buy from, trust and come back to.</p><a href="/create-online-store">Get Started <ArrowRight size={17} /></a><small>Own your store. Sell with confidence.</small></div></section>
        </main>
        <Footer />
      </PageTransition>
    </>
  );
}
