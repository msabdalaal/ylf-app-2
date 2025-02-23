import React from "react";
import { Svg, Path } from "react-native-svg";
interface CalendarProps {
  color?: string;
}

const Calendar: React.FC<CalendarProps> = ({ color = "#6B6E82" }) => {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path
        d="M4.16667 18.3337H15.8333C16.7525 18.3337 17.5 17.5862 17.5 16.667V5.00033C17.5 4.08116 16.7525 3.33366 15.8333 3.33366H14.1667V1.66699H12.5V3.33366H7.5V1.66699H5.83333V3.33366H4.16667C3.2475 3.33366 2.5 4.08116 2.5 5.00033V16.667C2.5 17.5862 3.2475 18.3337 4.16667 18.3337ZM4.16667 5.83366H15.8333V7.50033H4.16667V5.83366Z"
        fill={color}
      />
    </Svg>
  );
};

export default Calendar;
