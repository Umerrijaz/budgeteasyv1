import { PricingTier } from "@/components/Pricing";
import { ProblemProps } from "@/components/Problem";
import { FeaturesAccordionProps } from "@/components/FeaturesAccordion";

interface ConfigProps {
  appName: string;
  problem: ProblemProps;
  features: FeaturesAccordionProps;
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
  features: {
    title: "Everything you need to manage your money,",
    highlightedText: "all in one place",
    features: [
      {
        id: "budgeting",
        title: "Smart Budgeting",
        description: "Set monthly budgets for every category, track your spending in real-time, and get notified before you overspend. Never go over budget again.",
        type: "image",
        path: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=500&q=80",
        alt: "A person reviewing a budget on a laptop",
        svg: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
          </svg>
        ),
      },
      {
        id: "expense-tracking",
        title: "Expense Tracking",
        description: "Automatically categorize every transaction from your bank. See exactly where every dollar goes with beautiful charts and weekly summaries.",
        type: "image",
        path: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=500&q=80",
        alt: "Financial charts on a screen",
        svg: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6.75v6.75" />
          </svg>
        ),
      },
      {
        id: "savings-goals",
        title: "Savings Goals",
        description: "Set a savings goal for anything — a vacation, a new car, an emergency fund. BudgetEasy automatically tracks your progress and tells you how much to set aside each month.",
        svg: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
          </svg>
        ),
      },
      {
        id: "multi-device",
        title: "Sync Across Devices",
        description: "Your budget lives in the cloud. Add an expense on your phone at the grocery store, and it instantly appears on your laptop at home. Always in sync, always up to date.",
        svg: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
          </svg>
        ),
      },
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
