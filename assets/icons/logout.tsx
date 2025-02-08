import React from "react";
import { Svg, Path } from "react-native-svg";
interface LogoutProps {
  color?: string;
}

const Logout: React.FC<LogoutProps> = ({ color = "#FB4A59" }) => {
  return (
    <Svg width="18" height="19" viewBox="0 0 18 19" fill="none">
      <Path
        d="M11.7112 5.84639V5.03022C11.7112 3.25003 10.3085 1.80664 8.57862 1.80664H4.43445C2.70538 1.80664 1.30273 3.25003 1.30273 5.03022V14.7666C1.30273 16.5467 2.70538 17.9901 4.43445 17.9901H8.58712C10.3119 17.9901 11.7112 16.5511 11.7112 14.7762V13.9513"
        stroke={color}
        stroke-width="1.73395"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M16.3301 9.89833H6.09424"
        stroke={color}
        stroke-width="1.73395"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M13.8411 7.34766L16.3301 9.89765L13.8411 12.4485"
        stroke={color}
        stroke-width="1.73395"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default Logout;
