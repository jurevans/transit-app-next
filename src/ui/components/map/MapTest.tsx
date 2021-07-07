import React, {FC, ReactElement, useState, useCallback} from 'react';
import DeckGL, {FlyToInterpolator} from 'deck.gl';
import {StaticMap} from 'react-map-gl';
const { REACT_APP_MAPBOX_ACCESS_TOKEN } = process.env;
type Props = {
  city: string;
  mapStyle: string;
};
const Map: FC<Props> = (props: Props): ReactElement => {
  const initialState = {
    latitude: 37.7751,
    longitude: -122.4193,
    zoom: 11,
    bearing: 0,
    pitch: 0,
    transitionDuration: null,
    transitionInterpolator: null
  };

  const [initialViewState, setInitialViewState] = useState(initialState);

  const goToNYC = () => {
    setInitialViewState({
      longitude: -74.1,
      latitude: 40.7,
      zoom: 14,
      pitch: 0,
      bearing: 0,
      transitionDuration: 8000,
      transitionInterpolator: new FlyToInterpolator()
    })
  };

  return (
    <div>
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        height="85vh"
        width="100%"
      >
        <StaticMap mapboxApiAccessToken={REACT_APP_MAPBOX_ACCESS_TOKEN} />
      </DeckGL>

      <button style={{ position: 'absolute', bottom: 0, left: 0 }} onClick={goToNYC}>New York City</button>
    </div>
  );
}

export default Map;