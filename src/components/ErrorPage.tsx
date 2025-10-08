import { useNavigate } from "react-router-dom";
import { GoabButton } from "@abgov/react-components";
import { GoabIconType } from "@abgov/ui-components-common";
import { ErrorLayout } from "./ErrorLayout";

interface ErrorPageProps {
  icon: GoabIconType;
  errorCode?: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export function ErrorPage({
  icon,
  errorCode,
  heading,
  description,
  buttonText,
  buttonLink,
}: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <ErrorLayout
      icon={icon}
      label={errorCode}
      heading={heading}
      description={description}
      action={
        <GoabButton type="primary" size="compact" onClick={() => navigate(buttonLink)}>
          {buttonText}
        </GoabButton>
      }
    />
  );
}
