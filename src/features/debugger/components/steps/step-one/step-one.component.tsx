import { Button } from "features/common/components/button/button.component";
import { Codeblock, RequestData } from "../../codeblock/codeblock.component";

//TODO: replace with actual data coming from local state and api endpoint
const REQUEST_DATA: RequestData = {
  url: "https://samples.auth0.com/authorize",
  isEditable: true,
  params: [
    {
      key: "client_id",
      value: "testvalue1234456677888",
      isEditable: true,
    },
    {
      key: "redirect_uri",
      value: "https://openidconnect.net/callback",
    },
    {
      key: "scope",
      value: "openid profile email phone address",
      isEditable: true,
    },
    {
      key: "response_type",
      value: "code"
    },
    {
      key: "state",
      value: "12345678909876543212"
    }
  ],
};

export const StepOne = () => {
  return (
    <>
      <Codeblock title="Request" type="request" requestData={REQUEST_DATA} />
      <Button label="Start" />
    </>
  );
};
