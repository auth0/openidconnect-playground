"use client"
import { ComponentType, useState } from "react";
import styles from "./debugger-steps.module.scss";
import { StepOne, StepTwo, StepThree, StepFour } from "./index";

type Step = {
  id: string;
  label: string;
  component: ComponentType;
};
const stepsList: Step[] = [
  {
    id: "step-one",
    label: "Redirect to OpenID Connect Server",
    component: StepOne,
  },
  {
    id: "step-two",
    label: "Exchange Code for Token",
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
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          {stepsList.map((step, index) => {
            const state =
              index < currentStepIndex
                ? "completed"
                : index === currentStepIndex
                ? "current"
                : "upcoming";
            return (
              <div
                key={step.id}
                className={styles.stepContainer}
                data-state={state}
                aria-current={state === "current" ? "step" : undefined}
                aria-label={`${step.label} ${state}`}
              >
                <div className={styles.stepContent}>
                  {" "}
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <p>{step.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
