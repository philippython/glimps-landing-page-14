
import { NavLink } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="bg-glimps-900 text-white">
      <div className="container mx-auto py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform Your Bar Experience?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of bar owners who have increased customer satisfaction and revenue with Glimps photobooths.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink
              to="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-base font-medium text-glimps-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
            >
              See Pricing
            </NavLink>
            <NavLink
              to="/about"
              className="inline-flex h-12 items-center justify-center rounded-md border border-white px-8 text-base font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-glimps-900"
            >
              Learn More
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
