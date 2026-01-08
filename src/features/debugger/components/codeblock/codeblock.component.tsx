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
    <div className={styles.container}>
      <div className={styles.title_container}>{title}</div>
      <div className={styles.code_block}>
        {type === "request" && requestData ? (
          <>
            <div className={styles.code_line}>
              <p>01</p>
              <p className={styles.param_value} data-editable={"true"}>
                <span>{`${requestData.url}?`}</span>
              </p>
            </div>
            {requestData.params.map((data, idx) => (
              <div key={idx} className={styles.code_line}>
                <p>{`0${idx + 2}`}</p>
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
      </div>
    </div>
  );
};
