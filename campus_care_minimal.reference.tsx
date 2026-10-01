import React, { useState } from 'react';
import { Home, ClipboardList, Camera, Phone, LogOut, ArrowUp, Users, CheckCircle2, Clock, Building2 } from 'lucide-react';

const INK = '#111827';
const SUB = '#6B7280';
const BORDER = '#E5E7EB';
const BG = '#F7F8FA';
const BLUE = '#2F6FED';
const BLUE_SOFT = '#EEF3FE';
const GREEN = '#16A34A';
const AMBER = '#D97706';
const RED = '#DC2626';
const RED_SOFT = '#FCEAEA';

const URGENT_VOTES = 15;
const DEPARTMENTS = ['Mess', 'Living Room', 'Laundry', 'Study Hall', 'Outside Area', 'Common Restroom', 'Lift'];
const FLOOR_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const floorLabel = (f) => f === 0 ? 'Ground' : `Floor ${f}`;
const floorHasLaundry = (f) => [2, 3, 5].includes(f);

const DIRECTORY = [
  { role: 'Electrician', name: 'Murugan K.', phone: '+91 98765 43210' },
  { role: 'Plumber', name: 'Raghavan S.', phone: '+91 98765 43211' },
  { role: 'Carpenter', name: 'Vijay R.', phone: '+91 98765 43212' },
  { role: 'Food Department', name: 'Mess Office', phone: '+91 98765 43213' },
  { role: 'Clinic', name: 'Health Centre', phone: '+91 98765 43214' },
  { role: 'Emergency', name: 'Security Desk', phone: '+91 98765 43215' },
];

const seedIssues = [
  { id: 'i1', department: 'Common Restroom', floor: 2, location: 'Block C, Floor 2', description: 'Two taps leaking near entrance.', votes: 14, voted: false, status: 'In Progress', author: 'Aditi R. · 214', time: '2d ago' },
  { id: 'i2', department: 'Study Hall', floor: 1, location: 'Floor 1, Hall B', description: 'Tube lights flickering.', votes: 9, voted: false, status: 'Reported', author: 'Kevin M. · 108', time: '4d ago' },
  { id: 'i3', department: 'Lift', floor: null, location: 'Block A', description: 'Grinding noise between floor 3–4.', votes: 22, voted: false, status: 'Reported', author: 'Sana P. · 301', time: '6h ago' },
  { id: 'i4', department: 'Mess', floor: 0, location: 'Ground floor', description: 'Water dispenser empty since yesterday.', votes: 5, voted: false, status: 'Resolved', author: 'Rahul D. · 402', time: '1d ago' },
];

const seedGuestRequests = [
  { id: 'g1', student: 'Aditi Ramesh · 214', guest: 'Radha Ramesh (Mother)', checkIn: '2026-08-25', checkOut: '2026-08-27', status: 'Pending', room: null, guestStatus: null },
  { id: 'g2', student: 'Kevin Mathew · 108', guest: 'Thomas Mathew (Father)', checkIn: '2026-08-20', checkOut: '2026-08-24', status: 'Approved', room: '804', guestStatus: 'Checked in' },
  { id: 'g3', student: 'Sana Pillai · 301', guest: 'Nisha Pillai (Sister)', checkIn: '2026-08-22', checkOut: '2026-08-23', status: 'Pending', room: null, guestStatus: null },
];

const ALL_GUEST_ROOMS = Array.from({ length: 40 }, (_, i) => String(801 + i)); // 801–840

const datesOverlap = (aStart, aEnd, bStart, bEnd) =>
  Boolean(aStart && aEnd && bStart && bEnd && aStart <= bEnd && bStart <= aEnd);

const availableRoomsFor = (requests, checkIn, checkOut, excludeId) => {
  const booked = requests
    .filter(g => g.status === 'Approved' && g.guestStatus !== 'Checked out' && g.id !== excludeId && g.room)
    .filter(g => datesOverlap(g.checkIn, g.checkOut, checkIn, checkOut))
    .map(g => g.room);
  return ALL_GUEST_ROOMS.filter(r => !booked.includes(r));
};

