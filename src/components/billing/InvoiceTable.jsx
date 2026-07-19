import InvoiceTableRow from "./InvoiceTableRow";

const InvoiceTable = ({ invoices = [], onViewAll, onDelete, onPay, onDetail }) => {
  return (
    <section className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <div className="px-8 py-6 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Recent Invoices
        </h3>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            Filter
          </button>
          <button className="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-8 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Invoice ID</th>
              <th className="px-8 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Patient</th>
              <th className="px-8 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Date Issued</th>
              <th className="px-8 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Amount</th>
              <th className="px-8 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-center">Status</th>
              <th className="px-8 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.filter(Boolean).map((invoice, index) => (
              <InvoiceTableRow
                key={invoice.invoiceId || index}
                invoice={invoice}
                onDelete={onDelete}
                onPay={onPay}
                onDetail={onDetail}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-6 bg-gray-50/20 flex justify-center">
        <button onClick={onViewAll} className="text-teal-600 font-bold text-xs uppercase tracking-widest hover:underline transition-all">
          View All Transaction History
        </button>
      </div>
    </section>
  );
};

export default InvoiceTable;