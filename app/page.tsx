import { Hero } from "@/components/hero/Hero";
import { PaymentChallenge } from "@/components/section-02/PaymentChallenge";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { GlassNav } from "@/components/nav/GlassNav";

export default function Page() {
  return (
    <main>
      <GlassNav />
      <Hero />
      <PaymentChallenge />
      <SiteFooter />
    </main>
  );
}
