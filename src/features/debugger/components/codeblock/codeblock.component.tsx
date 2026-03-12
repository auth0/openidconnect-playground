import styles from "./codeblock.module.scss";

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
  type: "request" | "json" | "code";
  requestData?: RequestData;
  code?: string;
}

export const Codeblock = (props: CodeBlockProps) => {
  const { title, type, requestData, code } = props;
  return (
    <div className={styles.scrollContainer}>
      <div className={styles.container}>
        <div className={styles.titleContainer}>{title}</div>
        <div className={styles.codeBlock}>
          {type === "request" && requestData ? (
            <>
              <div className={styles.codeLine}>
                <p className={styles.codeLineNumber}>01</p>
                <p className={styles.paramValue} data-editable={"true"}>
                  <span>{`${requestData.method ? requestData.method: ""} ${requestData.url}?`}</span>
                </p>
              </div>
              {requestData.params.map((data, idx) => (
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
          {type === "code" && code ? <p>{code}</p> : null}
        </div>
      </div>
    </div>
  );
};
