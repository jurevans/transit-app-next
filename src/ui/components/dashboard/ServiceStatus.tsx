import { FC, ReactElement, useEffect } from 'react';
import Image from 'next/image';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchServiceStatus } from '../../../features/realtime/statusSlice';
import { getIconPath } from '../../../helpers/map';

type Props = {
  status: any;
};

const ServiceStatus: FC<Props> = (props: Props): ReactElement => {
  const { status } = props;
  const dispatch = useAppDispatch();
  const { agencyId } = useAppSelector(state => state.gtfs.agency);
  // Re-fetch status data every minute
  useEffect(() => {
    const timer = setTimeout(
      () => dispatch(fetchServiceStatus()),
      60000,
    );
    return () => clearTimeout(timer);
  });

  let icons: any[] = [];
  // TODO: This logic shouldn't go here. Perhaps a lookup can be provided in config to map appropriate icons.
  if (status) {
    icons = status.data.map((status: any) => {
      const { name } = status;
      // TODO: These cases are metro-specific. This will probably change
      // anyhow as GTFS-realtime status is implemented, and can probably
      // use the same overrides present in the API config in
      // transit-app-api. The discrepency is due to the realtime feeds
      // (in the case of the NYC MTA) using routeShortName instead of routeId.
      // Also, the NYC MTA has removed grouping of the routeIds in the
      // GTFS feed, but this still remains in the XML feed:
      switch (name) {
        case 'SIR':
          return ['SI'];
        case 'S':
          return ['GS'];
        default:
          return name.split('');
      }
    });
  }

  return (
    <div className="service-status">
      <h2>Service Status</h2>
      {status.data.map((status: any, i: number) => (
        <Accordion key={i}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${i}a-content`}
            id={`panel${i}a-content`}>
            {icons[i].map((routeId: any, j: number) =>
              <Image key={j} src={getIconPath(agencyId, routeId)} width={25} height={25} alt={routeId} />
            )} {status.status !=='' && <span><strong>{status.status}</strong> {status.date} {status.time}</span>}
          </AccordionSummary>
          <AccordionDetails>
            {/* TODO: Parse status text and remove tags: */}
            <div dangerouslySetInnerHTML={{ __html: status.text }} />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default ServiceStatus;
