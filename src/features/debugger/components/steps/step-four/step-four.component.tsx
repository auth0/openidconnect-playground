import { Button } from "features/common/components/button/button.component";
import { Codeblock } from "../../codeblock/codeblock.component";
import styles from "./step-four.module.scss";
import { ErrorIcon } from "features/common/icons/error.icon";

export const StepFour = ({
  decodedToken,
  onRestart,
  validated,
}: {
  decodedToken: string;
  onRestart: () => void;
  validated: boolean;
}) => {

  return (
    <>
      {validated ? (
        <Codeblock
          title="Decoded Token Payload"
          type="json"
          json={JSON.parse(decodedToken)}
        />
      ) : (
        <div className={styles.errorContainer}>
          <div className={styles.errorContentContainer}>
            <ErrorIcon />
            <p>The token is invalid. Check your parameters and try again</p>
          </div>
        </div>
      )}

      <div className={styles.buttonsContainer}>
        <Button label="Start Over" onClick={onRestart} />
        <Button label="Log Out" variant="transparent"/>
      </div>
    </>
  );
};
