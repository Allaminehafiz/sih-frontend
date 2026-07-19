import { useState } from "react";
import Icon from "../common/Icon";
import Button from "../common/Button";
import medicalService from "../../services/medicalService";

const ResultatExamenForm = ({ examen, onSubmit, onCancel }) => {
  const [resultat, setResultat] = useState(examen.resultat || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await medicalService.updateExamen(examen.id, {
        ...examen,
        resultat: resultat,
        statut: "FINALIZED",
      });
      setLoading(false);
      if (onSubmit) onSubmit();
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold mb-2">Résultat d'examen</h3>
        <p className="text-sm text-gray-500 mb-4">{examen.typeExamen}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500">Résultat</label>
            <textarea value={resultat} onChange={(e) => setResultat(e.target.value)} rows="4"
              placeholder="Saisissez le résultat..." className="w-full px-4 py-2 bg-gray-100 rounded-xl text-sm" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onCancel} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold">Annuler</button>
            <Button type="submit" label={loading ? "Enregistrement..." : "Finaliser"} variant="primary" className="flex-1" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResultatExamenForm;