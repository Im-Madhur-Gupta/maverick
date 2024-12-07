import { PersonaConfig, AgentPersona } from '../types/agent';

export const PERSONA_CONFIGS: Record<AgentPersona, PersonaConfig> = {
    MOON_CHASER: {
        name: 'Moon Chaser',
        description: 'High-risk, high-reward trader focused on catching explosive price movements',
        riskTolerance: 9,
        socialWeight: 5,
        technicalWeight: 9,
        whaleFollowingWeight: 6,
        customPromptModifiers: [
            'Prioritize tokens showing strong momentum and volume spikes',
            'Look for technical breakout patterns and potential pump signals',
            'Monitor new token launches and presales',
            'Consider market sentiment and FOMO indicators heavily'
        ]
    },
    MEME_LORD: {
        name: 'Meme Lord',
        description: 'Social-driven trader who values viral potential and community engagement',
        riskTolerance: 7,
        socialWeight: 9,
        technicalWeight: 4,
        whaleFollowingWeight: 5,
        customPromptModifiers: [
            'Analyze Farcaster, Twitter, and Discord engagement metrics extensively',
            'Evaluate meme quality and viral potential',
            'Monitor social influencer activities and meme trends',
            'Look for strong community growth and engagement signals'
        ]
    },
    WHALE_WATCHER: {
        name: 'Whale Watcher',
        description: 'Strategic trader who follows smart money and on-chain signals',
        riskTolerance: 5,
        socialWeight: 4,
        technicalWeight: 7,
        whaleFollowingWeight: 9,
        customPromptModifiers: [
            'Track and analyze whale wallet movements',
            'Monitor DEX trading patterns of successful traders',
            'Focus on tokens with strong institutional interest',
            'Evaluate on-chain metrics and holder distribution'
        ]
    }
}; 