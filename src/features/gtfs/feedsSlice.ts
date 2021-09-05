import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export interface Agency {
  feedIndex: number;
  agencyId: string;
  agencyName: string;
  agencyUrl: string;
  agencyTimezone: string;
  agencyLang: string;
  agencyPhone: string;
}

export interface Feed {
  feedIndex: number;
  feedStartDate: string;
  feedEndDate: string;
  agencies: Agency[];
}

type FeedsState = {
  [key: string]: Feed;
};

const initialState: FeedsState = {};

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    setFeeds(state: any, action: PayloadAction<Feed[]>) {
      const feeds = action.payload;
      feeds.forEach((feed: Feed) => {
        state[feed.feedIndex] = feed;
      });
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        ...action.payload.gtfs.feeds,
      }
    },
  },
});

export const { setFeeds } = feedsSlice.actions;
export default feedsSlice.reducer;
