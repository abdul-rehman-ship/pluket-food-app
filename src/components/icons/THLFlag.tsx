export const ThailandFlag = ({ width = "640px", height = "480px" }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 480"
        width={width}
        height={height}
      >
        <rect width="640" height="160" fill="#e70010" />
        <rect width="640" height="80" y="160" fill="#fff" />
        <rect width="640" height="80" y="240" fill="#0050f0" />
        <rect width="640" height="80" y="320" fill="#fff" />
        <rect width="640" height="80" y="400" fill="#e70010" />
      </svg>
    );
  };
  