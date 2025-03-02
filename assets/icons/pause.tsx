import React from "react";
import { Svg, Path, G, Rect } from "react-native-svg";
interface PauseProps {
  color?: string;
}

const Pause: React.FC<PauseProps> = ({ color = "#fff" }) => {
  return (
    <Svg fill={color} id="Layer_1" height={22} viewBox="0 0 365 365">
      <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
      <G
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></G>
      <G id="SVGRepo_iconCarrier">
        <G>
          <Rect x="74.5" width="73" height="365"></Rect>
          <Rect x="217.5" width="73" height="365"></Rect>
        </G>
      </G>
    </Svg>
  );
};

export default Pause;
