import React from "react";
import { Svg, Path } from "react-native-svg";
interface PhoneProps {
  color?: string;
}

const Phone: React.FC<PhoneProps> = ({ color = "#369BFF" }) => {
  return (
    <Svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.56462 3.66243C1.83405 3.21632 3.5193 1.19799 4.57865 1.24697C4.89532 1.27321 5.17525 1.46478 5.40269 1.68696C5.92493 2.19693 7.41992 4.12571 7.50477 4.53158C7.71122 5.52702 5.98578 6.41809 6.34881 7.42141C7.27432 9.68608 9.28498 11.6987 11.5506 12.6232C12.5531 12.9863 13.4451 11.2601 14.4406 11.4675C14.8456 11.5523 16.8205 13.2572 17.3305 13.7794C17.5518 14.0059 17.7442 14.2867 17.7705 14.6034C17.8098 15.7187 15.6459 17.2146 15.3099 17.4071C14.5174 17.9739 13.4834 17.9643 12.2229 17.3782C8.7054 15.9148 3.0841 10.3996 1.59349 6.74935C1.02313 5.49586 0.983769 4.45493 1.56462 3.66243Z"
        stroke={color}
        strokeWidth="1.50275"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Phone;
