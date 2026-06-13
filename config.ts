import { PricingTier } from "@/components/Pricing";

interface ConfigProps {
  appName: string;
  pricing: PricingTier[];
}

const config: ConfigProps = {
  appName: "BudgetEasy",
  pricing: [
    {
      id: "plus",
      name: "Plus",
      price: "$19",
      description: "Perfect for individuals managing their personal budget.",
      features: [
        "Unlimited budget categories",
        "Basic financial reports",
        "Sync across 2 devices",
        "Email support",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "$49",
      description: "Ideal for families and professionals with complex finances.",
      features: [
        "Everything in Plus",
        "Advanced forecasting & analytics",
        "Unlimited devices",
        "Priority 24/7 support",
        "Shared accounts for families",
      ],
      isPopular: true,
    },
  ],
};

export default config;
