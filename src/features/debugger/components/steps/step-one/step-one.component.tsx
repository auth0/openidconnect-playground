import { LinkButton } from "features/common/components/button/button.component";
import { Codeblock, RequestData } from "../../codeblock/codeblock.component";
import { getCompleteUrlFromRequestData } from "../utils";

export const StepOne = ({ requestData, openModal }: { requestData: RequestData, openModal: () => void }) => {
  const urlFromRequestData = getCompleteUrlFromRequestData(requestData);

  return (
    <>
      <Codeblock title="Request" type="request" requestData={requestData} onClickHandler={openModal}/>
      <LinkButton label="Start" href={urlFromRequestData} />
    </>
  );
};
