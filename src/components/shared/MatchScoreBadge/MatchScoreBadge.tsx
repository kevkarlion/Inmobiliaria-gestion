interface Props {
  score: number;
}

export default function MatchScoreBadge({ score }: Props) {
  const roundedScore = Math.round(score);

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" };
    if (score >= 60) return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" };
    if (score >= 40) return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" };
    return { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" };
  };

  const colors = getScoreColor(score);

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${colors.bg} ${colors.text} px-2 py-1 rounded-full border ${colors.border} text-xs font-bold`}
    >
      <span className="text-[10px] opacity: 70%">Match</span>
      <span>{roundedScore}%</span>
    </div>
  );
}
