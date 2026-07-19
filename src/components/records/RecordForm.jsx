import { useState } from "react";
import Icon from "../common/Icon";
import Button from "../common/Button";
import medicalService from "../../services/medicalService";

const RecordForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    departement: "",
    medecin: "",
    diagnostic: "",
    notes: "",
    status: "Draft",
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
    if (!formData.patientName.trim()) newErrors.patientName = "Patient name is required";
    if (!formData.departement.trim()) newErrors.departement = "Department is required";
    if (!formData.medecin.trim()) newErrors.medecin = "Physician is required";
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
      const dossierData = {
        patientId: 1,
        groupeSanguin: null,
        poids: null,
        taille: null,
        antecedents: `Département: ${formData.departement}\nMédecin: ${formData.medecin}\nDiagnostic: ${formData.diagnostic}\nNotes: ${formData.notes}`,
      };

      await medicalService.createDossier(dossierData);
      setLoading(false);
      setSuccess(true);
      if (onSubmit) onSubmit(formData);
    } catch (error) {
      setLoading(false);
      console.error("Erreur API :", error);
      setErrors({ global: "Erreur lors de la création du dossier." });
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
        <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
              New Medical Record
            </h2>
            <p className="text-sm text-gray-500">Create a new clinical record for a patient</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <Icon name="close" size={24} />
          </button>
        </div>

        {success && (
          <div className="mx-8 mt-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="check_circle" size={24} color="#005e53" />
              <div>
                <p className="font-bold text-teal-700">Medical record created successfully!</p>
                <p className="text-sm text-teal-600">{formData.patientName} - {formData.departement}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({ patientName: "", patientId: "", departement: "", medecin: "", diagnostic: "", notes: "", status: "Draft" });
                if (onCancel) onCancel();
              }}
              className="w-full py-2 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700 transition-colors"
            >
              Close & Continue
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="person" size={18} color="#005e53" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Patient Name *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="badge" size={18} />
                  </span>
                  <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} placeholder="Search patient..." className={inputClass("patientName")} />
                </div>
                {errors.patientName && <p className="text-xs text-red-500 mt-1">{errors.patientName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Patient ID (optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="fingerprint" size={18} />
                  </span>
                  <input type="text" name="patientId" value={formData.patientId} onChange={handleChange} placeholder="#CS-XXXXX" className={inputClass("patientId")} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="medical_information" size={18} color="#005e53" />
              Clinical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Department *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="business" size={18} />
                  </span>
                  <select name="departement" value={formData.departement} onChange={handleChange} className={selectClass("departement")}>
                    <option value="">Select department</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Icon name="arrow_drop_down" size={20} />
                  </span>
                </div>
                {errors.departement && <p className="text-xs text-red-500 mt-1">{errors.departement}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Attending Physician *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="stethoscope" size={18} />
                  </span>
                  <select name="medecin" value={formData.medecin} onChange={handleChange} className={selectClass("medecin")}>
                    <option value="">Select physician</option>
                    <option value="Dr. Elena Vance">Dr. Elena Vance</option>
                    <option value="Dr. Julian Vance">Dr. Julian Vance</option>
                    <option value="Dr. Nia Akosua">Dr. Nia Akosua</option>
                    <option value="Dr. Marcus Thorne">Dr. Marcus Thorne</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Icon name="arrow_drop_down" size={20} />
                  </span>
                </div>
                {errors.medecin && <p className="text-xs text-red-500 mt-1">{errors.medecin}</p>}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="description" size={18} color="#005e53" />
              Record Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Diagnosis Summary</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <Icon name="notes" size={18} />
                  </span>
                  <textarea name="diagnostic" value={formData.diagnostic} onChange={handleChange}
                    placeholder="Enter diagnosis details..." rows="3"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none transition-all resize-none"></textarea>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Additional Notes</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <Icon name="edit_note" size={18} />
                  </span>
                  <textarea name="notes" value={formData.notes} onChange={handleChange}
                    placeholder="Additional observations..." rows="2"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none transition-all resize-none"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={onCancel} className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <Button type="submit" label={loading ? "Creating..." : "Create Record"} variant="primary" className="flex-1 py-3 text-base" icon={loading ? null : "history_edu"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordForm;