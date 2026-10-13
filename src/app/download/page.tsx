import type { Metadata } from "next";
import Link from "next/link";
import { Download, Laptop, Monitor, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { getLatestRelease, RELEASES_PAGE, RELEASES_REPO, type DownloadFile } from "@/lib/releases";
import { RecommendedBadge } from "./RecommendedBadge";

export const metadata: Metadata = {
  title: "Download — Chizu",
  description: "Download Chizu for Windows and Linux.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function DownloadButton({ file, label }: { file: DownloadFile | null; label: string }) {
  return (
    <a
      href={file?.url ?? RELEASES_PAGE}
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition hover:bg-brand-dark"
    >
      <Download className="h-4 w-4" />
      {label}
      {file && <span className="font-normal text-white/70">· {file.sizeMb} MB</span>}
    </a>
  );
}

function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-[#16140f]/70">{children}</ol>;
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-[12px] text-[#16140f]">{children}</code>;
}

export default async function DownloadPage() {
  const release = await getLatestRelease();

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-4xl px-6 pt-16 pb-20">
          <h1 className="text-4xl font-semibold tracking-tight text-[#16140f]">Download Chizu</h1>
          <p className="mt-2 text-[#16140f]/60">
            {release
              ? `Version ${release.version} · released ${formatDate(release.publishedAt)}`
              : "For Windows and Linux."}
          </p>

          {!release && (
            <div className="mt-8 rounded-2xl border border-black/10 bg-[#faf7ef] p-6 text-sm text-[#16140f]/70">
              Downloads aren&apos;t available right now. Please check back soon, or see the{" "}
              <a href={RELEASES_PAGE} className="font-semibold text-brand hover:underline">
                releases page
              </a>
              .
            </div>
          )}

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-black/10 bg-white p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Monitor className="h-5 w-5 text-[#16140f]" strokeWidth={1.75} />
                <h2 className="text-xl font-bold tracking-tight text-[#16140f]">Windows</h2>
                <RecommendedBadge platform="windows" />
              </div>
              <p className="mt-2 text-sm text-[#16140f]/50">Windows 10 or 11, 64-bit</p>

              <DownloadButton file={release?.windows ?? null} label="Download for Windows" />

              <Steps>
                <li>Open the downloaded installer.</li>
                <li>
                  If Windows says <em>&quot;Windows protected your PC&quot;</em>, click{" "}
                  <strong>More info → Run anyway</strong>. Chizu isn&apos;t code-signed yet, so Windows
                  shows this the first time.
                </li>
                <li>Chizu opens when it&apos;s installed, and it&apos;s in your Start menu.</li>
              </Steps>
            </section>

            <section className="rounded-2xl border border-black/10 bg-white p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Laptop className="h-5 w-5 text-[#16140f]" strokeWidth={1.75} />
                <h2 className="text-xl font-bold tracking-tight text-[#16140f]">Linux</h2>
                <RecommendedBadge platform="linux" />
              </div>
              <p className="mt-2 text-sm text-[#16140f]/50">Ubuntu 22.04+, Debian 12+, Linux Mint, Pop!_OS (64-bit)</p>

              <DownloadButton file={release?.deb ?? null} label="Download .deb" />

              <Steps>
                <li>
                  Double-click the downloaded file and choose <strong>Install</strong>. Or in a terminal:{" "}
                  <Code>sudo apt install ./Chizu_*.deb</Code>
                </li>
                <li>Open Chizu from your apps list.</li>
              </Steps>

              <details className="mt-6 rounded-xl border border-black/10 p-4 text-sm text-[#16140f]/70">
                <summary className="cursor-pointer font-semibold text-[#16140f]">
                  Other Linux (Fedora, Arch…): AppImage
                </summary>
                <p className="mt-3">
                  One file that runs on most distributions without installing.{" "}
                  {release?.appImage ? (
                    <a href={release.appImage.url} className="font-semibold text-brand hover:underline">
                      Download AppImage ({release.appImage.sizeMb} MB)
                    </a>
                  ) : (
                    <a href={RELEASES_PAGE} className="font-semibold text-brand hover:underline">
                      Download AppImage
                    </a>
                  )}
                </p>
                <Steps>
                  <li>Move it to a folder you&apos;ll keep, e.g. <Code>~/Applications</Code>.</li>
                  <li>
                    Make it executable: right-click → Properties → <em>Allow executing as program</em>, or{" "}
                    <Code>chmod +x Chizu_*.AppImage</Code>
                  </li>
                  <li>Double-click it to run.</li>
                  <li>
                    If nothing happens, install FUSE 2 (<Code>libfuse2</Code>, or <Code>libfuse2t64</Code> on
                    Ubuntu 24.04) and try again.
                  </li>
                </Steps>
              </details>
            </section>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl bg-[#faf7ef] p-8">
              <h2 className="text-lg font-semibold text-[#16140f]">After installing</h2>
              <p className="mt-3 text-sm text-[#16140f]/70">
                Chizu opens your browser so you can sign in or create an account. Creating and editing
                projects needs an active subscription; see{" "}
                <Link href="/#pricing" className="font-semibold text-brand hover:underline">
                  pricing
                </Link>
                .
              </p>
            </section>
            <section className="rounded-2xl bg-[#faf7ef] p-8">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-[#16140f]" strokeWidth={1.75} />
                <h2 className="text-lg font-semibold text-[#16140f]">Updates are automatic</h2>
              </div>
              <p className="mt-3 text-sm text-[#16140f]/70">
                Chizu checks for new versions on its own and offers a one-click restart to update. No
                need to come back here.
              </p>
            </section>
          </div>

          <p className="mt-10 text-xs text-[#16140f]/40">
            Chizu includes FFmpeg, licensed under the GNU GPL v3, to export videos. Its license and
            source links are in the app under account menu → Open-source licenses, and at{" "}
            <a href="https://ffmpeg.org/legal.html" className="underline hover:text-[#16140f]/70">
              ffmpeg.org/legal
            </a>
            . All releases:{" "}
            <a href={`https://github.com/${RELEASES_REPO}/releases`} className="underline hover:text-[#16140f]/70">
              GitHub
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
