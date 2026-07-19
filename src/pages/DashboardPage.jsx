import { useState, useEffect } from "react";
import KpiCard from "../components/dashboard/KpiCard";
import TodaySchedule from "../components/dashboard/TodaySchedule";
import RecentActivity from "../components/dashboard/RecentActivity";
import WeeklySummary from "../components/dashboard/WeeklySummary";
import RecentPatients from "../components/dashboard/RecentPatients";
import FloatingActionButton from "../components/fab/FloatingActionButton";
import Button from "../components/common/Button";
import dashboardService from "../services/dashboardService";

// Seuls ADMIN et AGENT_ADMISSION peuvent voir le bouton "New Patient"
const canAddPatient = (role) => ["ADMIN", "AGENT_ADMISSION"].includes(role);

const DashboardPage = ({ user }) => {
  const [stats, setStats] = useState({ 
    totalPatients: 0, 
    pendingInvoices: 0, 
    appointmentsToday: 0,
    montantEnAttente: 0
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, patientsRes, appointmentsRes, montantRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentPatients(),
          dashboardService.getAppointmentsToday(),
          dashboardService.getMontantEnAttente(),
        ]);

        setStats({
          ...statsRes,
          appointmentsToday: appointmentsRes.data?.appointmentsToday || 0,
          montantEnAttente: montantRes.data || 0,
        });

        const formattedPatients = patientsRes.data.slice(0, 5).map((p) => ({
          name: `${p.prenom} ${p.nom}`,
          patientId: `#${p.clinicalId}`,
          avatar: `https://ui-avatars.com/api/?name=${p.prenom}+${p.nom}&background=005e53&color=fff&size=128`,
          status: "Active",
          statusVariant: "primary",
          lastVisit: p.dateAdmission || "N/A",
          balance: "$0.00",
          balanceColor: "text-gray-900",
        }));
        setRecentPatients(formattedPatients);

        setActivities([
          { icon: "assignment", iconColor: "primary", action: "Lab results uploaded for", patientName: "Patient récent", timeAgo: "À l'instant" },
          { icon: "medical_information", iconColor: "error", action: "New record created", patientName: "Système", timeAgo: "Aujourd'hui" },
        ]);
      } catch (error) {
        console.error("Erreur dashboard :", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const kpiData = [
    { title: "Total Patients", value: stats.totalPatients.toString(), trend: "+12%", subtitle: "Active records", icon: "person", color: "primary" },
    { title: "Appointments Today", value: stats.appointmentsToday?.toString() || "0", trend: `${stats.appointmentsToday || 0} scheduled`, subtitle: "Check calendar", icon: "calendar_today", color: "tertiary" },
    { title: "Pending Invoices", value: `$${stats.montantEnAttente?.toLocaleString() || 0}`, trend: `${stats.pendingInvoices} invoice(s)`, subtitle: "Total amount pending", icon: "payments", color: "error" },
  ];

  const appointmentsData = [
    { time: "09:00", patientName: "Patient 1", type: "Consultation", mode: "In Clinic", modeVariant: "primary" },
    { time: "10:30", patientName: "Patient 2", type: "Suivi", mode: "Telehealth", modeVariant: "tertiary" },
  ];

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Vue d'ensemble</h3>
<p className="text-gray-500 font-medium mt-1">Bonjour, Dr. Sterling. Voici l'activité du jour.</p>
        </div>
        <div className="flex gap-3">
          {canAddPatient(user?.role) && (
            <Button label="New Patient" icon="add" variant="primary" />
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <TodaySchedule appointments={appointmentsData} />
        <div className="lg:col-span-4 space-y-8">
          <RecentActivity activities={activities} />
          <WeeklySummary />
        </div>
      </section>

      <RecentPatients patients={recentPatients} />
      <FloatingActionButton />
    </div>
  );
};

export default DashboardPage;