import { ComponentType } from "react";
import styles from "./codeblock.module.scss";
import clsx from "clsx";

export type RequestData = {
  url: string;
  method?: "POST" | "PUT" | "GET" | "DELETE";
  isEditable?: boolean;
  params: {
    key: string;
    value: string;
    isEditable?: boolean;
  }[];
};

type CodeBlockMap = {
  request: { requestData: RequestData };
  json: { json: string };
  token: { token: string };
  rawJson: { rawJson: string; isError?: boolean };
};

type CodeBlockProps = {
  [K in keyof CodeBlockMap]: {
    title?: string;
    type: K;
  } & CodeBlockMap[K];
}[keyof CodeBlockMap] & {
  HeaderRightComponent?: ComponentType;
};

export const Codeblock = (props: CodeBlockProps) => {
  const { title, type, HeaderRightComponent } = props;
  return (
    <div
      className={clsx(
        styles.container,
        props.type === "rawJson" && props.isError && styles.rawJsonError,
      )}
    >
      {title && (
        <div className={styles.headerContainer}>
          <div className={styles.titleContainer}>{title}</div>
          {HeaderRightComponent && <HeaderRightComponent />}
        </div>
      )}
      <div className={styles.scrollContainer}>
        <div
          className={clsx(
            styles.codeBlock,
            (type === "token" || type === "json" || type === "rawJson") &&
              styles.verticalScrollContainer,
            (type === "request" || type === "json") &&
              styles.horizontalScrollContainer,
          )}
        >
          {type === "request" && props.requestData ? (
            <>
              <div className={styles.codeLine}>
                <p className={styles.codeLineNumber}>01</p>
                <p
                  className={styles.paramValue}
                  data-editable={props.requestData.isEditable}
                >
                  <span>{`${
                    props.requestData.method ? props.requestData.method : ""
                  } ${props.requestData.url}?`}</span>
                </p>
              </div>
              {props.requestData.params.map((data, idx) => (
                <div key={idx} className={styles.codeLine}>
                  <p className={styles.codeLineNumber}>{`0${idx + 2}`}</p>
                  <p
                    className={styles.paramValue}
                    data-editable={data.isEditable ? "true" : "false"}
                  >
                    {`${idx > 0 ? "&" : ""}${data.key}=`}
                    <span>{data.value}</span>
                  </p>
                </div>
              ))}
            </>
          ) : null}
          {type === "token" ? (
            <p className={styles.token}>{props.token}</p>
          ) : null}
          {type === "rawJson" ? (
            <pre className={clsx(styles.json, styles.rawJson)}>
              {props.rawJson}
            </pre>
          ) : null}
          {type === "json" ? (
            <pre className={styles.json}>
              {JSON.stringify(JSON.parse(props.json), null, 2)
                .split("\n")
                .map((line, index) => (
                  <div key={index} className={styles.codeLine}>
                    <p className={styles.codeLineNumber}>{`${
                      index < 9 ? "0" : ""
                    }${index + 1}`}</p>
                    <p className={clsx(styles.paramValue, styles.jsonLine)}>
                      <span>{line}</span>
                    </p>
                  </div>
                ))}
            </pre>
          ) : null}
        </div>
      </div>
    </div>
  );
};
