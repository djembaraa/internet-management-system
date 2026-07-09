import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Activity,
  Server,
  Network,
  Wifi,
  FileText,
  Calculator,
  Users as UsersIcon,
  History,
  Ticket,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Settings,
  Megaphone,
} from "lucide-react";
import { clsx } from "clsx";
import { useAuthStore } from "../features/auth/store/authStore";
import { useThemeStore } from "../store/themeStore";

interface NavChild {
  name: string;
  path: string;
}

interface NavMenu {
  name: string;
  path: string;
  icon: React.ElementType;
  children?: NavChild[];
}

const ADMIN_NAV_MENUS: NavMenu[] = [
  { name: "Dashboard", path: "/", icon: Home },
  {
    name: "Monitoring",
    path: "/monitoring",
    icon: Activity,
    children: [
      { name: "OLT", path: "/monitoring" },
      { name: "Traffic PPPoE Client", path: "/monitoring/traffic" },
    ],
  },
  { name: "Router", path: "/router", icon: Server },
  {
    name: "PPPoE",
    path: "/pppoe",
    icon: Network,
    children: [
      { name: "Profiles", path: "/pppoe" },
      { name: "Users", path: "/pppoe/users" },
    ],
  },
  {
    name: "Hotspot",
    path: "/hotspot",
    icon: Wifi,
    children: [
      { name: "Hotspot Profile", path: "/hotspot" },
      { name: "Hotspot Voucher", path: "/hotspot/voucher" },
      { name: "Voucher Editor", path: "/hotspot/editor" },
    ],
  },
  {
    name: "Invoice",
    path: "/invoice",
    icon: FileText,
    children: [
      { name: "PPPoE", path: "/invoice" },
      { name: "Manual", path: "/invoice/manual" },
    ],
  },
  { name: "Accounting", path: "/accounting", icon: Calculator },
  {
    name: "Broadcast",
    path: "/broadcast",
    icon: Megaphone,
    children: [
      { name: "Kirim Pesan ke Semua User", path: "/broadcast/all" },
      { name: "Kirim Pesan Pribadi", path: "/broadcast/personal" },
    ],
  },
  { name: "Log", path: "/log", icon: History },
  { name: "Ticket", path: "/ticket", icon: Ticket },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    children: [
      { name: "Billing", path: "/settings/billing" },
      { name: "Telegram", path: "/settings/telegram" },
      { name: "WhatsApp", path: "/settings/whatsapp" },
      { name: "Template Invoice", path: "/settings/template-invoice" },
      { name: "Payment Gateway", path: "/settings/payment-gateway" },
    ],
  },
];

const ROOT_NAV_MENUS: NavMenu[] = [
  { name: "Dashboard", path: "/", icon: Home },
  {
    name: "Users",
    path: "/users",
    icon: UsersIcon,
    children: [
      { name: "Users", path: "/users" },
      { name: "User Packages", path: "/users/packages" },
    ],
  },
  {
    name: "Invoice",
    path: "/invoice",
    icon: FileText,
    children: [
      { name: "PPPoE", path: "/invoice" },
      { name: "Manual", path: "/invoice/manual" },
    ],
  },
  { name: "Accounting", path: "/accounting", icon: Calculator },
  {
    name: "Broadcast",
    path: "/broadcast",
    icon: Megaphone,
    children: [
      { name: "Kirim Pesan ke Semua User", path: "/broadcast/all" },
      { name: "Kirim Pesan Pribadi", path: "/broadcast/personal" },
    ],
  },
  { name: "Log", path: "/log", icon: History },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    children: [
      { name: "Billing", path: "/settings/billing" },
      { name: "Telegram", path: "/settings/telegram" },
      { name: "WhatsApp", path: "/settings/whatsapp" },
      { name: "Template Invoice", path: "/settings/template-invoice" },
      { name: "Payment Gateway", path: "/settings/payment-gateway" },
    ],
  },
];

const CLIENT_NAV_MENUS: NavMenu[] = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Invoice", path: "/client/invoice", icon: FileText },
  { name: "Kelola Jaringan", path: "/client/network", icon: Network },
  { name: "Ticket", path: "/client/ticket", icon: Ticket },
];

