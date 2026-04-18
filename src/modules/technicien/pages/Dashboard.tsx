export default function TechnicienDashboard() {
  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Technicien</h1>
        <p className="text-sm text-gray-500 mt-1">Gérez vos interventions et les pannes signalées.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500">Bienvenue dans l'espace technique. Consultez l'onglet Interventions pour traiter les pannes.</p>
      </div>
    </div>
  );
}
