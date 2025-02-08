import React from "react";
import { Svg, Path } from "react-native-svg";
interface AngleLeftProps {
  color?: string;
}

const AngleLeft: React.FC<AngleLeftProps> = ({ color = "#015CA4" }) => {
  return (
    <Svg width="11" height="22" viewBox="0 0 11 22" fill="none">
      <Path
        d="M1 10.6609L9.6987 1.00001"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M1 11L9.6987 20.6609"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default AngleLeft;
