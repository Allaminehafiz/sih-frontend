import { useState } from "react";
import Icon from "../components/common/Icon";
import Button from "../components/common/Button";
import api from "../services/api";

const RegisterPage = ({ onRegisterSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    confirmPassword: "",   // ← déjà présent dans l'état, on va l'utiliser
    telephone: "",
    departement: "",
    specialite: "",
    role: "MEDECIN",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Vérification des champs obligatoires
    if (!formData.prenom || !formData.nom || !formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    // Vérification de la concordance des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // On retire confirmPassword avant d'envoyer au serveur
      const { confirmPassword, ...dataToSend } = formData;
      await api.post("/auth/register", dataToSend);
      alert("Compte créé avec succès !");
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="person_add" size={32} color="white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Créer un compte
          </h2>
          <p className="text-gray-500 mt-1">Rejoignez Sanctuary Health</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Prénom *</label>
              <input type="text" name="prenom" value={formData.prenom} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Nom *</label>
              <input type="text" name="nom" value={formData.nom} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Mot de passe *</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30" />
          </div>
          {/* Nouveau champ de confirmation du mot de passe */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Confirmer le mot de passe *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Téléphone</label>
            <input type="text" name="telephone" value={formData.telephone} onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Département</label>
              <select name="departement" value={formData.departement} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30">
                <option value="">Sélectionner</option>
                <option value="Cardiologie">Cardiologie</option>
                <option value="Radiologie">Radiologie</option>
                <option value="Laboratoire">Laboratoire</option>
                <option value="Pédiatrie">Pédiatrie</option>
                <option value="Administration">Administration</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Spécialité</label>
              <input type="text" name="specialite" value={formData.specialite} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Rôle</label>
            <select name="role" value={formData.role} onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30">
              <option value="MEDECIN">Médecin</option>
              <option value="ADMIN">Administrateur</option>
              <option value="AGENT_ADMISSION">Agent admission</option>
              <option value="COMPTABLE">Comptable</option>
            </select>
          </div>
          <Button type="submit" label={loading ? "Création..." : "Créer le compte"} variant="primary" className="w-full py-3" icon="person_add" />
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Déjà un compte ?{" "}
          <button onClick={onBack} className="text-teal-600 font-bold hover:underline">
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;