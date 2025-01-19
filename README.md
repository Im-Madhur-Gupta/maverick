# Memecoin Maverick

<div align="center">
    <img src="https://github.com/user-attachments/assets/d58f2f74-a509-4e99-8428-6dea918a7826" alt="Logo" height="250"/>
</div>

### **Overview**

**Memecoin Maverick** is an AI agent that autonomously trades meme coins for you based on your preferences and insights from top traders. Built to simplify meme coin trading, the agent leverages real-time on-chain and social data for intelligent, automated decision-making.

**Website**: [get-maverick.vercel.app](https://get-maverick.vercel.app/) <br/>
**API Docs**: [maverick-backend.onrender.com/api](https://maverick-backend.onrender.com/api)

---

### **Problem**

Meme coin trading is highly volatile and hype-driven, often influenced by social media trends and Key Opinion Leaders (KOLs). Traders lack efficient tools to keep up with these rapid changes, missing out on opportunities.

---

### **Solution**

Memecoin Maverick automates the trading process by:

- Using AI to analyze market sentiment and trends.
- Following strategies of trusted traders via their blockchain addresses or Farcaster handles.
- Executing trades for you based on pre-set criteria.

---

### **Tech Stack**

- **Frontend**:
  - TypeScript
  - Next.js
- **Backend**:
  - TypeScript
  - NestJS
  - PostgreSQL
  - PrismaORM
  - Redis
  - Docker
  - BullMQ
- **AI**:
  - LLMs for trend prediction and decision-making.
- **Blockchain**:
  - **Agent**: Leveraging the 0xDisciple agent from [FereAI](https://www.fereai.xyz/) for autonomous trading.

---

### **Current Progress**

#### Backend

1. JWT-based authentication using Solana signature (`Ed25519`) verification.
2. Create an agent with selectable personas:
   - `MOON_CHASER`: Focuses on short-term gains from meme coins with high volatility.
   - `MEME_LORD`: Prioritizes meme popularity on Farcaster.
   - `WHALE_WATCHER`: Tracks and mimics strategies of large traders.
3. Fetch current holdings of an agent.
4. Fetch portfolio information of an agent.
5. Generate and dispatch trading signals (buy/sell/hold) for coins based on social (Farcaster) sentiment.
6. Integrated pipeline framework for coin signal processing with BullMQ.
7. Added endpoints to fetch processed coin signals.

#### Frontend

1. Improved landing page UI.
2. Completed onboarding flow for agent creation and setup.
3. Dashboard displays portfolio and trading signal data.
4. Periodic updates for real-time portfolio, holdings insights.

---

### **TODOs**

- [X] Fix `create agent` call and formatting of `decision_prompt_pool` and `decision_prompt_portfolio`.
- [X] Migrate backend to NestJS and PostgreSQL.
  - [X] Real-time agent holdings tracker via CRON job.
  - [X] Analyze Farcaster posts:
    - Identify posts about coins in the agent's holdings.
    - Use AI to determine if the sentiment is positive, negative, or neutral.
    - Generate buy/sell/hold signals for agents holding those coins.
  - [X] Add get portfolio API.
  - [X] Add JWT-based user authentication.
  - [X] Integrate Redis for signal management.
  - [X] Add BullMQ-based pipeline for signal processing.
- [X] Frontend integration and improvements:
  - [X] Improve landing page UI.
  - [X] Implement user onboarding.
  - [X] Create agent.
  - [X] Get holdings.
  - [X] Get portfolio.
  - [X] Get processed coin signals.
- [ ] Persona selection should influence how the agent weighs social signals. For example, `MEME_LORD` gives more emphasis on meme popularity.
- [ ] Implement refresh access token mechanism for authentication.
- [ ] KOL signal integration:
  1. Fetch and analyze posts from user-supplied KOL handles.
  2. Generate trading signals based on KOL discussions for both portfolio and potential coins.
- [ ] Integrate the BUY API when it's available from [FereAI](https://www.fereai.xyz/).
- [ ] [LONG TERM] Generalize the agent for all types of crypto trading, beyond meme coins.

---

Stay tuned for updates as the project evolves! Contributions and feedback are welcome.
