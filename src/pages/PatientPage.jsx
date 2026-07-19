import { useState, useEffect, useCallback } from "react";
import Icon from "../components/common/Icon";
import PatientHeader from "../components/patients/PatientHeader";
import ClinicalTimeline from "../components/patients/ClinicalTimeline";
import DiagnosticReports from "../components/patients/DiagnosticReports";
import PatientDocuments from "../components/patients/PatientDocuments";
import PrescriptionsList from "../components/patients/PrescriptionsList";
import CareReminders from "../components/patients/CareReminders";
import PatientCoordination from "../components/patients/PatientCoordination";
import PrescriptionForm from "../components/patients/PrescriptionForm";
import ConfirmDialog from "../components/common/ConfirmDialog";
import admissionService from "../services/admissionService";
import medicalService from "../services/medicalService";
import facturationService from "../services/facturationService";
import ExamenForm from "../components/patients/ExamenForm";
import ResultatExamenForm from "../components/patients/ResultatExamenForm";
import exportPatientPDF from "../components/patients/PatientPDF";
import exportPrescriptionPDF from "../components/patients/PrescriptionPDF";
import exportSortiePDF from "../components/patients/SortiePDF";

const defaultPatientData = {
  name: "Elena Rodriguez",
  clinicalId: "CS-88291",
  dob: "May 12, 1978",
  age: 45,
  bloodType: "A Positive",
  weight: 64,
  height: 168,
  avatar: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=005e53&color=fff&size=256",
};

const coordinationActions = [
  { icon: "mail", label: "Message Family" },
  { icon: "calendar_add_on", label: "Schedule Follow-up" },
];

// Rôles autorisés à facturer et sortir un patient
const canFacturer = (role) => ["ADMIN", "COMPTABLE"].includes(role);
const canSortir = (role) => ["ADMIN", "AGENT_ADMISSION"].includes(role);
const canPrescrire = (role) => ["ADMIN", "MEDECIN"].includes(role);
const canGererExamen = (role) => ["ADMIN", "MEDECIN"].includes(role);

