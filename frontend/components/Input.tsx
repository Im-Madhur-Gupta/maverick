const OCInput = (props: any) => {
  return (
    <input
      {...props}
      className="w-full px-6 py-2 bg-gray-800/70 border border-gray-700/50 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition duration-300 ease-in-out"
    />
  );
};

export default OCInput;
