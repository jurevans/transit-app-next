import {
  FC,
  ProviderExoticComponent,
  ProviderProps,
  ReactElement,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import DeckGL, { FlyToInterpolator, MapView } from 'deck.gl';
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
import { openPopup, closePopup } from '../../../features/ui/mapPopupSlice';
import { updatedMapStyle } from '../../../features/ui/mapStyleSlice';
import { updatedStationDetails } from '../../../features/ui/mapStationDetails';
import {
  getInRange,
  getDurationForTransition,
  getZoomForTransition,
  getKeyValueFromArray,
} from '../../../helpers/functions';
import settings from '../../../settings';
import {
  getGeoJsonLayer,
  getScatterplotLayer,
  getTextLayer,
  isPlotPicker,
  getTooltipObject,
  FeatureCollection,
  PlotData,
} from '../../../helpers/map';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from '../../../styles/components/map/Map.module.scss';
import mapDefaults from '../../../../config/map.config';

const { mapBoxAccessToken } = process.env;
const {  mapStyles } = settings;

type Props = {
  stations: PlotData[],
  lines: FeatureCollection;
  location: any;
};

const Map: FC<Props> = (props: Props): ReactElement => {
  const { stations, lines, location } = props;
  const { longitude, latitude } = location;
  const dispatch = useAppDispatch();
  const { data: popupData, isOpen: isPopupOpen } = useAppSelector(state => state.ui.mapPopup);
  const { data: stationDetailsData, isOpen: isStationDetailsOpen } = useAppSelector(state => state.ui.stationDetails);
  const deckRef = useRef<DeckGL>(null);
  const [tooltipData, updateTooltip] = useState(null);
  const { style: mapStyle } = useAppSelector(state => state.ui.mapStyle);

  // Define the range constraints for which the user can drag the map:
  const range = {
    longitudeRange: [
      longitude - mapDefaults.range.lonMinOffset,
      longitude + mapDefaults.range.lonMaxOffset,
    ],
    latitudeRange: [
      latitude - mapDefaults.range.latMinOffset, 
      latitude + mapDefaults.range.latMaxOffset,
    ],
  };

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

  const initialViewState: ViewState = useMemo(() => ({
    viewState: {
      ...mapDefaults.initialView,
      longitude,
      latitude,
    },
    layers: [
      // TODO: When determining path-layer IDs, add these to global state to
      // be referenced later, e.g., if we want to filter/alter any:
      getGeoJsonLayer(lines),
      getScatterplotLayer(stations),
    ],
  }), [lines, stations]);

  const [mapViewState, setViewState] = useState(initialViewState);

  const goToPopup = (data: any) => {
    const duration = getDurationForTransition({
      minDuration: 375,
      startLon: mapViewState.viewState.longitude,
      endLon: data.coordinates[0],
      startLat: mapViewState.viewState.latitude,
      endLat: data.coordinates[1],
    });

    // Zoom in a little if need be
    const oldZoom = mapViewState.viewState.zoom;
    const zoom = getZoomForTransition(oldZoom, 14);

    const newViewState = {
      ...mapViewState,
      viewState: {
        ...mapViewState.viewState,
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

  const handleHover = (data: any) => {
    let updates: any = {};
    if (data.object && !isPopupOpen) {
      if (isPlotPicker(data)) {
        updates = getTooltipObject(data, true);
      } else {
        updates = getTooltipObject(data);
      }
      updateTooltip(updates);
    } else {
      updateTooltip(null);
    }
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

  const handleViewStateChange = useCallback((data: any) => {
    const layers = [...mapViewState.layers];
    const textLayerId = 'station-text-layer';
    // Determine if the TextLayer should be added
    if (data.interactionState
        && (data.interactionState.isZooming || data.interactionState.inTransition)) {
      if (data.viewState.zoom >= 14) {
        if (!layers.some(layer => layer.id === textLayerId)) {
          layers.push(getTextLayer(stations, mapStyle.label));
        }
      } else {
        if (layers.some(layer => layer.id === textLayerId)) {
          const index = layers.map(layer => layer.id).indexOf(textLayerId);
          layers.splice(index, 1);
        }
      }
    }

    const updatedState = {
      ...mapViewState,
      layers,
      viewState: {
        ...data.viewState,
        longitude: getInRange(data.viewState.longitude, range.longitudeRange),
        latitude: getInRange(data.viewState.latitude, range.latitudeRange),
      },
    };

    setViewState(updatedState);
  }, [mapViewState, mapStyle]);

  const handleStyleUpdate = (e: React.ChangeEvent<any>) => {
    // Find mapStyle:
    const mapStyle = getKeyValueFromArray('value', e.target.value, mapStyles);
    dispatch(updatedMapStyle(mapStyle));

    // Update TextLayer style:
    const layers = [...mapViewState.layers];
    const textLayerId = 'station-text-layer';
    if (layers.some(layer => layer.id === textLayerId)) {
      const index = layers.map(layer => layer.id).indexOf(textLayerId);
      layers.splice(index, 1);
      layers.push(getTextLayer(stations, mapStyle.label));
      setViewState({
        ...mapViewState,
        layers,
      });
    }
  };

  return (
    <div className={styles.map} onClick={handleClick} onContextMenu={event => event.preventDefault()}>
      <DeckGL
        id="deck"
        ref={deckRef}
        viewState={mapViewState.viewState}
        onViewStateChange={handleViewStateChange}
        layers={mapViewState.layers}
        ContextProvider={MapContext.Provider as ProviderExoticComponent<ProviderProps<any>>}
        onHover={(d: any) => handleHover(d)}
        views={[
          new MapView({
            id: 'base-map',
            controller: true,
            inertia: true,
            doubleClickZoom: false,
          }),
        ]}
      >
        <MapGL
          mapStyle={mapStyle.value}
          mapboxApiAccessToken={mapBoxAccessToken}
        />
        {isPopupOpen && <MapPopup data={popupData} />}
        <SelectMapStyle mapStyle={mapStyle} onChange={handleStyleUpdate} />
        <NavigationControl style={{ right: 10,top: 10 }} captureClick={true} capturePointerMove={true} />
        <GeolocateControl style={{ right: 10, top: 110 }} captureClick={true} capturePointerMove={true} />
        <FullscreenControl style={{ right: 10, bottom: 10 }} captureClick={true} capturePointerMove={true} />
      </DeckGL>
      {isStationDetailsOpen && <StationDetails data={stationDetailsData} />}
      {tooltipData && <MapTooltip data={tooltipData} />}
    </div>
  );
};

export default Map;
