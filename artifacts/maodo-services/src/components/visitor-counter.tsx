import { useEffect } from "react";
import { Users } from "lucide-react";
import { useRecordVisit } from "@workspace/api-client-react";

export function VisitorCounter() {
  const { mutate, data } = useRecordVisit();

  useEffect(() => {
    mutate();
  }, [mutate]);

  const count = data?.count ?? 0;
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-1.5 text-blue-100/80 text-xs">
      <Users className="w-3 h-3" />
      <span>
        <span className="font-bold text-white">{count.toLocaleString("fr-FR")}</span>{" "}
        visiteur{count > 1 ? "s" : ""} aujourd'hui
      </span>
    </div>
  );
}