const PatientPage = ({ patient, onBack, user }) => {
  const [dossier, setDossier] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [diagnostics, setDiagnostics] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [peutFacturer, setPeutFacturer] = useState(false);
  const [prescriptionsLoaded, setPrescriptionsLoaded] = useState(false);
  const [derniereConsultationId, setDerniereConsultationId] = useState(null);

  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showSortieConfirm, setShowSortieConfirm] = useState(false);
  const [sortieLoading, setSortieLoading] = useState(false);

  const [showExamenForm, setShowExamenForm] = useState(false);
  const [examenAFinaliser, setExamenAFinaliser] = useState(null);

  const patientId = patient?.id;

  const fetchExamens = useCallback(async () => {
    if (!patientId) return;
    try {
      const examensRes = await medicalService.getExamensByPatient(patientId);
      const formatted = examensRes.data.map((e) => ({
        id: e.id,
        name: e.typeExamen,
        status: e.statut === "FINALIZED" ? "Finalized" : "Pending Review",
        daysAgo: "recently",
        isPending: e.statut !== "FINALIZED",
        prix: e.prix,
        resultat: e.resultat,
        factureId: e.factureId,
        ...e,
      }));
      setDiagnostics(formatted);
    } catch (error) {
      console.error("Erreur chargement examens", error);
    }
  }, [patientId]);

  const fetchPrescriptions = useCallback(async () => {
    if (!derniereConsultationId) return;
    try {
      const prescRes = await medicalService.getPrescriptionsByConsultation(derniereConsultationId);
      setPrescriptions(prescRes.data.map(p => ({
        name: p.medicament,
        instructions: p.instructions,
        quantity: p.quantite,
        refills: p.nbRenouvellements,
        color: "primary",
      })));
    } catch (error) {
      console.error("Erreur chargement prescriptions :", error);
      setPrescriptions([]);
    }
    setPrescriptionsLoaded(true);
  }, [derniereConsultationId]);

  useEffect(() => {
    const examensNonFactures = diagnostics.filter((d) => d.factureId === null);
    setPeutFacturer(examensNonFactures.length > 0);
  }, [diagnostics]);

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        let dossierData = null;
        try {
          const dossierRes = await medicalService.getDossierByPatientId(patientId);
          dossierData = dossierRes.data;
        } catch (error) {
          if (error.response?.status !== 404) throw error;
        }
        setDossier(dossierData);

        if (dossierData?.id) {
          const consRes = await medicalService.getConsultationsByDossier(dossierData.id);
          const formattedTimeline = consRes.data.map(c => ({
            title: c.motif || "Consultation",
            date: new Date(c.dateConsultation).toLocaleDateString(),
            description: c.notes || "",
            tags: c.urgence ? ["Urgent"] : [],
            color: c.urgence ? "error" : "primary",
          }));
          setTimeline(formattedTimeline);

          if (consRes.data.length > 0) {
            const lastConsultation = consRes.data[consRes.data.length - 1];
            setDerniereConsultationId(lastConsultation.id);
          } else {
            setDerniereConsultationId(null);
            setPrescriptions([]);
            setPrescriptionsLoaded(true);
          }
        }

        await fetchExamens();
      } catch (error) {
        console.error("Erreur chargement données patient :", error);
        setPrescriptionsLoaded(true);
      }
      setLoading(false);
    };

    fetchData();
  }, [patientId, fetchExamens]);

  useEffect(() => {
    if (derniereConsultationId) {
      fetchPrescriptions();
    }
  }, [derniereConsultationId, fetchPrescriptions]);

  const patientData = patient
    ? {
        name: patient.name,
        clinicalId: patient.clinicalId,
        dob: patient.dob,
        age: patient.age,
        bloodType: dossier?.groupeSanguin || "N/A",
        weight: dossier?.poids || "N/A",
        height: dossier?.taille || "N/A",
        avatar: patient.avatar,
        couvertureMedicale: patient.couvertureMedicale,
        tauxPriseEnCharge: patient.tauxPriseEnCharge,
        chambre: patient.chambre,
        statutAdmission: patient.statutAdmission,
        id: patient.id,
      }
    : defaultPatientData;

  const handleSortirPatient = async () => {
    if (!patientData.id) return;
    setSortieLoading(true);
    try {
      await admissionService.sortirPatient(patientData.id);
      if (onBack) onBack();
    } catch (error) {
      console.error("Erreur sortie :", error);
    }
    setSortieLoading(false);
    setShowSortieConfirm(false);
  };

  const handleGenererFacture = async () => {
    if (!patientId) return;
    try {
      await facturationService.genererFacture(patientId);
      alert("Facture générée avec succès.");
      fetchExamens();
    } catch (error) {
      console.error("Erreur génération facture :", error);
      alert(error.response?.data?.message || "Aucun acte à facturer ou erreur.");
    }
  };

  const estHospitalise = patientData.chambre && !patientData.dateSortie;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <p className="text-center text-gray-400 py-12">Loading patient data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-teal-600 font-semibold hover:underline mb-2">
          <Icon name="arrow_back" size={20} />
          Back to Patient Registry
        </button>
      )}

      <div id="patient-pdf-content">
        <PatientHeader
          patient={patientData}
          onSortir={estHospitalise && canSortir(user?.role) ? () => setShowSortieConfirm(true) : undefined}
        />

        <div className="grid grid-cols-12 gap-8 mt-8">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <ClinicalTimeline events={timeline} patientData={patientData} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DiagnosticReports
                reports={diagnostics}
                patientData={patientData}
                onAddExamen={canGererExamen(user?.role) ? () => setShowExamenForm(true) : null}
                onFinalizeExamen={canGererExamen(user?.role) ? (examen) => setExamenAFinaliser(examen) : null}
              />
              <PatientDocuments documents={[]} />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <PrescriptionsList
              prescriptions={prescriptions}
              onAddClick={canPrescrire(user?.role) ? () => setShowPrescriptionForm(true) : null}
            />
            <CareReminders reminders={[]} />
            <PatientCoordination actions={coordinationActions} />

            {peutFacturer && canFacturer(user?.role) && (
              <div className="mt-4">
                <button
                  onClick={handleGenererFacture}
                  className="w-full py-3 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Icon name="receipt_long" size={20} />
                  Facturer les actes en attente
                </button>
              </div>
            )}

            <div className="mt-4">
              <button
                onClick={() => exportPatientPDF(patientData, timeline, diagnostics)}
                className="w-full py-3 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="picture_as_pdf" size={20} />
                Exporter en PDF (fiche patient)
              </button>
            </div>

            {prescriptionsLoaded && prescriptions.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => exportPrescriptionPDF(patientData, prescriptions)}
                  className="w-full py-3 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Icon name="prescriptions" size={20} />
                  Exporter l'ordonnance
                </button>
              </div>
            )}

            {estHospitalise && (
              <div className="mt-4">
                <button
                  onClick={() => exportSortiePDF(patientData)}
                  className="w-full py-3 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Icon name="logout" size={20} />
                  Fiche de sortie PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPrescriptionForm && canPrescrire(user?.role) && (
        <PrescriptionForm
          patientName={patientData.name}
          consultationId={derniereConsultationId}
          onSubmit={() => {
            setShowPrescriptionForm(false);
            fetchPrescriptions();
          }}
          onCancel={() => setShowPrescriptionForm(false)}
        />
      )}

      {showSortieConfirm && canSortir(user?.role) && (
        <ConfirmDialog
          title="Sortir le patient"
          message={`Confirmez-vous la sortie de ${patientData.name} ? Le lit sera libéré.`}
          onConfirm={handleSortirPatient}
          onCancel={() => setShowSortieConfirm(false)}
          loading={sortieLoading}
        />
      )}

      {showExamenForm && canGererExamen(user?.role) && (
        <ExamenForm
          patientId={patientId}
          onSubmit={() => {
            setShowExamenForm(false);
            fetchExamens();
          }}
          onCancel={() => setShowExamenForm(false)}
        />
      )}

      {examenAFinaliser && canGererExamen(user?.role) && (
        <ResultatExamenForm
          examen={examenAFinaliser}
          onSubmit={() => {
            setExamenAFinaliser(null);
            fetchExamens();
          }}
          onCancel={() => setExamenAFinaliser(null)}
        />
      )}
    </div>
  );
};

export default PatientPage;