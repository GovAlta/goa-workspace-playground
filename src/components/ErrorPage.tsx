import { useNavigate } from "react-router-dom";
import { GoabxButton } from "@abgov/react-components/experimental";
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
        <GoabxButton type="primary" size="compact" onClick={() => navigate(buttonLink)}>
          {buttonText}
        </GoabxButton>
      }
    />
  );
}
