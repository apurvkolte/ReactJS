import { Provider } from "react-redux";
// import { store } from "../app/store";
import ScrollToTop from "../components/common/ScrollTop";
import Seo from "../components/common/seo";
import "../index.scss";
import { SessionProvider } from "next-auth/react"

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}
// import { wrapper } from '../redux/store'
import store1 from "../redux/store1";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <SessionProvider>
        <Seo
          font={
            "https://fonts.googleapis.com/css?family=Nunito:400,400i,500,600,700&display=swap"
          }
        />
        <Provider store={store1}>
          <Component {...pageProps} />
        </Provider>
        <ScrollToTop />
      </SessionProvider >
    </>
  );
}

export default MyApp;
