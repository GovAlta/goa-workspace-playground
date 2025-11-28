import { Link } from "react-router-dom";
import { GoabText, GoabButton, GoabIcon } from "@abgov/react-components";
import { GoabIconType } from "@abgov/ui-components-common";
import { usePageHeader } from "../contexts/PageHeaderContext";

interface ErrorPageProps {
    icon: GoabIconType;
    errorCode: string;
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
    usePageHeader("");

    return (
        <div className="error-page">
            <div className="error-page-content">
                {/* Icon with circular background */}
                <div className="error-page-icon-wrapper">
                    <GoabIcon type={icon} size="xlarge" />
                </div>

                {/* Error label */}
                <GoabText size="body-m" mt="m" mb="none" color="secondary">
                    {errorCode}
                </GoabText>

                {/* Blue underline */}
                <div className="error-page-underline" />

                {/* Main heading */}
                <GoabText tag="h1" size="heading-l" mt="xl" mb="none">
                    {heading}
                </GoabText>

                {/* Description */}
                <GoabText size="body-m" mt="l" mb="xl" style={{ maxWidth: '500px', textAlign: 'center' }}>
                    {description}
                </GoabText>

                {/* Action button */}
                <Link to={buttonLink}>
                    <GoabButton type="primary" size="compact">
                        {buttonText}
                    </GoabButton>
                </Link>
            </div>
        </div>
    );
}
