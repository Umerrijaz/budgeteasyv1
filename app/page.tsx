import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Pricing from "@/components/Pricing";
import config from "@/config";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem {...config.problem} />
        <Pricing tiers={config.pricing} />
      </main>
    </>
  );
}
