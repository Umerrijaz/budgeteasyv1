import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import FeaturesAccordion from "@/components/FeaturesAccordion";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import config from "@/config";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero {...config.hero} />
        <Problem {...config.problem} />
        <FeaturesAccordion {...config.features} />
        <Pricing tiers={config.pricing} />
        <FAQ {...config.faqs} />
        <CTA />
      </main>
      <Footer />

    </>
  );
}
