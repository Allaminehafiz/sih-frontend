import { useState, useEffect } from "react";
import Icon from "../common/Icon";
import facturationService from "../../services/facturationService";
import admissionService from "../../services/admissionService";
import exportInvoicePDF from "./InvoicePDF";

const formatAmount = (val) => {
  if (val == null || isNaN(val)) return "0 FCFA";
  const num = Number(val);
  const parts = num.toFixed(0).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".") + " FCFA";
};

const InvoiceDetailModal = ({ invoice, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await facturationService.getFactureDetail(invoice.id);
        setDetail(res.data);
      } catch (error) {
        console.error("Erreur chargement détail facture", error);
      }
      setLoading(false);
    };
    fetchDetail();
  }, [invoice.id]);

  if (loading)
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
        <p className="text-white">Chargement...</p>
      </div>
    );

  if (!detail) return null;

  const completeFacture = {
    ...detail,
    patient: invoice.patient,
    email: invoice.email,
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <h3
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            Détail de la facture {detail.invoiceId}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <Icon name="close" size={24} />
          </button>
        </div>

        {/* Infos générales */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div><span className="text-gray-500">Patient :</span> <strong>{invoice.patient}</strong></div>
          <div><span className="text-gray-500">ID :</span> <strong>{invoice.email}</strong></div>
          <div><span className="text-gray-500">Date émission :</span> {detail.dateEmission}</div>
          <div><span className="text-gray-500">Échéance :</span> {detail.dateEcheance}</div>
          <div><span className="text-gray-500">Statut :</span>{" "}
            <span className={`font-bold ${detail.statut === 'PAYEE' ? 'text-teal-700' : 'text-amber-700'}`}>{detail.statut}</span>
          </div>
          <div><span className="text-gray-500">Couverture :</span> {detail.tauxCouverture ? Math.round(detail.tauxCouverture * 100) + '%' : '0%'}</div>
        </div>

        {/* Lignes de la facture */}
        <h4 className="font-bold text-gray-800 mb-2">Actes facturés</h4>
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          {detail.lignes && detail.lignes.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-right">Prix unitaire</th>
                  <th className="pb-2 text-right">Qté</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {detail.lignes.map((ligne, idx) => (
                  <tr key={idx} className="border-t border-gray-200">
                    <td className="py-2">{ligne.description}</td>
                    <td className="py-2 text-right">{formatAmount(ligne.montantUnitaire)}</td>
                    <td className="py-2 text-right">{ligne.quantite}</td>
                    <td className="py-2 text-right font-bold">
                      {formatAmount(ligne.montantUnitaire * ligne.quantite)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-500">Aucune ligne</p>
          )}
          <div className="flex justify-between font-bold mt-3 pt-3 border-t border-gray-200">
            <span>Total</span>
            <span>{formatAmount(detail.montantTotal)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Part assurance :</span>
            <span>{formatAmount(detail.partMutuelle)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Reste à payer (patient) :</span>
            <span className="font-bold text-teal-700">{formatAmount(detail.partPatient)}</span>
          </div>
        </div>

        {/* Paiements effectués */}
        <h4 className="font-bold text-gray-800 mb-2">Paiements</h4>
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          {detail.paiements && detail.paiements.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Montant</th>
                  <th className="pb-2">Mode</th>
                </tr>
              </thead>
              <tbody>
                {detail.paiements.map((p, idx) => (
                  <tr key={idx} className="border-t border-gray-200">
                    <td className="py-2">{p.datePaiement}</td>
                    <td className="py-2">{formatAmount(p.montant)}</td>
                    <td className="py-2">{p.modePaiement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-500">Aucun paiement enregistré</p>
          )}
        </div>

        <button
          onClick={() => exportInvoicePDF(completeFacture)}
          className="w-full mb-2 py-2 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="picture_as_pdf" size={20} />
          Exporter en PDF
        </button>

        <button onClick={onClose} className="w-full py-2 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition-colors">
          Fermer
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetailModal;