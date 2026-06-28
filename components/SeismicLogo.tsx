"use client";
import React from "react";

export function SeismicIcon({ className = "", color = "#825A6D", size = 40 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * (443 / 310)}
      viewBox="0 0 310 443"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#seismic-clip)">
        <path opacity="0.6" fillRule="evenodd" clipRule="evenodd"
          d="M301.898 274.51L258.156 222.049L270.515 84.1154L301.898 274.51Z"
          fill={color} />
        <path opacity="0.8" fillRule="evenodd" clipRule="evenodd"
          d="M253.926 227.462L253.924 227.46H253.926V227.462ZM264.973 54.2156L250.788 212.539L147.873 78.1072L152.534 4.09253L264.973 54.2156Z"
          fill={color} />
        <path opacity="0.9" fillRule="evenodd" clipRule="evenodd"
          d="M139.689 77.8962L29.8809 223.84L143.585 16.0583L139.689 77.8962Z"
          fill={color} />
        <path opacity="0.95" fillRule="evenodd" clipRule="evenodd"
          d="M248.888 223.517L106.956 433.199L4.09131 271.725L143.723 86.1467L248.888 223.517Z"
          fill={color} />
        <path opacity="0.75"
          d="M244.649 444.007H111.653L254.88 229.167L301.94 286.458L244.649 444.007Z"
          fill={color} />
      </g>
      <defs>
        <clipPath id="seismic-clip">
          <rect width="309.264" height="443" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function SeismicLogo({ className = "", color = "#825A6D", textColor = "#f5eef0", height = 36 }: {
  className?: string;
  color?: string;
  textColor?: string;
  height?: number;
}) {
  const iconW = (44.6272 / 63.9255) * height;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width={iconW} height={height} viewBox="0 0 44.6272 63.9255" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.6" d="M43.5636 39.6121L37.2521 32.0417L39.0363 12.1375L43.5636 39.6121Z" fill={color} />
        <path opacity="0.8" d="M38.2367 7.823L36.1888 30.6677L21.3382 11.2703L22.0111 0.5896L38.2367 7.823Z" fill={color} />
        <path opacity="0.9" d="M20.1569 11.2405L4.31018 32.302L20.7194 2.31665L20.1569 11.2405Z" fill={color} />
        <path opacity="0.95" d="M35.9146 32.2532L15.4341 62.511L0.589417 39.2102L20.7388 12.4319L35.9146 32.2532Z" fill={color} />
        <path opacity="0.75" d="M35.3033 64.0706H16.1117L36.7795 33.0688L43.5704 41.336L35.3033 64.0706Z" fill={color} />
      </svg>
      <span style={{ color: textColor, fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: height * 0.5, letterSpacing: '0.05em' }}>
        seismic
      </span>
    </div>
  );
}

export default SeismicLogo;
