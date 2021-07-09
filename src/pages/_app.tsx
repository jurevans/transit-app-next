import { wrapper } from '../app/store';
import '../styles/globals.scss';
/*
import { Provider } from 'react-redux';
import { setStations } from '../features/api/stationsApiSlice';
import { setLines } from '../features/api/linesApiSlice';
import App, { AppContext } from 'next/app';
*/
const MyApp = (props: { Component: any, pageProps: any }) => {
  const { Component, pageProps } = props;
  return <Component {...pageProps} />;
};

/*
MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const reduxStore = initializeStore({});
  const { dispatch } = reduxStore;

  const responseStations = await fetch(`http://localhost:3000/api/stations/nyc`);
  const stations = await responseStations.json();
  dispatch(setStations(stations.features));

  const responseLines = await fetch(`http://localhost:3000/api/lines/nyc`);
  const lines = await responseLines.json();
  dispatch(setLines(lines));

  appProps.pageProps = {
    ...appProps.pageProps,
    initialReduxState: reduxStore.getState(),
  };

  return appProps;
};
*/

export default wrapper.withRedux(MyApp);
