import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Home, ClipboardList, Camera, Building2, Utensils, Megaphone, Users, LogOut, ArrowUp, Clock, CheckCircle2, Phone, ChevronDown, Lock, Globe, Package, Wrench, UserCheck, Check, Send, AlertCircle, HelpCircle, Search, Plus, X, Trash2, Crop, Maximize2 } from 'lucide-react';
import { api } from './api';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const BLUE = '#2F6FED', INK = '#111827', SUB = '#6B7280', BORDER = '#E5E7EB', BG = '#F7F8FA', BLUE_SOFT = '#EEF3FE', GREEN = '#16A34A', AMBER = '#D97706', RED = '#DC2626', RED_SOFT = '#FCEAEA';
const COMMUNAL_DEPARTMENTS = ['Mess', 'Living Room', 'Laundry', 'Study Hall', 'Outside Area', 'Common Restroom', 'Lift'];
const ROOM_DEPARTMENTS = ['Attached Restroom', 'Electrical & Lights', 'Carpentry & Furniture', 'Room Fixtures / Doors'];
const DEPARTMENTS = COMMUNAL_DEPARTMENTS;
const FLOORS = Array.from({ length: 9 }, (_, i) => i); const floorLabel = f => f === 0 ? 'Ground' : `Floor ${f}`;
const STUDENTS = [
  { name: 'Nija K', email: '24z202@psgitech.ac.in', room: '214' },
  { name: 'Navina M', email: '24z200@psgitech.ac.in', room: '201' },
  { name: 'Nethrshri S', email: '24z201@psgitech.ac.in', room: '202' },
  { name: 'Kavinaya S', email: '24z173@psgitech.ac.in', room: '203' },
  { name: 'Poojashri V', email: '24z211@psgitech.ac.in', room: '204' },
  { name: 'Prathiksha N', email: '24z216@psgitech.ac.in', room: '205' }
];
const WARDENS = [
  { name: 'Puvaneshwari', role: 'Hostel Warden', phone: '+91 98765 43220', email: 'puvaneshwari@psgitech.ac.in' },
  { name: 'Jeyashree', role: 'Hostel Warden', phone: '+91 98765 43224', email: 'jeyashree@psgitech.ac.in' }
];
const SUPERVISORS = [
  { name: 'Indra', role: 'Block A & B', phone: '+91 98765 43221', email: 'supervisor1@psgitech.ac.in' },
  { name: 'Thangam', role: 'Block C & Services', phone: '+91 98765 43222', email: 'supervisor2@psgitech.ac.in' },
  { name: 'Archana', role: 'Mess & Common', phone: '+91 98765 43223', email: 'supervisor3@psgitech.ac.in' }
];
const TECHNICIANS = [
  { role: 'Plumber', name: 'Raghavan S', phone: '+91 98765 43211' },
  { role: 'Electrician', name: 'Murugan K', phone: '+91 98765 43210' },
  { role: 'Carpenter', name: 'Vijay R', phone: '+91 98765 43212' },
  { role: 'Mess Maintenance', name: 'Mess Office', phone: '+91 98765 43213' },
  { role: 'Health & Sanitation', name: 'Health Centre', phone: '+91 98765 43214' },
  { role: 'Security & Physical Works', name: 'Security Desk', phone: '+91 98765 43215' }
];
const iconMap = { Dashboard: Home, Feed: ClipboardList, 'Report Issue': Camera, Parcels: Package, 'Parcel Desk': Package, 'Work Queue': Wrench, 'Guest Rooms': Building2, 'Mess Menu': Utensils, Announcements: Megaphone, 'Issue Queue': ClipboardList, 'Guest Requests': Building2, Directory: Phone, 'Lost & Found': HelpCircle };

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

function resolveImage(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  const clean = url.startsWith('/') ? url : `/${url}`;
  return `${BACKEND_ORIGIN}${clean}`;
}

