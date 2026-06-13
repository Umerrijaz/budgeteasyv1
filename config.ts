import { PricingTier } from "@/components/Pricing";
import { ProblemProps } from "@/components/Problem";

interface ConfigProps {
  appName: string;
  problem: ProblemProps;
  pricing: PricingTier[];
}

const config: ConfigProps = {
  appName: "BudgetEasy",
  problem: {
    title: "80% of people fail to save money because they don't track expenses",
    description: "Spreadsheets, forgotten receipts, mental math... There's so much going on. Managing finances shouldn't feel like a second job.",
    steps: [
      { id: "build-spreadsheet", emoji: "🤯", text: "Try to build a spreadsheet" },
      { id: "struggle-update", emoji: "😮‍💨", text: "Struggle to find time to update it" },
      { id: "give-up", emoji: "💸", text: "Give up and overspend" },
    ],
  },
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
