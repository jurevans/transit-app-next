import { FC, ReactElement, useEffect } from 'react';
import Image from 'next/image';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getIcons } from '../../../helpers/map';
import { useAppDispatch } from '../../../app/hooks';
import { fetchServiceStatus } from '../../../features/api/statusApiSlice';

type Props = {
  city: string;
  status: any[];
};

const ServiceStatus: FC<Props> = (props: Props): ReactElement => {
  const { city, status } = props;
  const dispatch = useAppDispatch();

  // Re-fetch status data every minute
  useEffect(() => {
    const timer = setTimeout(
      () => dispatch(fetchServiceStatus(city)),
      60000,
    );
    return () => clearTimeout(timer);
  });

  let icons: any[] = [];
  // TODO: This logic shouldn't go here. Perhaps a lookup can be provided in config to map appropriate icons.
  if (status) {
    icons = status.map((status: any) => {
      const { name } = status;
      if (name === 'SIR') {
        return getIcons(city, name);
      } else {
        return getIcons(city, name.split('').join('-'));
      }
    });
  }

  return (
    <div className="service-status">
      <h2>Service Status</h2>
      {status.map((status: any, i: number) => (
        <Accordion key={i}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${i}a-content`}
            id={`panel${i}a-content`}>
            {icons[i].map((icon: any, j: number) =>
              <Image key={j} src={icon.icon} width={25} height={25} alt={icon.line} />
            )} {status.status !=='' && <span><strong>{status.status}</strong> {status.date} {status.time}</span>}
          </AccordionSummary>
          <AccordionDetails>
            <div dangerouslySetInnerHTML={{ __html: status.text }} />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default ServiceStatus;
