import { useState } from "react";
import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import PatientPage from "./pages/PatientPage";
import RegistryPage from "./pages/RegistryPage";
import CalendarPage from "./pages/CalendarPage";
import BillingPage from "./pages/BillingPage";
import StaffPage from "./pages/StaffPage";
import MedicalRecordsPage from "./pages/MedicalRecordsPage";
import LoginPage from "./pages/LoginPage";
import HospitalisesPage from "./pages/HospitalisesPage";
import DefinirMotDePassePage from "./pages/DefinirMotDePassePage";

const App = () => {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Route publique pour définir le mot de passe (accessible sans connexion)
  if (window.location.pathname.startsWith("/definir-mot-de-passe")) {
    return <DefinirMotDePassePage />;
  }

  const handleLogin = (userData) => {
    setUser({
      name: userData.name || "Dr. Sterling",
      role: userData.role || "MEDECIN",
      email: userData.email || "",
    });
    setIsLoggedIn(true);
    setCurrentPage("Dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage("Login");
  };

  if (!isLoggedIn) {
    return <LoginPage key={Date.now()} onLoginSuccess={handleLogin} />;
  }

  const handleNavigate = (page, patient = null) => {
    setCurrentPage(page);
    if (patient) setSelectedPatient(patient);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "Dashboard": return <DashboardPage user={user} />;
      case "Patients": return <RegistryPage onPatientClick={(p) => handleNavigate("PatientDetail", p)} user={user} />;
      case "PatientDetail": return <PatientPage patient={selectedPatient} onBack={() => handleNavigate("Patients")} user={user} />;
      case "Calendar": return <CalendarPage user={user} />;
      case "Billing": return <BillingPage user={user} />;
      case "Staff": return <StaffPage user={user} />;
      case "Medical Records": return <MedicalRecordsPage onPatientClick={(patient) => handleNavigate("PatientDetail", patient)} user={user} />;
      case "Hospitalises": return <HospitalisesPage user={user} />;
      default: return <DashboardPage user={user} />;
    }
  };

  return (
    <MainLayout activePage={currentPage} onNavigate={handleNavigate} onLogout={handleLogout} user={user}>
      {renderPage()}
    </MainLayout>
  );
};

export default App;