import { Button } from "features/common/components/button/button.component";
import { Codeblock, RequestData } from "../../codeblock/codeblock.component";
import styles from "../debugger-steps.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import { bodyFromRequestData, DebuggerStepsData } from "../utils";

export const StepTwo = ({
  authCode,
  requestData,
  setDebuggerStepsData,
  setCurrentStepIndex,
  restartData,
}: {
  authCode: string;
  requestData: RequestData;
  setDebuggerStepsData: Dispatch<SetStateAction<DebuggerStepsData>>;
  setCurrentStepIndex: Dispatch<SetStateAction<number>>;
  restartData: () => void;
}) => {
  const [exchangeResult, setExchangeResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleExchangeCode = async () => {
    try {
      const response = await fetch("api/code_to_token", {
        method: requestData.method,
        body: JSON.stringify(bodyFromRequestData(requestData)),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "The exchange could not be performed",
        );
      }
      const data = await response.json();
      const result = data.result.response.body;
      const header = result.id_token.split(".")[0];
      const decodedHeader = atob(header);
      const idTokenHeader = JSON.parse(decodedHeader).alg;
      setDebuggerStepsData((prev) => {
        return {
          ...prev,
          idToken: result.id_token,
          idTokenHeader,
        };
      });
      const statusString = `HTTP/1.1 ${data.result.response.statusCode}`;
      const jsonResponseString = `Content-Type: application/json\n${JSON.stringify(result, null, 2)}`;
      setExchangeResult(`${statusString}\n${jsonResponseString}`);
    } catch (error: unknown) {
      const statusString = `HTTP/1.1 500`;
      const message =
        error instanceof Error
          ? error.message
          : "Error in exchange, please try again";
      const [errorTitle, errorDescription] = message.split(":");
      const errorObject = {
        error: errorTitle ? errorTitle : "Error",
        error_description: errorDescription
          ? errorDescription
          : "Error in exchange, please try again",
      };
      const jsonErrorString = `Content-Type: application/json\n${JSON.stringify(errorObject, null, 2)}`;
      setErrorMessage(`${statusString}\n${jsonErrorString}`);
    }
  };

  return (
    <>
      <Codeblock title="Your Code" type="token" token={authCode} />
      <p className={styles.description}>
        Now, we need to turn that access code into an access token, by having
        our server make a request to your token endpoint
      </p>
      <Codeblock title="Request" type="request" requestData={requestData} />
      {!exchangeResult && !errorMessage && (
        <Button label="Exchange" onClick={handleExchangeCode} />
      )}
      {exchangeResult && (
        <>
          <Codeblock type="rawJson" rawJson={exchangeResult} />
          <Button label="Next" onClick={() => setCurrentStepIndex(2)} />
        </>
      )}
      {errorMessage && (
        <>
          <Codeblock type="rawJson" rawJson={errorMessage} isError />
          <Button label="Restart" onClick={restartData} />
        </>
      )}
    </>
  );
};
