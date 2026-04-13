import React, { useState } from "react";
import { Plus, Megaphone, Calendar, X } from "lucide-react";

// Mock data
const initialCampagnes = [
  { id: "1", nom: "Campagne d'Achat - Trimestre 1", budget: 60000, dateFin: "2026-05-30", status: "EN_COLLECTE" },
];

export default function AppelBesoinsPage() {
  const [campagnes, setCampagnes] = useState(initialCampagnes);
  const [showModal, setShowModal] = useState(false);
  const [formNom, setFormNom] = useState("");
  const [formBudget, setFormBudget] = useState("");
  const [formDate, setFormDate] = useState("");

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampagne = {
      id: Math.random().toString(),
      nom: formNom,
      budget: Number(formBudget),
      dateFin: formDate,
      status: "EN_COLLECTE",
    };
    setCampagnes([newCampagne, ...campagnes]);
    setShowModal(false);
    setFormNom(""); setFormBudget(""); setFormDate("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Appel aux Besoins</h1>
        <p className="text-sm text-gray-500 mt-1">Gérez le budget et lancez la collecte auprès des enseignants.</p>
      </div>

      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Demander les besoins</h2>
            <p className="text-sm text-gray-500">Demandez aux enseignants d'envoyer leurs besoins matériels.</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Nouvelle Campagne
        </button>
      </div>

      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mt-4 mb-3">Historique des Campagnes de Collecte</h3>
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Intitulé</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date Limite</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Budget Alloué</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {campagnes.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-4 text-sm font-medium text-gray-900">{c.nom}</td>
                <td className="px-5 py-4 text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" /> {new Date(c.dateFin).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-5 py-4 text-sm font-bold text-gray-900">{c.budget.toLocaleString()} DHS</td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-lg border border-green-200">
                    {c.status === "EN_COLLECTE" ? "En Collecte" : "Clôturée"}
                  </span>
                </td>
              </tr>
            ))}
            {campagnes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-500">Aucune campagne lancée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Lancer une collecte</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleLaunchCampaign} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nom de la campagne</label>
                <input type="text" required value={formNom} onChange={(e)=>setFormNom(e.target.value)} placeholder="Ex: Besoins 2026" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Date limite de soumission</label>
                <input type="date" required value={formDate} onChange={(e)=>setFormDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Budget alloué au département (DHS)</label>
                <input type="number" required value={formBudget} onChange={(e)=>setFormBudget(e.target.value)} placeholder="Ex: 50000" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">Valider et Lancer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
