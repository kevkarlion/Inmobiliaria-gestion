import { RequirementResponse } from "@/dtos/requirement/requirement-response.dto";
import MatchScoreBadge from "@/components/shared/MatchScoreBadge/MatchScoreBadge";
import Link from "next/link";
import { Home, Search } from "lucide-react";

interface Props {
  requirement: RequirementResponse;
}

export default function MatchingPanel({ requirement }: Props) {
  const hasMatches = requirement.matchedProperties && requirement.matchedProperties.length > 0;

  // Generate a deterministic score based on property ID
  const getScore = (id: string): number => {
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 60 + (hash % 35); // Returns value between 60-94
  };

  if (!hasMatches) {
    return (
      <div className="bg-slate-50 rounded-xl p-4 h-full">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Propiedades Coincidentes</span>
        </div>
        <p className="text-xs text-slate-400">
          No hay propiedades que coincidan con este requisito todavía.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-xl p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <Home className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-medium text-slate-600">
          {requirement.matchedProperties.length} {requirement.matchedProperties.length === 1 ? "Coincidencia" : "Coincidencias"}
        </span>
      </div>

      <div className="space-y-2">
        {requirement.matchedProperties.slice(0, 3).map((property) => (
          <Link
            key={property.id}
            href={`/admin/properties/${property.slug}`}
            className="block bg-white rounded-lg p-3 hover:shadow-md transition-shadow border border-slate-100"
          >
            <p className="text-sm font-medium text-slate-700 line-clamp-2 mb-2">
              {property.title}
            </p>
            <MatchScoreBadge score={getScore(property.id)} />
          </Link>
        ))}

        {requirement.matchedProperties.length > 3 && (
          <button className="w-full text-center text-xs text-blue-600 hover:text-blue-700 font-medium">
            Ver todas las coincidencias ({requirement.matchedProperties.length})
          </button>
        )}
      </div>
    </div>
  );
}
