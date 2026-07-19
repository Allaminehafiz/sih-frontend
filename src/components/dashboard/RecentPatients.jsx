import PatientTableRow from "./PatientTableRow";

const RecentPatients = ({ patients = [] }) => {
  return (
    <section className="bg-white rounded-2xl p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Recent Patients
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Show:</span>
          <select className="text-xs font-bold bg-transparent border-none focus:ring-0 text-teal-600 cursor-pointer outline-none">
            <option>Last 7 Days</option>
            <option>Last Month</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.1em] border-b border-gray-100">
              <th className="pb-4 pl-0">Patient Name</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Last Visit</th>
              <th className="pb-4">Balance</th>
              <th className="pb-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {patients.map((patient, index) => (
              <PatientTableRow key={index} {...patient} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentPatients;