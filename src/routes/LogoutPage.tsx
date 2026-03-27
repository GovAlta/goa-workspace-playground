import { ErrorPage } from "../components/ErrorPage";

export function LogoutPage() {
  return (
    <ErrorPage
      icon="checkmark-circle"
      heading="You have been signed out"
      description="You have successfully signed out of your account. Thank you for using our services."
      buttonText="Sign in again"
      buttonLink="/"
    />
  );
}
