import { Button } from "features/common/components/button/button.component";
import { Codeblock, RequestData } from "../../codeblock/codeblock.component";
import styles from "../debugger-steps.module.scss"

//TODO: replace with actual data coming from local state and api endpoint
const REQUEST_DATA: RequestData = {
  url: "https://samples.auth0.com/oauth/token",
  method: "POST",
  isEditable: false,
  params: [
    {
      key: "grant_type",
      value: "authorization_code",
    },
    {
      key: "client_id",
      value: "testvalue1234456677888",
      isEditable: true,
    },
    {
      key: "client_secret",
      value: "testvalue1234456677888",
      isEditable: true,
    },
    {
      key: "redirect_uri",
      value: "https://openidconnect.net/callback",
    },
    {
      key: "code",
      value: "test123456789",
    },
  ],
};

export const StepTwo = () => {
  return (
    <>
      <Codeblock title="Your Code" type="code" code="asdfasdfasdfsadfsdf" />
      <p className={styles.description}>
        Now, we need to turn that access code into an access token, by having
        our server make a request to your token endpoint
      </p>
      <Codeblock title="Request" type="request" requestData={REQUEST_DATA} />
      <Button label="Start" />
    </>
  );
};
