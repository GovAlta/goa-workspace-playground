import React from "react";
import { GoabText, GoabPageBlock } from "@abgov/react-components";

export function SettingsPage() {
  return (
    <GoabPageBlock width="content">
      <GoabText tag="h1" size="heading-l" mb="l">
        Settings
      </GoabText>
      <GoabText size="body-m">
        Settings page content goes here.
      </GoabText>
    </GoabPageBlock>
  );
}
