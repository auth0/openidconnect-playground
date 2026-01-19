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
interface CodeBlockProps {
  title: string;
  type: "request" | "json" | "token";
  requestData?: RequestData;
  token?: string;
  HeaderRightComponent?: ComponentType;
}

const formatLineNumber = (num: number) => num.toString().padStart(2, "0");

export const Codeblock = (props: CodeBlockProps) => {
  const { title, type, requestData, token, HeaderRightComponent } = props;
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
            type === "token" && styles.vertical_scroll_container,
            type === "request" && styles.horizontal_scroll_container
          )}
        >
          {type === "request" && requestData ? (
            <>
              <div className={styles.code_line}>
                <p className={styles.code_line_number}>01</p>
                <p
                  className={styles.param_value}
                  data-editable={requestData.isEditable}
                >
                  <span>{`${requestData.method ? requestData.method : ""} ${requestData.url}?`}</span>
                </p>
              </div>
              {requestData.params.map((data, idx) => (
                <div key={idx} className={styles.codeLine}>
                  <p className={styles.codeLineNumber}>
                    {formatLineNumber(idx + 2)}
                  </p>
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
          {type === "token" && token ? (
            <p className={styles.token}>{token}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
