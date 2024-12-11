# MemeCoin Maverick  

### **Overview**  
**MemeCoin Maverick** is an AI agent that autonomously trades meme coins for you based on your preferences and insights from top traders. Built to simplify meme coin trading, the agent leverages real-time onchain and social data for intelligent, automated decision-making.  

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
- **AI**:  
  - LLMs for sentiment analysis, trend prediction, and decision-making (WIP).  
- **Blockchain**:  
  - **Wallet**: Coinbase MPC Wallet for secure, autonomous transactions.  
  - **Agent**: Leveraging the 0xDisciple agent from FereAI for autonomous trading.  

---  

### **Features**  
- Fully autonomous AI trading agent.  
- Integration with Coinbase MPC Wallet for secure crypto handling.  
- Easy customization of trading strategies using trusted trader inputs.  

---  

### **Current Progress**  
1. Created a 0xDisciple agent with selectable personas:  
   - `MOON_CHASER`: Focuses on short-term gains from meme coins with high volatility.  
   - `MEME_LORD`: Prioritizes meme popularity on Farcaster.  
   - `WHALE_WATCHER`: Tracks and mimics strategies of large traders.  
2. Integrated Farcaster data to:  
   - Analyze coin popularity and generate trading signals (BUY, SELL, HOLD).  
   - Execute SELL signals using the Fere create trade API.  
3. Added functionality to fetch data from top traders on Farcaster:  
   - Analyzes their promoted coins and generates relevant trading signals.  
4. Persona selection influences how the agent weighs social and trader-based signals. For example, `MEME_LORD` gives more emphasis to meme popularity than trader insights.  

---  

### **Future Plans**  
- [ ] [WIP] Fix issues with the `create` call, especially formatting of `decision_prompt_pool` and `decision_prompt_portfolio`.  
- [ ] [WIP] Build a frontend for better user interaction (an initial version is in place).  
- [ ] Integrate the BUY API when it becomes available.  
- [ ] [LONG TERM] Generalize the agent for all types of crypto trading, beyond meme coins.  

---  

Stay tuned for updates as the project evolves! Contributions and feedback are welcome.  
