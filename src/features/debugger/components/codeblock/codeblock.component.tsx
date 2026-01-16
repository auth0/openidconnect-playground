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

export const Codeblock = (props: CodeBlockProps) => {
  const { title, type, requestData, token } = props;
  return (
    <div className={styles.scroll_container}>
      <div className={styles.container}>
        <div className={styles.title_container}>{title}</div>
        <div className={styles.code_block}>
          {type === "request" && requestData ? (
            <>
              <div className={styles.code_line}>
                <p className={styles.code_line_number}>01</p>
                <p className={styles.param_value} data-editable={requestData.isEditable}>
                  <span>{`${requestData.method ? requestData.method: ""} ${requestData.url}?`}</span>
                </p>
              </div>
              {requestData.params.map((data, idx) => (
                <div key={idx} className={styles.code_line}>
                  <p className={styles.code_line_number}>{`0${idx + 2}`}</p>
                  <p
                    className={styles.param_value}
                    data-editable={data.isEditable ? "true" : "false"}
                  >
                    {`${idx > 0 ? "&" : ""}${data.key}=`}
                    <span>{data.value}</span>
                  </p>
                </div>
              ))}
            </>
          ) : null}
          {type === "token" && token ? <p>{token}</p> : null}
        </div>
      </div>
    </div>
  );
};
