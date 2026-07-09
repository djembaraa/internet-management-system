import { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { MOCK_CLIENT_CONNECTION } from "../../router/constants";
import { useThemeStore } from "../../../store/themeStore";

// Dummy traffic data for chart
const trafficData = [
    { time: "00:00", upload: 0.5, download: 1.2 },
    { time: "00:10", upload: 0.8, download: 2.1 },
    { time: "00:20", upload: 1.2, download: 3.5 },
    { time: "00:30", upload: 0.6, download: 1.8 },
    { time: "00:40", upload: 1.5, download: 4.2 },
    { time: "00:50", upload: 0.9, download: 2.8 },
    { time: "01:00", upload: 1.1, download: 3.1 },
];

export default function ClientDashboard() {
    const conn = MOCK_CLIENT_CONNECTION;
    const [range, setRange] = useState("1 Hour");
    const isDark = useThemeStore((s) => s.theme === "dark");

    const infoRows: [string, React.ReactNode][] = [
        [
            "Status Perangkat",
            <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${conn.statusPerangkat === "Connected"
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                    }`}
            >
                <span
                    className={`w-1.5 h-1.5 rounded-full ${conn.statusPerangkat === "Connected"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                ></span>
                {conn.statusPerangkat}
            </span>,
        ],
        [
            "Uptime Perangkat",
            <span className="text-slate-700 dark:text-slate-100">{conn.uptimePerangkat}</span>,
        ],
        [
            "Fullname",
            <span className="text-slate-700 dark:text-slate-100">{conn.fullname}</span>,
        ],
        [
            "Paket / Layanan",
            <span className="text-slate-700 dark:text-slate-100">{conn.paketLayanan}</span>,
        ],
        [
            "Total Penggunaan Bulan Ini",
            <span className="text-slate-700 dark:text-slate-100 font-semibold tabular-nums">
                {conn.totalPenggunaan}
            </span>,
        ],
    ];

    return (
        <div className="space-y-4">
            {/* Connection Visualization */}
            {(() => {
                // Theme-aware color palette
                const c = isDark ? {
                    bg: 'from-[#0a1628] via-[#0f1d35] to-[#0a1628]',
                    border: 'border-blue-500/10',
                    gridColor: 'rgba(59,130,246,0.5)',
                    gridOpacity: '0.035',
                    blobBlue: 'bg-blue-500/[0.07]',
                    blobGreen: 'bg-emerald-500/[0.07]',
                    badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
                    badgeText: 'text-emerald-400',
                    pingDot: 'bg-emerald-400',
                    // SVG colors
                    pathBg: '#1e3a5f',
                    globeBgInner: '#1e40af',
                    globeBgOuter: '#1e3a5f',
                    globeBgInnerOp: 0.2,
                    globeBgOuterOp: 0.65,
                    serverBgInner: '#065f46',
                    serverBgOuter: '#064e3b',
                    serverBgInnerOp: 0.2,
                    serverBgOuterOp: 0.65,
                    nodeStroke: '#3b82f6',
                    globeStroke: '#60a5fa',
                    serverStroke: '#34d399',
                    serverLed: '#10b981',
                    serverLedBright: '#6ee7b7',
                    pingBadgeBg: '#0f172a',
                    pingBadgeStroke: '#10b981',
                    pingText: '#34d399',
                    labelText: '#94a3b8',
                    uploadLabel: '#34d399',
                    downloadLabel: '#a78bfa',
                    ambientOp: 0.025,
                } : {
                    bg: 'from-slate-50 via-white to-slate-50',
                    border: 'border-slate-200/80',
                    gridColor: 'rgba(148,163,184,0.35)',
                    gridOpacity: '0.5',
                    blobBlue: 'bg-blue-400/[0.08]',
                    blobGreen: 'bg-emerald-400/[0.08]',
                    badgeBg: 'bg-emerald-50 border-emerald-200',
                    badgeText: 'text-emerald-700',
                    pingDot: 'bg-emerald-500',
                    // SVG colors
                    pathBg: '#cbd5e1',
                    globeBgInner: '#dbeafe',
                    globeBgOuter: '#bfdbfe',
                    globeBgInnerOp: 0.9,
                    globeBgOuterOp: 1,
                    serverBgInner: '#d1fae5',
                    serverBgOuter: '#a7f3d0',
                    serverBgInnerOp: 0.9,
                    serverBgOuterOp: 1,
                    nodeStroke: '#3b82f6',
                    globeStroke: '#2563eb',
                    serverStroke: '#059669',
                    serverLed: '#059669',
                    serverLedBright: '#10b981',
                    pingBadgeBg: '#f0fdf4',
                    pingBadgeStroke: '#10b981',
                    pingText: '#059669',
                    labelText: '#64748b',
                    uploadLabel: '#059669',
                    downloadLabel: '#7c3aed',
                    ambientOp: 0.04,
                };
                return (
            <div className={`relative bg-gradient-to-br ${c.bg} rounded-xl border ${c.border} shadow-sm p-6 overflow-hidden`}>
                {/* Animated grid background */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(${c.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${c.gridColor} 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    opacity: c.gridOpacity,
                }} />
                {/* Ambient glow blobs */}
                <div className={`absolute top-1/2 left-[15%] -translate-y-1/2 w-40 h-40 ${c.blobBlue} rounded-full blur-3xl pointer-events-none`} />
                <div className={`absolute top-1/2 right-[15%] -translate-y-1/2 w-40 h-40 ${c.blobGreen} rounded-full blur-3xl pointer-events-none`} />

                <style>{`
                    @keyframes orbitalSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    @keyframes nodeBreath { 0%,100% { filter: drop-shadow(0 0 4px rgba(59,130,246,0.2)); } 50% { filter: drop-shadow(0 0 10px rgba(59,130,246,0.4)); } }
                    @keyframes nodeBreathLight { 0%,100% { filter: drop-shadow(0 0 2px rgba(59,130,246,0.1)); } 50% { filter: drop-shadow(0 0 6px rgba(59,130,246,0.25)); } }
                    @keyframes serverBreath { 0%,100% { filter: drop-shadow(0 0 4px rgba(16,185,129,0.2)); } 50% { filter: drop-shadow(0 0 10px rgba(16,185,129,0.4)); } }
                    @keyframes serverBreathLight { 0%,100% { filter: drop-shadow(0 0 2px rgba(16,185,129,0.1)); } 50% { filter: drop-shadow(0 0 6px rgba(16,185,129,0.25)); } }
                    @keyframes ledBlink { 0%,100% { fill: ${c.serverLed}; filter: drop-shadow(0 0 2px ${c.serverLed}); } 50% { fill: ${c.serverLedBright}; filter: drop-shadow(0 0 5px ${c.serverLedBright}); } }
                    @keyframes dashScroll { 0% { stroke-dashoffset: 24; } 100% { stroke-dashoffset: 0; } }
                    @keyframes dashScrollSlow { 0% { stroke-dashoffset: 30; } 100% { stroke-dashoffset: 0; } }
                `}</style>

                {/* Status badge */}
                <div className="relative flex items-center justify-center mb-4">
                    <div className={`flex items-center gap-2 ${c.badgeBg} backdrop-blur-sm border rounded-full px-4 py-1.5`}>
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.pingDot} opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${c.pingDot}`}></span>
                        </span>
                        <span className={`${c.badgeText} text-[11px] font-bold tracking-[0.2em]`}>CONNECTED</span>
                    </div>
                </div>

                <div className="relative flex items-center justify-center" style={{ perspective: '800px' }}>
                    <svg viewBox="0 0 600 140" className="w-full max-w-[660px] h-auto" style={{ transform: 'rotateX(8deg)', transformStyle: 'preserve-3d' }}>
                        <defs>
                            {/* Curved paths */}
                            <path id="uploadPath" d="M 100,70 C 200,70 220,30 300,30 C 380,30 400,70 500,70" fill="none" />
                            <path id="downloadPath" d="M 500,70 C 400,70 380,110 300,110 C 220,110 200,70 100,70" fill="none" />

                            {/* Gradients */}
                            <linearGradient id="upLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={c.nodeStroke} stopOpacity="0.6" />
                                <stop offset="50%" stopColor="#10b981" />
                                <stop offset="100%" stopColor={c.nodeStroke} stopOpacity="0.6" />
                            </linearGradient>
                            <linearGradient id="dnLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={c.nodeStroke} stopOpacity="0.6" />
                                <stop offset="50%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor={c.nodeStroke} stopOpacity="0.6" />
                            </linearGradient>
                            <radialGradient id="globeBg" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor={c.globeBgInner} stopOpacity={c.globeBgInnerOp} />
                                <stop offset="100%" stopColor={c.globeBgOuter} stopOpacity={c.globeBgOuterOp} />
                            </radialGradient>
                            <radialGradient id="serverBg" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor={c.serverBgInner} stopOpacity={c.serverBgInnerOp} />
                                <stop offset="100%" stopColor={c.serverBgOuter} stopOpacity={c.serverBgOuterOp} />
                            </radialGradient>

                            {/* Glow filters */}
                            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation={isDark ? 2.5 : 1.5} result="b" />
                                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation={isDark ? 3 : 2} result="b" />
                                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>

                        {/* ── Ambient circles behind nodes ── */}
                        <circle cx="100" cy="70" r="50" fill={c.nodeStroke} opacity={c.ambientOp} filter="url(#softGlow)" />
                        <circle cx="500" cy="70" r="50" fill="#10b981" opacity={c.ambientOp} filter="url(#softGlow)" />

                        {/* ── Upload path (top curve) ── */}
                        <use href="#uploadPath" stroke={c.pathBg} strokeWidth="2" opacity="0.35" />
                        <use href="#uploadPath" stroke="url(#upLineGrad)" strokeWidth="1.5" strokeDasharray="8 4" style={{ animation: "dashScroll 1.2s linear infinite" }} filter="url(#softGlow)" />

                        {/* ── Download path (bottom curve) ── */}
                        <path d="M 100,70 C 200,70 220,110 300,110 C 380,110 400,70 500,70" fill="none" stroke={c.pathBg} strokeWidth="2" opacity="0.35" />
                        <path d="M 100,70 C 200,70 220,110 300,110 C 380,110 400,70 500,70" fill="none" stroke="url(#dnLineGrad)" strokeWidth="1.5" strokeDasharray="8 4" style={{ animation: "dashScrollSlow 1.5s linear infinite" }} filter="url(#softGlow)" />

                        {/* ── Upload packets (3 orbs traveling right along top curve) ── */}
                        {[0, 0.75, 1.5].map((delay, i) => (
                            <g key={`up${i}`}>
                                <circle r="4.5" fill="#10b981" filter="url(#neonGlow)">
                                    <animateMotion dur="2.2s" repeatCount="indefinite" begin={`${delay}s`}>
                                        <mpath href="#uploadPath" />
                                    </animateMotion>
                                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.06;0.94;1" dur="2.2s" repeatCount="indefinite" begin={`${delay}s`} />
                                </circle>
                                <circle r="2" fill="#6ee7b7" opacity="0.7">
                                    <animateMotion dur="2.2s" repeatCount="indefinite" begin={`${delay + 0.12}s`}>
                                        <mpath href="#uploadPath" />
                                    </animateMotion>
                                    <animate attributeName="opacity" values="0;0.7;0.7;0" keyTimes="0;0.06;0.94;1" dur="2.2s" repeatCount="indefinite" begin={`${delay + 0.12}s`} />
                                </circle>
                            </g>
                        ))}

                        {/* ── Download packets (3 orbs traveling left along bottom curve) ── */}
                        {[0.35, 1.1, 1.85].map((delay, i) => (
                            <g key={`dn${i}`}>
                                <circle r="4" fill="#8b5cf6" filter="url(#neonGlow)">
                                    <animateMotion dur="2.6s" repeatCount="indefinite" begin={`${delay}s`}>
                                        <mpath href="#downloadPath" />
                                    </animateMotion>
                                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.06;0.94;1" dur="2.6s" repeatCount="indefinite" begin={`${delay}s`} />
                                </circle>
                                <circle r="1.8" fill="#c4b5fd" opacity="0.7">
                                    <animateMotion dur="2.6s" repeatCount="indefinite" begin={`${delay + 0.14}s`}>
                                        <mpath href="#downloadPath" />
                                    </animateMotion>
                                    <animate attributeName="opacity" values="0;0.7;0.7;0" keyTimes="0;0.06;0.94;1" dur="2.6s" repeatCount="indefinite" begin={`${delay + 0.14}s`} />
                                </circle>
                            </g>
                        ))}

                        {/* ── Left Node: DJ Internet ── */}
                        <g style={{ animation: `${isDark ? 'nodeBreath' : 'nodeBreathLight'} 3s ease-in-out infinite` }}>
                            {/* Pulse rings */}
                            <circle cx="100" cy="70" fill="none" stroke={c.nodeStroke} strokeWidth="1">
                                <animate attributeName="r" values="32;54" dur="2.4s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.45;0" dur="2.4s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="100" cy="70" fill="none" stroke={c.nodeStroke} strokeWidth="1">
                                <animate attributeName="r" values="32;54" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.45;0" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
                            </circle>

                            {/* Circle background */}
                            <circle cx="100" cy="70" r="32" fill="url(#globeBg)" stroke={c.nodeStroke} strokeWidth="1.5" strokeOpacity="0.5" />

                            {/* Orbital ring */}
                            <g style={{ transformOrigin: "100px 70px", animation: "orbitalSpin 8s linear infinite" }}>
                                <ellipse cx="100" cy="70" rx="28" ry="10" fill="none" stroke={c.globeStroke} strokeWidth="0.7" strokeDasharray="3 3" opacity="0.45" />
                                <circle cx="128" cy="70" r="2.2" fill={c.globeStroke} filter="url(#neonGlow)" />
                            </g>

                            {/* Globe icon */}
                            <circle cx="100" cy="70" r="15" fill="none" stroke={c.globeStroke} strokeWidth="1.6" />
                            <ellipse cx="100" cy="70" rx="6.5" ry="15" fill="none" stroke={c.globeStroke} strokeWidth="1" />
                            <line x1="85" y1="70" x2="115" y2="70" stroke={c.globeStroke} strokeWidth="0.8" />
                            <line x1="87" y1="61" x2="113" y2="61" stroke={c.globeStroke} strokeWidth="0.6" opacity="0.6" />
                            <line x1="87" y1="79" x2="113" y2="79" stroke={c.globeStroke} strokeWidth="0.6" opacity="0.6" />
                        </g>
                        <text x="100" y="120" textAnchor="middle" fill={c.labelText} style={{ fontSize: '11px', fontWeight: 600 }}>(DJ)</text>

                        {/* ── Center ping badge ── */}
                        <g>
                            <rect x="261" y="57" width="78" height="28" rx="14" fill={c.pingBadgeBg} stroke={c.pingBadgeStroke} strokeWidth="1" strokeOpacity="0.35" />
                            <rect x="261" y="57" width="78" height="28" rx="14" fill="#10b981" fillOpacity="0.06" />
                            {/* Signal bars */}
                            <rect x="273" y="72" width="3" height="5" rx="0.5" fill={c.pingBadgeStroke} opacity="0.4" transform="translate(0,-6)" />
                            <rect x="278" y="72" width="3" height="8" rx="0.5" fill={c.pingBadgeStroke} opacity="0.65" transform="translate(0,-9)" />
                            <rect x="283" y="72" width="3" height="11" rx="0.5" fill={c.pingBadgeStroke} transform="translate(0,-12)" />
                            <text x="314" y="76" textAnchor="middle" fill={c.pingText} style={{ fontSize: '12px', fontWeight: 700 }}>{conn.ping}</text>
                        </g>

                        {/* ── Right Node: Bras Server ── */}
                        <g style={{ animation: `${isDark ? 'serverBreath' : 'serverBreathLight'} 3s ease-in-out 1.5s infinite` }}>
                            {/* Pulse rings */}
                            <circle cx="500" cy="70" fill="none" stroke="#10b981" strokeWidth="1">
                                <animate attributeName="r" values="32;54" dur="2.4s" begin="0.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.45;0" dur="2.4s" begin="0.6s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="500" cy="70" fill="none" stroke="#10b981" strokeWidth="1">
                                <animate attributeName="r" values="32;54" dur="2.4s" begin="1.8s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.45;0" dur="2.4s" begin="1.8s" repeatCount="indefinite" />
                            </circle>

                            {/* Circle background */}
                            <circle cx="500" cy="70" r="32" fill="url(#serverBg)" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" />

                            {/* Server rack icon (3 units) */}
                            <rect x="486" y="53" width="28" height="10" rx="2.5" fill="none" stroke={c.serverStroke} strokeWidth="1.2" />
                            <circle cx="492" cy="58" r="1.8" style={{ animation: "ledBlink 1.5s ease-in-out infinite" }} />
                            <line x1="497" y1="56.5" x2="509" y2="56.5" stroke={c.serverStroke} strokeWidth="0.7" opacity="0.5" />
                            <line x1="497" y1="59.5" x2="505" y2="59.5" stroke={c.serverStroke} strokeWidth="0.7" opacity="0.35" />

                            <rect x="486" y="66" width="28" height="10" rx="2.5" fill="none" stroke={c.serverStroke} strokeWidth="1.2" />
                            <circle cx="492" cy="71" r="1.8" style={{ animation: "ledBlink 1.5s ease-in-out 0.5s infinite" }} />
                            <line x1="497" y1="69.5" x2="509" y2="69.5" stroke={c.serverStroke} strokeWidth="0.7" opacity="0.5" />
                            <line x1="497" y1="72.5" x2="505" y2="72.5" stroke={c.serverStroke} strokeWidth="0.7" opacity="0.35" />

                            <rect x="486" y="79" width="28" height="10" rx="2.5" fill="none" stroke={c.serverStroke} strokeWidth="1.2" />
                            <circle cx="492" cy="84" r="1.8" style={{ animation: "ledBlink 1.5s ease-in-out 1s infinite" }} />
                            <line x1="497" y1="82.5" x2="509" y2="82.5" stroke={c.serverStroke} strokeWidth="0.7" opacity="0.5" />
                            <line x1="497" y1="85.5" x2="505" y2="85.5" stroke={c.serverStroke} strokeWidth="0.7" opacity="0.35" />
                        </g>
                        <text x="500" y="120" textAnchor="middle" fill={c.labelText} style={{ fontSize: '11px', fontWeight: 600 }}>(Bras Server)</text>

                        {/* Path labels */}
                        <text x="300" y="20" textAnchor="middle" fill={c.uploadLabel} style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em' }} opacity="0.6">▸ UPLOAD</text>
                        <text x="300" y="136" textAnchor="middle" fill={c.downloadLabel} style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em' }} opacity="0.6">◂ DOWNLOAD</text>
                    </svg>
                </div>
            </div>
                );
            })()}

            {/* Device Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {infoRows.map(([label, value], i) => (
                        <div
                            key={i}
                            className="flex items-center px-5 py-3.5"
                        >
                            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-100 w-56 shrink-0">
                                {label}
                            </span>
                            <span className="text-[13px] text-slate-400 dark:text-slate-100 mr-3">
                                :
                            </span>
                            <span className="text-[13px]">{value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Traffic Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5">
                <div className="mb-4">
                    <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-100 mb-2">
                        Range
                    </label>
                    <select
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
                    >
                        <option>1 Hour</option>
                        <option>6 Hours</option>
                        <option>24 Hours</option>
                        <option>7 Days</option>
                    </select>
                </div>

                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trafficData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e2e8f0"
                                className="dark:opacity-20"
                            />
                            <XAxis
                                dataKey="time"
                                tick={{ fill: "#94a3b8", fontSize: 11 }}
                                axisLine={{ stroke: "#e2e8f0" }}
                            />
                            <YAxis
                                tick={{ fill: "#94a3b8", fontSize: 11 }}
                                axisLine={{ stroke: "#e2e8f0" }}
                                label={{
                                    value: "Mbps",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: { fill: "#94a3b8", fontSize: 11 },
                                }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "none",
                                    borderRadius: "8px",
                                    color: "#f1f5f9",
                                    fontSize: 12,
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="upload"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                dot={false}
                                name="Upload"
                            />
                            <Line
                                type="monotone"
                                dataKey="download"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={false}
                                name="Download"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
