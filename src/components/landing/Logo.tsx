import Image from "next/image";
import { Pin } from "./Scenery";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Image src="/chizu-logo.png" alt="" width={44} height={44} className="h-11 w-11" priority />
      <span
        className={`text-2xl font-black tracking-tight ${
          light ? "text-white" : "text-foreground"
        }`}
      >
        Ch
        <span className="relative">
          ı
          <Pin className="absolute -top-[0.08em] left-1/2 h-[0.5em] w-[0.5em] -translate-x-1/2" />
        </span>
        zu
      </span>
    </div>
  );
}
