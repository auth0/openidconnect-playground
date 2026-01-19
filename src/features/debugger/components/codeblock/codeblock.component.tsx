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
};

type CodeBlockProps = {
  [K in keyof CodeBlockMap]: {
    title: string;
    type: K;
  } & CodeBlockMap[K];
}[keyof CodeBlockMap] & {
  HeaderRightComponent?: ComponentType;
};

const formatLineNumber = (num: number) => num.toString().padStart(2, "0");

export const Codeblock = (props: CodeBlockProps) => {
  const { title, type, HeaderRightComponent } = props;
  return (
    <div className={styles.container}>
      <div className={styles.header_container}>
        <div className={styles.title_container}>{title}</div>
        {HeaderRightComponent && <HeaderRightComponent />}
      </div>
      <div className={styles.scroll_container}>
        <div
          className={clsx(
            styles.code_block,
            type === "token" || type === "json" && styles.vertical_scroll_container,
            type === "request" || type === "json" && styles.horizontal_scroll_container,
          )}
        >
          {type === "request" && props.requestData ? (
            <>
              <div className={styles.code_line}>
                <p className={styles.code_line_number}>01</p>
                <p
                  className={styles.param_value}
                  data-editable={props.requestData.isEditable}
                >
                  <span>{`${
                    props.requestData.method ? props.requestData.method : ""
                  } ${props.requestData.url}?`}</span>
                </p>
              </div>
              {props.requestData.params.map((data, idx) => (
                <div key={idx} className={styles.code_line}>
                  <p className={styles.code_line_number}>{`0${idx + 2}`}</p>
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
          {type === "json" ? (
            <pre className={styles.json}>
              {JSON.stringify(props.json, null, 2)
                .split("\n")
                .map((line, index) => (
                  <div key={index} className={styles.code_line}>
                    <p className={styles.code_line_number} >{`${
                      index < 9 ? "0" : ""
                    }${index + 1}`}</p>
                    <p className={clsx(styles.param_value, styles.json_line)}>
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
