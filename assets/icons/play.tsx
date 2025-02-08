import React from "react";
import { Svg, Path } from "react-native-svg";
interface PlayProps {
  color?: string;
}

const Play: React.FC<PlayProps> = ({ color = "#fff" }) => {
  return (
    <Svg width="18" height="22" viewBox="0 0 18 22" fill="none">
      <Path
        d="M0.356445 21.9773L9.09208 16.5175V5.59795L0.356445 0.138184V21.9773ZM9.09208 16.5175L17.8277 11.0577L9.09208 5.59795V16.5175Z"
        fill={color}
      />
    </Svg>
  );
};

export default Play;
