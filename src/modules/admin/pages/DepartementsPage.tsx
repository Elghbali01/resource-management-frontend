import React from "react";
import { Users } from "lucide-react";

const DepartementsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            {/* Utilisant la même icône que UsersPage pour l'instant pour le même style */}
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Gestion Utilisateurs
            </h1>
            <p className="text-sm text-gray-500">
              Gestion des départements en construction...
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-8 text-center text-gray-500">
        Le contenu de cette page sera implémenté prochainement.
      </div>
    </div>
  );
};

export default DepartementsPage;
