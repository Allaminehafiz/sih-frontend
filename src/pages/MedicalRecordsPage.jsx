import { useState, useEffect, useCallback } from "react";
import RecordsHeader from "../components/records/RecordsHeader";
import RecordsFilter from "../components/records/RecordsFilter";
import RecordCard from "../components/records/RecordCard";
import RecordDetail from "../components/records/RecordDetail";
import RecordForm from "../components/records/RecordForm";
import RecordEditForm from "../components/records/RecordEditForm";
import ConfirmDialog from "../components/common/ConfirmDialog";
import medicalService from "../services/medicalService";
import admissionService from "../services/admissionService";
import staffService from "../services/staffService";

const MedicalRecordsPage = ({ onPatientClick, user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Records");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const [dossiersRes, patientsRes, medecinsRes] = await Promise.all([
        medicalService.getAllDossiers(),
        admissionService.getAllPatients(),
        staffService.getByRole("MEDECIN"),
      ]);
      const patients = patientsRes.data;
      const medecins = medecinsRes.data;

      const formatted = await Promise.all(
        dossiersRes.data.map(async (d) => {
          const patient = patients.find(p => p.id === d.patientId);
          let lastConsultation = null;
          let physicianName = "N/A";
          let lastUpdated = "N/A";
          let diagnosis = "Pas de diagnostic";

          try {
            const consRes = await medicalService.getConsultationsByDossier(d.id);
            if (consRes.data.length > 0) {
              lastConsultation = consRes.data[consRes.data.length - 1];
              const medecin = medecins.find(m => m.id === lastConsultation.medecinId);
              physicianName = medecin ? `Dr. ${medecin.nom}` : "Dr. N/A";
              lastUpdated = new Date(lastConsultation.dateConsultation).toLocaleDateString();
              diagnosis = lastConsultation.motif || lastConsultation.diagnostic || "Consultation";
            }
          } catch (err) { /* pas de consultation */ }

          // Enrichir l'objet patient avec les champs attendus par PatientPage
          const enrichedPatient = patient ? {
            ...patient,
            name: `${patient.prenom} ${patient.nom}`,
            dob: patient.dateNaissance,
            age: patient.dateNaissance ? new Date().getFullYear() - new Date(patient.dateNaissance).getFullYear() : "?",
            avatar: `https://ui-avatars.com/api/?name=${patient.prenom}+${patient.nom}&background=005e53&color=fff&size=256`,
          } : null;

          return {
            id: d.id,
            patientId: d.patientId,
            patientName: patient ? `${patient.prenom} ${patient.nom}` : `Patient #${d.patientId}`,
            patientIdDisplay: patient?.clinicalId ? `#${patient.clinicalId}` : `#CS-${d.patientId}`,
            department: patient?.serviceAffecte || "General Medicine",
            lastUpdated,
            physician: physicianName,
            status: "Final",
            diagnosis,
            notes: "",
            documents: [],
            patient: enrichedPatient,
          };
        })
      );
      setRecords(formatted);
    } catch (error) {
      console.error("Erreur chargement dossiers :", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleDeleteRecord = async () => {
    if (!deleteRecord) return;
    setDeleting(true);
    try {
      await medicalService.deleteDossier(deleteRecord.id);
      setDeleteRecord(null);
      loadRecords();
    } catch (error) {
      console.error("Erreur suppression dossier :", error);
    }
    setDeleting(false);
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientIdDisplay.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "All Records" || record.department === activeFilter ||
      (activeFilter === "Cardiology" && record.department === "Cardiologie") ||
      (activeFilter === "Radiology" && record.department === "Radiologie");
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <RecordsHeader onNewRecord={null} />
      <RecordsFilter
        onSearch={setSearchTerm}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      {loading ? (
        <p className="text-center text-gray-400 mt-12">Loading records...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredRecords.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              onClick={() => {
                if (onPatientClick && record.patient) {
                  onPatientClick(record.patient);
                } else {
                  setSelectedRecord(record);
                }
              }}
              onEdit={(rec) => setEditRecord(rec)}
              onDelete={(rec) => setDeleteRecord(rec)}
            />
          ))}
        </div>
      )}
      {!loading && filteredRecords.length === 0 && (
        <p className="text-center text-gray-400 mt-12">No records found.</p>
      )}
      {selectedRecord && (
        <RecordDetail record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}
      {showRecordForm && (
        <RecordForm
          onSubmit={() => { setShowRecordForm(false); loadRecords(); }}
          onCancel={() => setShowRecordForm(false)}
        />
      )}
      {editRecord && (
        <RecordEditForm
          record={editRecord}
          onSubmit={() => { setEditRecord(null); loadRecords(); }}
          onCancel={() => setEditRecord(null)}
        />
      )}
      {deleteRecord && (
        <ConfirmDialog
          title="Delete Medical Record"
          message={`Are you sure you want to delete the record of ${deleteRecord.patientName}?`}
          onConfirm={handleDeleteRecord}
          onCancel={() => setDeleteRecord(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default MedicalRecordsPage;