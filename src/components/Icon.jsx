const iconPaths = {
  sparkles: <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Zm6 9 .8 2.2L21 15l-2.2.8L18 18l-.8-2.2L15 15l2.2-.8L18 12ZM6 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" />,
  meal: <path d="M4 15h16M6 15a6 6 0 0 1 12 0M12 7V5m-1-1h2" />,
  burger: <path d="M4 11h16M5 8.5C6.2 5.5 8.5 4 12 4s5.8 1.5 7 4.5H5ZM5 15h14v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2Z" />,
  drink: <path d="M7 7h10l-1 13H8L7 7Zm2-3h8m-2 0-3 6m-1 4h2" />,
  dessert: <path d="M4 18h16M6 18l1-7h10l1 7M8 11c0-2 1.5-4 4-4s4 2 4 4m-4-4V4" />,
  search: <path d="m20 20-4.3-4.3m1.3-4.2a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z" />,
  cart: <path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20 8H6m4 11.5h.01m6 0h.01" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  back: <path d="m15 18-6-6 6-6" />,
  check: <path d="m5 12 4 4L19 6" />,
  fullscreen: <path d="M8 3H3v5m13-5h5v5M8 21H3v-5m13 5h5v-5" />,
  'fullscreen-exit': <path d="M3 8h5V3m8 5h5V3M3 16h5v5m8-5h5v5" />,
};

export function Icon({ name, size = 24, strokeWidth = 1.8 }) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      >
        {iconPaths[name]}
      </g>
    </svg>
  );
}

export function BrandMark() {
  return (
    <svg
      aria-hidden="true"
      className="brand-mark"
      fill="none"
      viewBox="0 0 64 64"
    >
      <path d="M15 25h32v9c0 10-7 17-16 17S15 44 15 34v-9Z" />
      <path d="M47 29h3a7 7 0 0 1 0 14h-6M10 55h43M26 20c-5-7 7-7 2-14m10 14c-5-7 7-7 2-14" />
    </svg>
  );
}

