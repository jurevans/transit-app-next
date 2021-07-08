import {
  FC,
  ProviderExoticComponent,
  ProviderProps,
  ReactElement,
  useRef,
  useState,
} from 'react';
import DeckGL, { FlyToInterpolator } from 'deck.gl';
import MapGL, {
  _MapContext as MapContext,
  NavigationControl,
  GeolocateControl,
  FullscreenControl,
} from 'react-map-gl';
import MapTooltip from './MapTooltip';
import MapPopup from './MapPopup';
import SelectMapStyle from './SelectMapStyle';
import StationDetails from './StationDetails';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { openPopup, closePopup } from '../../../features/map/mapPopupSlice';
import { updatedMapStyle } from '../../../features/mapStyle/mapStyleSlice';
import { updatedStationDetails } from '../../../features/map/mapStationDetails';

import {
  getInRange,
  getDurationForTransition,
  getZoomForTransition,
  getKeyValue,
} from '../../../helpers/functions';
import settings from '../../../settings';
import {
  getStationData,
  getLineLayer,
  getScatterplotLayer,
  getTextLayer,
  isLinePicker,
  getTooltipObjectLine,
  getTooltipObjectPlot,
  StationsGeoData,
} from '../../../helpers/map';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from '../../../styles/components/map/Map.module.scss';

const { mapboxAccessToken } = process.env;
const { cities, mapStyles } = settings;

type Props = {
  city: string;
  mapStyle: any;
  stations: StationsGeoData;
  lines: any;
};

const Map: FC<Props> = (props: { city: string, mapStyle: any, stations: StationsGeoData, lines: any }): ReactElement => {
  const { city, mapStyle, stations, lines } = props;

  const dispatch = useAppDispatch();
  const popupData = useAppSelector(state => state.mapPopup.data);
  const isPopupOpen = useAppSelector(state => state.mapPopup.isOpen);
  const stationDetailsData = useAppSelector(state => state.mapStationDetails.data);
  const isStationDetailsOpen = useAppSelector(state => state.mapStationDetails.isOpen);
  const range = useAppSelector(state => state.city.range);

  type ViewState = {
    viewState: {
      minZoom: number;
      maxZoom: number;
      bearing: number;
      pitch: number;
      zoom: number;
      longitude: number;
      latitude: number;
    };
    layers: any[];
  };

  const cityConfig = cities.find(config => config.id === city) || cities[0];
  const initialViewState: ViewState = { 
    viewState: { ...cityConfig.settings.initialView },
    layers: [
      getLineLayer(city, lines),
      getScatterplotLayer(city, getStationData(stations)),
    ],
  };

  const [viewState, setViewState] = useState(initialViewState);
  const [tooltipData, updateTooltip] = useState(null);

  const handleHover = (data: any) => {
    let updates: any = {};

    if (data.object && !isPopupOpen) {
      if (isLinePicker(data)) {
        updates = getTooltipObjectLine(data);
      } else {
        updates = getTooltipObjectPlot(data);
      }
      updateTooltip(updates);
    } else {
      updateTooltip(null);
    }
  };

  const deckRef = useRef<DeckGL>(null);

  const goToPopup = (data: any) => {
    const duration = getDurationForTransition({
      minDuration: 375,
      startLon: viewState.viewState.longitude,
      endLon: data.coordinates[0],
      startLat: viewState.viewState.latitude,
      endLat: data.coordinates[1],
    });

    // Zoom in a little if need be
    const oldZoom = viewState.viewState.zoom;
    const zoom = getZoomForTransition(oldZoom, 14);

    const newViewState = {
      ...viewState,
      viewState: {
        ...viewState.viewState,
        zoom,
        longitude: data.coordinates[0],
        latitude: data.coordinates[1],
        transitionDuration: duration,
        transitionInterpolator: new FlyToInterpolator(),
      },
    };

    setViewState(newViewState);
    setTimeout(() => {
      dispatch(openPopup(data));
      dispatch(updatedStationDetails(data));
    }, duration - 100);

    updateTooltip(null);
  };

  const handleClick = (e: React.MouseEvent<any>) => {
    /* TODO: Do nothing if view is being dragged! */
    const pickInfo = deckRef.current?.pickObject({
      x: e.clientX,
      y: e.clientY,
      radius: 10,
      layerIds: ['stations-scatterplot-layer', 'station-text-layer'],
    });

    if (pickInfo) {
      // Close any existing popup first
      if (isPopupOpen) {
        dispatch(closePopup());
      }
      goToPopup(pickInfo.object);
    }
  };

  const handleViewStateChange = (data: any) => {
    const layers = [...viewState.layers];
    const textLayerId = 'station-text-layer';
    // Determine if the TextLayer be added
    if (data.interactionState
        && (data.interactionState.isZooming || data.interactionState.inTransition)) {
      if (data.viewState.zoom >= 14) {
        if (!layers.some(layer => layer.id === textLayerId)) {
          layers.push(getTextLayer(getStationData(stations), mapStyle.label));
        }
      } else {
        if (layers.some(layer => layer.id === textLayerId)) {
          const index = layers.map(layer => layer.id).indexOf(textLayerId);
          layers.splice(index, 1);
        }
      }
    }

    const updatedState = {
      ...viewState,
      layers,
      viewState: {
        ...data.viewState,
        longitude: getInRange(data.viewState.longitude, range.longitudeRange),
        latitude: getInRange(data.viewState.latitude, range.latitudeRange),
      },
    };

    setViewState(updatedState);
  };

  const handleStyleUpdate = (e: React.ChangeEvent<any>) => {
    // Find mapStyle:
    const mapStyle = mapStyles.find(style => style.value === e.target.value) || mapStyles[0];
    dispatch(updatedMapStyle(mapStyle));

    // Update TextLayer style:
    const layers = [...viewState.layers];
    const textLayerId = 'station-text-layer';
    if (layers.some(layer => layer.id === textLayerId)) {
      const index = layers.map(layer => layer.id).indexOf(textLayerId);
      layers.splice(index, 1);
      layers.push(getTextLayer(getStationData(stations), mapStyle.label));
      setViewState({
        ...viewState,
        layers,
      });
    }
  };

  return (
    <div className={styles.map} onClick={handleClick} onContextMenu={event => event.preventDefault()}>
      <DeckGL
        id="deck"
        ref={deckRef}
        viewState={viewState.viewState}
        onViewStateChange={handleViewStateChange}
        layers={viewState.layers}
        controller={true}
        ContextProvider={MapContext.Provider as ProviderExoticComponent<ProviderProps<any>>}
        onHover={(d: any) => handleHover(d)}
      >
        <MapGL
          mapStyle={mapStyle.value}
          mapboxApiAccessToken={mapboxAccessToken}
        />
        {isPopupOpen && <MapPopup city={city} data={popupData} />}
        {isStationDetailsOpen && <StationDetails city={city} data={stationDetailsData} />}
        <SelectMapStyle mapStyle={mapStyle} onChange={handleStyleUpdate} />
        <NavigationControl style={{ right: 10,top: 10 }} />
        <GeolocateControl style={{ right: 10, top: 110 }} />
        <FullscreenControl style={{ right: 10, bottom: 10 }} />
      </DeckGL>
      {tooltipData && <MapTooltip city={city} data={tooltipData} />}
    </div>
  );
};

export default Map;
