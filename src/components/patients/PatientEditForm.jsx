import { useState, useEffect } from "react";
import Icon from "../common/Icon";
import Button from "../common/Button";
import admissionService from "../../services/admissionService";

const PatientEditForm = ({ patient, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    sexe: "",
    telephone: "",
    email: "",
    adresse: "",
    couvertureMedicale: "",
    chambre: "",
    serviceAffecte: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [chambres, setChambres] = useState([]);

  useEffect(() => {
    if (patient) {
      setFormData({
        nom: patient.nom || "",
        prenom: patient.prenom || "",
        dateNaissance: patient.dateNaissance || "",
        sexe: patient.sexe || "",
        telephone: patient.telephone || "",
        email: patient.email || "",
        adresse: patient.adresse || "",
        couvertureMedicale: patient.couvertureMedicale || "",
        chambre: patient.chambre || "",
        serviceAffecte: patient.serviceAffecte || "",
      });

      // Charger les chambres disponibles pour le service actuel du patient
      if (patient.serviceAffecte) {
        admissionService.getChambresDisponibles(patient.serviceAffecte)
          .then(res => {
            // Inclure la chambre actuelle même si elle est pleine
            let list = res.data;
            const currentChambre = patient.chambre;
            if (currentChambre && !list.find(c => c.numero === currentChambre)) {
              list = [{ numero: currentChambre, capacite: 1, litsOccupes: 1 }, ...list];
            }
            setChambres(list);
          })
          .catch(() => setChambres([]));
      }
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Recharger les chambres si le service change
    if (name === "serviceAffecte" && value) {
      admissionService.getChambresDisponibles(value)
        .then(res => {
          // inclure la chambre actuelle si elle existe
          let list = res.data;
          if (patient?.chambre && !list.find(c => c.numero === patient.chambre)) {
            list = [{ numero: patient.chambre, capacite: 1, litsOccupes: 1 }, ...list];
          }
          setChambres(list);
        })
        .catch(() => setChambres([]));
    }

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.telephone.trim()) newErrors.telephone = "Le téléphone est requis";
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
      // Vérifier si la chambre a changé
      if (patient.chambre !== formData.chambre && formData.chambre) {
        // Appeler l'API de transfert
        await admissionService.transfererPatient(patient.id, formData.chambre);
      }

      // Mettre à jour les autres informations
      await admissionService.updatePatient(patient.id, {
        nom: formData.nom,
        prenom: formData.prenom,
        dateNaissance: formData.dateNaissance,
        sexe: formData.sexe,
        telephone: formData.telephone,
        email: formData.email,
        adresse: formData.adresse,
        couvertureMedicale: formData.couvertureMedicale,
        chambre: formData.chambre,
        serviceAffecte: formData.serviceAffecte,
      });

      setLoading(false);
      if (onSubmit) onSubmit();
    } catch (error) {
      setLoading(false);
      setErrors({ global: "Erreur lors de la modification." });
    }
  };

  const inputClass = (fieldName) =>
    `w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none ${
      errors[fieldName] ? "ring-2 ring-red-400" : ""
    }`;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 rounded-t-2xl flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Modifier le patient
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
            <Icon name="close" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Nom *</label>
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} className={inputClass("nom")} />
              {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Prénom *</label>
              <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className={inputClass("prenom")} />
              {errors.prenom && <p className="text-xs text-red-500 mt-1">{errors.prenom}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Téléphone *</label>
              <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} className={inputClass("telephone")} />
              {errors.telephone && <p className="text-xs text-red-500 mt-1">{errors.telephone}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass("email")} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1">Adresse</label>
              <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} className={inputClass("adresse")} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Couverture</label>
              <input type="text" name="couvertureMedicale" value={formData.couvertureMedicale} onChange={handleChange} className={inputClass("couvertureMedicale")} />
            </div>
            {/* Sélection du service */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Service</label>
              <select name="serviceAffecte" value={formData.serviceAffecte} onChange={handleChange} className={inputClass("serviceAffecte")}>
                <option value="">Aucun</option>
                <option value="Cardiologie">Cardiologie</option>
                <option value="Chirurgie">Chirurgie</option>
                <option value="Maternité">Maternité</option>
                <option value="Pédiatrie">Pédiatrie</option>
                <option value="Médecine Générale">Médecine Générale</option>
              </select>
            </div>
            {/* Sélection de la chambre */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Chambre</label>
              <select name="chambre" value={formData.chambre} onChange={handleChange} className={inputClass("chambre")} disabled={chambres.length === 0}>
                <option value="">{chambres.length === 0 ? 'Aucune chambre disponible' : 'Sélectionner une chambre'}</option>
                {chambres.map(ch => (
                  <option key={ch.numero} value={ch.numero}>
                    {ch.numero} ({ch.litsOccupes}/{ch.capacite} occupés)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errors.global && <p className="text-sm text-red-500">{errors.global}</p>}

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={onCancel} className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50">
              Annuler
            </button>
            <Button type="submit" label={loading ? "Enregistrement..." : "Enregistrer"} variant="primary" className="flex-1 py-3" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientEditForm;