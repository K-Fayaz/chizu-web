"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Eyebrow } from "./Scenery";

const faqs = [
  {
    question: "Which computers does Chizu run on?",
    answer:
      "Chizu is a desktop app for Windows 10/11 and Linux (Ubuntu, Debian, Mint and most other distributions). macOS support is coming later.",
  },
  {
    question: "Can I use my own audio?",
    answer:
      "Yes. Add your own narration or music track and Chizu will help you time your animation to the waveform.",
  },
  {
    question: "What export formats are supported?",
    answer:
      "You can export your finished map animation as an MP4 video, with or without audio, at the resolution you choose.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Not at the moment. Creating and editing projects needs an active subscription. You can cancel any time from your dashboard, and the projects on your computer stay there: you can still open, play and export them.",
  },
  {
    question: "Can I use the videos commercially?",
    answer:
      "Yes. Videos you export with Chizu are yours to use however you like, including commercial projects.",
  },
  {
    question: "What if I cancel and want to come back later?",
    answer:
      "Your founding rate stays locked in for as long as your subscription stays active. If you cancel, your spot opens up for someone else — so if you resubscribe after the 50 founding spots are gone, you'll be on the standard rate like any new customer.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="pb-24">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <Eyebrow>QUESTIONS</Eyebrow>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Before you get started.
        </h2>

        <div className="mt-10 space-y-3 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`rounded-[1.25rem] bg-white px-5 ring-1 transition ${
                  isOpen
                    ? "shadow-lg shadow-foreground/5 ring-brand/25"
                    : "ring-foreground/5"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-extrabold text-foreground"
                  aria-expanded={isOpen}
                >
                  {faq.question}
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                      isOpen ? "bg-brand text-white" : "bg-sand text-foreground/60"
                    }`}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      strokeWidth={2.5}
                    />
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-5 text-sm leading-relaxed font-medium text-foreground/65">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
