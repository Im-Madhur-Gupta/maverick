const HeaderLink = ({
  href,
  openInNewTab = false,
  children,
}: {
  href: string;
  openInNewTab?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <a
      href={href}
      target={openInNewTab ? "_blank" : "_self"}
      className="text-lg text-gray-400 hover:text-gray-200 transition-all duration-150 delay-100 font-semibold"
    >
      {children}
    </a>
  );
};

export default HeaderLink;
