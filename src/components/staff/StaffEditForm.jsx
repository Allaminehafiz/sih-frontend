import { useState, useEffect } from "react";
import Icon from "../common/Icon";
import Button from "../common/Button";
import staffService from "../../services/staffService";

const StaffEditForm = ({ staff, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    role: "",
    departement: "",
    specialite: "",
    actif: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staff) {
      setFormData({
        nom: staff.nom || "",
        email: staff.email || "",
        telephone: staff.telephone || "",
        role: staff.role || "",
        departement: staff.departement || "",
        specialite: staff.specialite || "",
        actif: staff.actif !== undefined ? staff.actif : true,
      });
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
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
      await staffService.updateUtilisateur(staff.id, formData);
      setLoading(false);
      if (onSubmit) onSubmit(formData);
    } catch (error) {
      setLoading(false);
      console.error("Erreur modification staff :", error);
    }
  };

  const inputClass = (fieldName) =>
    `w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none ${errors[fieldName] ? "ring-2 ring-red-400" : ""}`;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 rounded-t-2xl flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>Edit Staff</h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full"><Icon name="close" size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1">Full Name *</label>
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} className={inputClass("nom")} />
              {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass("email")} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Phone</label>
              <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} className={inputClass("telephone")} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className={inputClass("role")}>
                <option value="">Select</option>
                <option value="MEDECIN">Doctor</option>
                <option value="INFIRMIER">Nurse</option>
                <option value="PHARMACIEN">Pharmacist</option>
                <option value="COMPTABLE">Accountant</option>
                <option value="ADMIN">Admin</option>
                <option value="AGENT_ADMISSION">Admission Agent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Department</label>
              <input type="text" name="departement" value={formData.departement} onChange={handleChange} className={inputClass("departement")} />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="actif" checked={formData.actif} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-teal-600" />
                <span className="text-sm text-gray-700">Active account</span>
              </label>
            </div>
          </div>
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={onCancel} className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50">Cancel</button>
            <Button type="submit" label={loading ? "Saving..." : "Save Changes"} variant="primary" className="flex-1 py-3" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffEditForm;