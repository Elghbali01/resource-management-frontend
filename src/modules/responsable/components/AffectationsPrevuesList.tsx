import { useEffect, useState } from "react";
import type { AffectationPrevueResponse } from "../../../types/affectation";
import { responsableService } from "../services/responsableService";

interface Props {
  demandeId: number;
  demandeTitre: string;
  departementNom: string;
}

export default function AffectationsPrevuesList({ demandeId, demandeTitre, departementNom }: Props) {
  const [affectations, setAffectations] = useState<AffectationPrevueResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAffectations();
  }, [demandeId]);

  const loadAffectations = async () => {
    try {
      setLoading(true);
      const data = await responsableService.getAffectationsPrevues(demandeId);
      setAffectations(data);
    } catch (error: any) {
      console.error("Erreur chargement affectations", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">Chargement des affectations...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 bg-blue-50/30 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Affectations Prévues</h2>
        <p className="text-sm text-gray-500">Demande : <span className="font-semibold text-gray-700">{demandeTitre}</span> ({departementNom})</p>
      </div>

      <div className="p-0">
        {affectations.length === 0 ? (
          <div className="p-8 text-center text-gray-500 italic">Aucune affectation prévue générée pour cette demande.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                <tr>
                  <th className="px-6 py-3 font-semibold">Bénéficiaire</th>
                  <th className="px-6 py-3 font-semibold text-center">Type</th>
                  <th className="px-6 py-3 font-semibold">Matériel (Synthèse)</th>
                  <th className="px-6 py-3 font-semibold text-center">Quantité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {affectations.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      {a.typeAffectation === "ENSEIGNANT" ? (
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{a.enseignantNom} {a.enseignantPrenom}</p>
                          <p className="text-xs text-gray-500">Enseignant</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{a.departementNom}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span> Département
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                        a.typeAffectation === "ENSEIGNANT" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {a.typeAffectation}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 break-words max-w-xs">{a.descriptionMateriel}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-gray-900">{a.quantite}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
