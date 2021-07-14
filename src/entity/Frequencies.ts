import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { FeedInfo } from "./FeedInfo";
import { Trips } from "./Trips";

@Index("frequencies_pkey", ["feedIndex", "startTime", "tripId"], {
  unique: true,
})
@Entity("frequencies", { schema: "gtfs" })
export class Frequencies {
  @Column("integer", { primary: true, name: "feed_index" })
  feedIndex: number;

  @Column("text", { primary: true, name: "trip_id" })
  tripId: string;

  @Column("text", { primary: true, name: "start_time" })
  startTime: string;

  @Column("text", { name: "end_time" })
  endTime: string;

  @Column("integer", { name: "headway_secs" })
  headwaySecs: number;

  @Column("integer", { name: "exact_times", nullable: true })
  exactTimes: number | null;

  @Column("integer", { name: "start_time_seconds", nullable: true })
  startTimeSeconds: number | null;

  @Column("integer", { name: "end_time_seconds", nullable: true })
  endTimeSeconds: number | null;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.frequencies, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "feed_index", referencedColumnName: "feedIndex" }])
  feedIndex2: FeedInfo;

  @ManyToOne(() => Trips, (trips) => trips.frequencies)
  @JoinColumn([
    { name: "feed_index", referencedColumnName: "feedIndex" },
    { name: "trip_id", referencedColumnName: "tripId" },
  ])
  trips: Trips;
}
