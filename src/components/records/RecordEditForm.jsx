import { useState, useEffect } from "react";
import Icon from "../common/Icon";
import Button from "../common/Button";
import medicalService from "../../services/medicalService";

const RecordEditForm = ({ record, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    diagnostic: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData({
        diagnostic: record.diagnosis || record.diagnostic || "",
        notes: record.notes || "",
      });
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Envoyer les champs dédiés au backend
      await medicalService.updateDossier(record.id, {
        ...record,
        diagnostic: formData.diagnostic,
        notes: formData.notes,
        // on garde les autres champs inchangés
        patientId: record.patientId,
        groupeSanguin: record.groupeSanguin,
        poids: record.poids,
        taille: record.taille,
        antecedents: record.antecedents || "",
      });
      setLoading(false);
      if (onSubmit) onSubmit();
    } catch (error) {
      setLoading(false);
      console.error("Erreur modification dossier :", error);
      setErrors({ global: "Erreur lors de la modification." });
    }
  };

  const inputClass = (fieldName) =>
    `w-full px-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none ${
      errors[fieldName] ? "ring-2 ring-red-400" : ""
    }`;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 rounded-t-2xl flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Edit Medical Record
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
            <Icon name="close" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Diagnosis</label>
            <textarea
              name="diagnostic"
              value={formData.diagnostic}
              onChange={handleChange}
              rows="3"
              placeholder="Enter diagnosis..."
              className={inputClass("diagnostic")}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Additional notes..."
              className={inputClass("notes")}
            />
          </div>

          {errors.global && <p className="text-sm text-red-500">{errors.global}</p>}

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={onCancel} className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50">
              Cancel
            </button>
            <Button type="submit" label={loading ? "Saving..." : "Save Changes"} variant="primary" className="flex-1 py-3" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordEditForm;