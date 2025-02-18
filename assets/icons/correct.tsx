import React from "react";
import { Svg, Path } from "react-native-svg";
interface CorrectProps {
  color?: string;
}

const Correct: React.FC<CorrectProps> = ({ color = "#fff" }) => {
  return (
    <Svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <Path
        d="M6.99951 28.3869L21.3924 42.7737L50.1662 14"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Correct;
