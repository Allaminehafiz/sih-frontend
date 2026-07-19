import { useState } from "react";
import Icon from "../common/Icon";
import Button from "../common/Button";
import api from "../../services/api";

const ChangePasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    ancienMotDePasse: "",
    nouveauMotDePasse: "",
    confirmerMotDePasse: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.nouveauMotDePasse !== formData.confirmerMotDePasse) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.put("/auth/changer-mot-de-passe", {
        ancienMotDePasse: formData.ancienMotDePasse,
        nouveauMotDePasse: formData.nouveauMotDePasse,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors du changement de mot de passe.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Changer le mot de passe
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <Icon name="close" size={24} />
          </button>
        </div>

        {success ? (
          <div className="text-center">
            <Icon name="check_circle" size={48} color="#005e53" />
            <p className="font-bold text-teal-700 mt-4">Mot de passe modifié avec succès !</p>
            <button onClick={onClose} className="mt-6 w-full py-2 bg-teal-700 text-white rounded-xl font-bold">
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Mot de passe actuel</label>
              <input type="password" name="ancienMotDePasse" value={formData.ancienMotDePasse} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Nouveau mot de passe</label>
              <input type="password" name="nouveauMotDePasse" value={formData.nouveauMotDePasse} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Confirmer le mot de passe</label>
              <input type="password" name="confirmerMotDePasse" value={formData.confirmerMotDePasse} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30" />
            </div>
            <Button type="submit" label={loading ? "Modification..." : "Changer le mot de passe"} variant="primary" className="w-full py-3" />
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;