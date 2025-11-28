import { Link } from "react-router-dom";
import { GoabText, GoabButton, GoabBlock } from "@abgov/react-components";
import { usePageHeader } from "../contexts/PageHeaderContext";

export function NotFoundPage() {
    usePageHeader("Page not found");

    return (
        <div className="not-found-page">
            <GoabBlock direction="column" alignment="center" gap="l">
                <GoabText tag="h2" size="heading-xl" mt="none" mb="none">
                    404
                </GoabText>
                <GoabText size="body-l" mt="none" mb="none">
                    The page you're looking for doesn't exist or has been moved.
                </GoabText>
                <Link to="/search">
                    <GoabButton type="primary">
                        Go to home
                    </GoabButton>
                </Link>
            </GoabBlock>
        </div>
    );
}
