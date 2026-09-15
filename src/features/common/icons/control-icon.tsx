const ControlIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="none">
      <rect width="32" height="32" x=".5" y=".5" fill="transparent" rx="16" />
      <rect width="32" height="32" x=".5" y=".5" stroke="url(#a)" rx="16" />
      <mask
        id="b"
        width="13"
        height="13"
        x="10"
        y="10"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
      >
        <circle cx="11.289" cy="11.289" r="1.289" fill="#fff" />
        <circle cx="16.445" cy="11.289" r="1.289" fill="#fff" />
        <circle cx="21.601" cy="11.289" r="1.289" fill="#fff" />
        <circle cx="11.289" cy="16.445" r="1.289" fill="#fff" />
        <circle cx="16.445" cy="16.445" r="1.289" fill="#fff" />
        <circle cx="21.601" cy="16.445" r="1.289" fill="#fff" />
        <circle cx="11.289" cy="21.601" r="1.289" fill="#fff" />
        <circle cx="16.445" cy="21.601" r="1.289" fill="#fff" />
        <circle cx="21.601" cy="21.601" r="1.289" fill="#fff" />
      </mask>
      <g mask="url(#b)">
        <path fill="url(#c)" d="M9.898 9.5h13v14h-13z" />
      </g>
      <defs>
        <linearGradient
          id="a"
          x1="16.5"
          x2="16.5"
          y1="0"
          y2="33"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4061DF" />
          <stop offset="1" stopColor="#71C8B9" />
        </linearGradient>
        <linearGradient
          id="c"
          x1="16.398"
          x2="16.398"
          y1="9.5"
          y2="23.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3F59E4" />
          <stop offset="1" stopColor="#7DCDC0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ControlIcon