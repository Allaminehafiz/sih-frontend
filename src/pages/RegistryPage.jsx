import { useState, useEffect, useCallback } from "react";
import PageHeader from "../components/registry/PageHeader";
import StatsCounter from "../components/registry/StatsCounter";
import AlertCard from "../components/registry/AlertCard";
import FilterBar from "../components/registry/FilterBar";
import PatientTable from "../components/registry/PatientTable";
import PatientFlowChart from "../components/registry/PatientFlowChart";
import AiDiagnostics from "../components/registry/AiDiagnostics";
import PatientForm from "../components/patients/PatientForm";
import PatientEditForm from "../components/patients/PatientEditForm";
import ConfirmDialog from "../components/common/ConfirmDialog";
import admissionService from "../services/admissionService";

const filters = ["All Patients", "In-Patient", "Out-Patient", "Pending Review"];

// Rôles autorisés à créer/modifier/supprimer des patients
const canManagePatients = (role) => ["ADMIN", "AGENT_ADMISSION"].includes(role);

const RegistryPage = ({ onPatientClick, user }) => {
  const [activeFilter, setActiveFilter] = useState("All Patients");
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [patients, setPatients] = useState([]);
  const [editPatient, setEditPatient] = useState(null);
  const [deletePatient, setDeletePatient] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadPatients = useCallback(async () => {
    try {
      let response;
      switch (activeFilter) {
        case "In-Patient":
          response = await admissionService.getInPatients();
          break;
        case "Out-Patient":
          response = await admissionService.getOutPatients();
          break;
        case "Pending Review":
          response = await admissionService.getPendingReview();
          break;
        default:
          response = await admissionService.getAllPatients();
      }

      const formattedPatients = response.data.map((p) => ({
        id: p.id,
        clinicalId: p.clinicalId || `#CS-${p.id}`,
        name: `${p.prenom || ""} ${p.nom || ""}`.trim(),
        gender: p.sexe === "M" ? "Male" : p.sexe === "F" ? "Female" : "N/A",
        age: p.dateNaissance
          ? new Date().getFullYear() - new Date(p.dateNaissance).getFullYear()
          : "?",
        dob: p.dateNaissance || "N/A",
        lastEncounter: p.dateAdmission || "N/A",
        department: p.couvertureMedicale || "N/A",
        status: p.statutAdmission || "ADMIS",
        bloodType: "N/A",
        weight: "N/A",
        height: "N/A",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.prenom || "P")}+${encodeURIComponent(p.nom || "P")}&background=0d9488&color=fff&size=256`,
        nom: p.nom,
        prenom: p.prenom,
        dateNaissance: p.dateNaissance,
        sexe: p.sexe,
        telephone: p.telephone,
        email: p.email,
        adresse: p.adresse,
        couvertureMedicale: p.couvertureMedicale,
        chambre: p.chambre,
        serviceAffecte: p.serviceAffecte,
        statutAdmission: p.statutAdmission,
        tauxPriseEnCharge: p.tauxPriseEnCharge,
        dateSortie: p.dateSortie,
      }));
      setPatients(formattedPatients);
    } catch (error) {
      console.error("Erreur chargement patients :", error);
    }
  }, [activeFilter]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const handleDelete = async () => {
    if (!deletePatient) return;
    setDeleting(true);
    try {
      await admissionService.deletePatient(deletePatient.id);
      setDeletePatient(null);
      loadPatients();
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
    setDeleting(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Patient Registry"
        description="Manage your clinical demographic data with absolute precision and ease."
        buttonLabel="Add New Patient"
        buttonIcon="person_add"
        onButtonClick={() => setShowPatientForm(true)}
        showButton={canManagePatients(user?.role)}
      />

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCounter
          value={patients.length.toString()}
          label="Active Patient Load"
          trend="12% from last month"
          icon="diversity_3"
        />
        <AlertCard icon="emergency" label="Critical Alerts" value="04" color="tertiary" />
        <AlertCard icon="verified_user" label="Insurance Verified" value="98.2%" color="primary" />
      </section>

      <FilterBar
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        totalPatients={patients.length}
        showingRange={`1-${patients.length}`}
      />

      <PatientTable
        patients={patients}
        onPatientClick={onPatientClick}
        onEdit={canManagePatients(user?.role) ? (patient) => setEditPatient(patient) : null}
        onDelete={canManagePatients(user?.role) ? (patient) => setDeletePatient(patient) : null}
      />

      {showPatientForm && (
        <PatientForm
          onSubmit={() => {
            setShowPatientForm(false);
            loadPatients();
          }}
          onCancel={() => setShowPatientForm(false)}
        />
      )}

      {editPatient && (
        <PatientEditForm
          patient={editPatient}
          onSubmit={() => {
            setEditPatient(null);
            loadPatients();
          }}
          onCancel={() => setEditPatient(null)}
        />
      )}

      {deletePatient && (
        <ConfirmDialog
          title="Delete Patient"
          message={`Are you sure you want to delete ${deletePatient.name || deletePatient.nom}? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletePatient(null)}
          loading={deleting}
        />
      )}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <PatientFlowChart />
        <AiDiagnostics />
      </section>
    </div>
  );
};

export default RegistryPage;