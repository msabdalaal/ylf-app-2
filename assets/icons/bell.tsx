import React from "react";
import { Svg, Path, G } from "react-native-svg";
interface BellProps {
  color?: string;
}

const Bell: React.FC<BellProps> = ({ color = "#085CA3" }) => {
  return (
    <Svg
      fill={color}
      height="20px"
      width="20px"
      id="Layer_1"
      viewBox="0 0 448 512"
    >
      <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
      <G
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></G>
      <G id="SVGRepo_iconCarrier">
        <G>
          <Path d="M222.987,510c31.418,0,57.529-22.646,62.949-52.5H160.038C165.458,487.354,191.569,510,222.987,510z"></Path>
          <Path d="M432.871,352.059c-22.25-22.25-49.884-32.941-49.884-141.059c0-79.394-57.831-145.269-133.663-157.83h-4.141 c4.833-5.322,7.779-12.389,7.779-20.145c0-16.555-13.42-29.975-29.975-29.975s-29.975,13.42-29.975,29.975 c0,7.755,2.946,14.823,7.779,20.145h-4.141C120.818,65.731,62.987,131.606,62.987,211c0,108.118-27.643,118.809-49.893,141.059 C-17.055,382.208,4.312,434,47.035,434H398.93C441.568,434,463.081,382.269,432.871,352.059z"></Path>
        </G>
      </G>
    </Svg>
  );
};

export default Bell;
