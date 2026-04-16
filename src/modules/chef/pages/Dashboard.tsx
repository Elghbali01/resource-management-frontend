// src/modules/chef/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { Mail, AlertCircle, DollarSign, Users } from "lucide-react";
import { chefService, type EnseignantResponse } from "../services/chefService";
import api from "../../../services/api";

export default function ChefDashboard() {
  const { nom, prenom } = useAuth();
  
  const [enseignants, setEnseignants] = useState<EnseignantResponse[]>([]);
  const [departementNom, setDepartementNom] = useState<string>("");
  const [budget, setBudget] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lancer les requêtes : enseignants et détails du département
        const [enseignantsData, departementData] = await Promise.all([
          chefService.getEnseignants().catch(() => []),
          chefService.getMonDepartement().catch((e) => {
            console.warn("L'endpoint /api/chef/departement n'est peut-être pas implémenté ou a échoué", e);
            return null;
          }),
        ]);

        setEnseignants(enseignantsData);
        
        let nomDept = "";

        if (departementData) {
          nomDept = departementData.nom;
        } else if (enseignantsData.length > 0) {
          nomDept = enseignantsData[0].departementNom;
        }

        setDepartementNom(nomDept);

        try {
          const budgetRes = await api.get('/chef/departement/budget');
          if (budgetRes?.data?.budget !== undefined) {
            setBudget(Number(budgetRes.data.budget));
          } else {
            setBudget(0);
          }
        } catch (err) {
          console.warn("Impossible de récupérer le budget", err);
          setBudget(null);
        }

      } catch (err: any) {
        console.error("Erreur lors de la récupération des données:", err);
        setError("Impossible de charger les données du département.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/chef", icon: "📊" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIF":
        return <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">Actif</span>;
      case "INACTIF":
        return <span className="px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-lg">Inactif</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg">{status}</span>;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
        
        {/* Header */}
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {departementNom ? `Département de ${departementNom}` : loading ? "Chargement..." : "Département"}
          </h1>
          <p className="text-sm text-gray-500 mt-2">Bienvenue sur votre espace de gestion départementale.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-blue-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-xl flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Statistiques / Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium tracking-wide">Budget Alloué</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {budget !== null ? `${budget.toLocaleString()} DHS` : "Non défini"}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium tracking-wide">Enseignants</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {enseignants.length} <span className="text-lg text-gray-500 font-medium ml-1">profs</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Table des enseignants */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-lg">Corps Professoral</h3>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                  Excluant le chef de département
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Enseignant</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Département</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {enseignants.map((prof) => (
                      <tr key={prof.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 font-bold">
                              {prof.prenom.charAt(0)}{prof.nom.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{prof.prenom} {prof.nom}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {prof.email}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-50 text-purple-700 text-sm font-medium border border-purple-100">
                            {prof.departementNom}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {getStatusBadge(prof.status)}
                        </td>
                      </tr>
                    ))}
                    {enseignants.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <Users className="w-10 h-10 text-gray-300 mb-3" />
                            <p className="text-sm">Aucun enseignant trouvé pour ce département.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </>
  );
}
