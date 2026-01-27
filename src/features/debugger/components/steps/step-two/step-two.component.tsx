import { Button } from "features/common/components/button/button.component";
import { Codeblock, RequestData } from "../../codeblock/codeblock.component";
import styles from "../debugger-steps.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import { DebuggerStepsData } from "../utils";

export const StepTwo = ({
  authCode,
  requestData,
  setDebuggerStepsData,
  setCurrentStepIndex,
}: {
  authCode: string;
  requestData: RequestData;
  setDebuggerStepsData: Dispatch<SetStateAction<DebuggerStepsData>>;
  setCurrentStepIndex: Dispatch<SetStateAction<number>>;
}) => {
  const [exchangeResult, setExchangeResult] = useState<string | null>(null);
  const bodyFromRequestData = () => {
    const body = {
      tokenEndpoint: requestData.url,
    };
    requestData.params.forEach((param) => {
      body[`${param.key}`] = param.value;
    });

    return body;
  };
  const handleExchangeCode = () => {
    fetch("api/code_to_token", {
      method: requestData.method,
      body: JSON.stringify(bodyFromRequestData()),
    })
      .then((response) => response.json())
      .then((data) => {
        const result = data.result.response.body;
        const payload = result.id_token.split(".")[0];
        const decodedPayload = atob(payload);
        const idTokenHeader = JSON.parse(decodedPayload).alg;
        setDebuggerStepsData((prev) => {
          return {
            ...prev,
            idToken: result.id_token,
            idTokenHeader,
          };
        });
        const statusString = `'HTTP/1.1 ${data.result.response.statusCode}`;
        const jsonResponseString = `Content-Type: application/json\n${JSON.stringify(result, null, 2)}`;
        setExchangeResult(`${statusString}\n${jsonResponseString}`);
      });
  };

  return (
    <>
      <Codeblock title="Your Code" type="token" token={authCode} />
      <p className={styles.description}>
        Now, we need to turn that access code into an access token, by having
        our server make a request to your token endpoint
      </p>
      <Codeblock title="Request" type="request" requestData={requestData} />
      {!exchangeResult && (
        <Button label="Exchange" onClick={handleExchangeCode} />
      )}
      {exchangeResult && (
        <>
          <Codeblock type="rawJson" rawJson={exchangeResult} />
          <Button label="Next" onClick={() => setCurrentStepIndex(2)} />
        </>
      )}
    </>
  );
};
