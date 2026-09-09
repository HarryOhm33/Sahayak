export const getRelevanceColor = (rel: number): string => {
  if (rel >= 80) return "bg-emerald-100 text-emerald-700";
  if (rel >= 50) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
};
