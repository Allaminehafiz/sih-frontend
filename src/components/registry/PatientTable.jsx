import PatientTableRow from "./PatientTableRow";
import Pagination from "./Pagination";

const PatientTable = ({ patients = [], onPatientClick, onEdit, onDelete }) => {
  return (
    <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50">
            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">
              Patient Identity
            </th>
            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">
              Clinical ID
            </th>
            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">
              Last Encounter
            </th>
            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">
              Health Status
            </th>
            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {patients.map((patient, index) => (
            <PatientTableRow
              key={index}
              patient={patient}
              onClick={() => onPatientClick && onPatientClick(patient)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
      <Pagination currentPage={1} totalPages={3} />
    </section>
  );
};

export default PatientTable;