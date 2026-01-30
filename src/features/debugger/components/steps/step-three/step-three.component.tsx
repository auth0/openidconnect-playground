import { Button } from "features/common/components/button/button.component";
import { Codeblock, RequestData } from "../../codeblock/codeblock.component";
import styles from "../debugger-steps.module.scss";
import ConfigurationIcon from "features/common/icons/configuration-icon";
import { bodyFromRequestData, DebuggerStepsData } from "../utils";
import { Dispatch, SetStateAction, useState } from "react";

export const StepThree = ({
  requestData,
  token,
  setDebuggerStepsData,
  setCurrentStepIndex,
}: {
  requestData: RequestData;
  token: string;
  setDebuggerStepsData: Dispatch<SetStateAction<DebuggerStepsData>>;
  setCurrentStepIndex: Dispatch<SetStateAction<number>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTokenVerification = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("api/validate", {
        method: requestData.method,
        body: JSON.stringify(bodyFromRequestData(requestData)),
      });
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "There was an error verifying the token. Try again.",
        );
      }
      const data = await response.json();
      setDebuggerStepsData((prev) => {
        return {
          ...prev,
          idTokenDecoded: JSON.stringify(data.decoded, null, " "),
          validated: true,
        };
      });
      setCurrentStepIndex(3);
    } catch (error) {
      setDebuggerStepsData((prev) => {
        return {
          ...prev,
          validated: false,
          error: error.message,
        };
      });
      setCurrentStepIndex(3);
    }
  };

  return (
    <>
      <p className={styles.description} onClick={() => setCurrentStepIndex(3)}>
        Now, we need to verify that the ID Token sent was from the correct place
        by validating the JWT&apos;s signature
      </p>
      <Codeblock
        title="Request"
        type="token"
        token={token}
        HeaderRightComponent={() => <ViewJWTButton token={token} />}
      />

      <p className={styles.description}>
        This token is cryptographically signed with the HS256 algorithm.
        We&apos;ll use the client secret to validate it.
      </p>
      <Button
        label="Verify"
        onClick={handleTokenVerification}
        isLoading={isLoading}
      />
    </>
  );
};

const ViewJWTButton = ({ token }: { token: string }) => {
  return (
    <a href={`https://jwt.io/#token=${token}`} target="_blank" className={styles.buttonContainer}>
      <ConfigurationIcon />
      View on JWT.IO
    </a>
  );
};
