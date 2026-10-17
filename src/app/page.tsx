import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { BuiltForCreators } from "@/components/landing/BuiltForCreators";
import { VideoGallery } from "@/components/landing/VideoGallery";
import { CloserLook } from "@/components/landing/CloserLook";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

// Rebuilt at most once a minute so the founding-member spots (Pricing →
// AvatarGrid, read from the database) stay current. Without this the page
// was fully static: the grid would show whatever it was on deploy day.
export const revalidate = 60;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <BuiltForCreators />
        <VideoGallery />
        <CloserLook />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
