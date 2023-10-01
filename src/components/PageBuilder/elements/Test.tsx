import React from "react";
import { defineFC } from "@/utils/react/fc";

export default defineFC({
  render(props) {
    return (
      <div>{props.name}</div>
    );
  },
  displayName: "Test",
  defaultProps: {
    name: "test"
  }
})