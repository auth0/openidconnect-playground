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
import { DebuggerToolbar } from "../toolbar/debugger-toolbar.component";
import {
  ConfigurationModal,
  InitialModalData,
} from "../configuration-modal/configuration-modal.component";

type Steps = {
  id: string;
  label: string;
  render: () => React.JSX.Element;
};

export const DebuggerSteps = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [debuggerStepsData, setDebuggerStepsData] = useState<DebuggerStepsData>(
    InitialDebuggerStepsData,
  );
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const requestDataStepOne = useMemo<RequestData>(() => {
    return {
      url: debuggerStepsData.authEndpoint ?? "",
      isEditable: true,
      params: [
        {
          key: "client_id",
          value: authData?.clientID ?? "",
          isEditable: true,
        },
        {
          key: "redirect_uri",
          value: authData?.redirectURI ?? "",
        },
        {
          key: "scope",
          value: debuggerStepsData.scopes ?? "",
          isEditable: true,
        },
        {
          key: "response_type",
          value: "code",
        },
        {
          key: "state",
          value: authData?.stateToken ?? "",
        },
      ],
    };
  }, [debuggerStepsData, authData]);
  console.log("current index", currentStepIndex);

  const requestDataStepTwo: RequestData = useMemo(() => {
    return {
      url: debuggerStepsData.tokenEndpoint ?? "",
      method: "POST",
      isEditable: false,
      params: [
        {
          key: "grant_type",
          value: "authorization_code",
        },
        {
          key: "client_id",
          value: authData?.clientID ?? "",
          isEditable: true,
        },
        {
          key: "client_secret",
          value: authData?.clientSecret ?? "",
          isEditable: true,
        },
        {
          key: "redirect_uri",
          value: authData?.redirectURI ?? "",
        },
        {
          key: "code",
          value: authData?.authCode ?? "",
        },
      ],
    };
  }, [authData, debuggerStepsData]);

  const requestDataStepThree: RequestData = useMemo(() => {
    return {
      url: "api/validate",
      method: "POST",
      params: [
        {
          key: "clientSecret",
          value: authData?.clientSecret ?? "",
        },
        {
          key: "idToken",
          value: debuggerStepsData?.idToken ?? "",
        },
        {
          key: "tokenKeysEndpoint",
          value: debuggerStepsData?.tokenKeysEndpoint ?? "",
        },
        {
          key: "server",
          value: debuggerStepsData?.server ?? "",
        },
        {
          key: "code",
          value: authData?.authCode ?? ""
        }
      ],
    };
  }, [authData, debuggerStepsData]);

  const stepsList: Steps[] = [
    {
      id: "step-one",
      label: "Redirect to OpenID Connect Server",
      render: () => <StepOne requestData={requestDataStepOne} openModal={() => setIsOpenModal(true)}/>,
    },
    {
      id: "step-two",
      label: "Exchange Code from Token",
      render: () => (
        <StepTwo
          authCode={authData?.authCode ?? ""}
          requestData={requestDataStepTwo}
          setDebuggerStepsData={setDebuggerStepsData}
          setCurrentStepIndex={setCurrentStepIndex}
          restartData={restartData}
        />
      ),
    },
    {
      id: "step-three",
      label: "Verify User Token",
      render: () => (
        <StepThree
          token={debuggerStepsData?.idToken ?? ""}
          requestData={requestDataStepThree}
          setDebuggerStepsData={setDebuggerStepsData}
          setCurrentStepIndex={setCurrentStepIndex}
        />
      ),
    },
    {
      id: "step-four",
      label: "The token is valid!",
      render: () => (
        <StepFour
          decodedToken={debuggerStepsData?.idTokenDecoded ?? ""}
          onRestart={restartData}
          validated={debuggerStepsData?.validated ?? false}
        />
      ),
    },
  ];

  const stepRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const initialModalData: InitialModalData = useMemo(() => {
    return {
      audience: debuggerStepsData.audience,
      authEndpoint: debuggerStepsData.authEndpoint,
      clientId: authData?.clientID,
      clientSecret: authData?.clientSecret,
      domain: debuggerStepsData.domain,
      tokenEndpoint: debuggerStepsData.tokenEndpoint,
      tokenKeysEndpoint: debuggerStepsData.tokenKeysEndpoint,
      scope: debuggerStepsData.scopes,
      serverTemplate: debuggerStepsData.server,
    };
  }, [authData, debuggerStepsData]);

  const restartData = () => {
    const restartDebuggerStepsData: DebuggerStepsData = {
      ...debuggerStepsData,
      currentStep: 0,
      accessToken: null,
      idToken: null,
      idTokenDecoded: null,
      idTokenHeader: null,
      validated: false,
    };
    const restartAuthData: AuthData = {
      ...authData,
      authCode: null,
      stateToken: null,
    };
    localStorage.setItem(
      "app-state",
      JSON.stringify({ ...restartDebuggerStepsData, ...restartAuthData }),
    );
    setAuthData(restartAuthData);
    setDebuggerStepsData(debuggerStepsData);
    setCurrentStepIndex(0);
  };

  const onSaveData = (updatedData: InitialModalData) => {
    const {
      audience,
      authEndpoint,
      clientId,
      clientSecret,
      domain,
      scope,
      serverTemplate,
      tokenEndpoint,
      tokenKeysEndpoint,
    } = updatedData;
    setDebuggerStepsData((prev) => ({
      ...prev,
      audience,
      authEndpoint,
      domain,
      scopes: scope,
      server: serverTemplate,
      tokenEndpoint,
      tokenKeysEndpoint,
    }));
    setAuthData((prev) => ({
      ...prev,
      clientID: clientId,
      clientSecret,
    }));
  };

  useEffect(() => {
    const savedData = localStorage.getItem("app-state");
    const { debuggerSteps, auth } = getAppData(savedData);
    if (debuggerSteps) {
      setDebuggerStepsData(debuggerSteps);
      setCurrentStepIndex(debuggerSteps.currentStep ?? 0);
    }
    if (auth) setAuthData(auth);
    if (!auth) {
      fetch("api/auth_data")
        .then((res) => {
          if (!res.ok) throw new Error(`auth_data responded with ${res.status}`);
          return res.json();
        })
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
            setDebuggerStepsData(prev => ({ ...prev, currentStep: 1 }));
          }
          setAuthData(authDataResponse);
        })
        .catch((error) => {
          console.error("Failed to fetch auth data:", error);
        });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "app-state",
      JSON.stringify({
        ...debuggerStepsData,
        ...(authData ?? {}),
        currentStep: currentStepIndex,
      }),
    );
  }, [debuggerStepsData, authData, currentStepIndex]);

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(
        "app-state",
        JSON.stringify({ ...debuggerStepsData, ...authData }),
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [debuggerStepsData, authData]);

  return (
    <>
      <DebuggerToolbar openModal={() => setIsOpenModal(true)} />
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
                <div key={id} className={styles.step_container}>
                  <div
                    className={styles.step_title_container}
                    data-state={state}
                    aria-current={state === "current" ? "step" : undefined}
                    aria-label={`${label} ${state}`}
                  >
                    <div className={styles.step_title_content}>
                      {" "}
                      <div className={styles.step_number}>{index + 1}</div>
                      <p>{label}</p>
                    </div>
                  </div>

                  <div
                    className={styles.step_content}
                    data-open={state === "current"}
                    inert={state !== "current" ? true : undefined}
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
      <ConfigurationModal
        onClose={() => setIsOpenModal(false)}
        isOpen={isOpenModal}
        initialData={initialModalData}
        key={initialModalData.clientId}
        onSaveData={onSaveData}
      />
    </>
  );
};
