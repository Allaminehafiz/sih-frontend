import { useState } from "react";
import Icon from "../common/Icon";
import Button from "../common/Button";
import staffService from "../../services/staffService";
import api from "../../services/api";

const JOURS_SEMAINE = [
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
  { value: 7, label: "Dimanche" },
];

const StaffForm = ({ onSubmit, onCancel }) => {
  const [isOpen, setIsOpen] = useState(true);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    role: "",
    departement: "",
    specialite: "",
    dateEmbauche: new Date().toISOString().split("T")[0],
    typeContrat: "Temps plein",
  });

  const [creneaux, setCreneaux] = useState([
    { jourSemaine: 1, heureDebut: "08:00", heureFin: "17:00" },
  ]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCreneauChange = (index, field, value) => {
    const updated = [...creneaux];
    updated[index][field] = field === "jourSemaine" ? parseInt(value) : value;
    setCreneaux(updated);
  };

  const addCreneau = () => {
    setCreneaux([...creneaux, { jourSemaine: 1, heureDebut: "08:00", heureFin: "17:00" }]);
  };

  const removeCreneau = (index) => {
    if (creneaux.length > 1) {
      setCreneaux(creneaux.filter((_, i) => i !== index));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Last name is required";
    if (!formData.prenom.trim()) newErrors.prenom = "First name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    if (!formData.departement.trim()) newErrors.departement = "Department is required";

    if (mapRole(formData.role) === "MEDECIN") {
      creneaux.forEach((c, idx) => {
        if (!c.heureDebut || !c.heureFin) {
          newErrors[`creneau_${idx}`] = "Heures requises";
        } else if (c.heureDebut >= c.heureFin) {
          newErrors[`creneau_${idx}`] = "Début < Fin";
        }
      });
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
    setErrors({});
    try {
      const roleMapped = mapRole(formData.role);
      // Utiliser le même service pour tous les rôles
      const staffData = {
        nom: `${formData.prenom} ${formData.nom}`,
        email: formData.email,
        motDePasse: "changeme123",
        role: roleMapped,
        telephone: formData.telephone,
        departement: formData.departement,
        specialite: formData.specialite,
        actif: true,
      };
      const response = await staffService.createUtilisateur(staffData);
      
      console.log("Réponse API :", response.data);
      console.log("resetToken :", response.data.resetToken);
      
      setLoading(false);
      setCreatedUser(response.data);
      setSuccess(true);
    } catch (error) {
      setLoading(false);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erreur lors de l'enregistrement du staff.";
      setErrors({ global: message });
      console.error("Erreur API :", error.response?.data || error);
    }
  };

  const mapRole = (role) => {
    const roleMap = {
      "Médecin": "MEDECIN",
      "Infirmier": "INFIRMIER",
      "Pharmacien": "PHARMACIEN",
      "Technicien Labo": "PHARMACIEN",
      "Administrateur Clinique": "ADMIN",
      "Radiologue": "MEDECIN",
      "Spécialiste Soins": "INFIRMIER",
      "Comptable": "COMPTABLE",
    };
    return roleMap[role] || "AGENT_ADMISSION";
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onCancel) onCancel();
  };

  const inputClass = (fieldName) =>
    `w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none transition-all ${
      errors[fieldName] ? "ring-2 ring-red-400" : ""
    }`;

  const selectClass = (fieldName) =>
    `w-full pl-10 pr-10 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none transition-all appearance-none ${
      errors[fieldName] ? "ring-2 ring-red-400" : ""
    }`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Onboard New Staff
            </h2>
            <p className="text-sm text-gray-500">Add a new professional to the directory</p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <Icon name="close" size={24} />
          </button>
        </div>

        {/* Message d'erreur global */}
        {errors.global && (
          <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <Icon name="error" size={20} color="#ba1a1a" />
            <p className="text-sm text-red-700">{errors.global}</p>
          </div>
        )}

        {/* SUCCÈS – reste affiché jusqu'à Fermer */}
        {success && (
          <div className="mx-8 mt-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="check_circle" size={24} color="#005e53" />
              <div>
                <p className="font-bold text-teal-700">Compte créé avec succès !</p>
                <p className="text-sm text-teal-600">{createdUser?.nom || formData.prenom} - {formData.role}</p>
              </div>
            </div>
            {createdUser?.resetToken && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-teal-200">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Token de réinitialisation</p>
                <p className="text-sm font-mono text-teal-800 break-all">{createdUser.resetToken}</p>
                <p className="text-xs text-gray-400 mt-1 mb-3">
                  Lien à envoyer à l'utilisateur :
                  <br />
                  <span className="font-mono text-teal-700">
                    {window.location.origin}/definir-mot-de-passe?token={createdUser.resetToken}
                  </span>
                </p>
                <button
                  onClick={() => {
                    const lien = `${window.location.origin}/definir-mot-de-passe?token=${createdUser.resetToken}`;
                    navigator.clipboard.writeText(lien);
                    alert("Lien copié ! Vous pouvez le transmettre à l'utilisateur.");
                  }}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 transition-colors"
                >
                  Copier le lien d'invitation
                </button>
              </div>
            )}
            <button
              onClick={handleClose}
              className="w-full mt-4 py-2 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Formulaire (affiché si pas de succès) */}
        {!success && (
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Identité */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon name="person" size={18} color="#005e53" />
                Identity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Last Name *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="badge" size={18} /></span>
                    <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Doe" className={inputClass("nom")} />
                  </div>
                  {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">First Name *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="badge" size={18} /></span>
                    <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="John" className={inputClass("prenom")} />
                  </div>
                  {errors.prenom && <p className="text-xs text-red-500 mt-1">{errors.prenom}</p>}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon name="contact_phone" size={18} color="#005e53" />
                Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Email *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="mail" size={18} /></span>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="staff@sanctuary.med" className={inputClass("email")} />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Phone</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="call" size={18} /></span>
                    <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="+237 6XX XXX XXX" className={inputClass("telephone")} />
                  </div>
                </div>
              </div>
            </div>

            {/* Poste */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon name="work" size={18} color="#005e53" />
                Position
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Role *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="stethoscope" size={18} /></span>
                    <select name="role" value={formData.role} onChange={handleChange} className={selectClass("role")}>
                      <option value="">Select role</option>
                      <option value="Médecin">Doctor</option>
                      <option value="Infirmier">Nurse</option>
                      <option value="Pharmacien">Pharmacist</option>
                      <option value="Technicien Labo">Lab Technician</option>
                      <option value="Administrateur Clinique">Clinical Administrator</option>
                      <option value="Radiologue">Radiologist</option>
                      <option value="Spécialiste Soins">Patient Care Specialist</option>
                      <option value="Comptable">Accountant</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><Icon name="arrow_drop_down" size={20} /></span>
                  </div>
                  {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Department *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="business" size={18} /></span>
                    <select name="departement" value={formData.departement} onChange={handleChange} className={selectClass("departement")}>
                      <option value="">Select department</option>
                      <option value="Cardiologie">Cardiology</option>
                      <option value="Radiologie">Radiology</option>
                      <option value="Laboratoire">Laboratory</option>
                      <option value="Pharmacie">Pharmacy</option>
                      <option value="Pédiatrie">Pediatrics</option>
                      <option value="Administration">Administration</option>
                      <option value="Urgences">Emergency</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><Icon name="arrow_drop_down" size={20} /></span>
                  </div>
                  {errors.departement && <p className="text-xs text-red-500 mt-1">{errors.departement}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Specialty (optional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="star" size={18} /></span>
                    <input type="text" name="specialite" value={formData.specialite} onChange={handleChange} placeholder="e.g., Cardiac Surgery" className={inputClass("specialite")} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Contract Type</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="description" size={18} /></span>
                    <select name="typeContrat" value={formData.typeContrat} onChange={handleChange} className={selectClass("typeContrat")}>
                      <option value="Temps plein">Full-time</option>
                      <option value="Temps partiel">Part-time</option>
                      <option value="Contractuel">Contract</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><Icon name="arrow_drop_down" size={20} /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Horaires de travail (médecin seulement) */}
            {mapRole(formData.role) === "MEDECIN" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Icon name="schedule" size={18} color="#005e53" />
                    Work Schedule
                  </h3>
                  <button type="button" onClick={addCreneau}
                    className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1">
                    <Icon name="add" size={16} /> Add day
                  </button>
                </div>
                {creneaux.map((c, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 mb-3 items-center">
                    <div className="col-span-5">
                      <select
                        value={c.jourSemaine}
                        onChange={(e) => handleCreneauChange(index, "jourSemaine", e.target.value)}
                        className="w-full py-2 px-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none"
                      >
                        {JOURS_SEMAINE.map(j => (
                          <option key={j.value} value={j.value}>{j.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <input type="time" value={c.heureDebut}
                        onChange={(e) => handleCreneauChange(index, "heureDebut", e.target.value)}
                        className="w-full py-2 px-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none" />
                    </div>
                    <div className="col-span-3">
                      <input type="time" value={c.heureFin}
                        onChange={(e) => handleCreneauChange(index, "heureFin", e.target.value)}
                        className="w-full py-2 px-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none" />
                    </div>
                    <div className="col-span-1">
                      {creneaux.length > 1 && (
                        <button type="button" onClick={() => removeCreneau(index)}
                          className="text-gray-400 hover:text-red-500">
                          <Icon name="delete" size={16} />
                        </button>
                      )}
                    </div>
                    {errors[`creneau_${index}`] && (
                      <p className="col-span-12 text-xs text-red-500">{errors[`creneau_${index}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Boutons */}
            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button type="button" onClick={handleClose} className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <Button type="submit" label={loading ? "Registering..." : "Register Staff"} variant="primary" className="flex-1 py-3 text-base" icon={loading ? null : "person_add"} />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StaffForm;