function isMenuActive(pathname: string, menu: NavMenu): boolean {
  if (menu.path === "/") return pathname === "/";
  return pathname === menu.path || pathname.startsWith(menu.path + "/");
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  // drawerRef lets the click-outside handler ignore taps inside the mobile drawer
  const drawerRef = useRef<HTMLElement>(null);

  // Close mobile drawer & desktop dropdowns whenever the route changes.
  useEffect(() => {
    setOpenDrop(null);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      // Do NOT close the desktop dropdown when the user taps inside the mobile
      // drawer — drawer items are outside navRef and would otherwise collapse
      // the accordion before navigation fires.
      const insideNav = navRef.current?.contains(target);
      const insideDrawer = drawerRef.current?.contains(target);
      if (!insideNav && !insideDrawer) {
        setOpenDrop(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggle = (name: string) =>
    setOpenDrop((p) => (p === name ? null : name));

  const isClient = user?.role === "client";
  const isRoot = user?.role === "root";
  const navMenus = isClient
    ? CLIENT_NAV_MENUS
    : isRoot
      ? ROOT_NAV_MENUS
      : ADMIN_NAV_MENUS;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 md:px-6 py-3 flex justify-between items-center z-30 sticky top-0 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-lg text-slate-500 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center select-none">
            <img
              src="/dj-logo.jpg"
              alt="DJ IMS Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/account"
            className="hidden sm:flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#155b96] to-blue-400 flex items-center justify-center text-white text-xs font-bold">
              {(user?.email?.[0] || "N").toUpperCase()}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold leading-tight text-slate-700 dark:text-slate-100">
                {user?.email || "nizar"}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-100 capitalize leading-tight">
                {isClient
                  ? "User"
                  : isRoot
                    ? "Super Admin"
                    : user?.role === "admin"
                      ? "Admin"
                      : user?.role || "Admin"}
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <nav
        ref={navRef}
        className="hidden md:block bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 px-6 z-20 relative"
      >
        <div className="flex gap-0.5 pb-0 pt-0">
          {navMenus.map((menu) => {
            const active = isMenuActive(location.pathname, menu);
            const Icon = menu.icon;
            const hasSub = !!menu.children?.length;
            const isOpen = openDrop === menu.name;

            return (
              <div key={menu.name} className="relative">
                {hasSub ? (
                  <button
                    onClick={() => toggle(menu.name)}
                    className={clsx(
                      "flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-medium transition-all whitespace-nowrap border-b-2 rounded-t-lg",
                      active
                        ? "border-[#155b96] text-[#155b96] bg-blue-50/50 dark:bg-blue-950/30"
                        : "border-transparent text-slate-500 dark:text-slate-100 hover:text-[#155b96] hover:bg-slate-50 dark:hover:bg-slate-800/50",
                    )}
                  >
                    <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                    {menu.name}
                    <ChevronDown
                      size={13}
                      className={clsx(
                        "transition-transform duration-200 opacity-60",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    to={menu.path}
                    className={clsx(
                      "flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-medium transition-all whitespace-nowrap border-b-2 rounded-t-lg",
                      active
                        ? "border-[#155b96] text-[#155b96] bg-blue-50/50 dark:bg-blue-950/30"
                        : "border-transparent text-slate-500 dark:text-slate-100 hover:text-[#155b96] hover:bg-slate-50 dark:hover:bg-slate-800/50",
                    )}
                  >
                    <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                    {menu.name}
                  </Link>
                )}

                {hasSub && isOpen && (
                  <div className="absolute left-0 top-full z-[60] mt-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-black/30 rounded-lg w-48 py-1">
                    {menu.children!.map((child) => {
                      const childActive = location.pathname === child.path;
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={clsx(
                            "block px-4 py-2 text-[13px] transition-colors",
                            childActive
                              ? "text-[#155b96] font-semibold bg-blue-50/80 dark:bg-blue-950/30"
                              : "text-slate-600 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#155b96]",
                          )}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* ══════════ MOBILE OVERLAY ══════════ */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* ══════════ MOBILE DRAWER ══════════ */}
      <aside
        ref={drawerRef}
        className={clsx(
          "fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-out md:hidden flex flex-col",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Drawer header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src="/dj-logo.jpg"
              alt="DJ IMS Logo"
              className="h-7 w-auto object-contain"
            />
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer user card */}
        <Link
          to="/account"
          className="mx-4 mt-4 mb-2 flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 hover:border-[#155b96]/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#155b96] to-blue-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {(user?.email?.[0] || "N").toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-100 truncate">
              {user?.email || "nizar"}
            </p>
            <p className="text-[11px] text-slate-400 capitalize">
              {user?.role || "Admin"}
            </p>
          </div>
        </Link>

        {/* Drawer nav items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {navMenus.map((menu) => {
            const active = isMenuActive(location.pathname, menu);
            const Icon = menu.icon;
            const hasSub = !!menu.children?.length;
            const isOpen = openDrop === menu.name;

            return (
              <div key={menu.name}>
                {hasSub ? (
                  <button
                    onClick={() => toggle(menu.name)}
                    className={clsx(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all",
                      active
                        ? "bg-blue-50 dark:bg-blue-950/30 text-[#155b96]"
                        : "text-slate-600 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800",
                    )}
                  >
                    <Icon
                      size={18}
                      strokeWidth={active ? 2.5 : 2}
                      className={active ? "text-[#155b96]" : "text-slate-400"}
                    />
                    <span className="flex-1 text-left">{menu.name}</span>
                    <ChevronDown
                      size={14}
                      className={clsx(
                        "text-slate-400 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    to={menu.path}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all",
                      active
                        ? "bg-blue-50 dark:bg-blue-950/30 text-[#155b96]"
                        : "text-slate-600 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800",
                    )}
                  >
                    <Icon
                      size={18}
                      strokeWidth={active ? 2.5 : 2}
                      className={active ? "text-[#155b96]" : "text-slate-400"}
                    />
                    {menu.name}
                  </Link>
                )}

                {hasSub && isOpen && (
                  <div className="ml-9 mt-0.5 mb-1 pl-3 border-l-2 border-slate-200 dark:border-slate-700 space-y-0.5">
                    {menu.children!.map((child) => {
                      const childActive = location.pathname === child.path;
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={clsx(
                            "block px-3 py-2 rounded-md text-[13px] transition-colors",
                            childActive
                              ? "text-[#155b96] font-semibold bg-blue-50/80 dark:bg-blue-950/20"
                              : "text-slate-500 dark:text-slate-100 hover:text-[#155b96] hover:bg-slate-50 dark:hover:bg-slate-800",
                          )}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer footer */}
        <div className="px-3 py-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-600 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} className="text-slate-400" />
            )}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main className="flex-1 p-4 md:p-6 max-w-[1600px] mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
