const About = () => {
  const version = import.meta.env.VITE_APP_VERSION || "dev";

  return (
    <div className="mt-8 text-sm text-blue-600 opacity-70">
      <p>Version: {version}</p>
    </div>
  );
};

export default About;
