import React from "react";
import { Svg, Path } from "react-native-svg";
interface EmailProps {
  color?: string;
}

const Email: React.FC<EmailProps> = ({ color = "#413DFB" }) => {
  return (
    <Svg width="22" height="18" viewBox="0 0 22 18" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.8579 0.908203H19.0414C20.1586 0.908203 21.0643 1.8139 21.0643 2.93114V15.0688C21.0643 16.186 20.1586 17.0917 19.0414 17.0917H2.8579C1.73517 17.0917 0.834961 16.1814 0.834961 15.0688V2.93114C0.834961 1.80841 1.73517 0.908203 2.8579 0.908203ZM10.9497 7.98853L19.0414 2.93119H2.85792L10.9497 7.98853ZM19.0414 5.32835V15.0688H2.85792V5.32835L10.9497 10.3756L19.0414 5.32835Z"
        fill={color}
      />
    </Svg>
  );
};

export default Email;
