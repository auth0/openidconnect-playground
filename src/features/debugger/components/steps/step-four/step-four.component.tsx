import { Button } from "features/common/components/button/button.component";
import { Codeblock } from "../../codeblock/codeblock.component";
import styles from "./step-four.module.scss"

const JSON_EXAMPLE = `{
 "email": "julian.leiss@auth0.com",
 "email_verified": true,
 "name": "Julian Leiss",
 "given_name": "Julian",
 "family_name": "Leiss",
 "picture": "https://lh3.googleusercontent.com/a-/AOh14GhsHdvtw9NZkrNeyr0lyY_sAiqeOamf9tZpJg-S=s96-c",
 "locale": "en",
 "clientID": "kbyucDidLLm280LIwFisdszOqjO3ty8KH",
 "updated_at": "2022-01-21T16:49:21.591Z",
 "user_id": "google-oauth2|112520938745470371306",
 "nickname": "julian.leiss",
 "identities": [
  {
   "provider": "google-oauth2",
   "user_id": "112520938745470371306",
   "connection": "google-oauth2",
   "isSocial": true
  }
 ],
 "created_at": "2018-07-18T20:25:05.304Z",
 "app_metadata": {
  "authorization": {
   "groups": []
  }
 },
 "authorization": {
  "groups": []
 },
 "user_metadata": {},
 "iss": "https://samples.auth0.com/",
 "sub": "google-oauth2|112538938745470371306",
 "aud": "kbyuFDidLLm2119IwV22iazOqjO3ty8KH",
 "iat": 1642712938,
 "exp": 1142819938
}`;

export const StepFour = () => {
  return (
    <>
      <Codeblock
        title="Decoded Token Payload"
        type="json"
        json={JSON.parse(JSON_EXAMPLE)}
      />
      <div className={styles.buttons_container }>
        <Button label="Start Over" />
        <Button label="Log Out" variant="transparent"/>
      </div>
    </>
  );
};
