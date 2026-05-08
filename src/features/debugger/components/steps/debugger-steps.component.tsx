"use client";
import { ComponentType, useState } from "react";
import styles from "./debugger-steps.module.scss";
import { StepOne, StepTwo, StepThree, StepFour } from "./index";

type Steps = {
  id: string;
  label: string;
  component: ComponentType;
};
const stepsList: Steps[] = [
  {
    id: "step-one",
    label: "Redirect to OpenID Connect Server",
    component: StepOne,
  },
  {
    id: "step-two",
    label: "Exchange Code from Token",
    component: StepTwo,
  },
  {
    id: "step-three",
    label: "Verify User Token",
    component: StepThree,
  },
  {
    id: "step-four",
    label: "The token is valid!",
    component: StepFour,
  },
];

export const DebuggerSteps = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(2);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          {stepsList.map(({ id, label, component: Component }, index) => {
            const state =
              index < currentStepIndex
                ? "completed"
                : index === currentStepIndex
                ? "current"
                : "upcoming";
            return (
              <div key={id} className={styles.stepContainer}>
                <div
                  className={styles.stepTitleContainer}
                  data-state={state}
                  aria-current={state === "current" ? "step" : undefined}
                  aria-label={`${label} ${state}`}
                >
                  <div className={styles.stepTitleContent}>
                    {" "}
                    <div className={styles.stepNumber}>{index + 1}</div>
                    <p>{label}</p>
                  </div>
                </div>

                <div
                  className={styles.stepContent}
                  data-open={state === "current"}
                  aria-hidden={state !== "current"}
                >
                  <Component />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
