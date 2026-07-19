const sizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const Avatar = ({ src, alt = "Avatar", size = "md", className = "" }) => {
  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden bg-gray-200 ${className}`}>
      <img
        alt={alt}
        className="h-full w-full object-cover"
        src={src}
        onError={(e) => {
          e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(alt) + "&background=005e53&color=fff";
        }}
      />
    </div>
  );
};

export default Avatar;