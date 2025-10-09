import React from "react";
import { GoabText, GoabPageBlock } from "@abgov/react-components";

export function AccountPage() {
  return (
    <GoabPageBlock width="content">
      <GoabText tag="h1" size="heading-l" mb="l">
        Account Management
      </GoabText>
      <GoabText size="body-m">
        Account management page content goes here.
      </GoabText>
    </GoabPageBlock>
  );
}
