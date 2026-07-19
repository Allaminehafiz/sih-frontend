import Icon from "../common/Icon";
import TreatmentItem from "./TreatmentItem";

const NextAppointmentPanel = ({ patient, treatments = [], onViewHistory }) => {
  return (
    <aside className="w-80 bg-white border-l border-gray-200 p-6 hidden xl:flex flex-col h-full">
      {/* Titre */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Next Appointment
        </h3>
        <button className="text-teal-600 text-xs font-bold">Details</button>
      </div>

      {/* Carte patient */}
      <div className="bg-gray-100 rounded-3xl p-6 mb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-600/5 rounded-bl-full -mr-8 -mt-8"></div>
        <img
          alt={patient.name}
          className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-md mb-4"
          src={patient.avatar}
        />
        <h4 className="font-bold text-xl" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {patient.name}
        </h4>
        <p className="text-gray-500 text-sm font-medium">{patient.type}</p>

        <div className="mt-6 flex justify-around">
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-gray-400">BP</p>
            <p className="font-bold text-sm">{patient.bp}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-gray-400">Weight</p>
            <p className="font-bold text-sm">{patient.weight}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-gray-400">Pulse</p>
            <p className="font-bold text-sm">{patient.pulse}</p>
          </div>
        </div>
      </div>

      {/* Traitements */}
      <div className="space-y-6 flex-1">
        <h5 className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Treatment Plan
        </h5>
        <div className="space-y-4">
          {treatments.map((treatment, index) => (
            <TreatmentItem key={index} {...treatment} />
          ))}
        </div>
      </div>

      {/* Bouton bas */}
      <button
        onClick={onViewHistory}
        className="mt-auto w-full py-4 border-2 border-teal-600/20 text-teal-700 font-bold rounded-2xl hover:bg-teal-50 transition-colors"
        style={{ fontFamily: 'Manrope, sans-serif' }}
      >
        View Medical History
      </button>
    </aside>
  );
};

export default NextAppointmentPanel;