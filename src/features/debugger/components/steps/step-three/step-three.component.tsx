import { Button } from "features/common/components/button/button.component";
import { Codeblock } from "../../codeblock/codeblock.component";
import styles from "../debugger-steps.module.scss";
const REALLY_LONG_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1bGlhbi5sZWlzc0BhdXRoMC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6Ikp1bGlhbiBMZWlzcyIsImdpdmVuX25hbWUiOiJKdWxpYW4iLCJmYW1pbHlfbmFtZSI6IkxlaXNzIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdoc0hkdnR3OU5aa3JOZXlyMGx5WV9zQWlxZU9hbWY5dFpwSmctUz1zOTYtYyIsImxvY2FsZSI6ImVuIiwiY2xpZW50SUQiOiJrYnl1RkRpZExMbTI4MExJd1ZGaWF6T3FqTzN0eThLSCIsInVwZGF0ZWRfYXQiOiIyMDIyLTAxLTIxVDE2OjQ5OjIxLjU5MVoiLCJ1c2VyX2lkIjoiZ29vZ2xlLW9hdXRoMnwxMTI1MjA5Mzg3NDU0NzAzNzEzMDYiLCJuaWNrbmFtZSI6Imp1bGlhbi5sZWlzcyIsImlkZW50aXRpZXMiOlt7InByb3ZpZGVyIjoiZ29vZ2xlLW9hdXRoMiIsInVzZXJfaWQiOiIxMTI1MjA5Mzg3NDU0NzAzNzEzMDYiLCJjb25uZWN0aW9uIjoiZ29vZ2xlLW9hdXRoMiIsImlzU29jaWFsIjp0cnVlfV0sImNyZWF0ZWRfYXQiOiIyMDE4LTA3LTE4VDIwOjI1OjA1LjMwNFoiLCJhcHBfbWV0YWRhdGEiOnsiYXV0aG9yaXphdGlvbiI6eyJncm91cHMiOltdfX0sImF1dGhvcml6YXRpb24iOnsiZ3JvdXBzIjpbXX0sInVzZXJfbWV0YWRhdGEiOnt9LCJpc3MiOiJodHRwczovL3NhbXBsZXMuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTEyNTIwOTM4NzQ1NDcwMzcxMzA2IiwiYXVkIjoia2J5dUZEaWRMTG0yODBMSXdWRmlhek9xak8zdHk4S0giLCJpYXQiOjE2NDI3ODM5MzgsImV4cCI6MTY0MjgxOTkzOH0.h1RMacau6moieoJB1TG_Ecewk1acYxuPo3bsMYqC0r4";

export const StepThree = () => {
  return (
    <>
      <p className={styles.description}>
        Now, we need to verify that the ID Token sent was from the correct place
        by validating the JWT&apos;s signature
      </p>
      <Codeblock title="Request" type="token" token={REALLY_LONG_TOKEN} />

      <p className={styles.description}>
        This token is cryptographically signed with the HS256 algorithim. We&apos;ll
        use the client secret to validate it.
      </p>
      <Button label="Verify"/>
    </>
  );
};
