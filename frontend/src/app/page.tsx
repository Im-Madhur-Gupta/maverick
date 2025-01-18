"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import PersonaCard from "@/modules/common/components/PersonaCard";
import { Button } from "@/modules/common/components/ui/button";
import landingImage from "@/assets/images/landing.png";
import { PERSONAS } from "@/modules/common/constants/personas.constant";
import { useRouter } from "next/navigation";

const FEATURES = [
  {
    title: "Personalized Agents",
    description:
      "Customize your Maverick to reflect your unique style and goals with our intuitive persona system.",
  },
  {
    title: "Real-Time Insights",
    description:
      "Stay ahead of the game with AI-driven trading signals, all powered by social trends and on-chain data.",
  },
  {
    title: "Effortless Onboarding",
    description:
      "Start trading in no time with our easy setup process and secure authentication.",
  },
];

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    // TODO: If user isn't logged then redirect to 'onboarding' else redirect to 'dashboard'
    router.push("/onboarding");
  };

  return (
    <main className="max-w-6xl mx-auto">
      <section className="flex items-center justify-between h-[80vh]">
        <div className="flex flex-col items-start w-[48%]">
          <h1 className="text-6xl font-bold mb-6 text-primary">
            <span>Let</span>
            <span className="underline decoration-white decoration-1 underline-offset-8 mx-2.5">
              Maverick
            </span>
            <span>Trade Smarter for You</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-text-secondary">
            Your Personalized AI Trading Agent for Meme Coins and Beyond
          </p>
          <Button size="lg" onClick={handleGetStarted}>
            Get Started
          </Button>
        </div>

        <Image
          src={landingImage}
          alt="Maverick Eagle"
          className="w-[48%] drop-shadow-[0_0_40px_rgba(255,107,1,0.3)]"
          priority
        />
      </section>

      <section className="mt-24 mb-36 py-12 bg-primary text-white rounded-xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Why Choose Maverick?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-24 mb-36">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-primary">
          Choose Your Trading Persona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PERSONAS.map((persona) => (
            <PersonaCard key={persona.id} persona={persona} />
          ))}
        </div>
      </section>

      <section className="mt-24 mb-36 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Elevate Your Trading?
            </h2>
            <p className="text-xl mb-8">
              Create your Maverick now and experience smarter, automated trading
              with a personalized AI agent.
            </p>
            <Button size="xl" onClick={handleGetStarted}>
              Get Started Today
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
