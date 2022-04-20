import React from "react";
import { View } from "react-native";
export default function Collapsible(props) {
  if (!props.collapsed) {
    return <View>{props.children}</View>;
  } else {
    return null;
  }
}
