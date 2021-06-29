import React from "react";

export const MainContent = props => {
  return (
    <main className="container mx-auto p-3">
      {props.children}
    </main>
  )
}
