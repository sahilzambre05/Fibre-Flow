import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowDown, ArrowRight, ArrowUp, Bot, Check, CheckCircle2,
  ChevronRight, Clock3, Factory, Gauge, History, Layers3, Menu, Minus, Pause, Play,
  RefreshCw, RotateCcw, Settings2, ShieldCheck, Sparkles, Thermometer, Trash2, TrendingUp, X, Zap
} from 'lucide-react';
import './App.css';

const DEFAULT = { currentGrade: '80', targetGrade: '120', basisWeight: '82.3', stockFlow: '42.0', steamPressure: '61.5', machineSpeed: '497.0', moisture: '5.1', ash: '2.2', fillerFlow: '11.0' };
const PRESETS = [
  { name: 'Standard', caption: '80 → 120 GSM', data: DEFAULT },
  { name: 'High speed', caption: '60 → 90 GSM', data: { currentGrade: '60', targetGrade: '90', basisWeight: '64.5', stockFlow: '38', steamPressure: '55', machineSpeed: '530', moisture: '4.8', ash: '1.8', fillerFlow: '9.5' } },
  { name: 'Packaging', caption: '100 → 150 GSM', data: { currentGrade: '100', targetGrade: '150', basisWeight: '105', stockFlow: '51.5', steamPressure: '74', machineSpeed: '440', moisture: '5.9', ash: '3.1', fillerFlow: '14.2' } }
];
const fieldInfo = [
  ['currentGrade', 'Current grade', 'GSM'], ['targetGrade', 'Target grade', 'GSM'], ['basisWeight', 'Basis weight', 'g/m²'], ['stockFlow', 'Stock flow', 'L/min'], ['steamPressure', 'Steam pressure', 'kPa'], ['machineSpeed', 'Machine speed', 'm/min'], ['moisture', 'Moisture', '%'], ['ash', 'Ash content', '%'], ['fillerFlow', 'Filler flow', 'L/min']
];
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export default function App() {
  const [form, setForm] = useState(DEFAULT);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [activeTab, setActiveTab] = useState('recommendations');
  const [history, setHistory] = useState([]);
  const [timeIndex, setTimeIndex] = useState(4);
  const [simulation, setSimulation] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [online, setOnline] = useState({ api: false, spring: false });
  const [checklist, setChecklist] = useState({ steam: true, stock: true, scanner: true, filler: false, safety: true });

  const predict = useCallback(async (values) => {
    setLoading(true); setNotice('');
    const payload = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Number(value) || 0]));
    try {
      let response = await fetch(`${API_BASE}/api/grade-change/predict`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => null);
      if (!response?.ok) response = await fetch('http://localhost:8000/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => null);
      let result;
      if (response?.ok) result = await response.json();
      else {
        const delta = payload.targetGrade - payload.currentGrade;
        result = { nextBasisWeight: +(payload.basisWeight * (1 + delta * .002)).toFixed(2), nextStockFlow: +(payload.stockFlow * (1 + delta * .0015)).toFixed(2), nextSteamPressure: +(payload.steamPressure * 1.01).toFixed(2), nextMachineSpeed: +(payload.machineSpeed * .995).toFixed(2), nextMoisture: +(payload.moisture * .99).toFixed(2), nextAsh: +(payload.ash * 1.01).toFixed(2), nextFillerFlow: +(payload.fillerFlow * .98).toFixed(2), modelConfidence: 98.5, estimatedTransitionTimeMinutes: Math.round(10 + Math.abs(delta) * .25) };
        setNotice('Simulation mode is active while the live AI service is unavailable.');
      }
      setPrediction(result);
      setHistory(old => [{ id: Date.now(), time: new Date().toLocaleTimeString(), from: payload.currentGrade, to: payload.targetGrade, confidence: result.modelConfidence, duration: result.estimatedTransitionTimeMinutes }, ...old].slice(0, 10));
    } catch { setNotice('The prediction service could not be reached. Please try again.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { predict(DEFAULT); }, [predict]);
  useEffect(() => {
    const testHealth = async () => {
      const [fast, spring] = await Promise.all([fetch(import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8000/').catch(() => null), fetch(`${API_BASE}/api/grade-change/health`).catch(() => null)]);
      setOnline({ api: Boolean(fast?.ok), spring: Boolean(spring?.ok) });
    };
    testHealth(); const timer = setInterval(testHealth, 10000); return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!simulation) return undefined;
    const timer = setInterval(() => setProgress(value => { if (value >= 100) { setSimulation(false); return 100; } return value + 5; }), 250);
    return () => clearInterval(timer);
  }, [simulation]);

  const trajectory = useMemo(() => {
    if (!prediction) return [];
    const ratio = timeIndex / 4;
    return [['Basis weight', form.basisWeight, prediction.nextBasisWeight, 'g/m²'], ['Stock flow', form.stockFlow, prediction.nextStockFlow, 'L/min'], ['Steam pressure', form.steamPressure, prediction.nextSteamPressure, 'kPa'], ['Machine speed', form.machineSpeed, prediction.nextMachineSpeed, 'm/min'], ['Moisture', form.moisture, prediction.nextMoisture, '%'], ['Ash content', form.ash, prediction.nextAsh, '%'], ['Filler flow', form.fillerFlow, prediction.nextFillerFlow, 'L/min']].map(([label, current, target, unit]) => ({ label, unit, value: (+current + (+target - +current) * ratio).toFixed(2) }));
  }, [form, prediction, timeIndex]);
  const handleSubmit = event => { event.preventDefault(); setProgress(0); predict(form); };
  const applyPreset = preset => { setForm(preset.data); predict(preset.data); };
  const phase = progress < 34 ? 1 : progress < 67 ? 2 : 3;

  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <a className="brand" href="#top"><span><Factory size={22} /></span><b>FIBRE<span>FLOW</span></b></a>
      <p className="sidebar-label">WORKSPACE</p>
      <nav><a className="active" href="#dashboard"><Layers3 size={18} /> Grade change hub</a><a href="#history"><History size={18} /> Transition history</a><a href="#setup"><ShieldCheck size={18} /> Operator readiness</a><a href="#settings"><Settings2 size={18} /> System settings</a></nav>
      <div className="sidebar-bottom"><div className="support"><Bot size={18} /><span><b>FibreFlow Assist</b><small>AI operations support</small></span><i /></div><p>© 2026 FibreFlow Systems</p></div>
    </aside>
    <main className="main-content" id="top">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button><div><p className="crumb">OPERATIONS / GRADE CHANGE</p><h1>Grade change command centre</h1></div><div className="system-status"><span><i className={online.api ? 'live' : ''} /> AI engine {online.api ? 'online' : 'standby'}</span><span><i className={online.spring ? 'live' : ''} /> Plant gateway {online.spring ? 'online' : 'standby'}</span><div className="avatar">SA</div></div></header>
      <section className="page-intro"><div><p className="eyebrow">INTELLIGENT PRODUCTION CONTROL</p><h2>Move to the next grade with confidence.</h2><p>Set the machine state, generate a recommendation, and guide each phase of the transition from one place.</p></div><div className="intro-status"><Sparkles size={22} /><span><small>MODEL STATUS</small><b>Ready to optimise</b></span><CheckCircle2 size={19} /></div></section>
      <section className="dashboard" id="dashboard">
        <div className="input-card panel"><div className="panel-heading"><div><p className="eyebrow">01 / DEFINE</p><h3>Machine input</h3></div><button className="icon-button" onClick={() => { setForm(DEFAULT); predict(DEFAULT); }} title="Reset values"><RotateCcw size={17} /></button></div><p className="panel-copy">Choose a saved transition or enter the current machine readings.</p><div className="presets">{PRESETS.map(preset => <button key={preset.name} onClick={() => applyPreset(preset)}><b>{preset.name}</b><span>{preset.caption}</span></button>)}</div><form onSubmit={handleSubmit} className="sensor-form"><div className="input-grid">{fieldInfo.map(([name, label, unit]) => <label key={name}><span>{label}<small>{unit}</small></span><input type="number" step="any" name={name} value={form[name]} onChange={event => setForm({ ...form, [name]: event.target.value })} required /></label>)}</div><button className="run-button" disabled={loading}>{loading ? <Activity className="spin" size={18} /> : <Sparkles size={18} />}{loading ? 'Building your plan…' : 'Generate transition plan'}<ArrowRight size={18} /></button></form>{notice && <p className="notice"><AlertTriangle size={16} /> {notice}</p>}</div>
        <div className="plan-column"><div className="prediction-summary"><div><p className="eyebrow">02 / RECOMMEND</p><h3>Optimised transition</h3><p>AI-guided targets for this production run.</p></div>{prediction && <div className="grade-chip"><span>CURRENT</span><b>{form.currentGrade}</b><ArrowRight size={16} /><b>{form.targetGrade}</b><span>TARGET GSM</span></div>}</div><div className="summary-stats"><div><Clock3 /><span><small>Estimated time</small><b>{prediction?.estimatedTransitionTimeMinutes ?? '—'} min</b></span></div><div><TrendingUp /><span><small>Model confidence</small><b>{prediction?.modelConfidence ?? '—'}%</b></span></div><div><Activity /><span><small>Transition state</small><b>Ready</b></span></div></div><div className="tabs"><button className={activeTab === 'recommendations' ? 'active' : ''} onClick={() => setActiveTab('recommendations')}>Recommendations</button><button className={activeTab === 'trajectory' ? 'active' : ''} onClick={() => setActiveTab('trajectory')}>Trajectory</button><button className={activeTab === 'setup' ? 'active' : ''} onClick={() => setActiveTab('setup')}>Setup guide</button></div>
        {activeTab === 'recommendations' && <Recommendations prediction={prediction} form={form} />}
        {activeTab === 'trajectory' && <Trajectory values={trajectory} index={timeIndex} setIndex={setTimeIndex} />}
        {activeTab === 'setup' && <Setup checklist={checklist} setChecklist={setChecklist} prediction={prediction} />}
        </div>
      </section>
      <section className="transition panel"><div className="transition-head"><div><p className="eyebrow">03 / EXECUTE</p><h3>Transition control</h3><p>Run the phase simulation to review the recommended sequence.</p></div><button className="simulate" onClick={() => { if (progress === 100) setProgress(0); setSimulation(!simulation); }}>{simulation ? <><Pause size={16} /> Pause simulation</> : <><Play size={16} /> {progress ? 'Resume simulation' : 'Start simulation'}</>}</button></div><div className="progress-line"><span style={{ width: `${progress}%` }} /></div><div className="phase-grid"><Phase num="01" title="Dosing & flow" text={`Set stock flow to ${prediction?.nextStockFlow ?? '—'} L/min and filler flow to ${prediction?.nextFillerFlow ?? '—'} L/min.`} active={phase === 1} done={progress > 33} /><Phase num="02" title="Thermal & speed" text={`Synchronise steam at ${prediction?.nextSteamPressure ?? '—'} kPa with ${prediction?.nextMachineSpeed ?? '—'} m/min speed.`} active={phase === 2} done={progress > 66} /><Phase num="03" title="Quality stabilisation" text={`Lock the QCS loop at ${prediction?.nextBasisWeight ?? '—'} g/m² and ${prediction?.nextMoisture ?? '—'}% moisture.`} active={phase === 3} done={progress === 100} /></div></section>
      <section className="history-panel panel" id="history"><div className="panel-heading"><div><p className="eyebrow">RECENT ACTIVITY</p><h3>Transition history</h3></div>{history.length > 0 && <button className="text-action" onClick={() => setHistory([])}><Trash2 size={15} /> Clear history</button>}</div>{history.length ? <div className="history-table"><div className="table-header"><span>Time</span><span>Grade change</span><span>Duration</span><span>Confidence</span><span>Status</span></div>{history.map(item => <div className="table-row" key={item.id}><span>{item.time}</span><span><b>{item.from}</b> <ArrowRight size={13} /> <b>{item.to}</b> GSM</span><span>{item.duration} min</span><span>{item.confidence}%</span><span className="complete"><Check size={14} /> Plan generated</span></div>)}</div> : <div className="empty-history"><History size={25} /><p>No grade changes recorded yet.</p></div>}</section>
    </main>
  </div>;
}

function Recommendations({ prediction, form }) {
  const entries = [['Basis weight', 'basisWeight', 'nextBasisWeight', 'g/m²', Gauge], ['Stock flow', 'stockFlow', 'nextStockFlow', 'L/min', Activity], ['Steam pressure', 'steamPressure', 'nextSteamPressure', 'kPa', Thermometer], ['Machine speed', 'machineSpeed', 'nextMachineSpeed', 'm/min', Zap], ['Moisture', 'moisture', 'nextMoisture', '%', Activity], ['Ash content', 'ash', 'nextAsh', '%', Layers3], ['Filler flow', 'fillerFlow', 'nextFillerFlow', 'L/min', Gauge]];
  return <div className="recommendations-grid">{entries.map(([label, currentKey, targetKey, unit, Icon]) => { const current = +form[currentKey]; const target = +(prediction?.[targetKey] ?? current); const delta = target - current; const Arrow = delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : Minus; return <article className="recommendation" key={label}><div className="rec-top"><span className="rec-icon"><Icon size={18} /></span><span className={`delta ${delta > 0 ? 'up' : delta < 0 ? 'down' : ''}`}><Arrow size={13} />{delta > 0 ? '+' : ''}{delta.toFixed(2)}</span></div><h4>{label}</h4><p>{unit}</p><div className="value-line"><span><small>Current</small>{current}</span><ArrowRight size={15} /><b><small>Recommended</small>{target}</b></div></article>; })}</div>;
}
function Trajectory({ values, index, setIndex }) { const labels = ['Now', '+5 min', '+10 min', '+15 min', 'Target']; return <div className="trajectory"><div className="time-selector">{labels.map((label, i) => <button key={label} className={i === index ? 'active' : ''} onClick={() => setIndex(i)}>{label}</button>)}</div><div className="trajectory-grid">{values.map(item => <article key={item.label}><span>{item.label}</span><b>{item.value}</b><small>{item.unit}</small></article>)}</div></div>; }
function Setup({ checklist, setChecklist, prediction }) { const steps = [['steam', 'Steam dryer header', `Header pressure is ready for the ${prediction?.nextSteamPressure ?? '—'} kPa ramp.`], ['stock', 'Dilution stock line', `Flow limit is prepared for ${prediction?.nextStockFlow ?? '—'} L/min.`], ['scanner', 'Quality scanner', 'Basis weight and moisture scanner is calibrated.'], ['filler', 'Filler dosing pump', `Filler line is cleared for ${prediction?.nextFillerFlow ?? '—'} L/min.`], ['safety', 'Operator safety lock', 'Required operator checks are complete.']]; return <div className="setup-guide"><div><h4>Pre-flight checklist</h4><p>Confirm each condition before starting the transition.</p></div>{steps.map(([key, title, text]) => <button className={`check-item ${checklist[key] ? 'checked' : ''}`} key={key} onClick={() => setChecklist({ ...checklist, [key]: !checklist[key] })}><span>{checklist[key] && <Check size={14} />}</span><div><b>{title}</b><small>{text}</small></div></button>)}</div>; }
function Phase({ num, title, text, active, done }) { return <article className={`phase ${active ? 'active' : ''} ${done ? 'done' : ''}`}><span className="phase-number">{done ? <Check size={15} /> : num}</span><h4>{title}</h4><p>{text}</p><b>{active ? 'In progress' : done ? 'Complete' : 'Pending'}</b></article>; }