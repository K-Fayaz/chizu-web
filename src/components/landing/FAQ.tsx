"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is Chizu available for Windows or macOS?",
    answer:
      "Chizu is currently available as a desktop app for Linux. Windows and macOS support is coming soon.",
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
      "Yes. You can try Chizu free before subscribing — no credit card required to get started.",
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
    <section id="faq" className="bg-white pb-20">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <span className="text-xs font-semibold tracking-[0.2em] text-brand">
          QUESTIONS
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#16140f] sm:text-4xl">
          Before you get started.
        </h2>

        <div className="mt-10 divide-y divide-black/10 border-t border-b border-black/10 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-[#16140f]"
                  aria-expanded={isOpen}
                >
                  {faq.question}
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#16140f]/50 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="pb-4 text-sm text-[#16140f]/60">
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
