import { ErrorPage } from "../components/ErrorPage";

export function DocumentsPage() {
    return (
        <ErrorPage
            icon="warning"
            errorCode="Error 404"
            heading="The page you are looking for does not exist"
            description="We could not find the page you are looking for. Please check the URL and try again. We apologize for the inconvenience."
            buttonText="Go to home page"
            buttonLink="/search"
        />
    );
}
