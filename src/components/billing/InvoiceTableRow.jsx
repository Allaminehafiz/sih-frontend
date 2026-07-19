import ActionMenu from "../common/ActionMenu";

const statusStyles = {
  Paid: { bg: "bg-teal-50", text: "text-teal-700" },
  Pending: { bg: "bg-blue-50", text: "text-blue-700" },
  Overdue: { bg: "bg-red-50", text: "text-red-700" },
};

const InvoiceTableRow = ({ invoice, onDelete, onPay, onDetail }) => {
  if (!invoice) return null;

  const initials = (invoice.patient || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const statusStyle = statusStyles[invoice.status] || statusStyles.Pending;

  // Construit les actions personnalisées
  const customActions = [];

  // Action "Détails" (toujours visible)
  customActions.push({
    label: "Détails",
    action: () => onDetail && onDetail(invoice),
  });

  // Action de paiement (si la facture n'est pas déjà payée)
  if (invoice.status !== "Paid") {
    customActions.push({
      label: "Enregistrer un paiement",
      action: () => onPay && onPay(invoice),
    });
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      {/* Invoice ID */}
      <td className="px-8 py-5 text-sm font-medium text-teal-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
        {invoice.invoiceId || "N/A"}
      </td>

      {/* Patient */}
      <td className="px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{invoice.patient || "Unknown"}</p>
            <p className="text-xs text-gray-500">{invoice.email || ""}</p>
          </div>
        </div>
      </td>

      {/* Date */}
      <td className="px-8 py-5 text-sm text-gray-500">{invoice.date || "N/A"}</td>

      {/* Amount */}
      <td className="px-8 py-5 text-sm font-bold text-gray-900">{invoice.amount || "$0.00"}</td>

      {/* Status */}
      <td className="px-8 py-5 text-center">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text}`}
        >
          {invoice.status || "Pending"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
        <ActionMenu
          customActions={customActions}
          onDelete={() => onDelete && onDelete(invoice)}
          deleteLabel="Delete Invoice"
        />
      </td>
    </tr>
  );
};

export default InvoiceTableRow;