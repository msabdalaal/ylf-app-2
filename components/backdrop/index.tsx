import React from "react";
import { Image } from "react-native";

const Backdrop = () => {
  return (
    <>
      <Image
        source={require("../../assets/images/blue-backdrop.png")}
        className="absolute -bottom-20 -right-20 -z-10"
      />
      <Image
        source={require("../../assets/images/orange-backdrop.png")}
        className="absolute -top-20 -left-20 -z-20"
      />
    </>
  );
};

export default Backdrop;
