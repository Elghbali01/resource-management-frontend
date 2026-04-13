// src/modules/chef/pages/Dashboard.tsx
import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";
import { Plus, Megaphone, Calendar, DollarSign, Check, X, Pencil, Send, CheckCircle2, User, Monitor, Printer, AlertTriangle } from "lucide-react";

// --- Types ---
type Campagne = { id: string; nom: string; budget: number; dateFin: string; status: "EN_COLLECTE" | "CLOTUREE" };
type Besoin = { id: string; enseignant: string; type: string; specs: string; qte: number; prixEstime: number; status: "EN_ATTENTE" | "VALIDE" | "REJETE" };

// --- Mock Data ---
const initialCampagnes: Campagne[] = [
  { id: "1", nom: "Campagne d'Achat - Trimestre 1", budget: 60000, dateFin: "2026-05-30", status: "EN_COLLECTE" },
];

const initialBesoins: Besoin[] = [
  { id: "b1", enseignant: "Jean Dupont", type: "ORDINATEUR", specs: "i7, 16GB RAM, 512GB SSD", qte: 1, prixEstime: 12000, status: "EN_ATTENTE" },
  { id: "b2", enseignant: "Claire Martin", type: "IMPRIMANTE", specs: "Laser Couleur", qte: 2, prixEstime: 5000, status: "VALIDE" },
  { id: "b3", enseignant: "Luc Bernard", type: "ORDINATEUR", specs: "i5, 8GB RAM", qte: 5, prixEstime: 45000, status: "EN_ATTENTE" },
];

export default function ChefDashboard() {
  const { nom, prenom } = useAuth();
  
  // --- States ---
  const [activeTab, setActiveTab] = useState<"CAMPAGNES" | "VALIDATION">("CAMPAGNES");
  
  const [campagnes, setCampagnes] = useState<Campagne[]>(initialCampagnes);
  const [besoins, setBesoins] = useState<Besoin[]>(initialBesoins);
  
  // Modal states for creating campaign
  const [showModal, setShowModal] = useState(false);
  const [formNom, setFormNom] = useState("");
  const [formBudget, setFormBudget] = useState("");
  const [formDate, setFormDate] = useState("");

  const [transmitted, setTransmitted] = useState(false);

  // --- Actions ---
  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampagne: Campagne = {
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

  const updateBesoinStatus = (id: string, newStatus: Besoin["status"]) => {
    setBesoins(besoins.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const currentBudget = campagnes[0]?.budget || 0;
  const totalValide = besoins.filter(b => b.status === "VALIDE").reduce((acc, curr) => acc + curr.prixEstime, 0);

  const navItems = [
    { label: "Dashboard", path: "/chef", icon: "📊" },
  ];

  return (
    <DashboardLayout
      role="CHEF_DEPARTEMENT"
      nom={nom}
      prenom={prenom}
      navItems={navItems}
    >
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
        
        {/* Vue d'ensemble Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Espace Chef de Département</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez le budget, lancez la collecte et validez les besoins (Réunion de concertation).</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("CAMPAGNES")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "CAMPAGNES" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Budget & Collecte
          </button>
          <button
            onClick={() => setActiveTab("VALIDATION")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "VALIDATION" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Réunion de Concertation (Validation)
          </button>
        </div>

        {/* --- TAB 1 : BUDGET ET COLLECTE --- */}
        {activeTab === "CAMPAGNES" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
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

            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mt-4">Historique des Campagnes de Collecte</h3>
            
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
                        <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
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

            {/* MODAL NOUVELLE CAMPAGNE */}
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
                      <input type="text" required value={formNom} onChange={(e)=>setFormNom(e.target.value)} placeholder="Ex: Besoins 2026" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Date limite de soumission</label>
                      <input type="date" required value={formDate} onChange={(e)=>setFormDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Budget alloué au département (DHS)</label>
                      <input type="number" required value={formBudget} onChange={(e)=>setFormBudget(e.target.value)} placeholder="Ex: 50000" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">Valider et Lancer</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2 : VALIDATION ET TRANSMISSION --- */}
        {activeTab === "VALIDATION" && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 font-medium tracking-wide">Budget Alloué</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{currentBudget.toLocaleString()} DHS</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 font-medium tracking-wide">Dépenses Estimées (Validées)</p>
                <p className={`text-2xl font-bold mt-1 ${totalValide > currentBudget ? "text-red-600" : "text-blue-600"}`}>
                  {totalValide.toLocaleString()} DHS
                </p>
                {totalValide > currentBudget && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertTriangle className="w-3 h-3"/> Dépassement</p>}
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
                 <p className="text-xs text-center text-gray-500 mt-2">Génère un appel d'offre global.</p>
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
        )}

      </div>
    </DashboardLayout>
  );
}
