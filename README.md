# MemeCoin Maverick

<div align="center">
    <img src="https://github.com/user-attachments/assets/d58f2f74-a509-4e99-8428-6dea918a7826" alt="Logo" height="250"/>
</div>

### **Overview**  
**MemeCoin Maverick** is an AI agent that autonomously trades meme coins for you based on your preferences and insights from top traders. Built to simplify meme coin trading, the agent leverages real-time onchain and social data for intelligent, automated decision-making.  

**Frontend**: [memecoin-maverick.vercel.app](https://memecoin-maverick.vercel.app/) [WIP] <br/>
**API Docs**: [maverick-backend.onrender.com/api](https://maverick-backend.onrender.com/api)

---  

### **Problem**  
Meme coin trading is highly volatile and hype-driven, often influenced by social media trends and Key Opinion Leaders (KOLs). Traders lack efficient tools to keep up with these rapid changes, missing out on opportunities.  

---  

### **Solution**  
MemeCoin Maverick automates the trading process by:  
- Using AI to analyze market sentiment and trends.  
- Following strategies of trusted traders via their blockchain addresses or Farcaster handles.  
- Executing trades on your behalf based on pre-set criteria.  

---  

### **Tech Stack**  
- **Frontend**:
  - TypeScript
  - Next.js
- **Backend**:
  - TypeScript
  - NestJS
  - PostgreSQL
- **AI**:  
  - LLMs for trend prediction, and decision-making (WIP).  
- **Blockchain**:
  - **Agent**: Leveraging the 0xDisciple agent from FereAI for autonomous trading.  

---  

### **Current Progress**  
1. Created an agent with selectable personas:  
   - `MOON_CHASER`: Focuses on short-term gains from meme coins with high volatility.  
   - `MEME_LORD`: Prioritizes meme popularity on Farcaster.  
   - `WHALE_WATCHER`: Tracks and mimics strategies of large traders.

---  

### **TODOs**  
- [x] Fix issues with the `create` call, especially formatting of `decision_prompt_pool` and `decision_prompt_portfolio`.  
- [ ] [WIP] Migrate the backend to NestJS and PostgreSQL
    - [ ] [WIP] Real-time agent holdings tracker via CRON/WebSocket
    - [ ] Analyze Farcaster posts tokens under holdings to generate trading signals for respective agents
    - [ ] Add get portfolio API
- [ ] Persona selection should influence how the agent weighs social signals. For example, `MEME_LORD` gives more emphasis on meme popularity. 
- [ ] Integrate create agent and get holdings on the frontend.
- [ ] KOL signal integration
    1. Fetch and analyze posts from user-supplied KOL handles
    2. Generate trading signals based on KOL discussions for both portfolio and potential coins
- [ ] Integrate the BUY API when it's available.  
- [ ] [LONG TERM] Generalize the agent for all types of crypto trading, beyond meme coins.  

---  

Stay tuned for updates as the project evolves! Contributions and feedback are welcome.  
