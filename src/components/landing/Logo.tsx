import { MapPin } from "lucide-react";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">
        <MapPin className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span
        className={`text-lg font-semibold tracking-tight ${
          light ? "text-white" : "text-[#16140f]"
        }`}
      >
        Chizu
      </span>
    </div>
  );
}
