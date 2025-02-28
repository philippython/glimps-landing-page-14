
import { useState } from "react";
import { NavLink } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { Check } from "lucide-react";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const pricingPlans = [
    {
      name: "Starter",
      description: "Perfect for smaller bars looking to test the waters",
      monthlyPrice: 349,
      yearlyPrice: 3149,
      yearlyDiscount: 500,
      features: [
        "1 Standard Glimps photo booth",
        "Basic branded templates",
        "Social media sharing",
        "Email delivery of photos",
        "Monthly usage reports",
        "Standard support (10am - 6pm)",
      ],
      popular: false,
      ctaText: "Get Started",
    },
    {
      name: "Professional",
      description: "Our most popular option for established venues",
      monthlyPrice: 649,
      yearlyPrice: 5849,
      yearlyDiscount: 1000,
      features: [
        "1 Premium Glimps photo booth",
        "Custom branded templates",
        "Social media sharing with tracking",
        "Email & SMS delivery",
        "Weekly detailed analytics",
        "Priority support (10am - 8pm)",
        "Seasonal template updates",
        "Custom backdrop options",
      ],
      popular: true,
      ctaText: "Get Started",
    },
    {
      name: "Enterprise",
      description: "For multi-location bars and entertainment groups",
      monthlyPrice: 999,
      yearlyPrice: 8999,
      yearlyDiscount: 2000,
      features: [
        "Multiple booths across locations",
        "Fully customized hardware & branding",
        "Advanced social media integration",
        "Comprehensive data analytics",
        "24/7 dedicated support",
        "Monthly strategy consultations",
        "Custom feature development",
        "Marketing campaign integration",
      ],
      popular: false,
      ctaText: "Contact Sales",
    },
  ];

  const faqs = [
    {
      question: "What's included in the installation?",
      answer:
        "Our team handles everything from physical setup to network configuration and staff training. We ensure your photo booth is perfectly placed to maximize visibility and usage while blending with your venue's aesthetic.",
    },
    {
      question: "Can I customize the booth to match my bar's branding?",
      answer:
        "Absolutely! All plans include some level of customization. Our Professional and Enterprise plans offer extensive branding options including custom templates, physical booth branding, and even custom backdrops.",
    },
    {
      question: "How quickly can I get a booth installed?",
      answer:
        "Typically, we can have your booth installed within 2-3 weeks of signing. For Enterprise clients with multiple locations, we create a rollout schedule that works for your business timeline.",
    },
    {
      question: "What kind of ROI can I expect?",
      answer:
        "Our clients typically see a return on investment within 3-6 months through increased dwell time, higher average spend per customer, and new customer acquisition through social sharing. We provide detailed analytics to help you track your specific ROI.",
    },
    {
      question: "What happens if there are technical issues?",
      answer:
        "All plans include technical support. Our Professional and Enterprise plans include priority support with faster response times. Many issues can be resolved remotely, and for hardware problems, we dispatch technicians promptly.",
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer:
        "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades will take effect at the end of your current billing cycle.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-24 animate-fade-in">
      {/* Pricing Header */}
      <section className="pt-16 pb-8">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-glimps-600 mb-10 max-w-2xl mx-auto">
              Choose the plan that works best for your venue. All plans include professional installation and ongoing support.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span 
                className={`text-base font-medium ${
                  billingCycle === "monthly" ? "text-glimps-900" : "text-glimps-500"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2 ${
                  billingCycle === "yearly" ? "bg-glimps-900" : "bg-glimps-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === "yearly" ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-base font-medium flex items-center gap-2 ${
                  billingCycle === "yearly" ? "text-glimps-900" : "text-glimps-500"
                }`}
              >
                Yearly
                <span className="inline-block bg-glimps-accent/10 text-glimps-accent text-xs px-2 py-1 rounded-full">
                  Save up to 16%
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="pb-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-xl ${
                  plan.popular
                    ? "border-2 border-glimps-accent relative scale-105 shadow-lg"
                    : "border border-gray-200 glimps-shadow"
                } bg-white overflow-hidden pricing-card`}
              >
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 transform -translate-y-1/2">
                    <span className="bg-glimps-accent text-white text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-glimps-900">{plan.name}</h3>
                  <p className="text-glimps-600 mt-2 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-glimps-900">
                        ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                      <span className="text-glimps-500 ml-2">
                        {billingCycle === "monthly" ? "/month" : "/year"}
                      </span>
                    </div>
                    {billingCycle === "yearly" && (
                      <p className="text-glimps-accent text-sm mt-2">
                        Save ${plan.yearlyDiscount} with annual billing
                      </p>
                    )}
                  </div>
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-glimps-accent flex-shrink-0 mr-3 mt-0.5" />
                        <span className="text-glimps-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <NavLink
                    to={plan.name === "Enterprise" ? "/about" : "/pricing"}
                    className={`w-full inline-flex h-12 items-center justify-center rounded-md ${
                      plan.popular
                        ? "bg-glimps-accent text-white hover:bg-glimps-accent/90"
                        : "bg-glimps-900 text-white hover:bg-glimps-800"
                    } px-6 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2`}
                  >
                    {plan.ctaText}
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-glimps-50 py-16">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 glimps-shadow"
                >
                  <h3 className="text-lg font-semibold mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-glimps-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Custom Plan */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 md:p-12 glimps-shadow">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold mb-4">
                  Need a Custom Solution?
                </h2>
                <p className="text-glimps-600 mb-6">
                  We understand that every venue is unique. Contact our team to discuss custom features, multi-location discounts, or special requirements for your business.
                </p>
                <NavLink
                  to="/about"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-glimps-900 px-8 text-base font-medium text-white transition-colors hover:bg-glimps-800 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
                >
                  Contact Our Team
                </NavLink>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="rounded-full bg-glimps-100 p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-20 h-20 text-glimps-accent"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </div>
  );
};

export default Pricing;
