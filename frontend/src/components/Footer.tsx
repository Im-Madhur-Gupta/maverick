import ExternalLink from "./ExternalLink";

const Footer = () => {
  return (
    <footer className="bg-primary text-white p-12 rounded-t-xl">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4">Maverick</h3>
          <p className="text-sm">
            Empowering your trading with AI-driven insights and seamless
            automation for smarter, more efficient decision-making.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <ExternalLink href="https://github.com/Im-Madhur-Gupta/memecoin-maverick">
                About
              </ExternalLink>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
