import React from "react";
import { GoabText } from "@abgov/react-components";

interface WidgetProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function Widget({ title, action, children }: WidgetProps) {
  return (
    <div className="dashboard-widget">
      <div className="dashboard-widget__header">
        <GoabText size="heading-xs" mt="none" mb="none">
          {title}
        </GoabText>
        {action}
      </div>
      <div className="dashboard-widget__content">{children}</div>
    </div>
  );
}
