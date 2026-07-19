import Icon from "../common/Icon";
import Button from "../common/Button";

const RecordsHeader = ({ onNewRecord }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <span className="text-teal-600 font-bold tracking-widest text-[10px] uppercase mb-2 block">
          Clinical Archives
        </span>
        <h2
          className="text-4xl font-extrabold text-gray-900 tracking-tight"
          style={{ fontFamily: 'Manrope, sans-serif' }}
        >
          Medical Records
        </h2>
        <p className="text-gray-500 mt-2 text-lg">
          Browse and manage patient clinical histories and diagnostic reports.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          label="New Record"
          icon="add"
          variant="primary"
          onClick={onNewRecord}
        />
      </div>
    </div>
  );
};

export default RecordsHeader;