import LogoImage from "../assets/logo/logo.png";
import LoginFounderImage from "../assets/images/login_founder.jpg";
import LoginInvestorImage from "../assets/images/login_investor.jpg";
import CreateStartupProfileBackgroundImage from "../assets/images/create_startup_background.jpg";
import LandingPageBAckgroundImage from "../assets/images/landing_page_background.jpg";

export const ImageMap: { [key: string]: string } = {
  logo: LogoImage,
  login_founder: LoginFounderImage,
  login_investor: LoginInvestorImage,
  create_startup_profile_background: CreateStartupProfileBackgroundImage,
  investor_browse_background: LoginInvestorImage,
  landing_background_image: LandingPageBAckgroundImage,
};
export const getImage = (key: string): string => {
  return ImageMap[key] || LogoImage;
};
