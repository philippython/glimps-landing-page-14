
import { NavLink } from "react-router-dom";
import ImageWithFallback from "../components/ImageWithFallback";
import CallToAction from "../components/CallToAction";
import { Camera, Users, DollarSign, PartyPopper } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: <Camera className="h-10 w-10 text-glimps-accent" />,
      title: "Premium Photo Experience",
      description:
        "High-quality cameras and professional lighting ensure your customers get magazine-worthy photos every time.",
    },
    {
      icon: <Users className="h-10 w-10 text-glimps-accent" />,
      title: "Increased Customer Engagement",
      description:
        "Create memorable experiences that keep customers in your venue longer and coming back for more.",
    },
    {
      icon: <DollarSign className="h-10 w-10 text-glimps-accent" />,
      title: "Revenue Generation",
      description:
        "An additional revenue stream with flexible pricing models to suit your business.",
    },
    {
      icon: <PartyPopper className="h-10 w-10 text-glimps-accent" />,
      title: "Social Media Amplification",
      description:
        "Instant social sharing with your branded templates increases visibility and attracts new customers.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Since installing Glimps, our weekend revenue has increased by 22%. Customers love it and many come specifically for the photo experience.",
      author: "Sarah Johnson",
      position: "Owner, The Nightcap Lounge",
    },
    {
      quote:
        "The team at Glimps made setup incredibly easy. Their responsive support and regular updates keep the system running smoothly.",
      author: "Michael Chen",
      position: "Manager, Urban Spirit Bar",
    },
    {
      quote:
        "Our customers spend an average of 40 minutes longer in our bar when using the Glimps booth. It's been a game-changer for our business.",
      author: "Jessica Williams",
      position: "Owner, Crafted & Co.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="bg-glimps-100 text-glimps-800 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide">
                  For Bar Owners
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Turn Moments Into <span className="text-glimps-accent">Memories</span> Your Customers Will Share
              </h1>
              <p className="text-lg md:text-xl text-glimps-600 max-w-xl">
                Elevate your bar with Glimps photo booths—a premium amenity that increases customer engagement, dwell time, and generates social media exposure.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <NavLink
                  to="/pricing"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-glimps-900 px-8 text-base font-medium text-white transition-colors hover:bg-glimps-800 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
                >
                  View Pricing
                </NavLink>
                <NavLink
                  to="/about"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-glimps-800 px-8 text-base font-medium text-glimps-900 transition-colors hover:bg-glimps-50 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
                >
                  Learn More
                </NavLink>
              </div>
              <div className="pt-6">
                <p className="text-glimps-500 font-medium text-sm">
                  Trusted by 200+ bars and entertainment venues nationwide
                </p>
              </div>
            </div>
            <div className="lg:pl-10 glimps-shadow rounded-xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
                alt="People enjoying a Glimps photo booth at a bar"
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-glimps-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Why Bar Owners Love Glimps
            </h2>
            <p className="mt-4 text-lg text-glimps-600">
              Our premium photo booths are designed specifically for the bar and nightlife industry.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl glimps-shadow hover:scale-[1.02] transition-all duration-300"
              >
                <div className="mb-5">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-glimps-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 glimps-shadow rounded-xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                alt="Bar patrons enjoying themselves"
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-block">
                <span className="bg-glimps-100 text-glimps-800 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide">
                  Simple Process
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                How Glimps Works for Your Bar
              </h2>
              
              <div className="space-y-6 mt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-glimps-900 text-white flex items-center justify-center font-medium">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">
                      Seamless Installation
                    </h3>
                    <p className="text-glimps-600">
                      Our team handles the complete setup of your custom-branded photo booth in a spot that maximizes visibility and usage.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-glimps-900 text-white flex items-center justify-center font-medium">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">
                      Customer Engagement
                    </h3>
                    <p className="text-glimps-600">
                      Bar-goers use the intuitive touchscreen interface to take photos, apply filters, and instantly share branded content to their social networks.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-glimps-900 text-white flex items-center justify-center font-medium">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">
                      Analytics & Growth
                    </h3>
                    <p className="text-glimps-600">
                      Access real-time data on usage, popular times, and social sharing reach to measure ROI and optimize your marketing.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <NavLink
                  to="/pricing"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-glimps-900 px-8 text-base font-medium text-white transition-colors hover:bg-glimps-800 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
                >
                  Get Started
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-glimps-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              What Bar Owners Are Saying
            </h2>
            <p className="mt-4 text-lg text-glimps-600">
              Join hundreds of satisfied venue owners who've transformed their customer experience with Glimps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl glimps-shadow flex flex-col h-full hover:scale-[1.02] transition-all duration-300"
              >
                <div className="mb-4">
                  <svg width="45" height="36" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-glimps-200">
                    <path d="M13.4 36C8.93333 36 5.53333 34.5333 3.2 31.6C1.06667 28.6667 0 24.9333 0 20.4C0 14.2667 1.6 9 4.8 4.6C8.13333 0.2 13.0667 -1.16963e-06 19.6 -7.64446e-07L20 4.4C16.5333 5.06667 13.8667 6.33333 12 8.2C10.1333 10.0667 9.06667 12.4 8.8 15.2L9.2 15.4C10.1333 14.7333 11.6 14.4 13.6 14.4C16.2667 14.4 18.4667 15.4 20.2 17.4C22.0667 19.4 23 21.9333 23 25C23 28.0667 21.9333 30.6 19.8 32.6C17.6667 34.8667 15.8 36 13.4 36ZM35.4 36C30.9333 36 27.5333 34.5333 25.2 31.6C23.0667 28.6667 22 24.9333 22 20.4C22 14.2667 23.6 9 26.8 4.6C30.1333 0.2 35.0667 -1.16963e-06 41.6 -7.64446e-07L42 4.4C38.5333 5.06667 35.8667 6.33333 34 8.2C32.1333 10.0667 31.0667 12.4 30.8 15.2L31.2 15.4C32.1333 14.7333 33.6 14.4 35.6 14.4C38.2667 14.4 40.4667 15.4 42.2 17.4C44.0667 19.4 45 21.9333 45 25C45 28.0667 43.9333 30.6 41.8 32.6C39.6667 34.8667 37.8 36 35.4 36Z" fill="currentColor"/>
                  </svg>
                </div>
                <p className="text-glimps-700 mb-6 flex-grow">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-glimps-500 text-sm">{testimonial.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              The Glimps Impact
            </h2>
            <p className="mt-4 text-lg text-glimps-600">
              Real results from bars using our photo booths.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl glimps-shadow text-center">
              <div className="text-4xl font-bold text-glimps-accent mb-2">27%</div>
              <p className="text-glimps-600">Average increase in customer dwell time</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl glimps-shadow text-center">
              <div className="text-4xl font-bold text-glimps-accent mb-2">18%</div>
              <p className="text-glimps-600">Increase in beverage sales</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl glimps-shadow text-center">
              <div className="text-4xl font-bold text-glimps-accent mb-2">3.4K</div>
              <p className="text-glimps-600">Average monthly social media impressions</p>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </div>
  );
};

export default Index;
