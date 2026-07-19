import { useState, useEffect, useCallback } from "react";
import Button from "../components/common/Button";
import RevenueCard from "../components/billing/RevenueCard";
import StatCard from "../components/billing/StatCard";
import InvoiceTable from "../components/billing/InvoiceTable";
import AiInsights from "../components/billing/AiInsights";
import ExpansionCard from "../components/billing/ExpansionCard";
import InvoiceForm from "../components/billing/InvoiceForm";
import ConfirmDialog from "../components/common/ConfirmDialog";
import PaymentForm from "../components/billing/PaymentForm";
import InvoiceDetailModal from "../components/billing/InvoiceDetailModal";
import facturationService from "../services/facturationService";
import admissionService from "../services/admissionService";
import dashboardService from "../services/dashboardService";

// Rôles autorisés à gérer la facturation (créer, supprimer, payer)
const canManageBilling = (role) => ["ADMIN", "COMPTABLE"].includes(role);

const BillingPage = ({ user }) => {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [deleteInvoice, setDeleteInvoice] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [payInvoice, setPayInvoice] = useState(null);
  const [detailInvoice, setDetailInvoice] = useState(null);
  const [statsFacturation, setStatsFacturation] = useState({
    revenuTotal: 0,
    montantEnAttente: 0,
    nombreEnAttente: 0,
    nombreEnRetard: 0,
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await admissionService.getAllPatients();
        setPatients(res.data);
      } catch (error) {
        console.error("Erreur chargement patients", error);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getStatsFacturation();
        setStatsFacturation(res.data);
      } catch (error) {
        console.error("Erreur stats facturation :", error);
      }
    };
    fetchStats();
  }, []);

  const loadInvoices = useCallback(async () => {
    try {
      const response = await facturationService.getAllFactures();
      const formatted = response.data.map((f) => {
        const patient = patients.find(p => p.id === f.patientId);
        return {
          id: f.id,
          invoiceId: f.invoiceId || `INV-${f.id}`,
          patient: patient ? `${patient.prenom} ${patient.nom}` : `Patient #${f.patientId}`,
          email: patient?.clinicalId ? `#${patient.clinicalId}` : "",
          date: f.dateEmission || "N/A",
          amount: `$${f.montantTotal?.toFixed(2) || "0.00"}`,
          status: f.statut === "PAYEE" ? "Paid" : f.statut === "EN_ATTENTE" ? "Pending" : "Overdue",
        };
      });
      setInvoices(formatted);
    } catch (error) {
      console.error("Erreur factures :", error);
    }
  }, [patients]);

  useEffect(() => {
    if (patients.length > 0) {
      loadInvoices();
    }
  }, [patients, loadInvoices]);

  const handleDeleteInvoice = async () => {
    if (!deleteInvoice) return;
    setDeleting(true);
    try {
      await facturationService.deleteFacture(deleteInvoice.id);
      setDeleteInvoice(null);
      loadInvoices();
    } catch (error) {
      console.error("Erreur suppression facture :", error);
    }
    setDeleting(false);
  };

  const handlePay = (invoice) => {
    setPayInvoice(invoice);
  };

  const handlePaymentSuccess = () => {
    setPayInvoice(null);
    loadInvoices();
  };

  const handleDetail = (invoice) => {
    setDetailInvoice(invoice);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-teal-600 font-bold tracking-widest text-[10px] uppercase mb-2 block">
            Financial Administration
          </span>
          <h2
            className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            Billing & Invoicing
          </h2>
          <p className="text-gray-500 mt-2 max-w-md text-sm leading-relaxed">
            Comprehensive overview of clinic revenue and outstanding patient accounts.
          </p>
        </div>
        {canManageBilling(user?.role) && (
          <Button
            label="Create New Invoice"
            icon="add"
            variant="primary"
            className="shadow-sm"
            onClick={() => setShowInvoiceForm(true)}
          />
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RevenueCard amount={`$${statsFacturation.revenuTotal?.toLocaleString() || 0}`} />
        <div className="space-y-6">
          <StatCard
            title="Pending Collections"
            value={`$${statsFacturation.montantEnAttente?.toLocaleString() || 0}`}
            progress={statsFacturation.nombreEnAttente > 0
              ? Math.round((statsFacturation.montantEnAttente / (statsFacturation.revenuTotal + statsFacturation.montantEnAttente || 1)) * 100)
              : 0}
          />
          <StatCard
            title="Overdue Invoices"
            value={`$${statsFacturation.montantEnAttente?.toLocaleString() || 0}`}
            subtitle={`${statsFacturation.nombreEnRetard || 0} accounts require attention`}
            color="error"
          />
        </div>
      </section>

      <InvoiceTable
        invoices={invoices}
        onViewAll={() => console.log("View all")}
        onDelete={canManageBilling(user?.role) ? (inv) => setDeleteInvoice(inv) : null}
        onPay={canManageBilling(user?.role) ? handlePay : null}
        onDetail={handleDetail}
      />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
        <AiInsights
          title="AI Financial Insights"
          description={
            <>
              Based on current payment velocity, you are projected to exceed your Q4 revenue targets by{' '}
              <span className="font-bold text-teal-600">8%</span>.
            </>
          }
          linkLabel="Explore Revenue Analytics"
          onExplore={() => console.log("Explore")}
        />
        <ExpansionCard
          image="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          title="Expanding Precision Care"
          description="Your successful billing cycles fuel the expansion of our new Diagnostic Wing opening 2024."
        />
      </section>

      {showInvoiceForm && canManageBilling(user?.role) && (
        <InvoiceForm
          onSubmit={() => {
            setShowInvoiceForm(false);
            loadInvoices();
          }}
          onCancel={() => setShowInvoiceForm(false)}
        />
      )}

      {deleteInvoice && canManageBilling(user?.role) && (
        <ConfirmDialog
          title="Delete Invoice"
          message={`Are you sure you want to delete ${deleteInvoice.invoiceId}? This action cannot be undone.`}
          onConfirm={handleDeleteInvoice}
          onCancel={() => setDeleteInvoice(null)}
          loading={deleting}
        />
      )}

      {payInvoice && canManageBilling(user?.role) && (
        <PaymentForm
          invoice={payInvoice}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setPayInvoice(null)}
        />
      )}

      {detailInvoice && (
        <InvoiceDetailModal
          invoice={detailInvoice}
          onClose={() => setDetailInvoice(null)}
        />
      )}
    </div>
  );
};

export default BillingPage;