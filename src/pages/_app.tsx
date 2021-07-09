import { wrapper } from '../app/store';
import '../styles/globals.scss';

const MyApp = (props: { Component: any, pageProps: any }) => {
  const { Component, pageProps } = props;
  return <Component {...pageProps} />;
};

export default wrapper.withRedux(MyApp);
