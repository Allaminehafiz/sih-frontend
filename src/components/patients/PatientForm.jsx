import { useState, useEffect } from "react";
import Icon from "../common/Icon";
import Button from "../common/Button";
import admissionService from "../../services/admissionService";

const PatientForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    sexe: "",
    telephone: "",
    email: "",
    adresse: "",
    couvertureMedicale: "",
    numeroAssurance: "",
    dateExpirationCouverture: "",
    hospitalisation: false,
    serviceAffecte: "",
    chambre: "",
    groupeSanguin: "",
    poids: "",
    taille: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [chambres, setChambres] = useState([]);

  // Charger les chambres disponibles quand le service change
  useEffect(() => {
    if (formData.hospitalisation && formData.serviceAffecte) {
      admissionService
        .getChambresDisponibles(formData.serviceAffecte)
        .then(res => setChambres(res.data))
        .catch(() => setChambres([]));
    } else {
      setChambres([]);
    }
  }, [formData.hospitalisation, formData.serviceAffecte]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.dateNaissance) newErrors.dateNaissance = "La date de naissance est requise";
    if (!formData.sexe) newErrors.sexe = "Le sexe est requis";
    if (!formData.telephone.trim()) newErrors.telephone = "Le téléphone est requis";
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (formData.couvertureMedicale && !formData.numeroAssurance.trim()) {
      newErrors.numeroAssurance = "Numéro d'assurance requis";
    }
    if (formData.hospitalisation && !formData.serviceAffecte) {
      newErrors.serviceAffecte = "Service requis pour l'hospitalisation";
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
    try {
      const patientData = {
        patient: {
          nom: formData.nom,
          prenom: formData.prenom,
          dateNaissance: formData.dateNaissance,
          sexe: formData.sexe,
          telephone: formData.telephone,
          email: formData.email,
          adresse: formData.adresse,
          couvertureMedicale: formData.couvertureMedicale || "Aucune",
          numeroAssurance: formData.numeroAssurance,
          dateExpirationCouverture: formData.dateExpirationCouverture || null,
          chambre: formData.hospitalisation ? formData.chambre : null,
          serviceAffecte: formData.hospitalisation ? formData.serviceAffecte : null,
        },
        groupeSanguin: formData.groupeSanguin || null,
        poids: formData.poids ? parseFloat(formData.poids) : null,
        taille: formData.taille ? parseFloat(formData.taille) : null,
      };

      await admissionService.createPatient(patientData);
      setLoading(false);
      setSuccess(true);
      if (onSubmit) onSubmit(formData);
    } catch (error) {
      setLoading(false);
      setErrors({ global: "Erreur lors de l'enregistrement." });
    }
  };

  const inputClass = (fieldName) =>
    `w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none ${
      errors[fieldName] ? "ring-2 ring-red-400" : ""
    }`;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
              New Patient Registration
            </h2>
            <p className="text-sm text-gray-500">Fill in the patient's information below</p>
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
                <p className="font-bold text-teal-700">Patient enregistré avec succès !</p>
                <p className="text-sm text-teal-600">Le patient a été ajouté au registre.</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  nom: "", prenom: "", dateNaissance: "", sexe: "",
                  telephone: "", email: "", adresse: "", couvertureMedicale: "",
                  numeroAssurance: "", dateExpirationCouverture: "",
                  hospitalisation: false, serviceAffecte: "", chambre: "",
                  groupeSanguin: "", poids: "", taille: "",
                });
                if (onCancel) onCancel();
              }}
              className="w-full py-2 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700 transition-colors"
            >
              Close & Continue
            </button>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Identité */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="person" size={18} color="#005e53" />
              Identity Information
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
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Date of Birth *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="calendar_today" size={18} /></span>
                  <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} className={inputClass("dateNaissance")} />
                </div>
                {errors.dateNaissance && <p className="text-xs text-red-500 mt-1">{errors.dateNaissance}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Gender *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="wc" size={18} /></span>
                  <select name="sexe" value={formData.sexe} onChange={handleChange} className={inputClass("sexe")}>
                    <option value="">Select gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
                {errors.sexe && <p className="text-xs text-red-500 mt-1">{errors.sexe}</p>}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="contact_phone" size={18} color="#005e53" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Phone *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="call" size={18} /></span>
                  <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="+237 6XX XXX XXX" className={inputClass("telephone")} />
                </div>
                {errors.telephone && <p className="text-xs text-red-500 mt-1">{errors.telephone}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="mail" size={18} /></span>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="patient@example.com" className={inputClass("email")} />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="location_on" size={18} /></span>
                  <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Yaoundé, Cameroon" className={inputClass("adresse")} />
                </div>
              </div>
            </div>
          </div>

          {/* Médical */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="medical_information" size={18} color="#005e53" />
              Medical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Blood Type</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="water_drop" size={18} /></span>
                  <select name="groupeSanguin" value={formData.groupeSanguin} onChange={handleChange} className={inputClass("groupeSanguin")}>
                    <option value="">Unknown</option>
                    <option value="A+">A Positive</option>
                    <option value="A-">A Negative</option>
                    <option value="B+">B Positive</option>
                    <option value="B-">B Negative</option>
                    <option value="AB+">AB Positive</option>
                    <option value="AB-">AB Negative</option>
                    <option value="O+">O Positive</option>
                    <option value="O-">O Negative</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Weight (kg)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="monitor_weight" size={18} /></span>
                  <input type="number" name="poids" value={formData.poids} onChange={handleChange} placeholder="70" className={inputClass("poids")} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Height (cm)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="height" size={18} /></span>
                  <input type="number" name="taille" value={formData.taille} onChange={handleChange} placeholder="170" className={inputClass("taille")} />
                </div>
              </div>
            </div>
          </div>

          {/* Couverture */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="verified_user" size={18} color="#005e53" />
              Insurance Coverage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Coverage Type</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="shield" size={18} /></span>
                  <select name="couvertureMedicale" value={formData.couvertureMedicale} onChange={handleChange} className={inputClass("couvertureMedicale")}>
                    <option value="">No insurance</option>
                    <option value="CNPS">CNPS</option>
                    <option value="Mutuelle">Mutuelle</option>
                    <option value="Assurance Privée">Assurance Privée</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Insurance Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="pin" size={18} /></span>
                  <input type="text" name="numeroAssurance" value={formData.numeroAssurance} onChange={handleChange} placeholder="ASS-12345" className={inputClass("numeroAssurance")} />
                </div>
                {errors.numeroAssurance && <p className="text-xs text-red-500 mt-1">{errors.numeroAssurance}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Expiration Date</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="calendar_today" size={18} /></span>
                  <input type="date" name="dateExpirationCouverture" value={formData.dateExpirationCouverture} onChange={handleChange} className={inputClass("dateExpirationCouverture")} />
                </div>
              </div>
            </div>
          </div>

          {/* Hospitalisation */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="local_hotel" size={18} color="#005e53" />
              Hospitalisation
            </h3>
            <div className="mb-4">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="hospitalisation" checked={formData.hospitalisation} onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                <span className="text-sm font-medium">Hospitaliser le patient</span>
              </label>
            </div>
            {formData.hospitalisation && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Service *</label>
                  <select name="serviceAffecte" value={formData.serviceAffecte} onChange={handleChange} className={inputClass("serviceAffecte")}>
                    <option value="">Choisir un service</option>
                    <option value="Cardiologie">Cardiologie</option>
                    <option value="Chirurgie">Chirurgie</option>
                    <option value="Maternité">Maternité</option>
                    <option value="Pédiatrie">Pédiatrie</option>
                    <option value="Médecine Générale">Médecine Générale</option>
                  </select>
                  {errors.serviceAffecte && <p className="text-xs text-red-500 mt-1">{errors.serviceAffecte}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Chambre</label>
                  <select name="chambre" value={formData.chambre} onChange={handleChange} className={inputClass("chambre")}
                    disabled={chambres.length === 0}>
                    <option value="">
                      {chambres.length === 0 ? 'Aucune chambre disponible' : 'Sélectionner une chambre'}
                    </option>
                    {chambres.map((ch) => (
                      <option key={ch.id} value={ch.numero}>
                        {ch.numero} ({ch.litsOccupes}/{ch.capacite} occupés)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={onCancel}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <Button type="submit" label={loading ? "Registering..." : "Register Patient"} variant="primary" className="flex-1 py-3 text-base" icon={loading ? null : "person_add"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;