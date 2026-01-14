import { Button } from "features/common/components/button/button.component";
import { Codeblock, RequestData } from "../../codeblock/codeblock.component";

const REQUEST_DATA: RequestData = {
  url: "https://samples.auth0.com/authorize",
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
  ],
};

export const StepOne = () => {
  return (
    <>
      <Codeblock title="Request" type="request" requestData={REQUEST_DATA} />
      <Button label="Start"/>
    </>
  );
};
