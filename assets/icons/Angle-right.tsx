import React from "react";
import { Svg, Path } from "react-native-svg";
interface AngleRightProps {
  color?: string;
}

const AngleRight: React.FC<AngleRightProps> = ({ color = "#747783" }) => {
  return (
    <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <Path
        d="M12.853 18.5231L17.4769 13.8992L12.853 9.27539"
        stroke={color}
        stroke-width="1.73395"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default AngleRight;
