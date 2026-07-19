import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import Icon from "../common/Icon";

const PatientTableRow = ({ name, patientId, avatar, status, statusVariant = "primary", lastVisit, balance, balanceColor = "text-gray-900" }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-5 flex items-center gap-3">
        <Avatar src={avatar} alt={name} size="md" />
        <div>
          <p className="text-sm font-bold text-gray-900">{name}</p>
          <p className="text-[11px] text-gray-500">ID: {patientId}</p>
        </div>
      </td>
      <td className="py-5">
        <Badge label={status} variant={statusVariant} withDot />
      </td>
      <td className="py-5 text-sm text-gray-500 font-medium">{lastVisit}</td>
      <td className={`py-5 text-sm font-bold ${balanceColor}`}>{balance}</td>
      <td className="py-5 text-right">
        <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-teal-600">
          <Icon name="more_vert" size={20} />
        </button>
      </td>
    </tr>
  );
};

export default PatientTableRow;