import Button from "../common/Button";
import Icon from "../common/Icon";

const StaffHeader = ({ onOnboardClick }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
      <div className="space-y-1">
        <h3
          className="text-4xl font-extrabold text-gray-900 tracking-tight"
          style={{ fontFamily: 'Manrope, sans-serif' }}
        >
          Staff Directory
        </h3>
        <p className="text-gray-500 text-lg">
          Managing 42 active professionals across 6 departments.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          label="Export List"
          icon="file_download"
          variant="outline"
          className="bg-white text-teal-700 font-semibold shadow-sm hover:bg-gray-100"
        />
        <Button
          label="Onboard Staff"
          icon="person_add"
          variant="primary"
          className="font-semibold shadow-md"
          onClick={onOnboardClick}
        />
      </div>
    </div>
  );
};

export default StaffHeader;