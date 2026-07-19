import { useState } from "react";
import Icon from "../common/Icon";
import Button from "../common/Button";
import medicalService from "../../services/medicalService";

const ExamenForm = ({ patientId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    typeExamen: "",
    prix: "",
    urgence: false,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.typeExamen.trim()) return;
    setLoading(true);
    try {
      await medicalService.createExamen({
        patientId,
        typeExamen: formData.typeExamen,
        prix: formData.prix ? parseFloat(formData.prix) : null,
        dateDemande: new Date().toISOString().split('T')[0],
        statut: "PENDING",
        urgence: formData.urgence,
        notes: formData.notes,
      });
      setLoading(false);
      setSuccess(true);
      if (onSubmit) onSubmit();
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold mb-4">Nouvel Examen</h3>
        {success ? (
          <div className="text-center">
            <Icon name="check_circle" size={48} color="#005e53" />
            <p className="font-bold text-teal-700 mt-2">Examen créé avec succès</p>
            <button onClick={onCancel} className="mt-4 w-full py-2 bg-teal-700 text-white rounded-xl">Fermer</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500">Nom de l'examen *</label>
              <input type="text" name="typeExamen" value={formData.typeExamen} onChange={handleChange}
                placeholder="ex: IRM lombaire" className="w-full px-4 py-2 bg-gray-100 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500">Prix (FCFA)</label>
              <input type="number" name="prix" value={formData.prix} onChange={handleChange}
                placeholder="ex: 15000" className="w-full px-4 py-2 bg-gray-100 rounded-xl text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="urgence" checked={formData.urgence} onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-red-600" />
              <span className="text-sm">Urgent</span>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2"
                placeholder="Contexte clinique..." className="w-full px-4 py-2 bg-gray-100 rounded-xl text-sm" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onCancel} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold">Annuler</button>
              <Button type="submit" label={loading ? "Création..." : "Créer l'examen"} variant="primary" className="flex-1" />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ExamenForm;