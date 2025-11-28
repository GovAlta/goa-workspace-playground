import { ErrorPage } from "../components/ErrorPage";

export function UnauthorizedPage() {
    return (
        <ErrorPage
            icon="warning"
            errorCode="Error 401"
            heading="Restricted access"
            description="We cannot provide access to this page without valid credentials. Please log in or contact support at cs.licensingsupport@gov.ab.ca to request access. We apologize for the inconvenience."
            buttonText="Go to home page"
            buttonLink="/search"
        />
    );
}
