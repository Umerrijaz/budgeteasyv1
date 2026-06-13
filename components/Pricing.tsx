import React from "react";
import Link from "next/link";

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface PricingProps {
  tiers: PricingTier[];
}

export default function Pricing({ tiers }: PricingProps) {
  return (
    <section className="pt-24 pb-12 bg-base-200" id="pricing">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-base-content mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-base-content/80 max-w-xl mx-auto">
            Choose the plan that's right for you to start managing your budget effectively.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`card relative bg-base-100 shadow-xl w-full lg:w-96 border-2 transition duration-300 hover:-translate-y-2 flex flex-col ${tier.isPopular
                ? "border-primary shadow-primary/20 lg:scale-105 lg:origin-bottom z-10"
                : "border-transparent"
                }`}
            >
              <div className="card-body flex flex-col flex-1 p-8">
                <div>
                  {tier.isPopular && (
                    <div className="badge badge-primary badge-sm absolute top-4 right-4 uppercase font-bold tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-base-content">{tier.name}</h3>
                  <p className="text-base-content/70 text-sm mt-2">
                    {tier.description}
                  </p>
                  <div className="mt-3 mb-6 flex items-baseline">
                    <span className="text-5xl font-extrabold text-base-content tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-lg text-base-content/60 font-medium ml-1">
                      /month
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-success shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-base-content/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="card-actions mt-auto w-full">
                  <Link
                    href={`/checkout?plan=${tier.id}`}
                    className={`btn w-full ${tier.isPopular ? "btn-primary" : "btn-outline btn-primary"
                      }`}
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
