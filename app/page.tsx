import { HeroJumbotronComponent } from "features/common/components/hero-jumbotron/hero-jumbotron.component";
import { DebuggerSteps } from "features/debugger/components/steps/debugger-steps.component";
import { DebuggerToolbar } from "features/debugger/components/toolbar/debugger-toolbar.component";

export default function Page() {
  return (
    <>
      <HeroJumbotronComponent />
      <DebuggerToolbar />
      <DebuggerSteps />
    </>
  );
}
