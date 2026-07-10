import { LinkButton } from "features/common/components/button/button.component";
import { Codeblock, RequestData } from "../../codeblock/codeblock.component";
import { getCompleteUrlFromRequestData } from "../utils";

export const StepOne = ({
  requestData,
  openModal,
  authError,
}: {
  requestData: RequestData;
  openModal: () => void;
  authError?: { error: string; error_description: string } | null;
}) => {
  const urlFromRequestData = getCompleteUrlFromRequestData(requestData);

  return (
    <>
      <Codeblock title="Request" type="request" requestData={requestData} onClickHandler={openModal}/>
      {authError && (
        <Codeblock
          type="rawJson"
          isError
          rawJson={`Content-Type: application/json\n${JSON.stringify(authError, null, 2)}`}
        />
      )}
      <LinkButton label="Start" href={urlFromRequestData} />
    </>
  );
};
