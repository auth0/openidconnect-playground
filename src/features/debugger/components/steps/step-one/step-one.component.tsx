import { LinkButton } from "features/common/components/button/button.component";
import { Codeblock, RequestData } from "../../codeblock/codeblock.component";
import { getCompleteUrlFromRequestData } from "../utils";

export const StepOne = ({ requestData }: { requestData: RequestData }) => {
  const urlFromRequestData = getCompleteUrlFromRequestData(requestData);

  return (
    <>
      <Codeblock title="Request" type="request" requestData={requestData} />
      <LinkButton label="Start" href={urlFromRequestData} />
    </>
  );
};
