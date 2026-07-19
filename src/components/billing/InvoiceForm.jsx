import { useState } from "react";
import Icon from "../common/Icon";
import Button from "../common/Button";
import facturationService from "../../services/facturationService";


const InvoiceForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    dateEmission: new Date().toISOString().split("T")[0],
    dateEcheance: "",
    actes: [{ description: "", montant: "" }],
    notes: "",
    modePaiement: "Non payé",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleActeChange = (index, field, value) => {
    const newActes = [...formData.actes];
    newActes[index][field] = value;
    setFormData((prev) => ({ ...prev, actes: newActes }));
  };

  const addActe = () => {
    setFormData((prev) => ({
      ...prev,
      actes: [...prev.actes, { description: "", montant: "" }],
    }));
  };

  const removeActe = (index) => {
    if (formData.actes.length > 1) {
      const newActes = formData.actes.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, actes: newActes }));
    }
  };

  const totalAmount = formData.actes.reduce((sum, acte) => {
    return sum + (parseFloat(acte.montant) || 0);
  }, 0);

  const validate = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) newErrors.patientName = "Patient name is required";
    if (!formData.dateEcheance) newErrors.dateEcheance = "Due date is required";
    formData.actes.forEach((acte, index) => {
      if (!acte.description.trim()) newErrors[`acte_${index}_desc`] = "Description is required";
      if (!acte.montant || parseFloat(acte.montant) <= 0) newErrors[`acte_${index}_montant`] = "Valid amount is required";
    });
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
    const factureData = {
      patientId: 1, // À adapter avec l'ID réel du patient
      montantTotal: totalAmount,
      dateEmission: formData.dateEmission,
      dateEcheance: formData.dateEcheance,
      notes: formData.notes,
    };

    await facturationService.createFacture(factureData);
    setLoading(false);
    setSuccess(true);
    if (onSubmit) onSubmit({ ...formData, totalAmount });
  } catch (error) {
    setLoading(false);
    setErrors({ global: "Erreur lors de la génération de la facture." });
  }
};

  const inputClass = (fieldName) =>
    `w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none transition-all ${
      errors[fieldName] ? "ring-2 ring-red-400" : ""
    }`;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Create New Invoice
            </h2>
            <p className="text-sm text-gray-500">Generate a billing invoice for a patient</p>
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
                <p className="font-bold text-teal-700">Invoice created successfully!</p>
                <p className="text-sm text-teal-600">
                  {formData.patientName} - ${totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  patientName: "", patientId: "", dateEmission: new Date().toISOString().split("T")[0],
                  dateEcheance: "", actes: [{ description: "", montant: "" }], notes: "", modePaiement: "Non payé",
                });
                if (onCancel) onCancel();
              }}
              className="w-full py-2 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700 transition-colors"
            >
              Close & View Invoices
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
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Patient Name *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="badge" size={18} />
                  </span>
                  <input type="text" name="patientName" value={formData.patientName} onChange={handleChange}
                    placeholder="Search patient..." className={inputClass("patientName")} />
                </div>
                {errors.patientName && <p className="text-xs text-red-500 mt-1">{errors.patientName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Patient ID (optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="fingerprint" size={18} />
                  </span>
                  <input type="text" name="patientId" value={formData.patientId} onChange={handleChange}
                    placeholder="#CS-XXXXX" className={inputClass("patientId")} />
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="calendar_today" size={18} color="#005e53" />
              Invoice Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Issue Date</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="today" size={18} />
                  </span>
                  <input type="date" name="dateEmission" value={formData.dateEmission} onChange={handleChange}
                    className={inputClass("dateEmission")} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Due Date *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="event_busy" size={18} />
                  </span>
                  <input type="date" name="dateEcheance" value={formData.dateEcheance} onChange={handleChange}
                    className={inputClass("dateEcheance")} />
                </div>
                {errors.dateEcheance && <p className="text-xs text-red-500 mt-1">{errors.dateEcheance}</p>}
              </div>
            </div>
          </div>

          {/* Actes / Lignes de facture */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Icon name="receipt_long" size={18} color="#005e53" />
                Invoice Items
              </h3>
              <button type="button" onClick={addActe}
                className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1">
                <Icon name="add" size={16} /> Add Item
              </button>
            </div>
            <div className="space-y-4">
              {formData.actes.map((acte, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <div className="relative">
                      <input type="text" value={acte.description}
                        onChange={(e) => handleActeChange(index, "description", e.target.value)}
                        placeholder="Description (e.g., Consultation, Blood Test...)"
                        className={inputClass(`acte_${index}_desc`)} />
                    </div>
                    {errors[`acte_${index}_desc`] && <p className="text-xs text-red-500 mt-1">{errors[`acte_${index}_desc`]}</p>}
                  </div>
                  <div className="w-32">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input type="number" value={acte.montant}
                        onChange={(e) => handleActeChange(index, "montant", e.target.value)}
                        placeholder="0.00" step="0.01" min="0"
                        className={`w-full pl-8 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none transition-all ${errors[`acte_${index}_montant`] ? "ring-2 ring-red-400" : ""}`} />
                    </div>
                    {errors[`acte_${index}_montant`] && <p className="text-xs text-red-500 mt-1">{errors[`acte_${index}_montant`]}</p>}
                  </div>
                  {formData.actes.length > 1 && (
                    <button type="button" onClick={() => removeActe(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors mt-1">
                      <Icon name="delete" size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 p-4 bg-teal-50 rounded-xl flex justify-between items-center">
              <span className="font-bold text-teal-700">Total Amount</span>
              <span className="text-2xl font-extrabold text-teal-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="notes" size={18} color="#005e53" />
              Notes (optional)
            </h3>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <Icon name="description" size={18} />
              </span>
              <textarea name="notes" value={formData.notes} onChange={handleChange}
                placeholder="Additional notes or payment instructions..."
                rows="2" className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none transition-all resize-none"></textarea>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={onCancel}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <Button type="submit" label={loading ? "Creating..." : "Generate Invoice"}
              variant="primary" className="flex-1 py-3 text-base" icon={loading ? null : "receipt_long"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;