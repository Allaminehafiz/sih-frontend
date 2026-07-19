import TimelineItem from "./TimelineItem";

const ClinicalTimeline = ({ events = [], patientData }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Clinical Timeline
        </h3>
        <button className="text-teal-600 text-sm font-semibold hover:underline">
          View Full History
        </button>
      </div>

      {/* Ligne verticale de timeline */}
      <div className="relative space-y-12">
        {/* Ligne verticale */}
        <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gray-200"></div>

        {events.map((event, index) => (
          <TimelineItem key={index} {...event} patientData={patientData} fullConsultation={event} />
        ))}
      </div>
    </div>
  );
};

export default ClinicalTimeline;