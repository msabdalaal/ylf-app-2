import React from "react";
import { Svg, Path } from "react-native-svg";
interface UserIconProps {
  color?: string;
}

const UserIcon: React.FC<UserIconProps> = ({ color = "#FB6F3D" }) => {
  return (
    <Svg width="17" height="19" viewBox="0 0 17 19" fill="none">
      <Path
        d="M15.1743 17.3296V15.403C15.1743 14.3811 14.8089 13.401 14.1586 12.6784C13.5082 11.9558 12.6261 11.5498 11.7064 11.5498H4.77062C3.85088 11.5498 2.96881 11.9558 2.31846 12.6784C1.6681 13.401 1.30273 14.3811 1.30273 15.403V17.3296"
        stroke={color}
        strokeWidth="1.84954"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.2384 8.08226C10.1537 8.08226 11.7063 6.52964 11.7063 4.61437C11.7063 2.69911 10.1537 1.14648 8.2384 1.14648C6.32313 1.14648 4.77051 2.69911 4.77051 4.61437C4.77051 6.52964 6.32313 8.08226 8.2384 8.08226Z"
        stroke={color}
        strokeWidth="1.84954"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default UserIcon;
