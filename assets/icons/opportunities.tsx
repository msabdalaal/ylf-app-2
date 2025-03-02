import React from "react";
import { Svg, Path, G, Defs, ClipPath, Rect } from "react-native-svg";
interface OpportunitiesProps {
  color?: string;
}

const Opportunities: React.FC<OpportunitiesProps> = ({ color = "#015CA4" }) => {
  return (
    <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <G clip-path="url(#clip0_210_594)">
        <Path
          d="M23.1726 6.84723H18.6076V4.56473C18.6076 3.29794 17.5919 2.28223 16.3251 2.28223H11.7601C10.4933 2.28223 9.47763 3.29794 9.47763 4.56473V6.84723H4.91263C3.64584 6.84723 2.64154 7.86294 2.64154 9.12973L2.63013 21.6835C2.63013 22.9503 3.64584 23.966 4.91263 23.966H23.1726C24.4394 23.966 25.4551 22.9503 25.4551 21.6835V9.12973C25.4551 7.86294 24.4394 6.84723 23.1726 6.84723ZM16.3251 6.84723H11.7601V4.56473H16.3251V6.84723Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_210_594">
          <Rect
            width="27.39"
            height="27.39"
            fill="white"
            transform="translate(0.347656)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default Opportunities;
