import { ErrorPage } from "../components/ErrorPage";

export function ServerErrorPage() {
    return (
        <ErrorPage
            icon="warning"
            errorCode="Error 500"
            heading="We are experiencing a problem"
            description="We are experiencing an issue trying to load this page. Please try again in a few minutes. We apologize for the inconvenience."
            buttonText="Go to home page"
            buttonLink="/search"
        />
    );
}
