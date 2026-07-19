import Icon from "../common/Icon";
import Badge from "../common/Badge";
import Button from "../common/Button";

const PatientHeader = ({ patient, onSortir }) => {
  const statut = patient?.statutAdmission || "ADMIS";
  const statutLabels = {
    EN_ATTENTE: "En attente",
    ADMIS: "Admis",
    REFUSE: "Refusé",
    SORTI: "Sorti",
  };
  const statutColors = {
    EN_ATTENTE: "bg-amber-50 text-amber-700",
    ADMIS: "bg-teal-50 text-teal-700",
    REFUSE: "bg-red-50 text-red-700",
    SORTI: "bg-gray-50 text-gray-600",
  };
  const statutBadge = statutColors[statut] || "bg-teal-50 text-teal-700";
  const statutLabel = statutLabels[statut] || "Admis";

  const taux = patient?.tauxPriseEnCharge;
  const tauxDisplay = taux != null ? `${Math.round(taux * 100)}%` : null;

  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
      <div className="flex items-start gap-8">
        <img
          alt={patient?.name || "Patient"}
          className="w-32 h-32 rounded-full object-cover shadow-2xl"
          src={patient?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(patient?.name || "Patient")}&background=005e53&color=fff&size=256`}
        />

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {patient?.name || "Unknown"}
            </h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statutBadge}`}>
              {statutLabel}
            </span>
          </div>

          <p className="text-gray-500 font-medium flex items-center gap-4">
            <span>ID: #{patient?.clinicalId || "N/A"}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>DOB: {patient?.dob || "N/A"} ({patient?.age || "?"} yrs)</span>
          </p>

          <div className="flex gap-2 pt-2 flex-wrap">
            <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Icon name="water_drop" size={16} color="#005e53" />
              {patient?.bloodType || "N/A"}
            </span>
            <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Icon name="monitor_weight" size={16} color="#005c67" />
              {patient?.weight || "N/A"} kg
            </span>
            <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Icon name="height" size={16} color="#4c616c" />
              {patient?.height || "N/A"} cm
            </span>

            {patient?.couvertureMedicale && patient.couvertureMedicale !== "Aucune" && (
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Icon name="verified_user" size={16} color="#005e53" />
                {patient.couvertureMedicale}
                {tauxDisplay ? ` (${tauxDisplay})` : ""}
              </span>
            )}

            {patient?.chambre && (
              <span className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Icon name="local_hotel" size={16} color="#005e53" />
                Ch. {patient.chambre}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button label="Update Records" icon="edit_note" variant="primary" />
        {onSortir && (
          <Button label="Sortir" icon="logout" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={onSortir} />
        )}
        <button className="p-3 bg-white text-teal-600 rounded-md shadow-sm hover:bg-gray-100 transition-all">
          <Icon name="more_horiz" size={22} />
        </button>
      </div>
    </section>
  );
};

export default PatientHeader;