import Icon from "../common/Icon";
import PatientDocument from "./PatientDocument";

const PatientDocuments = ({ documents = [] }) => {
  return (
    <div className="bg-white p-6 rounded-xl space-y-4 border border-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
          <Icon name="folder_shared" size={22} color="#005e53" />
          Patient Documents
        </h3>
        <span className="cursor-pointer hover:text-gray-900 text-gray-400">
          <Icon name="upload" size={20} />
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {documents.map((doc, index) => (
          <PatientDocument key={index} {...doc} />
        ))}
      </div>
    </div>
  );
};

export default PatientDocuments;