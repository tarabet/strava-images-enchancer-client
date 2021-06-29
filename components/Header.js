import React from "react";
import {ModalRegular} from "./ModalRegular";

export const Header = props => {
  return (
    <div className="container mx-auto bg-blue-100 p-3">
      <h1>Header Goes Here</h1>
      <ModalRegular caption="Sign In with existing account" buttonText="Sign In" submitButtonText="Sign In" />
      <ModalRegular caption="Create new account" buttonText="Sign Up" submitButtonText="Sign Up" />
    </div>
  )
}
