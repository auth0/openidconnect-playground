import { HeroJumbotronComponent } from "features/common/components/hero-jumbotron/hero-jumbotron.component";
import { DebuggerSteps } from "features/debugger/components/steps/debugger-steps.component";

export default function Page() {
 
  return (
    <>
      <HeroJumbotronComponent />
      <DebuggerSteps />
    </>
  );
}
