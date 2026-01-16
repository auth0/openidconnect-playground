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
  type: "request" | "json" | "token";
  requestData?: RequestData;
  token?: string;
}

const formatLineNumber = (num: number) => num.toString().padStart(2, "0");

export const Codeblock = (props: CodeBlockProps) => {
  const { title, type, requestData, token } = props;
  return (
    <div className={styles.scrollContainer}>
      <div className={styles.container}>
        <div className={styles.titleContainer}>{title}</div>
        <div className={styles.codeBlock}>
          {type === "request" && requestData ? (
            <>
              <div className={styles.codeLine}>
                <p className={styles.codeLineNumber}>{formatLineNumber(1)}</p>
                <p className={styles.paramValue} data-editable={"true"}>
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
          {type === "token" && token ? <p className={styles.token}>{token}</p> : null}
        </div>
      </div>
    </div>
  );
};
