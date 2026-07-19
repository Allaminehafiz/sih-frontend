import { useState } from "react";
import Icon from "../common/Icon";

const allMenuItems = [
  { label: "Dashboard", icon: "dashboard", href: "/", roles: ["MEDECIN", "ADMIN", "AGENT_ADMISSION", "COMPTABLE"] },
  { label: "Patients", icon: "group", href: "/patients", roles: ["MEDECIN", "ADMIN", "AGENT_ADMISSION", "COMPTABLE"] },
  { label: "Hospitalises", icon: "local_hotel", href: "/hospitalises", roles: ["MEDECIN", "ADMIN", "AGENT_ADMISSION", "COMPTABLE"] },
  { label: "Calendar", icon: "calendar_month", href: "/calendar", roles: ["MEDECIN", "ADMIN", "AGENT_ADMISSION", "COMPTABLE"] },
  { label: "Medical Records", icon: "history_edu", href: "/medical-records", roles: ["MEDECIN", "ADMIN", "AGENT_ADMISSION", "COMPTABLE"] },
  { label: "Billing", icon: "receipt_long", href: "/billing", roles: ["MEDECIN", "ADMIN", "COMPTABLE"] },
  { label: "Staff", icon: "medical_services", href: "/staff", roles: ["MEDECIN", "ADMIN"] },
];

const Sidebar = ({ activePage = "Dashboard", onNavigate, onLogout, user }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = allMenuItems.filter(item => item.roles.includes(user?.role));

  const handleNavigate = (page) => {
    if (onNavigate) onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md">
        <Icon name="menu" size={24} />
      </button>

      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)}></div>}

      <aside className={`h-screen w-64 fixed left-0 top-0 bg-slate-50 flex flex-col p-4 z-50 border-r border-gray-200 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="px-4 py-6 mb-4">
          <h1 className="font-extrabold text-teal-900 text-xl" style={{ fontFamily: 'Manrope, sans-serif' }}>Sanctuary Health</h1>
          <p className="text-xs text-slate-500 font-medium">Precision Care Portal</p>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = activePage === item.label;
            return (
              <a key={item.label} href={item.href} onClick={(e) => { e.preventDefault(); handleNavigate(item.label); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? "bg-white text-teal-700 shadow-sm font-bold" : "text-slate-600 hover:text-teal-600 hover:bg-teal-50"}`}>
                <Icon name={item.icon} size={22} color={isActive ? "#0f766e" : "#475569"} />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="pt-4 mt-auto border-t border-slate-200 space-y-1">
  <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200">
    <Icon name="help_outline" size={22} />
    <span className="text-sm font-medium">Support</span>
  </a>
  <a href="#" onClick={(e) => { e.preventDefault(); setMobileOpen(false); if (onLogout) onLogout(); }}
    className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
    <Icon name="logout" size={22} />
    <span className="text-sm font-medium">Déconnexion</span>
  </a>
</div>
      </aside>
    </>
  );
};

export default Sidebar;