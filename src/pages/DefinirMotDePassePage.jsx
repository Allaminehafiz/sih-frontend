import { useState } from "react";
import Icon from "../components/common/Icon";
import Button from "../components/common/Button";
import api from "../services/api";

const DefinirMotDePassePage = () => {
  // Extraire le token manuellement depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirm) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/definir-mot-de-passe", {
        token,
        nouveauMotDePasse: password,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Token invalide ou expiré.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <Icon name="check_circle" size={64} color="#005e53" />
          <h2 className="text-2xl font-bold mt-4">Mot de passe défini !</h2>
          <p className="text-gray-500 mt-2">Vous pouvez maintenant vous connecter.</p>
          <a
            href="/"
            className="mt-6 inline-block py-3 px-6 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition-colors"
          >
            Aller à la connexion
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="lock" size={32} color="white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Définir mon mot de passe
          </h2>
          <p className="text-gray-500 mt-1">Choisissez un mot de passe sécurisé</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
          <Button
            type="submit"
            label={loading ? "Enregistrement..." : "Enregistrer le mot de passe"}
            variant="primary"
            className="w-full py-3"
            icon={loading ? null : "save"}
          />
        </form>
      </div>
    </div>
  );
};

export default DefinirMotDePassePage;