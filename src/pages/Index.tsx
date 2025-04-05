import { NavLink } from "react-router-dom";
import ImageWithFallback from "../components/ImageWithFallback";
import CallToAction from "../components/CallToAction";
import { Camera, Users, DollarSign, PartyPopper } from "lucide-react";
import { FormattedMessage } from "react-intl";

const Index = () => {
  const features = [
    {
      icon: <Camera className="h-10 w-10 text-glimps-accent" />,
      title: <FormattedMessage id="index.features.preiumExperience.title" />,
      description: <FormattedMessage id="index.features.preiumExperience.description" />,
    },
    {
      icon: <Users className="h-10 w-10 text-glimps-accent" />,
      title: <FormattedMessage id="index.features.customerEngagement.title" />,
      description: <FormattedMessage id="index.features.customerEngagement.description" />,
    },
    {
      icon: <DollarSign className="h-10 w-10 text-glimps-accent" />,
      title: <FormattedMessage id="index.features.revenueGeneration.title" />,
      description: <FormattedMessage id="index.features.revenueGeneration.description" />,
    },
    {
      icon: <PartyPopper className="h-10 w-10 text-glimps-accent" />,
      title: <FormattedMessage id="index.features.socialMedia.title" />,
      description: <FormattedMessage id="index.features.socialMedia.description" />,
    },
  ];

  const testimonials = [
    {
      quote: <FormattedMessage id="index.testimonials.1.quote" />,
      author: <FormattedMessage id="index.testimonials.1.author" />,
      position: <FormattedMessage id="index.testimonials.1.position" />,
    },
    {
      quote: <FormattedMessage id="index.testimonials.2.quote" />,
      author: <FormattedMessage id="index.testimonials.2.author" />,
      position: <FormattedMessage id="index.testimonials.2.position" />,
    },
    {
      quote: <FormattedMessage id="index.testimonials.3.quote" />,
      author: <FormattedMessage id="index.testimonials.3.author" />,
      position: <FormattedMessage id="index.testimonials.3.position" />,
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
                  <FormattedMessage id="index.hero.tagline" />
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <FormattedMessage id="index.hero.title.first" />
                <span className="text-glimps-accent">
                  <FormattedMessage id="index.hero.title.highlight" />
                </span>
                <FormattedMessage id="index.hero.title.last" />
              </h1>
              <p className="text-lg md:text-xl text-glimps-600 max-w-xl">
                <FormattedMessage id="index.hero.description" />
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <NavLink
                  to="/resgister"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-glimps-900 px-8 text-base font-medium text-white transition-colors hover:bg-glimps-800 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
                >
                  <FormattedMessage id="index.hero.links.getStarted" />
                </NavLink>
                <NavLink
                  to="/about"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-glimps-800 px-8 text-base font-medium text-glimps-900 transition-colors hover:bg-glimps-50 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
                >
                  <FormattedMessage id="index.hero.links.learnMore" />
                </NavLink>
              </div>
              <div className="pt-6">
                <p className="text-glimps-500 font-medium text-sm">
                  <FormattedMessage id="index.hero.footer" />
                </p>
              </div>
            </div>
            <div className="lg:pl-10 glimps-shadow rounded-xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
                alt="People enjoying a Glimps photo booth at a venue"
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
              <FormattedMessage id="index.features.title" />
            </h2>
            <p className="mt-4 text-lg text-glimps-600">
              <FormattedMessage id="index.features.description" />
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
                alt="Venue patrons enjoying themselves"
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-block">
                <span className="bg-glimps-100 text-glimps-800 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide">
                  <FormattedMessage id="index.howItWorks.tagline" />
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                <FormattedMessage id="index.howItWorks.title" />
              </h2>

              <div className="space-y-6 mt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-glimps-900 text-white flex items-center justify-center font-medium">
                    <FormattedMessage id="index.howItWorks.keyPoints.1.number" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">
                      <FormattedMessage id="index.howItWorks.keyPoints.1.title" />
                    </h3>
                    <p className="text-glimps-600">
                      <FormattedMessage id="index.howItWorks.keyPoints.1.description" />
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-glimps-900 text-white flex items-center justify-center font-medium">
                    <FormattedMessage id="index.howItWorks.keyPoints.2.number" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">
                      <FormattedMessage id="index.howItWorks.keyPoints.2.title" />
                    </h3>
                    <p className="text-glimps-600">
                      <FormattedMessage id="index.howItWorks.keyPoints.2.description" />
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-glimps-900 text-white flex items-center justify-center font-medium">
                    <FormattedMessage id="index.howItWorks.keyPoints.3.number" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">
                      <FormattedMessage id="index.howItWorks.keyPoints.3.title" />
                    </h3>
                    <p className="text-glimps-600">
                      <FormattedMessage id="index.howItWorks.keyPoints.3.description" />
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <NavLink
                  to="/resgister"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-glimps-900 px-8 text-base font-medium text-white transition-colors hover:bg-glimps-800 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
                >
                  <FormattedMessage id="index.howItWorks.cta" />
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
              <FormattedMessage id="index.testimonials.title" />
            </h2>
            <p className="mt-4 text-lg text-glimps-600">
              <FormattedMessage id="index.testimonials.description" />
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
                    <path d="M13.4 36C8.93333 36 5.53333 34.5333 3.2 31.6C1.06667 28.6667 0 24.9333 0 20.4C0 14.2667 1.6 9 4.8 4.6C8.13333 0.2 13.0667 -1.16963e-06 19.6 -7.64446e-07L20 4.4C16.5333 5.06667 13.8667 6.33333 12 8.2C10.1333 10.0667 9.06667 12.4 8.8 15.2L9.2 15.4C10.1333 14.7333 11.6 14.4 13.6 14.4C16.2667 14.4 18.4667 15.4 20.2 17.4C22.0667 19.4 23 21.9333 23 25C23 28.0667 21.9333 30.6 19.8 32.6C17.6667 34.8667 15.8 36 13.4 36ZM35.4 36C30.9333 36 27.5333 34.5333 25.2 31.6C23.0667 28.6667 22 24.9333 22 20.4C22 14.2667 23.6 9 26.8 4.6C30.1333 0.2 35.0667 -1.16963e-06 41.6 -7.64446e-07L42 4.4C38.5333 5.06667 35.8667 6.33333 34 8.2C32.1333 10.0667 31.0667 12.4 30.8 15.2L31.2 15.4C32.1333 14.7333 33.6 14.4 35.6 14.4C38.2667 14.4 40.4667 15.4 42.2 17.4C44.0667 19.4 45 21.9333 45 25C45 28.0667 43.9333 30.6 41.8 32.6C39.6667 34.8667 37.8 36 35.4 36Z" fill="currentColor" />
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
              <FormattedMessage id="index.stats.title" />
            </h2>
            <p className="mt-4 text-lg text-glimps-600">
              <FormattedMessage id="index.stats.description" />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl glimps-shadow text-center">
              <div className="text-4xl font-bold text-glimps-accent mb-2">
                <FormattedMessage id="index.stats.increaseCustomerDwellTime.value" />
              </div>
              <p className="text-glimps-600">
                <FormattedMessage id="index.stats.increaseCustomerDwellTime.label" />
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl glimps-shadow text-center">
              <div className="text-4xl font-bold text-glimps-accent mb-2">
                <FormattedMessage id="index.stats.increaseSales.value" />
              </div>
              <p className="text-glimps-600">
                <FormattedMessage id="index.stats.increaseSales.label" />
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl glimps-shadow text-center">
              <div className="text-4xl font-bold text-glimps-accent mb-2">
                <FormattedMessage id="index.stats.mediaImpressions.value" />
              </div>
              <p className="text-glimps-600">
                <FormattedMessage id="index.stats.mediaImpressions.label" />
              </p>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </div>
  );
};

export default Index;
