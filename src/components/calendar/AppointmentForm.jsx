import { useState, useEffect } from "react";
import Icon from "../common/Icon";
import Button from "../common/Button";
import medicalService from "../../services/medicalService";
import calendarService from "../../services/calendarService";
import staffService from "../../services/staffService";
import admissionService from "../../services/admissionService"; // ← ajout

const DUREE_OPTIONS = [15, 30, 45, 60, 90, 120];

const AppointmentForm = ({ onSubmit, onCancel, preselectedDate = "" }) => {
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    dossierId: null, // nouveau champ
    type: "",
    date: preselectedDate,
    duree: 30,
    medecin: "",
    location: "",
    notes: "",
    urgent: false,
  });

  const [patients, setPatients] = useState([]); // résultats de recherche
  const [searching, setSearching] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [creneaux, setCreneaux] = useState([]);
  const [creneauxLoading, setCreneauxLoading] = useState(false);
  const [selectedCreneau, setSelectedCreneau] = useState("");
  const [medecins, setMedecins] = useState([]);

  // Charger la liste des médecins depuis l'API
  useEffect(() => {
    const fetchMedecins = async () => {
      try {
        const response = await staffService.getByRole("MEDECIN");
        const formatted = response.data.map((u) => ({
          id: u.id,
          nom: `${u.nom} - ${u.specialite || 'Médecine Générale'}`,
        }));
        setMedecins(formatted);
      } catch (error) {
        console.error("Erreur chargement médecins :", error);
        setMedecins([]);
      }
    };
    fetchMedecins();
  }, []);

  // Recharge les créneaux dès que la date, le médecin ou la durée changent
  useEffect(() => {
    if (!formData.medecin || !formData.date) {
      setCreneaux([]);
      return;
    }

    const fetchCreneaux = async () => {
      setCreneauxLoading(true);
      try {
        const response = await calendarService.getCreneauxLibres(
          formData.medecin,
          formData.date,
          formData.duree
        );
        setCreneaux(response.data);
        setSelectedCreneau("");
      } catch (error) {
        console.error("Erreur créneaux :", error);
        setCreneaux([]);
      }
      setCreneauxLoading(false);
    };

    fetchCreneaux();
  }, [formData.medecin, formData.date, formData.duree]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Recherche de patients
  const handlePatientSearch = async (value) => {
    setFormData(prev => ({ ...prev, patientName: value }));
    if (value.trim().length < 2) {
      setPatients([]);
      return;
    }
    setSearching(true);
    try {
      const res = await admissionService.searchPatients(value);
      setPatients(res.data);
    } catch (error) {
      console.error("Erreur recherche patient :", error);
    }
    setSearching(false);
  };

  // Sélection d'un patient
  const selectPatient = async (patient) => {
    setFormData(prev => ({
      ...prev,
      patientName: `${patient.prenom} ${patient.nom}`,
      patientId: patient.id.toString(),
    }));
    setPatients([]);
    // Récupération du dossier médical automatiquement
    try {
      const dossierRes = await medicalService.getDossierByPatientId(patient.id);
      setFormData(prev => ({ ...prev, dossierId: dossierRes.data.id }));
    } catch (error) {
      console.log("Dossier non trouvé pour ce patient, dossierId = 1");
      setFormData(prev => ({ ...prev, dossierId: 1 }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) newErrors.patientName = "Patient name is required";
    if (!formData.type.trim()) newErrors.type = "Appointment type is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.medecin) newErrors.medecin = "Doctor is required";
    if (!formData.urgent && !selectedCreneau && creneaux.length > 0) {
      newErrors.creneau = "Please select a time slot or check Urgent.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const [heureBrute] = selectedCreneau ? selectedCreneau.split(" - ") : ["", ""];
      const heureClean = heureBrute ? heureBrute.substring(0, 5) : "00:00";

      const consultationData = {
        dossierId: formData.dossierId || parseInt(formData.patientId) || 1,
        medecinId: parseInt(formData.medecin),
        dateConsultation: selectedCreneau
          ? `${formData.date}T${heureClean}:00`
          : `${formData.date}T00:00:00`,
        dureeMinutes: parseInt(formData.duree),
        motif: formData.type,
        notes: formData.notes,
        diagnostic: "",
        urgence: formData.urgent,
      };

      await medicalService.createConsultation(consultationData);
      setLoading(false);
      setSuccess(true);
      if (onSubmit) onSubmit(formData);
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 409) {
        setErrors({ global: "Slot conflict. Please choose another." });
      } else {
        setErrors({ global: "Error scheduling appointment." });
      }
    }
  };

  const inputClass = (fieldName) =>
    `w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none ${
      errors[fieldName] ? "ring-2 ring-red-400" : ""
    }`;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
              New Appointment
            </h2>
            <p className="text-sm text-gray-500">Schedule a patient consultation or procedure</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <Icon name="close" size={24} />
          </button>
        </div>

        {/* Message de succès */}
        {success && (
          <div className="mx-8 mt-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="check_circle" size={24} color="#005e53" />
              <div>
                <p className="font-bold text-teal-700">Appointment scheduled successfully!</p>
                <p className="text-sm text-teal-600">
                  {formData.patientName} - {formData.date} - {selectedCreneau || "Forced"}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  patientName: "", patientId: "", dossierId: null, type: "", date: "",
                  duree: 30, medecin: "", location: "", notes: "", urgent: false,
                });
                setCreneaux([]);
                setSelectedCreneau("");
                if (onCancel) onCancel();
              }}
              className="w-full py-2 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700 transition-colors"
            >
              Close & View Calendar
            </button>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Patient */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="person" size={18} color="#005e53" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 mb-1">Patient Name *</label>
                <input type="text" name="patientName" value={formData.patientName}
                  onChange={(e) => handlePatientSearch(e.target.value)}
                  placeholder="Search patient..." className={inputClass("patientName")} />
                {patients.length > 0 && (
                  <div className="absolute z-10 bg-white border rounded-lg shadow-lg mt-1 w-full max-h-40 overflow-y-auto">
                    {patients.map(p => (
                      <div
                        key={p.id}
                        className="px-4 py-2 hover:bg-teal-50 cursor-pointer text-sm"
                        onClick={() => selectPatient(p)}
                      >
                        {p.prenom} {p.nom} ({p.clinicalId})
                      </div>
                    ))}
                  </div>
                )}
                {errors.patientName && <p className="text-xs text-red-500">{errors.patientName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Patient ID (optional)</label>
                <input type="text" name="patientId" value={formData.patientId} onChange={handleChange}
                  placeholder="#CS-XXXXX" className={inputClass("patientId")} />
              </div>
            </div>
          </div>

          {/* Détails du RDV */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="event" size={18} color="#005e53" />
              Appointment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Type *</label>
                <select name="type" value={formData.type} onChange={handleChange} className={inputClass("type")}>
                  <option value="">Select type</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Routine Check">Routine Check</option>
                </select>
                {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Duration (min)</label>
                <select name="duree" value={formData.duree} onChange={handleChange} className={inputClass("duree")}>
                  {DUREE_OPTIONS.map((d) => (
                    <option key={d} value={d}>{d} min</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Date *</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange}
                  className={inputClass("date")} />
                {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Doctor *</label>
                <select name="medecin" value={formData.medecin} onChange={handleChange} className={inputClass("medecin")}>
                  <option value="">Select doctor</option>
                  {medecins.map((m) => (
                    <option key={m.id} value={m.id}>{m.nom}</option>
                  ))}
                </select>
                {errors.medecin && <p className="text-xs text-red-500">{errors.medecin}</p>}
              </div>
            </div>
          </div>

          {/* Créneaux disponibles */}
          {formData.medecin && formData.date && (
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon name="schedule" size={18} color="#005e53" />
                Available Slots
              </h3>
              {creneauxLoading ? (
                <p className="text-sm text-gray-400">Loading slots...</p>
              ) : creneaux.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {creneaux.map((c, idx) => {
                    const label = `${c.debut} - ${c.fin}`;
                    const isSelected = selectedCreneau === label;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedCreneau(label)}
                        className={`py-2 px-3 text-xs font-bold rounded-lg border transition-colors ${
                          isSelected
                            ? "bg-teal-700 text-white border-teal-700"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-teal-50"
                        }`}
                      >
                        {c.debut}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-amber-600">
                  No slots available for this date/duration.{" "}
                  {!formData.urgent && "Check urgent box to force creation."}
                </p>
              )}
              {errors.creneau && <p className="text-xs text-red-500 mt-1">{errors.creneau}</p>}
            </div>
          )}

          {/* Urgence */}
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="urgent"
                checked={formData.urgent}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">
                <Icon name="emergency" size={18} color="#ba1a1a" /> Urgent (force creation even if conflict)
              </span>
            </label>
          </div>

          {/* Lieu + Notes */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="info" size={18} color="#005e53" />
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange}
                  placeholder="RM 402, West Wing" className={inputClass("location")} />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-500 mb-1">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange}
                placeholder="Additional notes..." rows="2"
                className="w-full px-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none resize-none" />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={onCancel}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50">
              Cancel
            </button>
            <Button
              type="submit"
              label={loading ? "Scheduling..." : "Schedule Appointment"}
              variant="primary"
              className="flex-1 py-3 text-base"
              icon={loading ? null : "calendar_add_on"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;