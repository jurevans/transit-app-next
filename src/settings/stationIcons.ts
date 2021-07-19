import mta_1 from 'mta-subway-bullets/build/png/1.png';
import mta_2 from 'mta-subway-bullets/build/png/2.png';
import mta_3 from 'mta-subway-bullets/build/png/3.png';
import mta_4 from 'mta-subway-bullets/build/png/4.png';
import mta_5 from 'mta-subway-bullets/build/png/5.png';
import mta_6 from 'mta-subway-bullets/build/png/6.png';
import mta_6d from 'mta-subway-bullets/build/png/6d.png';
import mta_7 from 'mta-subway-bullets/build/png/7.png';
import mta_7d from 'mta-subway-bullets/build/png/7d.png';
import mta_a from 'mta-subway-bullets/build/png/a.png';
import mta_b from 'mta-subway-bullets/build/png/b.png';
import mta_c from 'mta-subway-bullets/build/png/c.png';
import mta_d from 'mta-subway-bullets/build/png/d.png';
import mta_e from 'mta-subway-bullets/build/png/e.png';
import mta_f from 'mta-subway-bullets/build/png/f.png';
import mta_g from 'mta-subway-bullets/build/png/g.png';
import mta_j from 'mta-subway-bullets/build/png/j.png';
import mta_l from 'mta-subway-bullets/build/png/l.png';
import mta_m from 'mta-subway-bullets/build/png/m.png';
import mta_n from 'mta-subway-bullets/build/png/n.png';
import mta_q from 'mta-subway-bullets/build/png/q.png';
import mta_r from 'mta-subway-bullets/build/png/r.png';
import mta_w from 'mta-subway-bullets/build/png/w.png';
import mta_z from 'mta-subway-bullets/build/png/z.png';
import mta_s from 'mta-subway-bullets/build/png/s.png';
import mta_sf from 'mta-subway-bullets/build/png/sf.png';
import mta_sir from 'mta-subway-bullets/build/png/sir.png';

type StationIcons = {
  [key: string]: {
    [key: string]: {
      icon: unknown,
    },
  },
};

/* TODO: Add express route icons */
const stationIcons: StationIcons = {
  nyc: {
    '1': {
      icon: mta_1,
    },
    '2': {
      icon: mta_2,
    },
    '3': {
      icon: mta_3,
    },
    '4': {
      icon: mta_4,
    },
    '5': {
      icon: mta_5,
    },
    '6': {
      icon: mta_6,
    },
    '6X': {
      icon: mta_6d,
    },
    '7': {
      icon: mta_7,
    },
    '7X': {
      icon: mta_7d,
    },
    'A': {
      icon: mta_a,
    },
    'B': {
      icon: mta_b,
    },
    'C': {
      icon: mta_c,
    },
    'D': {
      icon: mta_d,
    },
    'E': {
      icon: mta_e,
    },
    'F': {
      icon: mta_f,
    },
    'FX': {
      icon: mta_f,
    },
    'G': {
      icon: mta_g,
    },
    'J': {
      icon: mta_j,
    },
    'L': {
      icon: mta_l,
    },
    'M': {
      icon: mta_m,
    },
    'N': {
      icon: mta_n,
    },
    'Q': {
      icon: mta_q,
    },
    'R': {
      icon: mta_r,
    },
    'W': {
      icon: mta_w,
    },
    'Z': {
      icon: mta_z,
    },
    'S': {
      icon: mta_s,
    },
    'SF': {
      icon: mta_sf,
    },
    'SIR': {
      icon: mta_sir,
    },
  },
  /*
  portland: {

  }
  */
};

export default stationIcons;