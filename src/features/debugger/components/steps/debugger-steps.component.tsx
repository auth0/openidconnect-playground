/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./debugger-steps.module.scss";
import { StepOne, StepTwo, StepThree, StepFour } from "./index";
import {
  AuthData,
  DebuggerStepsData,
  getAppData,
  InitialDebuggerStepsData,
} from "./utils";
import { RequestData } from "../codeblock/codeblock.component";

type Steps = {
  id: string;
  label: string;
  render: () => React.JSX.Element;
};

export const DebuggerSteps = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [debuggerStepsData, setDebuggerStepsData] = useState<DebuggerStepsData>(
    InitialDebuggerStepsData,
  );
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const requestData = useMemo<RequestData>(() => {
    return {
      url: debuggerStepsData.authEndpoint,
      isEditable: true,
      params: [
        {
          key: "client_id",
          value: authData?.clientID,
          isEditable: true,
        },
        {
          key: "redirect_uri",
          value: authData?.redirectURI,
        },
        {
          key: "scope",
          value: debuggerStepsData.scopes,
          isEditable: true,
        },
        {
          key: "response_type",
          value: "code",
        },
        {
          key: "state",
          value: authData?.stateToken,
        },
      ],
    };
  }, [debuggerStepsData, authData]);

  const stepsList: Steps[] = [
    {
      id: "step-one",
      label: "Redirect to OpenID Connect Server",
      render: () => <StepOne requestData={requestData} />,
    },
    {
      id: "step-two",
      label: "Exchange Code from Token",
      render: () => <StepTwo />,
    },
    {
      id: "step-three",
      label: "Verify User Token",
      render: () => <StepThree />,
    },
    {
      id: "step-four",
      label: "The token is valid!",
      render: () => <StepFour />,
    },
  ];

  const stepRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const savedData = localStorage.getItem("app-state");
    const { debuggerSteps, auth } = getAppData(savedData);
    if (debuggerSteps) {
      setDebuggerStepsData(debuggerSteps);
      setCurrentStepIndex(debuggerSteps.currentStep)
    }
    if (auth) setAuthData(auth);
    if (!auth) {
      fetch("api/auth_data")
        .then((res) => res.json())
        .then((data) => {
          const authDataResponse: AuthData = {
            clientID: data.clientId,
            clientSecret: data.clientSecret,
            stateToken: data.state,
            redirectURI: data.redirect_uri,
            authCode: data.code,
          };
          if (authDataResponse.authCode) {
            setCurrentStepIndex(1);
            debuggerSteps.currentStep = 1;
          }
          setAuthData(authDataResponse);
          localStorage.setItem(
            "app-state",
            JSON.stringify({ ...debuggerSteps, ...authDataResponse }),
          );
        });
    }
  }, []);

  useEffect(() => {
    if (currentStepIndex === 0) return;
    const ref = stepRefs.current[currentStepIndex];
    if (!ref) return;
    const yOffset = ref.getBoundingClientRect().top + window.scrollY - 170;
    window.scrollTo({
      behavior: "smooth",
      top: yOffset,
    });
  }, [currentStepIndex]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          {stepsList.map(({ id, label, render }, index) => {
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
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                >
                  {render()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
