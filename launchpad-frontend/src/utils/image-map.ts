import LogoImage from "../assets/logo/logo.png";
import LoginFounderImage from "../assets/images/login_founder.jpg";
import LoginInvestorImage from "../assets/images/login_investor.jpg";

export const ImageMap: { [key: string]: string } = {
  logo: LogoImage,
  login_founder: LoginFounderImage,
  login_investor: LoginInvestorImage,
};
export const getImage = (key: string): string => {
  return ImageMap[key] || LogoImage;
};
