import { Users, MapPin, Music } from "lucide-react";
import { Eyebrow } from "./Scenery";

const steps = [
  { icon: Users, label: "Create", tile: "bg-brand text-white" },
  { icon: MapPin, label: "Animate", tile: "bg-land text-ink" },
  { icon: Music, label: "Export", tile: "bg-coral text-white" },
];

export function BuiltForCreators() {
  return (
    <section id="features" className="px-6 py-20">
      <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-sand/70 px-6 py-16 text-center ring-1 ring-foreground/5">
        <Eyebrow>BUILT FOR CREATORS</Eyebrow>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Maps that move.
          <br />
          Stories that make sense.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-lg font-medium text-foreground/65">
          Turn places, data and ideas into engaging map videos — in a
          simple, focused editor.
        </p>

        <div className="mt-12 flex items-center justify-center gap-10 sm:gap-16">
          {steps.map(({ icon: Icon, label, tile }) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-[1.25rem] shadow-lg shadow-foreground/10 sm:h-20 sm:w-20 sm:rounded-[1.5rem] ${tile}`}
              >
                <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.25} />
              </span>
              <span className="text-base font-extrabold text-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
