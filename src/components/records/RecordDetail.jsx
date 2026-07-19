import Icon from "../common/Icon";

const RecordDetail = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="float-right text-gray-400 hover:text-gray-600"
        >
          <Icon name="close" size={24} />
        </button>

        {/* En-tête */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {record.patientName}
          </h3>
          <p className="text-gray-500 text-sm">ID: {record.patientId} | {record.department}</p>
          <span
            className={`mt-2 inline-block text-xs font-bold px-3 py-1 rounded-full ${
              record.status === "Final"
                ? "bg-teal-50 text-teal-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {record.status}
          </span>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Attending Physician</p>
            <p className="text-gray-800 font-medium">{record.physician}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Last Updated</p>
            <p className="text-gray-800 font-medium">{record.lastUpdated}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-400 uppercase font-bold">Diagnosis Summary</p>
            <p className="text-gray-800 font-medium">{record.diagnosis || "No diagnosis recorded."}</p>
          </div>
        </div>

        {/* Documents liés */}
        <div className="mb-8">
          <h4 className="font-bold text-gray-900 mb-3">Attached Documents</h4>
          <div className="space-y-2">
            {record.documents?.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="description" size={20} color="#4c616c" />
                  <span className="text-sm">{doc.name}</span>
                </div>
                <button className="text-teal-600 text-xs font-bold hover:underline">Download</button>
              </div>
            ))}
            {(!record.documents || record.documents.length === 0) && (
              <p className="text-sm text-gray-400 italic">No documents attached.</p>
            )}
          </div>
        </div>

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition-colors"
        >
          Close Record
        </button>
      </div>
    </div>
  );
};

export default RecordDetail;