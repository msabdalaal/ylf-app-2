import React from "react";
import { Svg, Path, G } from "react-native-svg";
interface DotsProps {
  color?: string;
}

const Search: React.FC<DotsProps> = ({ color = "#085CA3" }) => {
  return (
    <Svg viewBox="0 0 24 24" fill="none" width={22} height={22}>
      <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
      <G
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></G>
      <G id="SVGRepo_iconCarrier">
        <Path
          d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></Path>
      </G>
    </Svg>
  );
};

export default Search;
