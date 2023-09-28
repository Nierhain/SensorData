import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import withTheme from "~/theme";

const MyApp: AppType = ({ Component, pageProps }) => {
  return withTheme(<Component {...pageProps} />);
};

export default api.withTRPC(MyApp);