function ImageModal({ photoUrl, onClose }) {
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoadError(false);
    setLoading(true);
  }, [photoUrl]);

  if (!photoUrl) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-4 py-3 bg-gray-900 text-white flex items-center justify-between">
          <span className="text-sm font-semibold flex items-center gap-2">
            <Camera size={16} /> Attached Photo Preview
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-1 rounded-lg hover:bg-gray-800"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="relative p-4 bg-gray-950 flex items-center justify-center min-h-[280px]">
          {loading && !loadError && (
            <div className="text-gray-400 text-sm flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
              Loading photo…
            </div>
          )}
          {loadError ? (
            <div className="text-center py-8 px-4 text-gray-400">
              <Camera size={36} className="mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-medium">Unable to load photo preview.</p>
              <a
                href={photoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-xs text-blue-400 hover:underline"
              >
                Open image directly
              </a>
            </div>
          ) : (
            <img
              src={photoUrl}
              alt="Enlarged issue preview"
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setLoadError(true); }}
              className={`max-h-[75vh] max-w-full w-auto object-contain rounded-lg transition-opacity duration-200 ${loading ? 'opacity-0 h-0 w-0' : 'opacity-100'}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(() => { try { return JSON.parse(localStorage.getItem('cc_user')) || null } catch { return null } });
  const [role, setRole] = useState(() => {
    try {
      const r = JSON.parse(localStorage.getItem('cc_user'))?.role?.toLowerCase();
      if (r === 'supervisor') return 'supervisor';
      if (r === 'warden' || r === 'staff') return 'warden';
      return 'student';
    } catch { return 'student' }
  });
  const [page, setPage] = useState(() => role === 'supervisor' ? 'tasks' : 'dashboard');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const login = async (email, password) => {
    setLoading(true); setLoginError('');
    try {
      const x = await api.login(email, password);
      localStorage.setItem('cc_token', x.token);
      localStorage.setItem('cc_user', JSON.stringify(x));
      setSession(x);
      const r = (x.role || '').toLowerCase();
      const detectedRole = r === 'supervisor' ? 'supervisor' : (r === 'warden' || r === 'staff') ? 'warden' : 'student';
      setRole(detectedRole);
      setPage(detectedRole === 'supervisor' ? 'tasks' : 'dashboard');
    } catch (e) { setLoginError(e.message) }
    finally { setLoading(false) }
  };
  const logout = () => { localStorage.removeItem('cc_token'); localStorage.removeItem('cc_user'); setSession(null); setPage('dashboard') };
  if (!session) return <Login role={role} setRole={setRole} onLogin={login} loading={loading} error={loginError} />;
  const nav = role === 'student' ? [
    ['dashboard', 'Dashboard'], ['feed', 'Feed'], ['lostFound', 'Lost & Found'], ['report', 'Report Issue'], ['parcels', 'Parcels'], ['guestRooms', 'Guest Rooms'], ['mess', 'Mess Menu'], ['announcements', 'Announcements'], ['directory', 'Directory']
  ] : role === 'warden' ? [
    ['dashboard', 'Dashboard'], ['queue', 'Issue Queue'], ['guestRequests', 'Guest Requests'], ['mess', 'Mess Menu'], ['announcements', 'Announcements'], ['directory', 'Directory']
  ] : [
    ['tasks', 'Work Queue'], ['parcels', 'Parcel Desk'], ['announcements', 'Announcements'], ['mess', 'Mess Menu'], ['directory', 'Directory']
  ];
  return <div className="min-h-screen flex bg-[#F7F8FA] text-[#111827]"><Sidebar nav={nav} page={page} setPage={setPage} logout={logout} /><main className="flex-1 min-w-0 px-8 py-8 overflow-y-auto"><PageRenderer page={page} role={role} session={session} setPage={setPage} /></main></div>
}

function Login({ role, setRole, onLogin, loading, error }) {
  const [email, setEmail] = useState(''), [password, setPassword] = useState('');
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, [role]);

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-6 text-white bg-cover bg-center"
      style={{
        backgroundImage: "url('/campus-hostel.png')",
        backgroundPosition: 'center 40%',
        backgroundSize: 'cover'
      }}
    >
      {/* Dark overlay to preserve clarity while making text readable without gradients */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Center Glassmorphic Login Card matching reference image */}
      <div className="relative z-10 w-full max-w-[490px] backdrop-blur-md bg-black/30 border border-white/25 rounded-3xl p-7 sm:p-10 shadow-2xl">
        {/* Title above Login */}
        <h2
          className="text-[26px] font-medium text-[#93C5FD] text-center tracking-wide mb-1 drop-shadow-sm"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          HostelCare
        </h2>

        {/* Title in serif font like reference */}
        <h1
          className="text-[44px] font-normal text-white text-center mb-5 tracking-wide drop-shadow-md"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Login
        </h1>

        {/* Role Selector Tabs (Student / Warden / Supervisor) */}
        <div className="flex bg-black/25 p-1 rounded-full border border-white/20 mb-6 backdrop-blur-sm">
          {[
            { id: 'student', label: 'Student' },
            { id: 'warden', label: 'Warden' },
            { id: 'supervisor', label: 'Supervisor' }
          ].map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold tracking-wide transition ${role === r.id
                ? 'bg-[#2F6FED] text-white shadow-md'
                : 'text-white/80 hover:text-white'
                }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Form Fields */}
        <form onSubmit={e => { e.preventDefault(); onLogin(email, password) }} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-white text-sm font-medium mb-1.5 drop-shadow-sm">
              Email Address
            </label>
            <input
              className="w-full bg-white text-gray-900 rounded-lg px-4 py-3 text-[15px] outline-none shadow-sm focus:ring-2 focus:ring-[#2F6FED] transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-white text-sm font-medium drop-shadow-sm">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Demo credentials password is: password123')}
                className="text-xs text-white/80 hover:text-white underline transition drop-shadow-sm"
              >
                Forgot Password?
              </button>
            </div>
            <input
              className="w-full bg-white text-gray-900 rounded-lg px-4 py-3 text-[15px] outline-none shadow-sm focus:ring-2 focus:ring-[#2F6FED] transition"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-xs bg-red-500/30 border border-red-400/50 text-red-100 px-3 py-2 rounded-lg mt-2">
              {error}
            </p>
          )}

          {/* Login Button - Solid Clean Blue (No Gradients) */}
          <div className="flex justify-center pt-3">
            <button
              disabled={loading}
              className="w-full sm:w-auto min-w-[210px] px-10 py-3.5 rounded-full bg-[#2F6FED] hover:bg-[#1D4ED8] text-white font-medium tracking-wider text-sm shadow-md uppercase transition active:scale-95 disabled:opacity-60"
            >
              {loading ? 'LOGGING IN…' : 'LOGIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Sidebar({ nav, page, setPage, logout }) { return <aside className="w-[300px] shrink-0 bg-white border-r border-[#E5E7EB] min-h-screen flex flex-col px-5 py-6"><div className="px-3 mb-8"><p className="text-[25px] font-semibold">Campus Care</p></div><nav className="space-y-1 flex-1">{nav.map(([id, label]) => { const Icon = iconMap[label] || Home; const active = page === id; return <button key={id} onClick={() => setPage(id)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[17px] font-medium transition ${active ? 'text-[#2F6FED] bg-[#EEF3FE]' : 'text-[#6B7280] hover:bg-gray-50'}`}><Icon size={21} />{label}</button> })}</nav><button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3.5 text-[17px] text-[#6B7280]"><LogOut size={21} />Sign out</button></aside> }
function PageRenderer({ page, role, session, setPage }) { const props = { role, session, setPage }; switch (page) { case 'dashboard': return role === 'student' ? <StudentDashboard {...props} /> : role === 'warden' ? <StaffDashboard {...props} /> : <SupervisorTasks {...props} />; case 'tasks': return <SupervisorTasks {...props} />; case 'feed': return <Feed {...props} />; case 'report': return <Report {...props} />; case 'lostFound': return role === 'student' ? <LostFound {...props} /> : role === 'warden' ? <StaffDashboard {...props} /> : <SupervisorTasks {...props} />; case 'parcels': return role === 'student' ? <StudentParcels {...props} /> : role === 'supervisor' ? <StaffParcelDesk {...props} /> : <IssueQueue {...props} />; case 'guestRooms': return <GuestRooms {...props} />; case 'mess': return <MessMenu {...props} />; case 'announcements': return <Announcements {...props} />; case 'queue': return <IssueQueue {...props} />; case 'guestRequests': return <GuestRequests {...props} />; case 'directory': return <Directory {...props} />; default: return role === 'supervisor' ? <SupervisorTasks {...props} /> : role === 'warden' ? <StaffDashboard {...props} /> : <StudentDashboard {...props} /> } }
function Header({ title, sub }) { return <div className="mb-7"><h1 className="text-[29px] font-semibold tracking-[-0.02em]">{title}</h1>{sub && <p className="text-[18px] text-[#6B7280] mt-1">{sub}</p>}</div> }
function Card({ title, children, className = '' }) { return <section className={`bg-white border border-[#E5E7EB] rounded-2xl p-7 ${className}`}><h2 className="text-[19px] font-semibold mb-5">{title}</h2>{children}</section> }
function Stat({ icon: Icon, color, value, label }) { return <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 min-h-[145px]"><div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: color + '18' }}><Icon size={22} style={{ color }} /></div><p className="text-[27px] font-semibold leading-none">{value}</p><p className="text-[17px] mt-3">{label}</p></div> }
function Field({ label, children }) { return <div><label className="block text-[16px] font-medium mb-2.5">{label}</label>{children}</div> }
function Status({ children }) { const key = String(children).trim().toLowerCase().replaceAll('_', ' '), labels = { reported: 'Reported', 'in progress': 'In Progress', resolved: 'Resolved', pending: 'Pending', approved: 'Approved', rejected: 'Rejected', awaiting: 'Awaiting', 'checked in': 'Checked in', 'checked out': 'Checked out', urgent: 'Urgent' }, label = labels[key] || children, s = { 'Reported': ['#6B7280', '#F3F4F6'], 'In Progress': [AMBER, '#FEF3E2'], Resolved: [GREEN, '#E9F7EE'], Pending: [AMBER, '#FEF3E2'], Approved: [GREEN, '#E9F7EE'], Rejected: [RED, RED_SOFT], Awaiting: [SUB, '#F3F4F6'], 'Checked in': [BLUE, BLUE_SOFT], 'Checked out': [GREEN, '#E9F7EE'], Urgent: [RED, RED_SOFT] }[label] || [SUB, '#F3F4F6']; return <span className="pill" style={{ color: s[0], background: s[1] }}>{label}</span> }
function Tag({ children }) { return <span className="tag">{children}</span> }
function Stars({ value, interactive = false, onChange }) { return <div className="flex gap-1" role={interactive ? 'radiogroup' : undefined} aria-label={interactive ? 'Select rating' : `Rating ${value} out of 5`}>{[1, 2, 3, 4, 5].map(star => <button key={star} type="button" disabled={!interactive} onClick={() => onChange?.(star)} aria-label={`${star} star${star > 1 ? 's' : ''}`} className={`text-[28px] leading-none ${interactive ? 'cursor-pointer' : 'cursor-default'} ${star <= value ? 'text-[#F59E0B]' : 'text-[#CBD5E1]'}`}>{star <= value ? '★' : '☆'}</button>)}</div> }
function FeedbackThanks({ feedback }) {
  return (
    <div className="mt-4 border border-[#A7F3D0] rounded-xl p-4 bg-[#F0FDF4] flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-[#166534] flex items-center gap-1.5">
          <span>✓ Feedback recorded</span>
        </p>
        {feedback?.comment && <p className="text-sm text-[#374151] mt-1 italic">"{feedback.comment}"</p>}
      </div>
      <Stars value={feedback?.rating || 5} />
    </div>
  );
}
function FeedbackForm({ issue, onSubmitted }) { const [rating, setRating] = useState(0), [comment, setComment] = useState(''), action = useAction(); const submit = async () => { if (!rating) return; const succeeded = await action.run(async () => { await api.submitFeedback(issue.id, { rating, comment }); await onSubmitted() }); if (succeeded) setComment('') }; return <div className="mt-5 border border-[#E5E7EB] rounded-xl p-5 bg-[#FBFDFF]"><p className="font-semibold text-[17px] mb-3">How was your issue handled?</p><Stars value={rating} interactive onChange={setRating} /><label className="block text-[15px] font-medium mt-4 mb-2">Tell us more (optional)</label><textarea className="input min-h-[90px]" value={comment} onChange={e => setComment(e.target.value)} /><ActionError error={action.error} /><button type="button" disabled={!rating || action.pending} onClick={submit} className="primary mt-3 disabled:opacity-50">{action.pending ? 'Submitting...' : 'Submit Feedback'}</button></div> }
function FeedbackSummary({ feedback }) { return <Card title="Feedback from resolved issues" className="mt-5"><div className="flex flex-wrap items-start gap-8"><div><p className="text-[27px] font-semibold">{feedback.average.toFixed(1)} / 5</p><p className="text-[15px] text-[#6B7280]">Average rating · {feedback.total} response{feedback.total === 1 ? '' : 's'}</p></div><div className="space-y-2">{[5, 4, 3, 2, 1].map(r => <div key={r} className="flex items-center gap-3 text-[15px]"><span className="w-[70px]">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span><span className="text-[#6B7280]">{feedback.counts[r] || 0}</span></div>)}</div></div>{feedback.recent.length > 0 && <div className="mt-5 border-t border-[#E5E7EB] pt-4 space-y-3">{feedback.recent.slice(0, 3).map(item => <div key={item.id} className="flex flex-wrap items-start justify-between gap-3 text-[15px]"><div><p className="font-medium">Issue #{item.issueId} · {item.student}</p>{item.comment && <p className="text-[#6B7280] mt-1">{item.comment}</p>}</div><Stars value={item.rating} /></div>)}</div>}</Card> }

function StudentDashboard({ session, setPage }) {
  const request = useRequest(() => Promise.all([api.studentDash(), api.parcels(), api.mess(), api.announcements(), api.issues()]), []);
  const action = useAction();
  const [previewPhoto, setPreviewPhoto] = useState(null);
  if (request.loading || request.error) return <><div className="mb-6"><h1 className="text-[28px] font-bold text-[#111827]">Dashboard</h1><p className="text-sm text-[#6B7280]">Welcome, {session.name}</p></div><RequestState loading={request.loading} error={request.error} onRetry={request.reload} /></>;
  const [dash, parcels, messItems, announcements, issues] = request.data;
  const waitingParcels = (parcels || []).filter(p => p.status === 'WAITING_PICKUP');
  const myIssues = (issues || []).filter(i => i.author === session.name || (i.room && String(i.room) === String(dash.room)));

  const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  const todayShort = daysMap[now.getDay()];
  const todayFullDay = dayNamesFull[now.getDay()];

  const todayMeals = (messItems || []).filter(m => m.dayOfWeek === todayShort);
  const hour = now.getHours();
  const currentMealName = hour < 9 ? 'Breakfast' : (hour < 15 ? 'Lunch' : (hour < 18 ? 'Snacks' : 'Dinner'));

  return <div className="max-w-[1080px] space-y-6">
    {/* Top Header */}
    <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">Welcome, {session.name}</h1>
          <span className="px-3.5 py-1 rounded-xl bg-[#EEF3FE] text-[#2F6FED] border border-[#BFDBFE] text-xs font-semibold tracking-wide">
            Room {dash.room} · Floor {dash.floor}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <button onClick={() => setPage('report')} className="primary !bg-[#2F6FED] hover:!bg-[#1D4ED8] !py-2.5 !px-5 text-sm font-semibold flex items-center gap-2 shadow-sm text-white transition">
          <span>+ Report Room Issue</span>
        </button>
      </div>
    </div>

    <ActionError error={action.error} />

    {/* 1. Parcel Pickup Card - Matching #2F6FED / #EEF3FE Palette */}
    {waitingParcels.length > 0 ? (
      <div className="space-y-3">
        {waitingParcels.map(p => (
          <div key={p.id} className="bg-white border border-[#BFDBFE] rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#EEF3FE] text-[#2F6FED] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                <Package size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[16px] text-[#111827]">{p.courier}</span>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-[#EEF3FE] text-[#2F6FED] border border-[#BFDBFE]">#{p.parcelCode}</span>
                  <span className="text-xs font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full">At Gate</span>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">Show OTP to security officer to collect package</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#EEF3FE] border border-[#BFDBFE] px-4 py-2 rounded-xl flex items-center gap-2.5 shadow-sm">
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#2F6FED]">OTP</span>
                <span className="text-[24px] font-mono font-black tracking-widest text-[#2F6FED] leading-none">{p.otp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 text-sm text-[#6B7280]">
        <div className="flex items-center gap-2.5">
          <Package size={18} className="text-[#2F6FED]" />
          <span>No parcels waiting at security gate.</span>
        </div>
        <button onClick={() => setPage('parcels')} className="text-xs font-bold text-[#2F6FED] hover:text-[#1D4ED8]">
          Parcel History →
        </button>
      </div>
    )}

    {/* 2. Today's Mess Menu Widget */}
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
        <h2 className="text-[18px] font-bold text-[#111827] flex items-center gap-2">
          <Utensils size={19} className="text-[#2F6FED]" /> Today's Mess Menu · {todayFullDay}
        </h2>
        <button onClick={() => setPage('mess')} className="text-xs font-bold text-[#2F6FED] hover:text-[#1D4ED8]">
          Full Weekly Schedule →
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3.5 mt-4">
        {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(mealName => {
          const mealData = todayMeals.find(m => m.meal === mealName);
          const isCurrent = mealName === currentMealName;
          const timeRanges = {
            'Breakfast': '7:30 AM – 9:00 AM',
            'Lunch': '12:30 PM – 2:00 PM',
            'Snacks': '4:30 PM – 5:30 PM',
            'Dinner': '7:30 PM – 9:00 PM'
          };
          return (
            <div
              key={mealName}
              className={`rounded-2xl p-4 transition ${isCurrent
                ? 'bg-[#EEF3FE] border-2 border-[#2F6FED] shadow-sm'
                : 'bg-[#F9FAFB] border border-[#E5E7EB]'
                }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-[#2F6FED]' : 'text-[#6B7280]'}`}>
                  {mealName}
                </span>
                {isCurrent && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-[#2F6FED] text-white">
                    Current
                  </span>
                )}
              </div>
              <p className={`text-[11px] mb-2.5 font-medium ${isCurrent ? 'text-[#2F6FED]/80' : 'text-[#9CA3AF]'}`}>
                {timeRanges[mealName]}
              </p>
              <p className={`text-[14px] font-semibold leading-snug ${isCurrent ? 'text-[#111827]' : 'text-[#374151]'}`}>
                {mealData?.items || 'Menu not scheduled'}
              </p>
            </div>
          );
        })}
      </div>
    </div>


    {/* 3. Bottom Row: Notice Board (Left) & My Room Tickets (Right) */}
    <div className="grid grid-cols-5 gap-6">
      {/* Notice Board (3 cols) */}
      <div className="col-span-3 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <Megaphone size={19} className="text-[#2F6FED]" />
            <h2 className="text-[18px] font-bold text-[#111827]">Hostel Notice Board</h2>
          </div>
          <button onClick={() => setPage('announcements')} className="text-xs font-bold text-[#2F6FED] hover:text-[#1D4ED8]">
            All Notices ({announcements?.length || 0}) →
          </button>
        </div>

        {(!announcements || announcements.length === 0) ? (
          <p className="text-sm text-[#6B7280] py-6 text-center">No announcements posted yet.</p>
        ) : (
          <div className="space-y-3.5">
            {announcements.slice(0, 3).map(a => (
              <div key={a.id} className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[15px] text-[#111827]">{a.title}</p>
                    {a.pinned && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EEF3FE] text-[#2F6FED] border border-[#BFDBFE]">
                        PINNED
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#6B7280]">{a.time}</span>
                </div>
                <p className="text-sm text-[#374151] leading-relaxed">{a.message}</p>
                <p className="text-xs font-semibold text-[#6B7280] mt-2">Posted by: {a.author}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Room Tickets (2 cols) */}
      <div className="col-span-2 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#E5E7EB]">
          <Wrench size={19} className="text-[#2F6FED]" />
          <h2 className="text-[18px] font-bold text-[#111827]">My Complaints</h2>
        </div>

        {myIssues.length === 0 ? (
          <div className="py-8 text-center text-[#6B7280]">
            <CheckCircle2 size={32} className="mx-auto mb-2 text-[#9CA3AF]" />
            <p className="text-sm font-semibold text-[#111827]">No active room complaints</p>
            <p className="text-xs mt-1">Everything in your room is in good shape.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myIssues.slice(0, 3).map(issue => (
              <div key={issue.id} className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-[#2F6FED]">{issue.department}</span>
                  <Status>{issue.status}</Status>
                </div>
                <p className="text-sm font-medium text-[#111827] line-clamp-2">{issue.description}</p>

                {issue.photoUrl && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setPreviewPhoto(resolveImage(issue.photoUrl))}
                      className="text-xs text-[#2F6FED] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <Camera size={13} /> View Attached Photo
                    </button>
                  </div>
                )}

                <div className="mt-2.5 pt-2 border-t border-[#E5E7EB] text-xs">
                  {String(issue.status).toUpperCase() === 'RESOLVED' ? (
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Resolved by Warden
                    </span>
                  ) : issue.workCompleted ? (
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <Check size={13} /> Work Done by Supervisor
                    </span>
                  ) : issue.assignedToSupervisor ? (
                    <span className="font-semibold text-amber-700 flex items-center gap-1">
                      <Clock size={13} /> In Progress ({issue.assignedTechnician?.split(' ')[0] || 'Technician'})
                    </span>
                  ) : (
                    <span className="font-semibold text-[#6B7280] flex items-center gap-1">
                      <Clock size={13} /> Awaiting Warden Delegation
                    </span>
                  )}
                </div>

                {String(issue.status).toUpperCase() === 'RESOLVED' && !issue.feedback && (
                  <div className="mt-2">
                    <button onClick={() => setPage('feed')} className="text-xs font-bold text-[#2F6FED] hover:text-[#1D4ED8]">
                      Rate Resolution ★
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    <ImageModal photoUrl={previewPhoto} onClose={() => setPreviewPhoto(null)} />
  </div>;
}
function StaffDashboard({ session, setPage }) {
  const request = useRequest(() => Promise.all([api.staffDash(), api.guests(), api.feedbackSummary(), api.issues()]), []);
  if (request.loading || request.error) return <><Header title="Dashboard" sub={`Welcome, ${session?.name || 'Hostel Warden'}`} /><RequestState loading={request.loading} error={request.error} onRetry={request.reload} /></>;
  const [d, guests, feedback, issues] = request.data;
  const readyForSignoff = issues.filter(i => i.workCompleted && String(i.status).toUpperCase() !== 'RESOLVED').length;
  const inProgress = issues.filter(i => i.assignedToSupervisor && !i.workCompleted && String(i.status).toUpperCase() !== 'RESOLVED').length;
  const data = [{ name: 'Open', value: d.open, color: '#6B7280' }, { name: 'In Progress', value: d.inProgress, color: AMBER }, { name: 'Resolved', value: d.resolved, color: GREEN }];
  return <>
    <Header title="Dashboard" sub={`Welcome, ${session?.name || 'Hostel Warden'}`} />
    {readyForSignoff > 0 && <div className="mb-6 bg-[#ECFDF5] border-2 border-[#6EE7B7] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#059669] text-white flex items-center justify-center shrink-0">
          <CheckCircle2 size={24} />
        </div>
        <div>
          <p className="text-[18px] font-semibold text-[#065F46]">{readyForSignoff} maintenance task{readyForSignoff > 1 ? 's' : ''} completed by Supervisor</p>
          <p className="text-[15px] text-[#047857] mt-0.5">Ready for your final review and sign-off in the Issue Queue.</p>
        </div>
      </div>
      <button onClick={() => setPage('queue')} className="primary !bg-[#059669] hover:!bg-[#047857] !py-2.5 !px-5 whitespace-nowrap text-[15px]">Review & Sign-off →</button>
    </div>}
    <div className="grid grid-cols-4 gap-5 mb-6">
      <Stat icon={ClipboardList} color={RED} value={d.urgent} label="Urgent (15+ votes)" />
      <Stat icon={CheckCircle2} color="#0D9488" value={readyForSignoff} label="Ready for Sign-off" />
      <Stat icon={Clock} color={AMBER} value={inProgress} label="With Supervisor" />
      <Stat icon={CheckCircle2} color={GREEN} value={d.resolved} label="Resolved" />
    </div>
    <div className="grid grid-cols-2 gap-5">
      <Card title="Complaints">
        <div className="flex items-center gap-8">
          <div className="w-[150px] h-[150px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius={45} outerRadius={65} startAngle={90} endAngle={-270} paddingAngle={0}>
                  {data.map(x => <Cell key={x.name} fill={x.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 text-[17px] text-[#6B7280]">
            {data.map(x => <p key={x.name}><span style={{ color: x.color }}>●</span> {x.name} — {x.value}</p>)}
          </div>
        </div>
      </Card>
      <Card title="Guest requests">
        {guests.length === 0 ? <p className="text-sm text-[#6B7280]">No guest requests.</p> :
          <div className="space-y-5">
            {guests.slice(0, 3).map(g => <div key={g.id} className="flex items-center justify-between gap-3">
              <p className="text-[16px]">{g.student}</p>
              <Status>{g.status}</Status>
            </div>)}
          </div>}
      </Card>
    </div>
    <FeedbackSummary feedback={feedback} />
  </>
}

function IssueRow({ issue, staff, onChange, onFeedbackSubmitted, session, busy = false, onPreviewPhoto }) {
  const canReview = session && issue.author === session.name && String(issue.status).toLowerCase() === 'resolved';
  return <div className="py-7 flex gap-5 items-start">
    {issue.isPrivate ? (
      <div className="w-16 h-16 rounded-xl bg-[#EEF3FE] border border-[#DBEAFE] text-[#2F6FED] flex flex-col items-center justify-center gap-0.5 shrink-0" title="Private room request">
        <Lock size={20} />
        <span className="text-[11px] font-bold uppercase tracking-wider">Room</span>
      </div>
    ) : (
      <button disabled={busy} onClick={() => onChange(issue.id)} className={`vote ${issue.voted ? 'vote-active' : ''} disabled:opacity-50`}>
        <ArrowUp size={20} />
        <span>{issue.votes}</span>
      </button>
    )}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <Tag>{issue.department}</Tag>
        <span className="text-[16px] text-[#6B7280]">{issue.location}</span>
        <Status>{issue.status}</Status>
        {issue.urgent && <Status>Urgent</Status>}
      </div>
      <p className="text-[18px]">{issue.description}</p>

      {issue.photoUrl && (
        <div className="mt-3">
          <div
            onClick={() => onPreviewPhoto?.(resolveImage(issue.photoUrl))}
            className="inline-flex items-center gap-3 p-1.5 pr-3.5 rounded-xl border border-[#E5E7EB] bg-gray-50 hover:bg-gray-100 hover:border-[#BFDBFE] cursor-pointer transition group shadow-2xs"
            title="Click to view full photo"
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-200">
              <img
                src={resolveImage(issue.photoUrl)}
                alt="Complaint attachment"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                onError={e => { e.currentTarget.parentElement.parentElement.style.display = 'none'; }}
              />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-[#111827] flex items-center gap-1 group-hover:text-[#2F6FED] transition">
                <Camera size={13} className="text-[#2F6FED]" /> Attached Photo
              </p>
              <p className="text-[11px] text-[#6B7280] mt-0.5 flex items-center gap-1">
                <Maximize2 size={11} /> Click to expand
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="text-[15px] text-[#6B7280] mt-2">{issue.author} · {issue.room} · {issue.time}</p>
      {canReview && (issue.feedback ? <FeedbackThanks feedback={issue.feedback} /> : <FeedbackForm issue={issue} onSubmitted={onFeedbackSubmitted} />)}
    </div>
    {staff && String(issue.status).toUpperCase() !== 'RESOLVED' && <button disabled={staff.busy} onClick={() => staff.resolve(issue.id)} className="text-[#2F6FED] text-[16px] font-medium whitespace-nowrap disabled:opacity-50">{staff.busy ? 'Saving…' : 'Mark resolved'}</button>}
  </div>
}

function useAction() { const [pending, setPending] = useState(false), [error, setError] = useState(''); const run = async task => { setPending(true); setError(''); try { await task(); return true } catch (err) { setError(err.message || 'Request failed.'); return false } finally { setPending(false) } }; return { pending, error, run } }
function ActionError({ error }) { return error ? <p role="alert" className="my-3 text-sm text-red-700">{error}</p> : null }

function Feed({ session }) {
  const request = useRequest(() => api.issues(), []);
  const action = useAction();
  const [filter, setFilter] = useState('public');
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const vote = async id => {
    await action.run(async () => {
      await api.vote(id);
      await request.reload();
    });
  };

  if (request.loading || request.error) return <><Header title="Feed" /><RequestState loading={request.loading} error={request.error} onRetry={request.reload} /></>;

  const allIssues = request.data || [];
  const publicIssues = allIssues.filter(i => !i.isPrivate);
  const myRoomIssues = allIssues.filter(i => i.isPrivate && (i.author === session.name || (i.room && String(i.room) === String(session.roomNumber))));
  const issues = filter === 'public' ? publicIssues : filter === 'room' ? myRoomIssues : allIssues;

  return <>
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-[29px] font-semibold tracking-[-0.02em]">Feed</h1>
        <p className="text-[18px] text-[#6B7280] mt-1">
          {filter === 'room'
            ? 'Maintenance requests for your room'
            : 'Community complaints and your private room tickets'}
        </p>
      </div>
      <div className="flex bg-gray-100 p-1 rounded-xl">
        <button onClick={() => setFilter('public')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'public' ? 'bg-white text-[#2F6FED] shadow-sm font-semibold' : 'text-[#6B7280]'}`}>Community Feed ({publicIssues.length})</button>
        <button onClick={() => setFilter('room')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'room' ? 'bg-white text-[#2F6FED] shadow-sm font-semibold' : 'text-[#6B7280]'}`}>My Room ({myRoomIssues.length})</button>
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'all' ? 'bg-white text-[#2F6FED] shadow-sm font-semibold' : 'text-[#6B7280]'}`}>All ({allIssues.length})</button>
      </div>
    </div>
    <ActionError error={action.error} />
    {issues.length === 0 ? (
      <p className="py-8 text-[16px] text-[#6B7280]">{filter === 'room' ? 'No private room issues submitted yet. You can submit one from Report Issue.' : 'No issues reported yet.'}</p>
    ) : (
      <div className="bg-transparent">
        {issues.map((i, n) => (
          <div key={i.id} className={n ? 'border-t border-[#E5E7EB]' : ''}>
            <IssueRow issue={i} session={session} onFeedbackSubmitted={request.reload} onChange={vote} busy={action.pending} onPreviewPhoto={setPreviewPhoto} />
          </div>
        ))}
      </div>
    )}
    <ImageModal photoUrl={previewPhoto} onClose={() => setPreviewPhoto(null)} />
  </>;
}

function IssueQueue() {
  const request = useRequest(() => api.issues(), []);
  const action = useAction();
  const [filter, setFilter] = useState('active');
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [supervisorSelections, setSupervisorSelections] = useState({});
  const [reassigningId, setReassigningId] = useState(null);

  if (request.loading || request.error) return <><Header title="Issue Queue" sub="Hostel complaints & maintenance" /><RequestState loading={request.loading} error={request.error} onRetry={request.reload} /></>;

  const allIssues = request.data || [];
  const unresolved = allIssues.filter(i => String(i.status).toUpperCase() !== 'RESOLVED');
  const resolved = allIssues.filter(i => String(i.status).toUpperCase() === 'RESOLVED');
  const filtered = filter === 'active' ? unresolved : resolved;

  const handleAssign = async (issueId) => {
    const selected = supervisorSelections[issueId] || `${SUPERVISORS[0].name} (${SUPERVISORS[0].role})`;
    await action.run(async () => {
      await api.assignSupervisor(issueId, { technician: selected, instructions: '' });
      await request.reload();
      setReassigningId(null);
    });
  };

  const handleResolve = async (id) => {
    await action.run(async () => {
      await api.resolveIssue(id);
      await request.reload();
    });
  };

  return <>
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight">Issue Queue</h1>
        <p className="text-[15px] text-[#6B7280] mt-1">
          {filter === 'active' ? `${unresolved.length} active complaints` : `${resolved.length} resolved complaints`}
        </p>
      </div>
      <div className="flex bg-gray-100 p-1 rounded-xl">
        <button onClick={() => setFilter('active')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'active' ? 'bg-white text-[#2F6FED] shadow-sm font-semibold' : 'text-[#6B7280]'}`}>Active ({unresolved.length})</button>
        <button onClick={() => setFilter('resolved')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'resolved' ? 'bg-white text-[#2F6FED] shadow-sm font-semibold' : 'text-[#6B7280]'}`}>Resolved ({resolved.length})</button>
      </div>
    </div>

    <ActionError error={action.error} />

    {filtered.length === 0 ? (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 text-center text-[#6B7280]">
        <CheckCircle2 size={32} className="mx-auto mb-2 text-[#2F6FED] opacity-80" />
        <p className="text-[17px] font-medium text-[#111827]">{filter === 'active' ? 'No pending complaints' : 'No resolved complaints yet'}</p>
        <p className="text-sm mt-1 text-[#6B7280]">{filter === 'active' ? 'All complaints are attended to.' : 'Resolved complaints will appear here.'}</p>
      </div>
    ) : (
      <div className="space-y-4">
        {filtered.map(i => {
          const isResolved = String(i.status).toUpperCase() === 'RESOLVED';
          const isReadyForSignoff = !isResolved && i.workCompleted;
          const isAssigned = !isResolved && !isReadyForSignoff && i.assignedToSupervisor && reassigningId !== i.id;

          return (
            <div key={i.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-[16px] text-[#111827]">{i.location}</span>
                    <span className="text-xs text-[#6B7280] font-medium bg-gray-100 px-2 py-0.5 rounded-md">{i.department}</span>
                    {isResolved ? (
                      <span className="pill" style={{ color: GREEN, background: '#E9F7EE' }}>Resolved</span>
                    ) : isReadyForSignoff ? (
                      <span className="pill" style={{ color: '#059669', background: '#D1FAE5' }}>Work Completed</span>
                    ) : isAssigned ? (
                      <span className="pill" style={{ color: BLUE, background: BLUE_SOFT }}>With Supervisor</span>
                    ) : (
                      <span className="pill" style={{ color: AMBER, background: '#FEF3E2' }}>Needs Supervisor</span>
                    )}
                    {i.urgent && <Status>Urgent</Status>}
                  </div>
                  <p className="text-[15px] text-[#374151] mt-1 leading-normal">{i.description}</p>
                  <p className="text-xs text-[#9CA3AF] mt-1.5">{i.author} · Reported {i.time}</p>

                  {i.photoUrl && (
                    <div className="mt-3">
                      <div
                        onClick={() => setPreviewPhoto(resolveImage(i.photoUrl))}
                        className="inline-flex items-center gap-3 p-1.5 pr-3.5 rounded-xl border border-[#E5E7EB] bg-gray-50 hover:bg-gray-100 hover:border-[#BFDBFE] cursor-pointer transition group"
                        title="Click to view full photo"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                          <img
                            src={resolveImage(i.photoUrl)}
                            alt="Complaint attachment"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                            onError={e => { e.currentTarget.parentElement.parentElement.style.display = 'none'; }}
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-semibold text-[#111827] flex items-center gap-1 group-hover:text-[#2F6FED] transition">
                            <Camera size={13} className="text-[#2F6FED]" /> Attached Photo
                          </p>
                          <p className="text-[11px] text-[#6B7280] mt-0.5 flex items-center gap-1">
                            <Maximize2 size={11} /> Click to expand
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!isResolved && (
                <div className="mt-3.5 pt-3 border-t border-[#E5E7EB]">
                  {isReadyForSignoff ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm text-[#065F46] font-medium">
                        Work Completed by {i.assignedTechnician?.split(' ')[0] || 'Supervisor'}
                      </div>
                      <button 
                        disabled={action.pending} 
                        onClick={() => handleResolve(i.id)} 
                        className="primary !bg-[#059669] hover:!bg-[#047857] !py-1.5 !px-4 text-sm font-medium"
                      >
                        {action.pending ? 'Saving…' : 'Approve & Close'}
                      </button>
                    </div>
                  ) : isAssigned ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#4B5563]">
                      <div>
                        Assigned to: <strong className="text-[#111827] font-medium">{i.assignedTechnician}</strong>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setReassigningId(i.id)} 
                        className="text-xs text-[#2F6FED] font-medium hover:underline"
                      >
                        Reassign
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-[#374151]">Assign to:</span>
                        <select 
                          className="input !py-1.5 !px-3 !text-sm !w-auto bg-[#F9FAFB]"
                          value={supervisorSelections[i.id] || `${SUPERVISORS[0].name} (${SUPERVISORS[0].role})`}
                          onChange={e => setSupervisorSelections({ ...supervisorSelections, [i.id]: e.target.value })}
                        >
                          {SUPERVISORS.map(s => (
                            <option key={s.email} value={`${s.name} (${s.role})`}>
                              {s.name} ({s.role})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        {reassigningId === i.id && (
                          <button 
                            type="button" 
                            onClick={() => setReassigningId(null)} 
                            className="text-xs text-[#6B7280] hover:underline px-2"
                          >
                            Cancel
                          </button>
                        )}
                        <button 
                          disabled={action.pending} 
                          onClick={() => handleAssign(i.id)} 
                          className="primary !py-1.5 !px-4 text-sm font-medium"
                        >
                          {action.pending ? 'Assigning…' : 'Assign'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}
    <ImageModal photoUrl={previewPhoto} onClose={() => setPreviewPhoto(null)} />
  </>;
}

function SupervisorTasks({ session }) {
  const request = useRequest(() => api.issues(), []);
  const action = useAction();
  const [filter, setFilter] = useState('pending');
  const [previewPhoto, setPreviewPhoto] = useState(null);

  if (request.loading || request.error) return <><Header title="Work Queue" sub={`Welcome, ${session?.name || 'Supervisor'}`} /><RequestState loading={request.loading} error={request.error} onRetry={request.reload} /></>;

  const allIssues = request.data || [];
  const assignedToMe = allIssues.filter(i => i.assignedToSupervisor && !i.workCompleted && String(i.status).toUpperCase() !== 'RESOLVED');
  const completed = allIssues.filter(i => (i.workCompleted || String(i.status).toUpperCase() === 'RESOLVED') && i.assignedToSupervisor);

  const filtered = filter === 'pending' ? assignedToMe : completed;

  const handleMarkDone = async (id) => {
    await action.run(async () => {
      await api.reportCompletion(id, { report: 'Work completed on site.' });
      await request.reload();
    });
  };

  return <div>
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-[#111827]">Work Queue</h1>
        <p className="text-[15px] text-[#6B7280] mt-1">
          {filter === 'pending' ? (assignedToMe.length === 0 ? 'No pending tasks' : `${assignedToMe.length} pending task${assignedToMe.length === 1 ? '' : 's'}`) : `${completed.length} completed tasks`}
        </p>
      </div>
      <div className="flex bg-gray-100 p-1 rounded-xl">
        <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'pending' ? 'bg-white text-[#2F6FED] shadow-sm font-semibold' : 'text-[#6B7280]'}`}>To Do ({assignedToMe.length})</button>
        <button onClick={() => setFilter('completed')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'completed' ? 'bg-white text-[#2F6FED] shadow-sm font-semibold' : 'text-[#6B7280]'}`}>Done ({completed.length})</button>
      </div>
    </div>

    <ActionError error={action.error} />

    {filtered.length === 0 ? (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 text-center text-[#6B7280]">
        <CheckCircle2 size={32} className="mx-auto mb-2 text-[#059669] opacity-80" />
        <p className="text-[17px] font-medium text-[#111827]">{filter === 'pending' ? 'All caught up! No tasks pending.' : 'No completed tasks yet.'}</p>
        <p className="text-sm mt-1 text-[#6B7280]">{filter === 'pending' ? 'When the Warden assigns maintenance complaints, they will appear here.' : 'Tasks you mark as done will appear here.'}</p>
      </div>
    ) : (
      <div className="space-y-4">
        {filtered.map(i => (
          <div key={i.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-[17px] text-[#111827]">{i.location}</span>
                  <span className="text-xs text-[#2F6FED] font-medium bg-[#EEF3FE] px-2 py-0.5 rounded-md border border-[#BFDBFE]">{i.department}</span>
                  {i.urgent && <Status>Urgent</Status>}
                </div>
                <p className="text-[15px] text-[#374151] mt-1.5 leading-normal">{i.description}</p>
                <p className="text-xs text-[#9CA3AF] mt-1.5">{i.author ? `Reported by ${i.author} · ` : ''}{i.time}</p>

                {i.photoUrl && (
                  <div className="mt-3">
                    <div
                      onClick={() => setPreviewPhoto(resolveImage(i.photoUrl))}
                      className="inline-flex items-center gap-3 p-1.5 pr-3.5 rounded-xl border border-[#E5E7EB] bg-gray-50 hover:bg-gray-100 hover:border-[#BFDBFE] cursor-pointer transition group"
                      title="Click to view full photo"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                        <img
                          src={resolveImage(i.photoUrl)}
                          alt="Task attachment"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                          onError={e => { e.currentTarget.parentElement.parentElement.style.display = 'none'; }}
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-[#111827] flex items-center gap-1 group-hover:text-[#2F6FED] transition">
                          <Camera size={13} className="text-[#2F6FED]" /> Attached Photo
                        </p>
                        <p className="text-[11px] text-[#6B7280] mt-0.5 flex items-center gap-1">
                          <Maximize2 size={11} /> View full photo
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="shrink-0 pt-1 self-center">
                {!i.workCompleted && String(i.status).toUpperCase() !== 'RESOLVED' ? (
                  <button 
                    disabled={action.pending} 
                    onClick={() => handleMarkDone(i.id)} 
                    className="bg-[#059669] hover:bg-[#047857] text-white py-2 px-5 text-sm font-medium rounded-xl transition disabled:opacity-50"
                  >
                    {action.pending ? 'Saving…' : 'Mark as Done'}
                  </button>
                ) : (
                  <span className="pill" style={{ color: String(i.status).toUpperCase() === 'RESOLVED' ? GREEN : '#059669', background: String(i.status).toUpperCase() === 'RESOLVED' ? '#E9F7EE' : '#D1FAE5' }}>
                    {String(i.status).toUpperCase() === 'RESOLVED' ? 'Approved & Closed' : 'Waiting for Warden'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
    <ImageModal photoUrl={previewPhoto} onClose={() => setPreviewPhoto(null)} />
  </div>;
}
function Report({ session }) {
  const [isPrivate, setIsPrivate] = useState(false);
  const [dept, setDept] = useState('Mess');
  const [floor, setFloor] = useState(session?.floorNumber ?? 2);
  const [location, setLocation] = useState('');
  const [desc, setDesc] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [convertingHeic, setConvertingHeic] = useState(false);
  const [done, setDone] = useState(false);
  const [validationError, setValidationError] = useState('');
  const issueRequest = useRequest(() => api.issues(), []);
  const action = useAction();

  const issues = issueRequest.data || [];
  const duplicates = !isPrivate
    ? issues.filter(i => !i.isPrivate && i.department === dept && i.floor === floor && i.status !== 'Resolved')
    : [];

  const handleToggleMode = toPrivate => {
    setIsPrivate(toPrivate);
    if (toPrivate) {
      setDept('Attached Restroom');
      if (session?.floorNumber != null) setFloor(session.floorNumber);
      setLocation(session?.roomNumber ? `Room ${session.roomNumber} (Attached Bath)` : '');
    } else {
      setDept('Mess');
      setLocation('');
    }
  };

  const handlePhotoSelect = async e => {
    let file = e.target.files?.[0] || null;
    if (!file) return;

    const isHeic = file.name.toLowerCase().endsWith('.heic') || file.type.includes('heic') || file.type.includes('heif');
    if (isHeic) {
      setConvertingHeic(true);
      try {
        const heic2any = (await import('heic2any')).default;
        const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 });
        const blob = Array.isArray(converted) ? converted[0] : converted;
        file = new File([blob], file.name.replace(/\.heic$/i, '.jpeg'), { type: 'image/jpeg' });
      } catch (err) {
        console.warn('HEIC conversion skipped', err);
      } finally {
        setConvertingHeic(false);
      }
    }

    setPhoto(file);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview(null);
  };

  const submit = async e => {
    e.preventDefault();
    if (!desc.trim()) {
      setValidationError('Enter a description before submitting.');
      return;
    }
    setValidationError('');

    const f = new FormData();
    f.append('department', dept);
    f.append('floor', String(floor));
    f.append('location', location || (isPrivate ? `Room ${session?.roomNumber || ''}` : floorLabel(floor)));
    f.append('description', desc.trim());
    f.append('isPrivate', isPrivate ? 'true' : 'false');
    if (photo) f.append('photo', photo);

    const succeeded = await action.run(async () => {
      await api.createIssue(f);
      await issueRequest.reload();
    });

    if (succeeded) {
      setDone(true);
      handleRemovePhoto();
      setTimeout(() => {
        setDone(false);
        setDesc('');
        setLocation(isPrivate && session?.roomNumber ? `Room ${session.roomNumber} (Attached Bath)` : '');
      }, 1000);
    }
  };

  const vote = async id => {
    await action.run(async () => {
      await api.vote(id);
      await issueRequest.reload();
    });
  };

  return (
    <div className="max-w-[850px]">
      <Header
        title="Report Issue"
        sub={isPrivate ? 'Direct maintenance request for your room' : 'Communal hostel reporting with student upvoting'}
      />

      <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => handleToggleMode(false)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-[16px] transition ${!isPrivate ? 'bg-white text-[#2F6FED] shadow-sm font-semibold' : 'text-[#6B7280] hover:text-[#111827]'}`}
        >
          <Globe size={19} />
          <span>Common Area</span>
        </button>
        <button
          type="button"
          onClick={() => handleToggleMode(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-[16px] transition ${isPrivate ? 'bg-white text-[#2F6FED] shadow-sm font-semibold' : 'text-[#6B7280] hover:text-[#111827]'}`}
        >
          <Lock size={19} />
          <span>My Room</span>
        </button>
      </div>

      {done ? (
        <p className="notice">
          {isPrivate ? '✓ Private room ticket submitted.' : '✓ Posted to communal feed.'}
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-6" noValidate>
          <div className="grid grid-cols-2 gap-5">
            <Field label="Category / Department">
              <select className="input" value={dept} onChange={e => setDept(e.target.value)}>
                {(isPrivate ? ROOM_DEPARTMENTS : COMMUNAL_DEPARTMENTS).map(x => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
            <Field label="Floor">
              <select className="input" value={floor} onChange={e => setFloor(+e.target.value)}>
                {FLOORS.map(x => (
                  <option key={x} value={x}>{floorLabel(x)}</option>
                ))}
              </select>
            </Field>
          </div>

          {!isPrivate && (
            <RequestState loading={issueRequest.loading} error={issueRequest.error} onRetry={issueRequest.reload}>
              {duplicates.length > 0 && (
                <div className="bg-gray-100 rounded-xl p-4">
                  <p className="font-medium mb-2">Already reported on {floorLabel(floor)}</p>
                  {duplicates.map(d => (
                    <div key={d.id} className="flex items-center justify-between py-2">
                      <span className="text-sm text-[#6B7280]">{d.description}</span>
                      <button
                        type="button"
                        disabled={action.pending}
                        onClick={() => vote(d.id)}
                        className="text-sm border rounded-lg px-3 py-1 disabled:opacity-50"
                      >
                        Vote ({d.votes})
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </RequestState>
          )}

          <Field label={isPrivate ? 'Room / Fixture Details' : 'Location detail (optional)'}>
            <input
              className="input"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </Field>

          <Field label="Photo Attachment (Optional)">
            <label className="upload cursor-pointer">
              <Camera size={22} className="text-[#2F6FED]" />
              <span>{convertingHeic ? 'Converting HEIC photo…' : photo ? photo.name : 'Upload photo (JPG, PNG, HEIC)'}</span>
              <input
                type="file"
                accept="image/*,.heic,.HEIC"
                className="hidden"
                disabled={convertingHeic}
                onChange={handlePhotoSelect}
              />
            </label>

            {photoPreview && (
              <div className="mt-3 relative inline-block">
                <img
                  src={photoPreview}
                  alt="Attachment preview"
                  className="w-32 h-24 object-cover rounded-xl border border-[#CBD5E1] shadow-xs"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition"
                  title="Remove photo"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </Field>

          <Field label="Description">
            <textarea
              className="input min-h-[150px]"
              value={desc}
              onChange={e => {
                setDesc(e.target.value);
                if (e.target.value.trim()) setValidationError('');
              }}
              aria-invalid={!!validationError}
              aria-describedby={validationError ? 'report-description-error' : undefined}
            />
          </Field>

          {validationError && (
            <p id="report-description-error" role="alert" className="-mt-4 text-sm text-red-600 font-medium">
              {validationError}
            </p>
          )}

          <ActionError error={action.error} />

          <button disabled={action.pending || convertingHeic} className="primary w-full disabled:opacity-50">
            {action.pending ? 'Submitting…' : isPrivate ? 'Submit Room Request' : 'Submit to Community Feed'}
          </button>
        </form>
      )}
    </div>
  );
}

function StudentParcels() { const request = useRequest(() => api.parcels(), []); const parcels = request.data || []; const waiting = parcels.filter(p => p.status === 'WAITING_PICKUP'); const collected = parcels.filter(p => p.status === 'COLLECTED'); return <div className="max-w-[850px]"><Header title="My Deliveries" sub="Gate 1 Security Desk · Show your 4-digit OTP upon collection" /><h2 className="text-[20px] font-semibold mb-4 flex items-center gap-2.5"><span>Waiting for Pickup</span><span className="pill" style={{ color: waiting.length > 0 ? BLUE : '#6B7280', background: waiting.length > 0 ? BLUE_SOFT : '#F3F4F6' }}>{waiting.length}</span></h2>{waiting.length === 0 ? <p className="py-6 text-[15px] text-[#6B7280] mb-6">No parcels waiting for pickup.</p> : <div className="space-y-5 mb-8">{waiting.map(p => <div key={p.id} className="bg-white border-2 border-[#BFDBFE] rounded-2xl p-6 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]"><div className="flex items-center gap-3"><span className="font-semibold text-[17px] text-[#2F6FED]">{p.courier}</span><Tag>{p.parcelCode}</Tag>{p.trackingNumber && <span className="text-sm text-[#6B7280]">AWB: {p.trackingNumber}</span>}</div><span className="pill" style={{ color: AMBER, background: '#FEF3E2' }}>Waiting at Gate</span></div>{p.notes && <p className="text-[17px] mt-4 font-medium text-[#111827]">{p.notes}</p>}<div className="bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] rounded-2xl p-5 my-4 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Pickup Verification OTP</p><p className="text-[34px] font-mono font-bold tracking-widest text-[#2F6FED] leading-none mt-1.5">{p.otp}</p></div><div className="text-right"><p className="text-[15px] font-medium text-[#111827]">Show code at Gate 1</p><p className="text-xs text-[#6B7280] mt-0.5">{p.storageLocation || 'Security Desk'}</p></div></div><div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-sm text-[#6B7280]"><span>Arrived: {p.arrivedAt}</span><span className="text-xs font-semibold text-[#2F6FED] bg-[#EEF3FE] px-3 py-1.5 rounded-lg border border-[#BFDBFE]">Collect with OTP at Gate Desk</span></div></div>)}</div>}<h2 className="text-[20px] font-semibold mb-4">Past Deliveries</h2><RequestState loading={request.loading} error={request.error} onRetry={request.reload}>{collected.length === 0 ? <p className="text-[15px] text-[#6B7280]">No past delivery records.</p> : <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden divide-y divide-[#E5E7EB]">{collected.map(p => <div key={p.id} className="p-5 flex flex-wrap items-center justify-between gap-4"><div><div className="flex items-center gap-2.5 mb-1"><span className="font-medium text-[16px]">{p.courier}</span><Tag>{p.parcelCode}</Tag>{p.notes && <span className="text-[15px] text-[#6B7280]">· {p.notes}</span>}</div><p className="text-sm text-[#6B7280]">Arrived {p.arrivedAt} · Collected {p.collectedAt || 'Recently'}</p></div><span className="pill" style={{ color: GREEN, background: '#E9F7EE' }}>Collected</span></div>)}</div>}</RequestState></div> }

function StaffParcelDesk() { const request = useRequest(() => Promise.all([api.parcels(), api.parcelStudents()]), []); const action = useAction(); const [filter, setFilter] = useState('waiting'); const [search, setSearch] = useState(''); const [showLogForm, setShowLogForm] = useState(false); const [studentId, setStudentId] = useState(''); const [courier, setCourier] = useState('Amazon'); const [tracking, setTracking] = useState(''); const [storage, setStorage] = useState('Gate 1 Security Desk'); const [notes, setNotes] = useState(''); const [logSuccess, setLogSuccess] = useState(''); const [otpInputs, setOtpInputs] = useState({}); const [otpError, setOtpError] = useState({}); const [parcels, students] = (request.data || [[], []]); const unresolved = parcels.filter(p => p.status === 'WAITING_PICKUP'); const collected = parcels.filter(p => p.status === 'COLLECTED'); const filtered = parcels.filter(p => { const matchesFilter = filter === 'waiting' ? p.status === 'WAITING_PICKUP' : filter === 'collected' ? p.status === 'COLLECTED' : true; if (!matchesFilter) return false; if (!search.trim()) return true; const q = search.toLowerCase(); return (p.studentName || '').toLowerCase().includes(q) || (p.roomNumber || '').toLowerCase().includes(q) || (p.courier || '').toLowerCase().includes(q) || (p.parcelCode || '').toLowerCase().includes(q) || (p.trackingNumber || '').toLowerCase().includes(q) }); const handleLog = async e => { e.preventDefault(); if (!studentId) { alert('Please select a student'); return } const succeeded = await action.run(async () => { const p = await api.logParcel({ studentId: +studentId, courier, trackingNumber: tracking.trim(), storageLocation: storage.trim(), notes: notes.trim() }); await request.reload(); setLogSuccess(`Parcel logged for Room ${p.roomNumber}! Pickup OTP: ${p.otp}`); setTimeout(() => setLogSuccess(''), 6000); setTracking(''); setNotes(''); setShowLogForm(false) }); }; const handleVerifyOtp = async id => { const entered = otpInputs[id]; if (!entered || entered.trim().length !== 4) { setOtpError(cur => ({ ...cur, [id]: 'Enter 4-digit OTP' })); return } setOtpError(cur => ({ ...cur, [id]: '' })); await action.run(async () => { try { await api.verifyParcelOtp(id, entered.trim()); await request.reload(); setOtpInputs(cur => ({ ...cur, [id]: '' })) } catch (err) { setOtpError(cur => ({ ...cur, [id]: err.message || 'Invalid OTP' })); throw err } }) }; const handleManualRelease = async id => { const confirmed = window.confirm('Release this parcel without OTP verification?'); if (!confirmed) return; await action.run(async () => { await api.collectParcel(id); await request.reload() }) }; return <div><div className="flex flex-wrap items-center justify-between gap-4 mb-7"><div><h1 className="text-[29px] font-semibold tracking-[-0.02em]">Security Gate Parcel Desk</h1><p className="text-[18px] text-[#6B7280] mt-1">{unresolved.length} parcels waiting pickup · {collected.length} collected total</p></div><button type="button" onClick={() => setShowLogForm(!showLogForm)} className="primary flex items-center gap-2"><Package size={18} /><span>{showLogForm ? 'Close Form' : 'Log Incoming Delivery'}</span></button></div>{logSuccess && <div className="mb-6 p-4 rounded-xl bg-[#E9F7EE] border border-[#A7F3D0] text-[#166534] font-medium flex items-center justify-between"><span>✓ {logSuccess}</span><button onClick={() => setLogSuccess('')} className="text-sm underline">Dismiss</button></div>}{showLogForm && <Card title="Log New Delivery Package" className="mb-8 border-[#BFDBFE]"><form onSubmit={handleLog} className="space-y-5"><div className="grid grid-cols-2 gap-5"><Field label="Student / Room"><select className="input" value={studentId} onChange={e => setStudentId(e.target.value)} required><option value="">Select recipient student…</option>{students.map(s => <option key={s.id} value={s.id}>{s.name} — Room {s.roomNumber} (Floor {s.floorNumber})</option>)}</select></Field><Field label="Courier Partner"><select className="input" value={courier} onChange={e => setCourier(e.target.value)}>{['Amazon', 'Flipkart', 'India Post / Speed Post', 'Blue Dart', 'DTDC', 'Swiggy Instamart / Zepto', 'Home Courier / Parents', 'Delhivery', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}</select></Field></div><div className="grid grid-cols-2 gap-5"><Field label="AWB / Tracking Number (Optional)"><input className="input" value={tracking} onChange={e => setTracking(e.target.value)} /></Field><Field label="Storage Location at Gate"><input className="input" value={storage} onChange={e => setStorage(e.target.value)} /></Field></div><Field label="Package Description / Notes"><input className="input" value={notes} onChange={e => setNotes(e.target.value)} /></Field><ActionError error={action.error} /><button disabled={action.pending} className="primary w-full disabled:opacity-50">{action.pending ? 'Logging…' : 'Log Package & Generate Student OTP'}</button></form></Card>}<div className="flex flex-wrap items-center justify-between gap-4 mb-6"><div className="flex bg-gray-100 p-1 rounded-xl"><button onClick={() => setFilter('waiting')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'waiting' ? 'bg-white text-[#2F6FED] shadow-sm' : 'text-[#6B7280]'}`}>Waiting for Pickup ({unresolved.length})</button><button onClick={() => setFilter('collected')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'collected' ? 'bg-white text-[#2F6FED] shadow-sm' : 'text-[#6B7280]'}`}>Collected ({collected.length})</button><button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'all' ? 'bg-white text-[#2F6FED] shadow-sm' : 'text-[#6B7280]'}`}>All ({parcels.length})</button></div><div className="relative min-w-[280px]"><input className="input !py-2 !text-sm" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} /></div></div><ActionError error={action.error} /><RequestState loading={request.loading} error={request.error} onRetry={request.reload}>{filtered.length === 0 ? <p className="py-8 text-[16px] text-[#6B7280]">No deliveries found matching this view.</p> : <div className="space-y-4">{filtered.map(p => <div key={p.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-3 flex-wrap mb-1.5"><span className="text-[18px] font-semibold">{p.studentName}</span><span className="pill" style={{ color: BLUE, background: BLUE_SOFT }}>Room {p.roomNumber}</span><Tag>{p.parcelCode}</Tag><span className="font-medium text-[15px] text-[#2F6FED]">{p.courier}</span></div>{p.notes && <p className="text-[16px] text-[#111827] mt-1">{p.notes}</p>}<p className="text-sm text-[#6B7280] mt-1.5">Location: <span className="font-medium text-[#374151]">{p.storageLocation || 'Gate Desk'}</span>{p.trackingNumber && ` · Tracking: ${p.trackingNumber}`}{` · Arrived: ${p.arrivedAt}`}</p></div>{p.status === 'WAITING_PICKUP' ? <div className="flex flex-col items-end gap-2 shrink-0"><span className="pill" style={{ color: AMBER, background: '#FEF3E2' }}>Waiting Pickup</span><div className="flex items-center gap-2 mt-1"><input type="text" maxLength={4} placeholder="OTP" className="input !w-[90px] !py-1.5 !px-2.5 text-center font-mono font-bold tracking-widest text-[16px]" value={otpInputs[p.id] || ''} onChange={e => setOtpInputs({ ...otpInputs, [p.id]: e.target.value })} onKeyDown={e => { if (e.key === 'Enter') handleVerifyOtp(p.id) }} /><button type="button" disabled={action.pending || !(otpInputs[p.id]?.length === 4)} onClick={() => handleVerifyOtp(p.id)} className="primary !py-1.5 !px-3 text-sm disabled:opacity-50">Verify OTP</button></div>{otpError[p.id] && <p className="text-xs text-red-600 font-medium">{otpError[p.id]}</p>}<button type="button" disabled={action.pending} onClick={() => handleManualRelease(p.id)} className="text-xs text-[#6B7280] hover:text-[#111827] underline">Override & release</button></div> : <div className="text-right shrink-0"><span className="pill" style={{ color: GREEN, background: '#E9F7EE' }}>Collected</span><p className="text-xs text-[#6B7280] mt-1.5">Collected: {p.collectedAt}</p>{p.collectedBy && <p className="text-xs text-[#6B7280]">{p.collectedBy}</p>}</div>}</div></div>)}</div>}</RequestState></div> }

function GuestRooms() {
  const [guest, setGuest] = useState(''), [inDate, setIn] = useState(''), [outDate, setOut] = useState('');
  const [inTime, setInTime] = useState('10:00'), [outTime, setOutTime] = useState('18:00');
  const [done, setDone] = useState(false), [errors, setErrors] = useState({});
  const request = useRequest(() => api.guests(), []), action = useAction();
  const requests = request.data || [];

  const formatTimeLabel = t => {
    if (!t) return '';
    const parts = t.split(':');
    if (parts.length < 2) return t;
    const h = parseInt(parts[0], 10), m = parseInt(parts[1], 10);
    if (isNaN(h)) return t;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m || 0).padStart(2, '0')} ${ampm}`;
  };

  const submit = async e => {
    e.preventDefault();
    const next = {};
    if (!guest.trim()) next.guest = 'Enter the guest name and relation.';
    if (!inDate) next.checkIn = 'Choose a check-in date.';
    if (!outDate) next.checkOut = 'Choose a check-out date.';
    else if (inDate && outDate < inDate) next.checkOut = 'Check-out date cannot be before check-in date.';
    if (!inTime) next.inTime = 'Choose an arrival time.';
    if (!outTime) next.outTime = 'Choose a departure time.';
    else if (inDate && outDate && inDate === outDate && inTime && outTime && outTime <= inTime) {
      next.outTime = 'Departure time must be after arrival time for same-day visits.';
    }
    setErrors(next);
    if (Object.keys(next).length) return;
    const succeeded = await action.run(async () => {
      await api.createGuest({
        guest: guest.trim(),
        checkIn: inDate,
        checkOut: outDate,
        checkInTime: formatTimeLabel(inTime),
        checkOutTime: formatTimeLabel(outTime)
      });
      await request.reload();
    });
    if (succeeded) {
      setGuest('');
      setIn('');
      setOut('');
      setInTime('10:00');
      setOutTime('18:00');
      setDone(true);
      setTimeout(() => setDone(false), 900);
    }
  };

  const updateDate = (key, value) => {
    if (key === 'checkIn') {
      setIn(value);
      if (!outDate || outDate < value) setOut(value);
    } else {
      setOut(value);
    }
    setErrors(current => ({ ...current, [key]: '', ...(key === 'checkIn' ? { checkOut: '' } : {}) }));
  };

  return (
    <div className="max-w-[850px]">
      <Header title="Guest Rooms" />
      <Card title="New request">
        {done ? <p className="notice">Request sent for verification.</p> : (
          <form onSubmit={submit} className="space-y-5" noValidate>
            <Field label="Guest name & relation">
              <input
                className="input"
                value={guest}
                onChange={e => { setGuest(e.target.value); setErrors(current => ({ ...current, guest: '' })); }}
                aria-invalid={!!errors.guest}
                aria-describedby={errors.guest ? 'guest-name-error' : undefined}
              />
              {errors.guest && <p id="guest-name-error" role="alert" className="mt-2 text-sm text-red-600">{errors.guest}</p>}
            </Field>
            <div className="grid grid-cols-2 gap-5">
              <Field label="Check-in Date">
                <input
                  type="date"
                  className="input"
                  value={inDate}
                  onChange={e => updateDate('checkIn', e.target.value)}
                  aria-invalid={!!errors.checkIn}
                  aria-describedby={errors.checkIn ? 'guest-checkin-error' : undefined}
                />
                {errors.checkIn && <p id="guest-checkin-error" role="alert" className="mt-2 text-sm text-red-600">{errors.checkIn}</p>}
              </Field>
              <Field label="Arrival Time">
                <input
                  type="time"
                  className="input"
                  value={inTime}
                  onChange={e => { setInTime(e.target.value); setErrors(current => ({ ...current, inTime: '', outTime: '' })); }}
                  aria-invalid={!!errors.inTime}
                />
                {errors.inTime && <p role="alert" className="mt-2 text-sm text-red-600">{errors.inTime}</p>}
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Field label="Check-out Date">
                <input
                  type="date"
                  min={inDate || undefined}
                  className="input"
                  value={outDate}
                  onChange={e => updateDate('checkOut', e.target.value)}
                  aria-invalid={!!errors.checkOut}
                  aria-describedby={errors.checkOut ? 'guest-checkout-error' : undefined}
                />
                {errors.checkOut && <p id="guest-checkout-error" role="alert" className="mt-2 text-sm text-red-600">{errors.checkOut}</p>}
              </Field>
              <Field label="Departure Time">
                <input
                  type="time"
                  className="input"
                  value={outTime}
                  onChange={e => { setOutTime(e.target.value); setErrors(current => ({ ...current, outTime: '' })); }}
                  aria-invalid={!!errors.outTime}
                />
                {errors.outTime && <p role="alert" className="mt-2 text-sm text-red-600">{errors.outTime}</p>}
              </Field>
            </div>
            {inDate && outDate && inDate === outDate && (
              <div className="text-xs font-semibold text-[#2F6FED] bg-[#EEF3FE] px-3.5 py-2.5 rounded-xl border border-[#BFDBFE] flex items-center justify-between">
                <span>✓ Same-Day Visit: Arrival at {formatTimeLabel(inTime)} · Departure at {formatTimeLabel(outTime)}</span>
                <span className="text-[11px] uppercase tracking-wider bg-white px-2 py-0.5 rounded font-bold shadow-2xs">Day Pass</span>
              </div>
            )}
            <ActionError error={action.error} />
            <button disabled={action.pending} className="primary w-full disabled:opacity-50">
              {action.pending ? 'Sending…' : inDate && outDate && inDate === outDate ? 'Request Same-Day Visit' : 'Send request'}
            </button>
          </form>
        )}
      </Card>
      <h2 className="text-[19px] font-semibold mt-8 mb-4">Your requests</h2>
      <RequestState loading={request.loading} error={request.error} onRetry={request.reload}>
        {requests.length === 0 ? <p className="text-[15px] text-[#6B7280]">No requests yet.</p> : requests.map(g => (
          <div key={g.id} className="py-5 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <p className="text-[17px] font-medium">{g.guest}</p>
              <p className="text-[15px] text-[#6B7280] mt-1">
                {g.checkIn === g.checkOut
                  ? `${g.checkIn} · ${g.checkInTime || '10:00 AM'} → ${g.checkOutTime || '06:00 PM'} (Same Day)`
                  : `${g.checkIn} (${g.checkInTime || '10:00 AM'}) → ${g.checkOut} (${g.checkOutTime || '06:00 PM'})`}
                {g.room ? ` · Room ${g.room}` : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Status>{g.status}</Status>
              {g.guestStatus && <Status>{g.guestStatus}</Status>}
            </div>
          </div>
        ))}
      </RequestState>
    </div>
  );
}

function MessMenu({ role }) { const [edit, setEdit] = useState(null), [edits, setEdits] = useState({}), request = useRequest(() => api.mess(), []), action = useAction(); if (request.loading || request.error) return <><Header title="Mess Menu" /><RequestState loading={request.loading} error={request.error} onRetry={request.reload} /></>; const items = request.data, days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], meals = ['Breakfast', 'Lunch', 'Snacks', 'Dinner']; const find = (d, m) => items.find(x => x.dayOfWeek === d && x.meal === m); const save = async id => { const x = items.find(y => y.id === id), value = edits[id] ?? x.items; const succeeded = await action.run(async () => { await api.updateMess(id, value); await request.reload() }); if (succeeded) { setEdit(null); setEdits(current => { const next = { ...current }; delete next[id]; return next }) } }; return <><Header title="Mess Menu" sub={(role === 'warden' || role === 'supervisor' || role === 'staff') ? 'Click a cell to edit — changes are visible to students immediately' : 'This week'} /><ActionError error={action.error} />{items.length === 0 ? <p className="py-8 text-[15px] text-[#6B7280]">No menu items are available.</p> : <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-auto"><table className="w-full min-w-[1050px] border-collapse"><thead><tr><th className="table-head text-left">Meal</th>{days.map(d => <th key={d} className="table-head text-left">{d}</th>)}</tr></thead><tbody>{meals.map(m => <tr key={m}><td className="table-cell font-medium">{m}</td>{days.map(d => { const x = find(d, m); return <td key={d} className="table-cell align-top">{(role === 'warden' || role === 'supervisor' || role === 'staff') && edit === x?.id ? <div className="space-y-2"><textarea autoFocus className="w-full border rounded-lg p-2 text-sm" value={edits[x.id] ?? x.items} onChange={e => setEdits(current => ({ ...current, [x.id]: e.target.value }))} /><div className="flex gap-2"><button disabled={action.pending} className="text-sm text-blue-600 disabled:opacity-50" onClick={() => save(x.id)}>{action.pending ? 'Saving…' : 'Save'}</button><button disabled={action.pending} className="text-sm text-gray-500" onClick={() => setEdit(null)}>Cancel</button></div></div> : <button disabled={(role !== 'warden' && role !== 'supervisor' && role !== 'staff') || !x} onClick={() => { if (x) { setEdit(x.id); setEdits(current => ({ ...current, [x.id]: x.items })) } }} className="text-left leading-7 disabled:cursor-default">{x?.items || '—'}</button>}</td> })}</tr>)}</tbody></table></div>}</> }

function AnnouncementPreview({ a, empty }) { if (!a) return <p className="text-[15px] text-[#6B7280]">{empty}</p>; return <div><div className="flex items-center gap-2"><p className="text-[19px] font-medium">{a.title}</p>{a.pinned && <span className="pill" style={{ color: BLUE, background: BLUE_SOFT }}>Pinned</span>}</div><p className="text-[17px] mt-2">{a.message}</p><p className="text-[15px] text-[#6B7280] mt-2">{a.author} · {a.time}</p></div> }
function Announcements({ role }) { const [title, setTitle] = useState(''), [message, setMessage] = useState(''), [pinned, setPinned] = useState(false), request = useRequest(() => api.announcements(), []), action = useAction(); const post = async e => { e.preventDefault(); if (!title.trim() || !message.trim()) return; const succeeded = await action.run(async () => { await api.postAnnouncement({ title: title.trim(), message: message.trim(), pinned }); await request.reload() }); if (succeeded) { setTitle(''); setMessage(''); setPinned(false) } }; return <div className="max-w-[850px]"><Header title="Announcements" />{(role === 'warden' || role === 'supervisor' || role === 'staff') && <Card title="Post announcement" className="mb-8"><form onSubmit={post} className="space-y-5"><Field label="Title"><input className="input" value={title} onChange={e => setTitle(e.target.value)} /></Field><Field label="Message"><textarea className="input min-h-[120px]" value={message} onChange={e => setMessage(e.target.value)} /></Field><label className="flex items-center gap-3 text-[16px]"><input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} className="w-5 h-5" />Pin as daily reminder</label><ActionError error={action.error} /><button disabled={action.pending} className="primary w-full disabled:opacity-50">{action.pending ? 'Posting…' : 'Post'}</button></form></Card>}<h2 className="text-[19px] font-semibold mb-4">{(role === 'warden' || role === 'supervisor' || role === 'staff') ? 'All announcements' : 'Latest'}</h2><RequestState loading={request.loading} error={request.error} onRetry={request.reload}>{request.data?.length === 0 ? <p className="py-6 text-[15px] text-[#6B7280]">No announcements yet.</p> : request.data?.map((a, i) => <div key={a.id} className={i ? 'border-t border-[#E5E7EB]' : ''}><div className="py-6"><AnnouncementPreview a={a} /></div></div>)}</RequestState></div> }

function GuestRequests() { const [choices, setChoices] = useState({}), request = useRequest(async () => { const list = await api.guests(); const pending = list.filter(g => g.status === 'Pending'); const available = await Promise.all(pending.map(async g => [g.id, await api.availability(g.checkIn, g.checkOut)])); return { list, rooms: Object.fromEntries(available) } }, []), action = useAction(); const list = request.data?.list || [], rooms = request.data?.rooms || {}; const runAndRefresh = task => action.run(async () => { await task(); await request.reload() }); const approve = g => { if (choices[g.id]) return runAndRefresh(() => api.approveGuest(g.id, choices[g.id])) }; return <><Header title="Guest Requests" sub="Floor 8 · 40 rooms in inventory" /><ActionError error={action.error} /><RequestState loading={request.loading} error={request.error} onRetry={request.reload}>{list.length === 0 ? <p className="py-8 text-[15px] text-[#6B7280]">No guest requests.</p> : list.map(g => <div key={g.id} className="py-6 border-b border-[#E5E7EB] flex items-center justify-between gap-5"><div><p className="text-[18px]">{g.student}</p><p className="text-[16px] text-[#6B7280] mt-1">{g.guest} · {g.checkIn === g.checkOut ? `${g.checkIn} · ${g.checkInTime || '10:00 AM'} → ${g.checkOutTime || '06:00 PM'} (Same Day)` : `${g.checkIn} → ${g.checkOut} (${g.checkInTime || '10:00 AM'} - ${g.checkOutTime || '06:00 PM'})`}</p></div>{g.status === 'Pending' ? <div className="flex items-center gap-3"><select className="input !w-[120px]" value={choices[g.id] || ''} onChange={e => setChoices({ ...choices, [g.id]: e.target.value })}><option value="">{rooms[g.id]?.count ?? 0} free</option>{(rooms[g.id]?.rooms || []).map(r => <option key={r}>{r}</option>)}</select><button disabled={!choices[g.id] || action.pending} onClick={() => approve(g)} className="text-blue-600 font-medium disabled:text-gray-400">{action.pending ? 'Saving…' : 'Approve'}</button><button disabled={action.pending} onClick={() => runAndRefresh(() => api.rejectGuest(g.id))} className="text-red-600 font-medium disabled:opacity-50">Reject</button></div> : <div className="text-right"><div className="flex gap-2 justify-end"><Status>{g.status}</Status>{g.guestStatus && <Status>{g.guestStatus}</Status>}</div>{g.room && <p className="text-sm text-[#6B7280] mt-1">Room {g.room}</p>}{g.status === 'Approved' && g.guestStatus === 'Awaiting' && <button disabled={action.pending} onClick={() => runAndRefresh(() => api.arrive(g.id))} className="text-blue-600 text-sm mt-1 disabled:opacity-50">{action.pending ? 'Saving…' : 'Mark arrived'}</button>}{g.status === 'Approved' && g.guestStatus === 'Checked in' && <button disabled={action.pending} onClick={() => runAndRefresh(() => api.depart(g.id))} className="text-blue-600 text-sm mt-1 disabled:opacity-50">{action.pending ? 'Saving…' : 'Mark departed'}</button>}</div>}</div>)}</RequestState></> }
function Directory() {
  const request = useRequest(() => api.directory(), []);
  return (
    <div className="max-w-[850px]">
      <Header title="Directory" sub="Emergency and campus maintenance contact numbers" />
      <RequestState loading={request.loading} error={request.error} onRetry={request.reload}>
        {request.data?.length === 0 ? (
          <p className="py-8 text-[15px] text-[#6B7280]">No directory entries available.</p>
        ) : (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl divide-y divide-[#E5E7EB] overflow-hidden shadow-sm mt-4">
            {request.data?.map(d => (
              <div key={d.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition">
                <div>
                  <div className="flex items-center gap-2.5">
                    <p className="text-[17px] font-semibold text-[#111827]">{d.name}</p>
                    <span className="text-xs font-medium bg-blue-50 text-[#2F6FED] px-2.5 py-0.5 rounded-md border border-blue-200">
                      {d.role}
                    </span>
                  </div>
                </div>
                <a
                  className="inline-flex items-center gap-2 font-mono font-medium text-[16px] text-[#2F6FED] hover:text-[#1D4ED8] bg-[#EEF3FE] px-4 py-2 rounded-xl border border-[#BFDBFE] transition"
                  href={`tel:${d.phone}`}
                >
                  <Phone size={16} />
                  <span>{d.phone}</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </RequestState>
    </div>
  );
}

function ImageCropModal({ file, onCrop, onClose }) {
  const [img, setImg] = useState(null);
  const [crop, setCrop] = useState({ top: 12, bottom: 12, left: 12, right: 12 });
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => setImg(image);
    image.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const maxW = 400, maxH = 340;
    const w = img.naturalWidth, h = img.naturalHeight;
    const ratio = Math.min(maxW / w, maxH / h, 1);
    const dispW = Math.round(w * ratio);
    const dispH = Math.round(h * ratio);

    canvas.width = dispW;
    canvas.height = dispH;

    ctx.drawImage(img, 0, 0, dispW, dispH);

    const cropX = Math.round((crop.left / 100) * dispW);
    const cropY = Math.round((crop.top / 100) * dispH);
    const cropW = Math.max(20, Math.round(((100 - crop.left - crop.right) / 100) * dispW));
    const cropH = Math.max(20, Math.round(((100 - crop.top - crop.bottom) / 100) * dispH));

    ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
    ctx.fillRect(0, 0, dispW, cropY);
    ctx.fillRect(0, cropY + cropH, dispW, dispH - (cropY + cropH));
    ctx.fillRect(0, cropY, cropX, cropH);
    ctx.fillRect(cropX + cropW, cropY, dispW - (cropX + cropW), cropH);

    ctx.strokeStyle = '#2F6FED';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropW, cropH);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cropX + cropW / 3, cropY);
    ctx.lineTo(cropX + cropW / 3, cropY + cropH);
    ctx.moveTo(cropX + 2 * cropW / 3, cropY);
    ctx.lineTo(cropX + 2 * cropW / 3, cropY + cropH);
    ctx.moveTo(cropX, cropY + cropH / 3);
    ctx.lineTo(cropX + cropW, cropY + cropH / 3);
    ctx.moveTo(cropX, cropY + 2 * cropH / 3);
    ctx.lineTo(cropX + cropW, cropY + 2 * cropH / 3);
    ctx.stroke();
  }, [img, crop]);

  const handleApply = () => {
    if (!img) return;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;

    const sx = Math.round((crop.left / 100) * nw);
    const sy = Math.round((crop.top / 100) * nh);
    const sw = Math.max(20, Math.round(((100 - crop.left - crop.right) / 100) * nw));
    const sh = Math.max(20, Math.round(((100 - crop.top - crop.bottom) / 100) * nh));

    const outCanvas = document.createElement('canvas');
    outCanvas.width = sw;
    outCanvas.height = sh;
    const ctx = outCanvas.getContext('2d');
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    outCanvas.toBlob(blob => {
      if (!blob) return;
      const croppedFile = new File([blob], file.name.replace(/\.[^.]+$/, '') + '-cropped.jpg', { type: 'image/jpeg' });
      onCrop(croppedFile, URL.createObjectURL(croppedFile));
      onClose();
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-[17px] font-semibold text-[#111827]">Crop Only The Item</h3>
            <p className="text-xs text-[#6B7280]">Trim unnecessary surroundings (chat, battery, status bar)</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">
            <X size={18} />
          </button>
        </div>

        <div className="flex justify-center bg-gray-900 rounded-xl p-2 overflow-hidden">
          <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="flex justify-between font-medium text-gray-700 mb-1">
              <span>Trim Top</span><span>{crop.top}%</span>
            </label>
            <input type="range" min="0" max="45" value={crop.top} onChange={e => setCrop({ ...crop, top: +e.target.value })} className="w-full accent-[#2F6FED]" />
          </div>
          <div>
            <label className="flex justify-between font-medium text-gray-700 mb-1">
              <span>Trim Bottom</span><span>{crop.bottom}%</span>
            </label>
            <input type="range" min="0" max="45" value={crop.bottom} onChange={e => setCrop({ ...crop, bottom: +e.target.value })} className="w-full accent-[#2F6FED]" />
          </div>
          <div>
            <label className="flex justify-between font-medium text-gray-700 mb-1">
              <span>Trim Left</span><span>{crop.left}%</span>
            </label>
            <input type="range" min="0" max="45" value={crop.left} onChange={e => setCrop({ ...crop, left: +e.target.value })} className="w-full accent-[#2F6FED]" />
          </div>
          <div>
            <label className="flex justify-between font-medium text-gray-700 mb-1">
              <span>Trim Right</span><span>{crop.right}%</span>
            </label>
            <input type="range" min="0" max="45" value={crop.right} onChange={e => setCrop({ ...crop, right: +e.target.value })} className="w-full accent-[#2F6FED]" />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t">
          <button type="button" onClick={() => setCrop({ top: 0, bottom: 0, left: 0, right: 0 })} className="px-3 py-1.5 text-xs border rounded-lg text-gray-600 hover:bg-gray-50">
            Full View
          </button>
          <div className="flex-1" />
          <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg">
            Cancel
          </button>
          <button type="button" onClick={handleApply} className="px-4 py-1.5 text-xs bg-[#2F6FED] hover:bg-[#1D4ED8] text-white font-medium rounded-lg shadow-sm">
            Save Cropped Item
          </button>
        </div>
      </div>
    </div>
  );
}

function LostFound({ session, role }) {
  if (role !== 'student') return null;
  const request = useRequest(() => api.lostItems(), []);
  const action = useAction();
  const items = request.data || [];

  const [showPostForm, setShowPostForm] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Post form state
  const [itemType, setItemType] = useState('LOST');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [roomNumber, setRoomNumber] = useState(session?.roomNumber ? String(session.roomNumber) : '');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [originalPhoto, setOriginalPhoto] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setOriginalPhoto(file);
      setPhotoPreviewUrl(URL.createObjectURL(file));
      setShowCropModal(true);
    }
  };

  const handleCropComplete = (croppedFile, previewUrl) => {
    setPhoto(croppedFile);
    setPhotoPreviewUrl(previewUrl);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!title.trim()) {
      setFormError('Please enter the item name.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please provide a description.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('itemType', itemType);
    formData.append('location', location.trim());
    formData.append('roomNumber', roomNumber.trim());
    formData.append('description', description.trim());
    if (photo) {
      formData.append('photo', photo);
    }

    const succeeded = await action.run(async () => {
      await api.createLostItem(formData);
      await request.reload();
      setFormSuccess(itemType === 'LOST' ? 'Lost item posted to the hostel noticeboard!' : 'Found item posted! The owner can now reach you.');
      setTimeout(() => setFormSuccess(''), 6000);
      setTitle('');
      setLocation('');
      setDescription('');
      setPhoto(null);
      setOriginalPhoto(null);
      setPhotoPreviewUrl('');
      setShowCropModal(false);
      setShowPostForm(false);
    });
  };

  const handleClaim = async (id) => {
    const confirmed = window.confirm('Mark this item as returned / claimed?');
    if (!confirmed) return;
    await action.run(async () => {
      await api.claimLostItem(id);
      await request.reload();
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this listing?');
    if (!confirmed) return;
    await action.run(async () => {
      await api.deleteLostItem(id);
      await request.reload();
    });
  };

  return (
    <div className="max-w-[1080px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <h1 className="text-[29px] font-semibold tracking-[-0.02em]">Lost & Found</h1>
        <button
          type="button"
          onClick={() => {
            setShowPostForm(!showPostForm);
            if (!showPostForm && session?.roomNumber) {
              setRoomNumber(String(session.roomNumber));
            }
          }}
          className="primary flex items-center gap-2 !py-2.5 !px-5"
        >
          {showPostForm ? <X size={18} /> : <Plus size={18} />}
          <span>{showPostForm ? 'Close Form' : 'Post Lost / Found Item'}</span>
        </button>
      </div>

      {/* Success Banner */}
      {formSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-[#E9F7EE] border border-[#A7F3D0] text-[#166534] font-medium flex items-center justify-between">
          <span>✓ {formSuccess}</span>
          <button onClick={() => setFormSuccess('')} className="text-sm underline">Dismiss</button>
        </div>
      )}

      {/* Post Form */}
      {showPostForm && (
        <Card title="Post Lost or Misplaced Item" className="mb-8 border-[#BFDBFE]">
          <form onSubmit={handlePost} className="space-y-5">
            {/* Toggle Lost vs Found */}
            <div>
              <label className="block text-[15px] font-medium mb-2 text-[#111827]">What are you reporting?</label>
              <div className="flex bg-gray-100 p-1 rounded-xl max-w-md">
                <button
                  type="button"
                  onClick={() => setItemType('LOST')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                    itemType === 'LOST' ? 'bg-white text-[#D97706] shadow-sm' : 'text-[#6B7280]'
                  }`}
                >
                  Lost Item (I lost something)
                </button>
                <button
                  type="button"
                  onClick={() => setItemType('FOUND')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                    itemType === 'FOUND' ? 'bg-white text-[#2F6FED] shadow-sm' : 'text-[#6B7280]'
                  }`}
                >
                  Found Item (Misplaced in bucket / mess)
                </button>
              </div>
            </div>

            {/* Title & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Item Name">
                <input
                  className="input"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </Field>
              <Field label={itemType === 'LOST' ? 'Where was it lost?' : 'Where was it found / misplaced?'}>
                <input
                  className="input"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </Field>
            </div>

            {/* Room & Photo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={itemType === 'LOST' ? 'Return to Room' : 'Collect from Room'}>
                <input
                  className="input"
                  value={roomNumber}
                  onChange={e => setRoomNumber(e.target.value)}
                  required
                />
              </Field>
              <Field label="Photo (Recommended)">
                <label className="upload cursor-pointer flex items-center gap-2 border border-[#CBD5E1] rounded-xl px-4 py-3 bg-white hover:bg-gray-50">
                  <Camera size={20} className="text-[#6B7280]" />
                  <span className="text-sm text-[#4B5563] truncate">
                    {photo ? photo.name : 'Upload photo of item'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                </label>
              </Field>
            </div>

            {/* Photo preview thumbnail */}
            {photoPreviewUrl && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <img src={photoPreviewUrl} alt="Thumbnail preview" className="w-16 h-16 object-cover rounded-lg border" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#111827] truncate">{photo?.name}</p>
                  <p className="text-xs text-[#6B7280]">{Math.round((photo?.size || 0) / 1024)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCropModal(true)}
                  className="flex items-center gap-1.5 text-xs text-[#2F6FED] font-medium px-2.5 py-1.5 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                  title="Crop unnecessary contents to only keep the item"
                >
                  <Crop size={13} />
                  <span>Crop Item</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setPhoto(null); setOriginalPhoto(null); setPhotoPreviewUrl(''); }}
                  className="text-xs text-red-600 hover:underline px-2 py-1"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Description */}
            <Field label="Description & Details">
              <textarea
                className="input min-h-[100px]"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </Field>

            {formError && <p className="text-sm text-red-600 font-medium">{formError}</p>}
            <ActionError error={action.error} />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPostForm(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#4B5563] hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={action.pending}
                className="primary px-6 py-2.5 text-sm font-medium disabled:opacity-50"
              >
                {action.pending ? 'Publishing…' : 'Publish to Lost & Found'}
              </button>
            </div>
          </form>
        </Card>
      )}

      <ActionError error={action.error} />

      {/* Grid of items */}
      <RequestState loading={request.loading} error={request.error} onRetry={request.reload}>
        {items.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center text-[#6B7280]">
            <HelpCircle size={36} className="mx-auto mb-2 text-[#9CA3AF]" />
            <p className="text-[17px] font-medium text-[#374151]">No items posted yet</p>
            <p className="text-sm mt-1">When someone reports a lost or found item, it will show up here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#CBD5E1] transition"
              >
                <div>
                  {/* Badges: Type, Location, Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.itemType === 'LOST' ? (
                        <span className="pill" style={{ color: AMBER, background: '#FEF3E2' }}>Lost Item</span>
                      ) : (
                        <span className="pill" style={{ color: BLUE, background: BLUE_SOFT }}>Found Item</span>
                      )}
                      {item.location && (
                        <span className="text-xs text-[#4B5563] bg-gray-100 px-2.5 py-0.5 rounded-md font-medium">
                          {item.location}
                        </span>
                      )}
                    </div>
                    <div>
                      {item.status === 'CLAIMED' ? (
                        <span className="pill" style={{ color: GREEN, background: '#E9F7EE' }}>Returned / Claimed</span>
                      ) : (
                        <span className="text-xs text-gray-500 font-medium">Open</span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-[19px] font-semibold text-[#111827] mb-2">{item.title}</h3>

                  {/* Description */}
                  <p className="text-[15px] text-[#374151] leading-relaxed mb-4">{item.description}</p>

                  {/* Photo Thumbnail */}
                  {item.photoUrl && (
                    <div className="mb-4">
                      <div
                        onClick={() => setPreviewPhoto(resolveImage(item.photoUrl))}
                        className="relative group cursor-pointer overflow-hidden rounded-xl border border-[#E5E7EB] bg-gray-50 max-h-[220px] flex items-center justify-center"
                        title="Click to view full photo"
                      >
                        <img
                          src={resolveImage(item.photoUrl)}
                          alt={item.title}
                          className="w-full h-[200px] object-cover transition group-hover:scale-[1.02]"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-xs font-medium">
                          Click to view photo
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Room & Contact Box */}
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 mb-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B7280]">
                        {item.itemType === 'LOST' ? 'Return to Room:' : 'Collect from Room:'}
                      </span>
                      <span className="font-semibold text-[#2F6FED]">
                        {item.roomNumber ? `Room ${item.roomNumber}` : 'Contact Poster'}
                      </span>
                    </div>
                    {item.authorName && (
                      <div className="flex items-center justify-between mt-1.5 text-xs text-[#6B7280]">
                        <span>Posted by:</span>
                        <span>{item.authorName} · {item.time}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between">
                  {item.status === 'OPEN' ? (
                    <button
                      type="button"
                      disabled={action.pending}
                      onClick={() => handleClaim(item.id)}
                      className="text-sm font-medium text-[#059669] hover:text-[#047857] hover:underline disabled:opacity-50"
                    >
                      ✓ Mark as Returned
                    </button>
                  ) : (
                    <span className="text-xs text-[#059669] font-medium">Returned to Owner</span>
                  )}

                  {item.isMine && (
                    <button
                      type="button"
                      disabled={action.pending}
                      onClick={() => handleDelete(item.id)}
                      className="text-xs text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </RequestState>

      {/* Modal Photo Lightbox */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden p-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 px-1 border-b border-[#E5E7EB]">
              <h4 className="font-semibold text-[17px] text-[#111827]">Item Photo</h4>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="text-gray-500 hover:text-gray-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
            </div>
            <div className="p-2 flex items-center justify-center bg-gray-900 rounded-xl mt-3 max-h-[75vh] overflow-hidden">
              <img
                src={previewPhoto}
                alt="Item Full Preview"
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Interactive Image Cropper Modal */}
      {showCropModal && originalPhoto && (
        <ImageCropModal
          file={originalPhoto}
          onCrop={handleCropComplete}
          onClose={() => setShowCropModal(false)}
        />
      )}
    </div>
  );
}

function useRequest(loader, deps = []) { const loaderRef = useRef(loader); loaderRef.current = loader; const [data, setData] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState(''); const reload = async () => { setLoading(true); setError(''); try { const result = await loaderRef.current(); setData(result); return result } catch (err) { setError(err.message || 'Request failed.'); throw err } finally { setLoading(false) } }; useEffect(() => { let active = true; setLoading(true); setError(''); loaderRef.current().then(result => { if (active) setData(result) }).catch(err => { if (active) setError(err.message || 'Request failed.') }).finally(() => { if (active) setLoading(false) }); return () => { active = false } }, deps); return { data, loading, error, reload } }
function RequestState({ loading, error, onRetry, children }) { if (loading) return <Loading />; if (error) return <div role="alert" className="my-6 border border-red-200 bg-red-50 rounded-xl p-5 text-red-800"><p className="font-medium">Could not load this information.</p><p className="text-sm mt-1 break-words">{error}</p><button type="button" onClick={() => onRetry().catch(() => { })} className="mt-3 text-sm font-semibold underline">Try again</button></div>; return children }
function Loading() { return <div aria-live="polite" className="text-[#6B7280] py-20">Loading Campus Care…</div> }

export default App;
