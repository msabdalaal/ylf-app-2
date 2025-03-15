import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function NoConnection({ color = "#000" }) {
  return (
    <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM3.22 11.48a9.97 9.97 0 0117.56 0M6.34 14.6a6 6 0 0111.32 0M9.46 17.72a2 2 0 013.08 0"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.5 4.5l-15 15"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}