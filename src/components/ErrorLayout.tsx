import { ReactNode } from "react";
import { GoabText, GoabIcon } from "@abgov/react-components";
import { GoabIconType } from "@abgov/ui-components-common";
import "./ErrorPage.css";

interface ErrorLayoutProps {
  icon: GoabIconType;
  label: string;
  heading: string;
  description: string;
  action: ReactNode;
}

export function ErrorLayout({
  icon,
  label,
  heading,
  description,
  action,
}: ErrorLayoutProps) {
  return (
    <div className="error-page">
      <div className="error-page-content">
        <div className="error-page-icon-wrapper">
          <GoabIcon type={icon} size="xlarge" />
        </div>
        <GoabText size="body-m" mt="m" mb="none" color="secondary">
          {label}
        </GoabText>
        <div className="error-page-underline" />
        <GoabText tag="h1" size="heading-l" mt="xl" mb="none">
          {heading}
        </GoabText>
        <div className="error-page-description">
          <GoabText size="body-m" mt="l" mb="none">
            {description}
          </GoabText>
        </div>
        {action}
      </div>
    </div>
  );
}
