import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import config from "@/config";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Pricing tiers={config.pricing} />
      </main>
    </>
  );
}
