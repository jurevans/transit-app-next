import '../styles/globals.scss';
import { Provider } from 'react-redux';
import { initializeStore, useStore } from '../app/store';
import { setStations } from '../features/api/stationsApiSlice';
import { setLines } from '../features/api/linesApiSlice';
import App, { AppContext } from 'next/app';

const MyApp = (props: { Component: any, pageProps: any }) => {
  const { Component, pageProps } = props;
  const store = useStore(pageProps.initialReduxState);
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

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

export default MyApp;
