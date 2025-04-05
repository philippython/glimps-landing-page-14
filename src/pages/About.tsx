import { FormattedMessage } from "react-intl";
import CallToAction from "../components/CallToAction";
import ImageWithFallback from "../components/ImageWithFallback";

const About = () => {
  // const team = [
  //   {
  //     name: "Daniil",
  //     role: "Founder & CEO",
  //     bio: "Sales and Strategic Planning person | Passionate about Driving Business Growth and Efficiency | Experienced in B2B Sales, CRM, and Strategic Planning According to MBTI have ESTJ-T type of personality",
  //     image: "/placeholder.svg",
  //   },
  //   {
  //     name: "Taylor Chen",
  //     role: "Head of Technology",
  //     bio: "With 15+ years in photography tech, Taylor leads our R&D team and ensures Glimps booths deliver premium photo quality.",
  //     image: "/placeholder.svg",
  //   },
  //   {
  //     name: "Morgan Williams",
  //     role: "Customer Success Manager",
  //     bio: "Morgan works directly with venue owners to ensure they get maximum value from their Glimps investment.",
  //     image: "/placeholder.svg",
  //   },
  // ];

  const values = [
    {
      title: <FormattedMessage id="about.ourValues.quality.title" />,
      description: <FormattedMessage id="about.ourValues.quality.description" />,
    },
    {
      title: <FormattedMessage id="about.ourValues.partnerSuccess.title" />,
      description: <FormattedMessage id="about.ourValues.partnerSuccess.description" />,
    },
    {
      title: <FormattedMessage id="about.ourValues.innovation.title" />,
      description: <FormattedMessage id="about.ourValues.innovation.description" />,
    },
    {
      title: <FormattedMessage id="about.ourValues.service.title" />,
      description: <FormattedMessage id="about.ourValues.service.description" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-24 animate-fade-in">
      {/* Hero Section */}
      <section className="pt-12 pb-16">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <FormattedMessage id="about.title" />
            </h1>
            <p className="text-xl text-glimps-600 mb-10 max-w-2xl mx-auto">
              <FormattedMessage id="about.description" />
            </p>
          </div>

          <div className="mt-10 rounded-xl overflow-hidden glimps-shadow">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              alt="Person using a Glimps photobooth"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-glimps-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">
                <FormattedMessage id="about.ourStory.title" />
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-glimps-700">
              <p>
                <FormattedMessage id="about.ourStory.description.description1" />
              </p>
              <p>
                <FormattedMessage id="about.ourStory.description.description2" />
              </p>
              <p>
                <FormattedMessage id="about.ourStory.description.description3" />
              </p>
              <p>
                <FormattedMessage id="about.ourStory.description.description4" />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">
              <FormattedMessage id="about.ourValues.title" />
            </h2>
            <p className="text-lg text-glimps-600 max-w-2xl mx-auto">
              <FormattedMessage id="about.ourValues.description" />
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl glimps-shadow hover:scale-[1.02] transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-glimps-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="bg-glimps-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-lg text-glimps-600 max-w-2xl mx-auto">
              The passionate people behind Glimps who make it all happen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden glimps-shadow hover:scale-[1.02] transition-all duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-glimps-accent font-medium mb-3">{member.role}</p>
                  <p className="text-glimps-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Contact Section */}
      {/* <section>
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 md:p-12 glimps-shadow">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
              <p className="text-glimps-600 max-w-2xl mx-auto">
                Interested in learning more about how Glimps can transform your venue? We'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xl font-semibold mb-6">Contact Information</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-glimps-500 mb-1">Email</p>
                    <a href="mailto:hello@glimps.com" className="text-glimps-900 hover:text-glimps-accent transition-colors">
                      hello@glimps.com
                    </a>
                  </div>

                  <div>
                    <p className="text-glimps-500 mb-1">Phone</p>
                    <a href="tel:+18001234567" className="text-glimps-900 hover:text-glimps-accent transition-colors">
                      (800) 123-4567
                    </a>
                  </div>

                  <div>
                    <p className="text-glimps-500 mb-1">Office</p>
                    <address className="text-glimps-900 not-italic">
                      123 Photo Lane<br />
                      San Francisco, CA 94103
                    </address>
                  </div>

                  <div>
                    <p className="text-glimps-500 mb-1">Hours</p>
                    <p className="text-glimps-900">
                      Monday - Friday: 9AM - 6PM PST
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-6">Send Us a Message</h3>

                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-glimps-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glimps-accent"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-glimps-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glimps-accent"
                      placeholder="Your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="venue" className="block text-glimps-700 mb-2">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      id="venue"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glimps-accent"
                      placeholder="Your venue name"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-glimps-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glimps-accent"
                      placeholder="Tell us about your venue and requirements"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center rounded-md bg-glimps-900 px-8 text-base font-medium text-white transition-colors hover:bg-glimps-800 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <CallToAction />
    </div>
  );
};

export default About;
