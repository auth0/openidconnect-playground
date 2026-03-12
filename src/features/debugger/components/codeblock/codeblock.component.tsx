import styles from "./codeblock.module.scss";

export type RequestData = {
  url: string;
  params: {
    key: string;
    value: string;
    isEditable?: boolean;
  }[];
};
interface CodeBlockProps {
  title: string;
  type: "request" | "json";
  requestData?: RequestData;
}

export const Codeblock = (props: CodeBlockProps) => {
  const { title, type, requestData } = props;
  return (
    <div className={styles.scrollContainer}>
      <div className={styles.container}>
        <div className={styles.titleContainer}>{title}</div>
        <div className={styles.codeBlock}>
          {type === "request" && requestData ? (
            <>
              <div className={styles.codeLine}>
                <p className={styles.codeLineNumber}>01</p>
                <p className={styles.param_value} data-editable={"true"}>
                  <span>{`${requestData.url}?`}</span>
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
        </div>
      </div>
    </div>
  );
};
