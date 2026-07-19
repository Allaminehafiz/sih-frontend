import { useState } from "react";
import Icon from "../common/Icon";
import Button from "../common/Button";
import medicalService from "../../services/medicalService";

const PrescriptionForm = ({ patientName = "", consultationId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    medicament: "",
    dosage: "",
    forme: "Comprimé",
    frequence: "1 fois par jour",
    moment: "Matin",
    duree: "7",
    instructions: "",
    quantite: "30",
    renouvellements: "0",
    dateDebut: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.medicament.trim()) newErrors.medicament = "Medication name is required";
    if (!formData.dosage.trim()) newErrors.dosage = "Dosage is required";
    if (!formData.quantite || formData.quantite <= 0) newErrors.quantite = "Valid quantity is required";
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
      const prescriptionData = {
        consultationId: consultationId || 1, // utilise la prop, sinon 1 par défaut
        medicament: formData.medicament,
        dosage: formData.dosage,
        instructions: formData.instructions || `Prendre ${formData.frequence}, le ${formData.moment}, pendant ${formData.duree} jours`,
        quantite: parseInt(formData.quantite),
        nbRenouvellements: parseInt(formData.renouvellements),
        dateDebut: formData.dateDebut,
      };

      await medicalService.createPrescription(prescriptionData);
      setLoading(false);
      setSuccess(true);
      if (onSubmit) onSubmit(prescriptionData);
    } catch (error) {
      setLoading(false);
      setErrors({ global: "Erreur lors de la création de la prescription." });
    }
  };

  const inputClass = (fieldName) =>
    `w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none transition-all ${
      errors[fieldName] ? "ring-2 ring-red-400" : ""
    }`;

  const selectClass = (fieldName) =>
    `w-full pl-10 pr-10 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none transition-all appearance-none ${
      errors[fieldName] ? "ring-2 ring-red-400" : ""
    }`;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
              New Prescription
            </h2>
            {patientName && (
              <p className="text-sm text-gray-500">For patient: <span className="font-bold text-teal-600">{patientName}</span></p>
            )}
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
                <p className="font-bold text-teal-700">Prescription created successfully!</p>
                <p className="text-sm text-teal-600">{formData.medicament} - {formData.dosage}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  medicament: "", dosage: "", forme: "Comprimé", frequence: "1 fois par jour",
                  moment: "Matin", duree: "7", instructions: "", quantite: "30",
                  renouvellements: "0", dateDebut: new Date().toISOString().split("T")[0],
                });
                if (onCancel) onCancel();
              }}
              className="w-full py-2 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700 transition-colors"
            >
              Close & Continue
            </button>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Médicament */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="pill" size={18} color="#005e53" />
              Medication
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Medication Name *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="medication" size={18} />
                  </span>
                  <input type="text" name="medicament" value={formData.medicament} onChange={handleChange}
                    placeholder="e.g., Metformin" className={inputClass("medicament")} />
                </div>
                {errors.medicament && <p className="text-xs text-red-500 mt-1">{errors.medicament}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Dosage *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="straighten" size={18} />
                  </span>
                  <input type="text" name="dosage" value={formData.dosage} onChange={handleChange}
                    placeholder="e.g., 500mg" className={inputClass("dosage")} />
                </div>
                {errors.dosage && <p className="text-xs text-red-500 mt-1">{errors.dosage}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Form</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="category" size={18} />
                  </span>
                  <select name="forme" value={formData.forme} onChange={handleChange} className={selectClass("forme")}>
                    <option value="Comprimé">Tablet</option>
                    <option value="Gélule">Capsule</option>
                    <option value="Sirop">Syrup</option>
                    <option value="Injectable">Injectable</option>
                    <option value="Pommade">Ointment</option>
                    <option value="Gouttes">Drops</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Icon name="arrow_drop_down" size={20} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Posologie */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="schedule" size={18} color="#005e53" />
              Dosage Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Frequency</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="repeat" size={18} />
                  </span>
                  <select name="frequence" value={formData.frequence} onChange={handleChange} className={selectClass("frequence")}>
                    <option value="1 fois par jour">Once daily</option>
                    <option value="2 fois par jour">Twice daily</option>
                    <option value="3 fois par jour">Three times daily</option>
                    <option value="Toutes les 4 heures">Every 4 hours</option>
                    <option value="Toutes les 8 heures">Every 8 hours</option>
                    <option value="Au coucher">At bedtime</option>
                    <option value="Au besoin">As needed</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Icon name="arrow_drop_down" size={20} />
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Time</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="wb_sunny" size={18} />
                  </span>
                  <select name="moment" value={formData.moment} onChange={handleChange} className={selectClass("moment")}>
                    <option value="Matin">Morning</option>
                    <option value="Midi">Noon</option>
                    <option value="Soir">Evening</option>
                    <option value="Coucher">Bedtime</option>
                    <option value="Matin et Soir">Morning & Evening</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Icon name="arrow_drop_down" size={20} />
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Duration (days)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="date_range" size={18} />
                  </span>
                  <input type="number" name="duree" value={formData.duree} onChange={handleChange}
                    min="1" className={inputClass("duree")} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Start Date</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="calendar_today" size={18} />
                  </span>
                  <input type="date" name="dateDebut" value={formData.dateDebut} onChange={handleChange}
                    className={inputClass("dateDebut")} />
                </div>
              </div>
            </div>
          </div>

          {/* Quantité + Renouvellements */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="inventory" size={18} color="#005e53" />
              Dispensing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Quantity *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="numbers" size={18} />
                  </span>
                  <input type="number" name="quantite" value={formData.quantite} onChange={handleChange}
                    min="1" className={inputClass("quantite")} />
                </div>
                {errors.quantite && <p className="text-xs text-red-500 mt-1">{errors.quantite}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Refills</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="autorenew" size={18} />
                  </span>
                  <select name="renouvellements" value={formData.renouvellements} onChange={handleChange} className={selectClass("renouvellements")}>
                    <option value="0">0 refills</option>
                    <option value="1">1 refill</option>
                    <option value="2">2 refills</option>
                    <option value="3">3 refills</option>
                    <option value="6">6 refills</option>
                    <option value="12">12 refills</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Icon name="arrow_drop_down" size={20} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="description" size={18} color="#005e53" />
              Instructions
            </h3>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <Icon name="notes" size={18} />
              </span>
              <textarea name="instructions" value={formData.instructions} onChange={handleChange}
                placeholder="Additional instructions for the patient (e.g., take with food, avoid alcohol...)"
                rows="3" className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none transition-all resize-none"></textarea>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={onCancel}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <Button type="submit" label={loading ? "Creating..." : "Create Prescription"}
              variant="primary" className="flex-1 py-3 text-base" icon={loading ? null : "prescriptions"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionForm;