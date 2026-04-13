import { useState } from "react";
import { CheckCircle2, User, Monitor, Printer, AlertTriangle, Check, X, Pencil, Send } from "lucide-react";

type Besoin = { id: string; enseignant: string; type: string; specs: string; qte: number; prixEstime: number; status: "EN_ATTENTE" | "VALIDE" | "REJETE" };

const initialBesoins: Besoin[] = [
  { id: "b1", enseignant: "Jean Dupont", type: "ORDINATEUR", specs: "i7, 16GB RAM, 512GB SSD", qte: 1, prixEstime: 12000, status: "EN_ATTENTE" },
  { id: "b2", enseignant: "Claire Martin", type: "IMPRIMANTE", specs: "Laser Couleur", qte: 1, prixEstime: 5000, status: "VALIDE" },
  { id: "b3", enseignant: "Luc Bernard", type: "ORDINATEUR", specs: "i5, 8GB RAM", qte: 3, prixEstime: 27000, status: "EN_ATTENTE" },
];

export default function ConcertationPage() {
  const [besoins, setBesoins] = useState<Besoin[]>(initialBesoins);
  const [transmitted, setTransmitted] = useState(false);

  const currentBudget = 60000;

  const updateBesoinStatus = (id: string, newStatus: Besoin["status"]) => {
    setBesoins(besoins.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const totalValide = besoins.filter(b => b.status === "VALIDE").reduce((acc, curr) => acc + curr.prixEstime, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Réunion de Concertation</h1>
        <p className="text-sm text-gray-500 mt-1">Validez ou rejetez les demandes reçues de la part des enseignants avant transmission.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 font-medium tracking-wide">Budget Alloué</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{currentBudget.toLocaleString()} DHS</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 font-medium tracking-wide">Dépenses Estimées (Validées)</p>
          <p className={`text-2xl font-bold mt-1 ${totalValide > currentBudget ? "text-red-600" : "text-blue-600"}`}>
            {totalValide.toLocaleString()} DHS
          </p>
          {totalValide > currentBudget && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertTriangle className="w-3 h-3"/> Dépassement budgétaire</p>}
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
            <button
              disabled={transmitted || totalValide === 0}
              onClick={() => setTransmitted(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700"
            >
              {transmitted ? <CheckCircle2 className="w-5 h-5"/> : <Send className="w-5 h-5"/>}
              {transmitted ? "Transmission Envoyée" : "Transmettre au Responsable"}
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">Définit les ressources à acheter.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Requêtes des Enseignants</h3>
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-medium">{besoins.length} demandes</span>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Enseignant</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Besoin</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prix Estimé</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {besoins.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{b.enseignant}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 mt-0.5 bg-gray-100 rounded-lg">
                        {b.type === "ORDINATEUR" ? <Monitor className="w-4 h-4 text-gray-600"/> : <Printer className="w-4 h-4 text-gray-600"/>}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{b.qte}x {b.type}</p>
                        <p className="text-xs text-gray-500">{b.specs}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                    {b.prixEstime.toLocaleString()} DHS
                  </td>
                  <td className="px-5 py-4">
                    {b.status === "VALIDE" && <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-medium border border-green-200"><CheckCircle2 className="w-3.5 h-3.5"/> Validé</span>}
                    {b.status === "REJETE" && <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-2.5 py-1 rounded-md text-xs font-medium border border-red-200"><X className="w-3.5 h-3.5"/> Rejeté</span>}
                    {b.status === "EN_ATTENTE" && <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-xs font-medium border border-amber-200">En attente</span>}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        disabled={transmitted || b.status === "VALIDE"}
                        onClick={() => updateBesoinStatus(b.id, "VALIDE")}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 disabled:opacity-30 transition"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        disabled={transmitted || b.status === "REJETE"}
                        onClick={() => updateBesoinStatus(b.id, "REJETE")}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        disabled={transmitted}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
