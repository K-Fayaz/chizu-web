import Image from "next/image";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Image src="/chizu-logo.png" alt="" width={44} height={44} className="h-11 w-11" priority />
      <span
        className={`text-xl font-semibold tracking-tight ${
          light ? "text-white" : "text-[#16140f]"
        }`}
      >
        Chizu
      </span>
    </div>
  );
}