const todayStr = () => new Date().toISOString().slice(0, 10);

const profile = { name: 'Aditi Ramesh', email: 'aditi.ramesh@college.edu', room: '214', floor: 2, phone: '+91 90000 11223', isFloorRep: true };

export default function CampusCare() {
  const [page, setPage] = useState('login');
  const [role, setRole] = useState('student');
  const [issues, setIssues] = useState(seedIssues);
  const [guestRequests, setGuestRequests] = useState(seedGuestRequests);

  const login = (r) => { setRole(r); setPage('dashboard'); };
  const logout = () => setPage('login');

  const toggleVote = (id) => setIssues(prev => prev.map(i => i.id === id ? { ...i, voted: !i.voted, votes: i.voted ? i.votes - 1 : i.votes + 1 } : i));
  const markResolved = (id) => setIssues(prev => prev.map(i => i.id === id ? { ...i, status: 'Resolved' } : i));

  const approveGuest = (id, room) => setGuestRequests(prev => prev.map(g => g.id === id ? { ...g, status: 'Approved', room, guestStatus: 'Awaiting' } : g));
  const rejectGuest = (id) => setGuestRequests(prev => prev.map(g => g.id === id ? { ...g, status: 'Rejected' } : g));
  const markArrived = (id) => setGuestRequests(prev => prev.map(g => g.id === id ? { ...g, guestStatus: 'Checked in' } : g));
  const markDeparted = (id) => setGuestRequests(prev => prev.map(g => g.id === id ? { ...g, guestStatus: 'Checked out' } : g));

  const inputBase = { width: '100%', padding: '9px 12px', fontSize: '14px', borderRadius: '8px', border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', color: INK, outline: 'none' };
  const Label = ({ children }) => <label className="block text-[13px] font-medium mb-1.5" style={{ color: INK }}>{children}</label>;

  const StatusPill = ({ status }) => {
    const map = { 'Reported': { fg: SUB, bg: '#F3F4F6' }, 'In Progress': { fg: AMBER, bg: '#FEF3E2' }, 'Resolved': { fg: GREEN, bg: '#E9F7EE' }, 'Pending': { fg: AMBER, bg: '#FEF3E2' }, 'Approved': { fg: GREEN, bg: '#E9F7EE' }, 'Rejected': { fg: RED, bg: RED_SOFT }, 'Awaiting': { fg: SUB, bg: '#F3F4F6' }, 'Checked in': { fg: BLUE, bg: BLUE_SOFT }, 'Checked out': { fg: GREEN, bg: '#E9F7EE' } };
    const s = map[status] || { fg: SUB, bg: '#F3F4F6' };
    return <span className="text-[12px] px-2 py-0.5 rounded-full font-medium" style={{ color: s.fg, backgroundColor: s.bg }}>{status}</span>;
  };

  const UrgentTag = () => (
    <span className="text-[12px] px-2 py-0.5 rounded-full font-medium" style={{ color: RED, backgroundColor: RED_SOFT }}>Urgent</span>
  );

  const VoteButton = ({ issue }) => (
    <button onClick={() => toggleVote(issue.id)} className="flex flex-col items-center justify-center rounded-lg" style={{ width: 48, height: 48, border: `1px solid ${issue.voted ? BLUE : BORDER}`, backgroundColor: issue.voted ? BLUE_SOFT : '#FFFFFF', color: issue.voted ? BLUE : SUB }}>
      <ArrowUp size={15} strokeWidth={2.5} />
      <span className="text-[13px] font-semibold">{issue.votes}</span>
    </button>
  );

  const Donut = ({ segments, size = 72 }) => {
    let acc = 0;
    const stops = segments.map(s => { const start = acc; acc += s.pct; return `${s.color} ${start}% ${acc}%`; }).join(', ');
    const main = segments[0];
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <div style={{ width: size, height: size, borderRadius: '50%', background: `conic-gradient(${stops})` }} />
        <div style={{ position: 'absolute', inset: size * 0.15, background: '#FFFFFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="text-[15px] font-semibold" style={{ color: INK }}>{main.pct}%</span>
        </div>
      </div>
    );
  };

  const StatCard = ({ icon: Icon, tint, value, label }) => (
    <div className="rounded-xl p-4" style={{ border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: tint + '1A' }}>
        <Icon size={16} style={{ color: tint }} />
      </div>
      <p className="text-[22px] font-semibold leading-none" style={{ color: INK }}>{value}</p>
      <p className="text-[13px] mt-1.5" style={{ color: INK }}>{label}</p>
    </div>
  );

  const Card = ({ title, children }) => (
    <div className="rounded-xl p-5" style={{ border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF' }}>
      <p className="text-[14px] font-semibold mb-4" style={{ color: INK }}>{title}</p>
      {children}
    </div>
  );

  // ---------------- LOGIN ----------------
  if (page === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG }}>
        <div className="w-full max-w-[380px] p-8 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}` }}>
          <p className="text-[20px] font-semibold mb-6" style={{ color: INK }}>Campus Care</p>
          <div className="flex gap-6 mb-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
            {['student', 'staff'].map(r => (
              <button key={r} onClick={() => setRole(r)} className="pb-2.5 text-[14px] font-medium capitalize" style={{ color: role === r ? BLUE : SUB, borderBottom: role === r ? `2px solid ${BLUE}` : '2px solid transparent', marginBottom: '-1px' }}>{r}</button>
            ))}
          </div>
          <div className="space-y-4">
            <div><Label>Email</Label><input style={inputBase} placeholder="name@college.edu" /></div>
            <div><Label>Password</Label><input type="password" style={inputBase} placeholder="••••••••" /></div>
            <button onClick={() => login(role)} className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-white" style={{ backgroundColor: BLUE }}>Log In</button>
          </div>
        </div>
      </div>
    );
  }

  const studentNav = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'feed', label: 'Feed', icon: ClipboardList },
    { id: 'report', label: 'Report Issue', icon: Camera },
    { id: 'guestRooms', label: 'Guest Rooms', icon: Building2 },
    ...(profile.isFloorRep ? [{ id: 'digest', label: 'Floor Digest', icon: Users }] : []),
  ];
  const staffNav = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'queue', label: 'Issue Queue', icon: ClipboardList },
    { id: 'guestRequests', label: 'Guest Requests', icon: Building2 },
    { id: 'directory', label: 'Directory', icon: Phone },
  ];
  const nav = role === 'student' ? studentNav : staffNav;

  // ---------------- Sidebar ----------------
  const Sidebar = () => (
    <div className="w-60 flex flex-col shrink-0" style={{ backgroundColor: '#FFFFFF', borderRight: `1px solid ${BORDER}` }}>
      <div className="px-5 py-5"><p className="text-[17px] font-semibold" style={{ color: INK }}>Campus Care</p></div>
      <nav className="flex-1 px-3 space-y-0.5">
        {nav.map(item => {
          const active = page === item.id;
          return (
            <button key={item.id} onClick={() => setPage(item.id)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[14px] font-medium" style={{ color: active ? BLUE : SUB, backgroundColor: active ? BLUE_SOFT : 'transparent' }}>
              <item.icon size={16} /> {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-3">
        <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[14px]" style={{ color: SUB }}>
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </div>
  );

  const Header = ({ title, sub }) => (
    <div className="mb-6">
      <p className="text-[22px] font-semibold" style={{ color: INK }}>{title}</p>
      {sub && <p className="text-[13px] mt-0.5" style={{ color: SUB }}>{sub}</p>}
    </div>
  );

  // ---------------- STUDENT DASHBOARD ----------------
  const StudentDashboard = () => {
    const mine = issues.filter(i => i.author.includes(profile.name.split(' ')[0]));
    const myGuest = guestRequests.filter(g => g.student.includes(profile.name.split(' ')[0]))[0];
    return (
      <>
        <Header title="Dashboard" sub={`Welcome, ${profile.name}`} />
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard icon={ClipboardList} tint={BLUE} value={mine.length} label="Reports filed" />
          <StatCard icon={ArrowUp} tint={AMBER} value={issues.reduce((s, i) => s + i.votes, 0)} label="Total votes cast" />
          <StatCard icon={Building2} tint={GREEN} value={myGuest ? myGuest.status : 'None'} label="Guest booking" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card title="Your floor">
            <p className="text-[14px]" style={{ color: INK }}>Floor {profile.floor} · Room {profile.room}</p>
            <div className="mt-3 space-y-1.5 text-[13px]" style={{ color: SUB }}>
              <p>Study halls: 2</p>
              <p>Laundry area: {floorHasLaundry(profile.floor) ? 'Yes' : 'No'}</p>
              <p>Mess: Ground floor</p>
            </div>
          </Card>
          <Card title="Recent activity">
            <div className="space-y-3">
              {issues.slice(0, 3).map(i => (
                <div key={i.id} className="flex items-center justify-between">
                  <p className="text-[13px]" style={{ color: INK }}>{i.department}</p>
                  <StatusPill status={i.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </>
    );
  };

  // ---------------- STAFF DASHBOARD ----------------
  const StaffDashboard = () => {
    const open = issues.filter(i => i.status === 'Reported').length;
    const inProgress = issues.filter(i => i.status === 'In Progress').length;
    const resolved = issues.filter(i => i.status === 'Resolved').length;
    const total = issues.length;
    const urgentCount = issues.filter(i => i.votes >= URGENT_VOTES && i.status !== 'Resolved').length;
    const pendingGuests = guestRequests.filter(g => g.status === 'Pending').length;

    const complaintSegments = [
      { pct: Math.round((open / total) * 100), color: SUB },
      { pct: Math.round((inProgress / total) * 100), color: AMBER },
      { pct: Math.round((resolved / total) * 100), color: GREEN },
    ];

    return (
      <>
        <Header title="Dashboard" sub="Welcome, Staff" />
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard icon={ClipboardList} tint={RED} value={urgentCount} label="Urgent (15+ votes)" />
          <StatCard icon={Clock} tint={AMBER} value={inProgress} label="In Progress" />
          <StatCard icon={CheckCircle2} tint={GREEN} value={resolved} label="Resolved" />
          <StatCard icon={Building2} tint={BLUE} value={pendingGuests} label="Guest requests" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card title="Complaints">
            <div className="flex items-center gap-5">
              <Donut segments={complaintSegments} />
              <div className="text-[13px] space-y-1.5" style={{ color: SUB }}>
                <p><span style={{ color: SUB }}>●</span> Open — {open}</p>
                <p><span style={{ color: AMBER }}>●</span> In Progress — {inProgress}</p>
                <p><span style={{ color: GREEN }}>●</span> Resolved — {resolved}</p>
              </div>
            </div>
          </Card>
          <Card title="Guest requests">
            <div className="space-y-3">
              {guestRequests.slice(0, 3).map(g => (
                <div key={g.id} className="flex items-center justify-between">
                  <p className="text-[13px]" style={{ color: INK }}>{g.student}</p>
                  <StatusPill status={g.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </>
    );
  };

  // ---------------- FEED (student, with urgent tag) ----------------
  const IssueRow = ({ issue, showResolve }) => {
    const isUrgent = issue.votes >= URGENT_VOTES && issue.status !== 'Resolved';
    return (
      <div className="py-5 flex gap-4 items-start">
        <VoteButton issue={issue} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[12px] font-medium px-2 py-0.5 rounded" style={{ backgroundColor: '#F3F4F6', color: INK }}>{issue.department}</span>
            <span className="text-[12px]" style={{ color: SUB }}>{issue.location}</span>
            <StatusPill status={issue.status} />
            {isUrgent && <UrgentTag />}
          </div>
          <p className="text-[14px]" style={{ color: INK }}>{issue.description}</p>
          <p className="text-[12px] mt-1" style={{ color: SUB }}>{issue.author} · {issue.time}</p>
        </div>
        {showResolve && issue.status !== 'Resolved' && (
          <button onClick={() => markResolved(issue.id)} className="text-[13px] font-medium whitespace-nowrap" style={{ color: BLUE }}>Mark resolved</button>
        )}
      </div>
    );
  };

  const IssueList = ({ list, showResolve }) => (
    <div>
      {list.map((issue, idx) => (
        <div key={issue.id}>
          {idx > 0 && <div style={{ borderTop: `1px solid ${BORDER}` }} />}
          <IssueRow issue={issue} showResolve={showResolve} />
        </div>
      ))}
    </div>
  );

  const Feed = () => (<><Header title="Feed" /><IssueList list={issues} showResolve={false} /></>);

  const Queue = () => {
    const sorted = [...issues].sort((a, b) => b.votes - a.votes);
    const urgent = sorted.filter(i => i.votes >= URGENT_VOTES && i.status !== 'Resolved');
    const rest = sorted.filter(i => !(i.votes >= URGENT_VOTES && i.status !== 'Resolved'));
    return (
      <>
        <Header title="Issue Queue" sub={urgent.length ? `${urgent.length} issue${urgent.length > 1 ? 's' : ''} past the urgent threshold (${URGENT_VOTES} votes)` : undefined} />
        {urgent.length > 0 && (
          <>
            <p className="text-[12px] font-semibold uppercase mb-1" style={{ color: RED, letterSpacing: '0.04em' }}>Urgent</p>
            <IssueList list={urgent} showResolve={true} />
            <p className="text-[12px] font-semibold uppercase mt-4 mb-1" style={{ color: SUB, letterSpacing: '0.04em' }}>All other issues</p>
          </>
        )}
        <IssueList list={rest} showResolve={true} />
      </>
    );
  };

  // ---------------- REPORT (with duplicate detection) ----------------
  const Report = () => {
    const [dept, setDept] = useState(DEPARTMENTS[0]);
    const [floor, setFloor] = useState(profile.floor);
    const [location, setLocation] = useState('');
    const [desc, setDesc] = useState('');
    const [done, setDone] = useState(false);

    const duplicates = issues.filter(i => i.department === dept && i.floor === floor && i.status !== 'Resolved');

    const submit = () => {
      setIssues(prev => [{ id: 'i' + Date.now(), department: dept, floor, location: location || floorLabel(floor), description: desc || '—', votes: 0, voted: false, status: 'Reported', author: `${profile.name} · ${profile.room}`, time: 'now' }, ...prev]);
      setDone(true);
      setTimeout(() => { setDone(false); setPage('feed'); }, 1000);
    };

    return (
      <div className="max-w-[480px]">
        <Header title="Report Issue" />
        {done ? (
          <p className="text-[14px] p-4 rounded-lg" style={{ backgroundColor: BLUE_SOFT, color: BLUE }}>Posted to feed.</p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Department</Label><select value={dept} onChange={e => setDept(e.target.value)} style={inputBase}>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></div>
              <div><Label>Floor</Label><select value={floor} onChange={e => setFloor(Number(e.target.value))} style={inputBase}>{FLOOR_OPTIONS.map(f => <option key={f} value={f}>{floorLabel(f)}</option>)}</select></div>
            </div>

            {duplicates.length > 0 && (
              <div className="rounded-lg p-3" style={{ backgroundColor: '#F3F4F6' }}>
                <p className="text-[13px] font-medium mb-2" style={{ color: INK }}>Already reported on {floorLabel(floor)}</p>
                {duplicates.map(d => (
                  <div key={d.id} className="flex items-center justify-between py-1.5">
                    <p className="text-[13px]" style={{ color: SUB }}>{d.description}</p>
                    <button onClick={() => toggleVote(d.id)} className="text-[12px] font-medium px-2 py-1 rounded shrink-0 ml-2" style={{ color: d.voted ? BLUE : INK, backgroundColor: d.voted ? BLUE_SOFT : '#FFFFFF', border: `1px solid ${d.voted ? BLUE : BORDER}` }}>
                      {d.voted ? 'Voted' : `Vote (${d.votes})`}
                    </button>
                  </div>
                ))}
                <p className="text-[12px] mt-2" style={{ color: SUB }}>Vote instead of posting a duplicate, or continue below if this is different.</p>
              </div>
            )}

            <div><Label>Location detail (optional)</Label><input style={inputBase} value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Near Room 214" /></div>
            <div>
              <Label>Photo</Label>
              <button className="w-full py-6 rounded-lg flex flex-col items-center gap-1.5" style={{ border: `1px dashed ${BORDER}` }}>
                <Camera size={18} style={{ color: SUB }} />
                <span className="text-[13px]" style={{ color: SUB }}>Upload photo</span>
              </button>
            </div>
            <div><Label>Description</Label><textarea rows={3} style={{ ...inputBase, resize: 'vertical' }} value={desc} onChange={e => setDesc(e.target.value)} placeholder="What's wrong?" /></div>
            <button onClick={submit} className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-white" style={{ backgroundColor: BLUE }}>Submit</button>
          </div>
        )}
      </div>
    );
  };

  // ---------------- GUEST ROOMS (student) ----------------
  const GuestRooms = () => {
    const [guest, setGuest] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [done, setDone] = useState(false);
    const mine = guestRequests.filter(g => g.student.includes(profile.name.split(' ')[0]));

    const submit = () => {
      setGuestRequests(prev => [...prev, { id: 'g' + Date.now(), student: `${profile.name} · ${profile.room}`, guest: guest || '—', checkIn, checkOut, status: 'Pending', room: null, guestStatus: null }]);
      setGuest(''); setCheckIn(''); setCheckOut('');
      setDone(true);
      setTimeout(() => setDone(false), 1200);
    };

    return (
      <div className="max-w-[520px]">
        <Header title="Guest Rooms" sub="Floor 8 · Verified by staff before allocation" />
        <Card title="New request">
          {done ? (
            <p className="text-[14px] p-3 rounded-lg" style={{ backgroundColor: BLUE_SOFT, color: BLUE }}>Request sent for verification.</p>
          ) : (
            <div className="space-y-4">
              <div><Label>Guest name & relation</Label><input style={inputBase} value={guest} onChange={e => setGuest(e.target.value)} placeholder="e.g. Radha Ramesh (Mother)" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Check-in</Label><input type="date" style={inputBase} value={checkIn} onChange={e => setCheckIn(e.target.value)} /></div>
                <div><Label>Check-out</Label><input type="date" style={inputBase} value={checkOut} onChange={e => setCheckOut(e.target.value)} /></div>
              </div>
              <button onClick={submit} className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-white" style={{ backgroundColor: BLUE }}>Send request</button>
            </div>
          )}
        </Card>

        <p className="text-[13px] font-semibold mt-6 mb-3" style={{ color: INK }}>Your requests</p>
        <div>
          {mine.length === 0 && <p className="text-[13px]" style={{ color: SUB }}>No requests yet.</p>}
          {mine.map((g, idx) => (
            <div key={g.id}>
              {idx > 0 && <div style={{ borderTop: `1px solid ${BORDER}` }} />}
              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-[13px]" style={{ color: INK }}>{g.guest}</p>
                  <p className="text-[12px]" style={{ color: SUB }}>{g.checkIn} → {g.checkOut}{g.room ? ` · Room ${g.room}` : ''}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusPill status={g.status} />
                  {g.guestStatus && <StatusPill status={g.guestStatus} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ---------------- GUEST REQUESTS (staff, with arrival/departure log) ----------------
  const GuestRequestsPage = () => {
    const [roomChoice, setRoomChoice] = useState({});
    const freeToday = availableRoomsFor(guestRequests, todayStr(), todayStr(), null).length;
    return (
      <div className="max-w-[640px]">
        <Header title="Guest Requests" sub={`Floor 8 · ${freeToday}/40 rooms free today`} />
        <div>
          {guestRequests.map((g, idx) => {
            const options = availableRoomsFor(guestRequests, g.checkIn, g.checkOut, g.id);
            return (
              <div key={g.id}>
                {idx > 0 && <div style={{ borderTop: `1px solid ${BORDER}` }} />}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[14px]" style={{ color: INK }}>{g.student}</p>
                    <p className="text-[13px]" style={{ color: SUB }}>{g.guest} · {g.checkIn} → {g.checkOut}</p>
                  </div>
                  {g.status === 'Pending' ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <select style={{ ...inputBase, width: 90, padding: '6px 8px' }} value={roomChoice[g.id] || ''} onChange={e => setRoomChoice(prev => ({ ...prev, [g.id]: e.target.value }))}>
                        <option value="">{options.length} free</option>
                        {options.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <button disabled={!roomChoice[g.id]} onClick={() => approveGuest(g.id, roomChoice[g.id])} className="text-[13px] font-medium" style={{ color: roomChoice[g.id] ? BLUE : SUB }}>Approve</button>
                      <button onClick={() => rejectGuest(g.id)} className="text-[13px] font-medium" style={{ color: RED }}>Reject</button>
                    </div>
                  ) : (
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 justify-end">
                        <StatusPill status={g.status} />
                        {g.guestStatus && <StatusPill status={g.guestStatus} />}
                      </div>
                      {g.room && <p className="text-[12px] mt-1" style={{ color: SUB }}>Room {g.room}</p>}
                      {g.status === 'Approved' && g.guestStatus === 'Awaiting' && (
                        <button onClick={() => markArrived(g.id)} className="text-[12px] font-medium mt-1" style={{ color: BLUE }}>Mark arrived</button>
                      )}
                      {g.status === 'Approved' && g.guestStatus === 'Checked in' && (
                        <button onClick={() => markDeparted(g.id)} className="text-[12px] font-medium mt-1" style={{ color: BLUE }}>Mark departed</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ---------------- DIRECTORY (staff only) ----------------
  const Directory = () => (
    <div className="max-w-[560px]">
      <Header title="Directory" />
      <div>
        {DIRECTORY.map((d, idx) => (
          <div key={d.role}>
            {idx > 0 && <div style={{ borderTop: `1px solid ${BORDER}` }} />}
            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="text-[14px]" style={{ color: INK }}>{d.role}</p>
                <p className="text-[12px]" style={{ color: SUB }}>{d.name}</p>
              </div>
              <a href={`tel:${d.phone}`} className="text-[13px] font-medium" style={{ color: BLUE }}>{d.phone}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ---------------- FLOOR DIGEST (student, floor rep only) ----------------
  const Digest = () => {
    const floorIssues = issues.filter(i => i.floor === profile.floor && i.status !== 'Resolved').sort((a, b) => b.votes - a.votes);
    return (
      <div className="max-w-[520px]">
        <Header title={`${floorLabel(profile.floor)} Digest`} sub="Weekly summary for floor reps" />
        {floorIssues.length === 0 ? (
          <p className="text-[13px]" style={{ color: SUB }}>No open issues on your floor this week.</p>
        ) : (
          <div>
            {floorIssues.map((i, idx) => (
              <div key={i.id}>
                {idx > 0 && <div style={{ borderTop: `1px solid ${BORDER}` }} />}
                <div className="py-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] font-medium px-2 py-0.5 rounded" style={{ backgroundColor: '#F3F4F6', color: INK }}>{i.department}</span>
                      <StatusPill status={i.status} />
                      {i.votes >= URGENT_VOTES && <UrgentTag />}
                    </div>
                    <p className="text-[13px]" style={{ color: INK }}>{i.description}</p>
                  </div>
                  <p className="text-[13px] font-semibold shrink-0" style={{ color: SUB }}>{i.votes} votes</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const pageMap = role === 'student'
    ? { dashboard: <StudentDashboard />, feed: <Feed />, report: <Report />, guestRooms: <GuestRooms />, digest: <Digest /> }
    : { dashboard: <StaffDashboard />, queue: <Queue />, guestRequests: <GuestRequestsPage />, directory: <Directory /> };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: BG }}>
      <Sidebar />
      <div className="flex-1 px-8 py-8 overflow-y-auto">
        {pageMap[page]}
      </div>
    </div>
  );
}