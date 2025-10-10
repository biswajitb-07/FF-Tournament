const ButtonLoader = () => {
  return (
    <div className="inline-flex space-x-1 items-end">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-1 h-4 bg-white rounded animate-bounce"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "0.8s",
          }}
        />
      ))}
    </div>
  );
};

export default ButtonLoader;
