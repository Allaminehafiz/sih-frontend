import { useState } from "react";
import Icon from "../common/Icon";
import Button from "../common/Button";
import facturationService from "../../services/facturationService";

const PaymentForm = ({ invoice, onSuccess, onCancel }) => {
  const [montant, setMontant] = useState(invoice.amount ? parseFloat(invoice.amount.replace('$','')) : 0);
  const [datePaiement, setDatePaiement] = useState(new Date().toISOString().split('T')[0]);
  const [modePaiement, setModePaiement] = useState("Espèces");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (montant <= 0) return;
    setLoading(true);
    try {
      await facturationService.createPaiement({
        factureId: invoice.id,
        montant: montant,
        datePaiement: datePaiement,
        modePaiement: modePaiement,
      });
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur paiement :", error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold mb-2">Enregistrer un paiement</h3>
        <p className="text-sm text-gray-500 mb-4">Facture : {invoice.invoiceId} – {invoice.patient}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500">Montant *</label>
            <input type="number" step="0.01" value={montant} onChange={(e) => setMontant(parseFloat(e.target.value))}
              className="w-full px-4 py-2 bg-gray-100 rounded-xl text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500">Date</label>
            <input type="date" value={datePaiement} onChange={(e) => setDatePaiement(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 rounded-xl text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500">Mode de paiement</label>
            <select value={modePaiement} onChange={(e) => setModePaiement(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 rounded-xl text-sm">
              <option>Espèces</option>
              <option>Mobile Money</option>
              <option>Carte bancaire</option>
              <option>Chèque</option>
              <option>Virement</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold">Annuler</button>
            <Button type="submit" label={loading ? "Enregistrement..." : "Valider le paiement"} variant="primary" className="flex-1" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;