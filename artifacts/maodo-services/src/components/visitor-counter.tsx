import { useEffect } from "react";
import { Users } from "lucide-react";
import { useRecordVisit, useGetTodayVisits, getGetTodayVisitsQueryKey } from "@workspace/api-client-react";

function getTodayKey() {
  return "visit_" + new Date().toISOString().split("T")[0];
}

export function VisitorCounter() {
  const alreadyCounted = typeof localStorage !== "undefined" && localStorage.getItem(getTodayKey()) === "1";

  const { mutate, data: mutateData } = useRecordVisit();
  const { data: todayData } = useGetTodayVisits({ query: { enabled: alreadyCounted, queryKey: getGetTodayVisitsQueryKey() } });

  useEffect(() => {
    if (!alreadyCounted) {
      mutate(undefined, {
        onSuccess: () => {
          localStorage.setItem(getTodayKey(), "1");
        },
      });
    }
  }, []);

  const count = alreadyCounted ? (todayData?.count ?? 0) : (mutateData?.count ?? 0);
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
