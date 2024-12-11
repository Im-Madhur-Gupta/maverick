"use client";

import { useState } from "react";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import { PERSONA_CONFIGS } from "@/config/personas";
// import { AgentService } from "@/services/agent";
import { AgentPersona } from "@/types/agent";

export default function CreateAgent() {
  // const router = useRouter();
  const [step, setStep] = useState<"persona" | "token">("persona");
  const [selectedPersona, setSelectedPersona] = useState<AgentPersona>();
  const [tokenAddress, setTokenAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!selectedPersona || !tokenAddress) return;
    setLoading(true);
    setError("");

    try {
      // const { agentId } = await AgentService.createAgent({
      //   persona: selectedPersona,
      //   trackedTokens: [{
      //     address: tokenAddress,
      //     symbol: 'AUTO',
      //     name: 'Auto-detected'
      //   }],
      //   primaryToken: tokenAddress,
      //   walletConfig: {
      //     fereApiKey: process.env.NEXT_PUBLIC_FERE_API_KEY!,
      //     fereUserId: process.env.NEXT_PUBLIC_FERE_USER_ID!
      //   }
      // });
      // router.push(`/dashboard/${agentId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create agent");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Image src="/logo.png" alt="Memecoin Maverick" width={50} height={50} className="rounded-full mr-4" />
          <h1 className="text-3xl font-bold">Create Your Maverick</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mb-12">
          <div className={`h-1 w-1/2 ${step === "persona" ? "bg-blue-500" : "bg-blue-900"}`} />
          <div className={`h-1 w-1/2 ${step === "token" ? "bg-blue-500" : "bg-blue-900"}`} />
        </div>

        {step === "persona" ? (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold mb-6">Choose Your Trading Style</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(PERSONA_CONFIGS).map(([key, persona]) => (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedPersona(key as AgentPersona);
                    setStep("token");
                  }}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:transform hover:scale-105
                    ${
                      selectedPersona === key
                        ? "border-blue-500 bg-blue-900/20"
                        : "border-gray-700 hover:border-gray-500"
                    }`}
                >
                  <h3 className="text-xl font-bold mb-2">{persona.name}</h3>
                  <p className="text-gray-400 mb-4">{persona.description}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Risk Level</span>
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${persona.riskTolerance * 10}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Social Focus</span>
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${persona.socialWeight * 10}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Technical</span>
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${persona.technicalWeight * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto space-y-8">
            <h2 className="text-2xl font-semibold mb-6">Enter Token Details</h2>
            <div>
              <label className="block text-lg mb-2">Token Address</label>
              <input
                type="text"
                value={tokenAddress}
                onChange={e => setTokenAddress(e.target.value)}
                placeholder="0x..."
                className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-700 
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-lg"
              />
              <p className="text-gray-400 mt-2">Enter the contract address of the token you want to trade</p>
            </div>

            {error && <div className="text-red-500 bg-red-900/20 p-4 rounded-xl">{error}</div>}

            <div className="flex gap-4">
              <button
                onClick={() => setStep("persona")}
                className="flex-1 py-4 rounded-xl text-lg font-bold bg-gray-800 hover:bg-gray-700"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!tokenAddress || loading}
                className={`flex-1 py-4 rounded-xl text-lg font-bold
                  ${loading ? "bg-gray-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {loading ? "Creating..." : "Deploy Agent"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
