import { Auth0Banner } from "features/common/components/auth0-banner/auth0-banner.component";
import { HandbookBanner } from "features/common/components/handbook-banner/handbook-banner.component";
import { HeroJumbotronComponent } from "features/common/components/hero-jumbotron/hero-jumbotron.component";
import { IntroductionContent } from "features/common/components/introduction-content/introduction-content.component";

export default function IntroductionPage() {
  return (
    <>
      <HeroJumbotronComponent ctaLabel="Try it now" ctaHref="/" />
      <IntroductionContent />
      <HandbookBanner />
      <Auth0Banner />
    </>
  );
}
