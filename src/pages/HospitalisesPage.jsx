import { useState, useEffect } from "react";
import admissionService from "../services/admissionService";
import Icon from "../components/common/Icon";
import ConfirmDialog from "../components/common/ConfirmDialog";
import exportHospitalisesPDF from "../components/hospitalises/HospitalisesPDF";

// Rôles autorisés à sortir un patient
const canSortir = (role) => ["ADMIN", "AGENT_ADMISSION"].includes(role);

const HospitalisesPage = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortieConfirm, setSortieConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadHospitalises();
  }, []);

  const loadHospitalises = async () => {
    setLoading(true);
    try {
      const response = await admissionService.getPatientsHospitalises();
      setPatients(response.data);
    } catch (error) {
      console.error("Erreur chargement patients hospitalisés :", error);
    }
    setLoading(false);
  };

  const handleSortir = async () => {
    if (!sortieConfirm) return;
    setDeleting(true);
    try {
      await admissionService.sortirPatient(sortieConfirm.id);
      setSortieConfirm(null);
      loadHospitalises();
    } catch (error) {
      console.error("Erreur sortie :", error);
    }
    setDeleting(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <p className="text-center text-gray-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      <div className="flex justify-between items-center">
        <div>
          <h2
            className="text-3xl font-extrabold text-gray-900 tracking-tight"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            Patients Hospitalisés
          </h2>
          <p className="text-gray-500 mt-1">
            Liste des patients occupant actuellement une chambre
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadHospitalises}
            className="px-4 py-2 bg-teal-700 text-white rounded-lg font-bold hover:bg-teal-800 transition-colors flex items-center gap-2"
          >
            <Icon name="refresh" size={18} />
            Actualiser
          </button>
          <button
            onClick={() => exportHospitalisesPDF(patients)}
            className="px-4 py-2 bg-teal-700 text-white rounded-lg font-bold hover:bg-teal-800 transition-colors flex items-center gap-2"
          >
            <Icon name="picture_as_pdf" size={18} />
            Exporter PDF
          </button>
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
          <Icon name="local_hotel" size={48} className="mx-auto mb-4" />
          <p className="text-lg">Aucun patient hospitalisé pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Patient</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Chambre</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Service</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Date d'admission</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Sortie prévue</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.prenom + " " + p.nom)}&background=005e53&color=fff&size=128`}
                      alt={p.nom}
                    />
                    <div>
                      <p className="font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {p.prenom} {p.nom}
                      </p>
                      <p className="text-xs text-gray-500">
                        {p.sexe === "M" ? "Homme" : "Femme"} •{" "}
                        {p.dateNaissance
                          ? new Date().getFullYear() - new Date(p.dateNaissance).getFullYear()
                          : "?"}{" "}
                        ans
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.clinicalId}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold">
                      <Icon name="local_hotel" size={14} />
                      {p.chambre}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                    {p.serviceAffecte || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{p.dateAdmission}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 italic">--</td>
                  <td className="px-6 py-4 text-right">
                    {canSortir(user?.role) && (
                      <button
                        onClick={() => setSortieConfirm(p)}
                        className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 ml-auto"
                      >
                        <Icon name="logout" size={14} />
                        Sortir
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sortieConfirm && (
        <ConfirmDialog
          title="Sortir le patient"
          message={`Confirmez-vous la sortie de ${sortieConfirm.prenom} ${sortieConfirm.nom} ? Le lit sera libéré.`}
          onConfirm={handleSortir}
          onCancel={() => setSortieConfirm(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default HospitalisesPage;