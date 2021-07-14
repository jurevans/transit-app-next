import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Frequencies } from "./Frequencies";
import { StopTimes } from "./StopTimes";
import { Calendar } from "./Calendar";
import { FeedInfo } from "./FeedInfo";
import { Routes } from "./Routes";
import { WheelchairAccessible } from "./WheelchairAccessible";

@Index("trips_pkey", ["feedIndex", "tripId"], { unique: true })
@Index("trips_service_id", ["feedIndex", "serviceId"], {})
@Index("trips_trip_id", ["tripId"], {})
@Entity("trips", { schema: "gtfs" })
export class Trips {
  @Column("integer", { primary: true, name: "feed_index" })
  feedIndex: number;

  @Column("text", { name: "service_id" })
  serviceId: string;

  @Column("text", { primary: true, name: "trip_id" })
  tripId: string;

  @Column("text", { name: "trip_headsign", nullable: true })
  tripHeadsign: string | null;

  @Column("integer", { name: "direction_id", nullable: true })
  directionId: number | null;

  @Column("text", { name: "block_id", nullable: true })
  blockId: string | null;

  @Column("text", { name: "shape_id", nullable: true })
  shapeId: string | null;

  @Column("text", { name: "trip_short_name", nullable: true })
  tripShortName: string | null;

  @Column("text", { name: "direction", nullable: true })
  direction: string | null;

  @Column("text", { name: "schd_trip_id", nullable: true })
  schdTripId: string | null;

  @Column("text", { name: "trip_type", nullable: true })
  tripType: string | null;

  @Column("integer", { name: "exceptional", nullable: true })
  exceptional: number | null;

  @Column("integer", { name: "bikes_allowed", nullable: true })
  bikesAllowed: number | null;

  @OneToMany(() => Frequencies, (frequencies) => frequencies.trips)
  frequencies: Frequencies[];

  @OneToMany(() => StopTimes, (stopTimes) => stopTimes.trips)
  stopTimes: StopTimes[];

  @ManyToOne(() => Calendar, (calendar) => calendar.trips)
  @JoinColumn([
    { name: "feed_index", referencedColumnName: "feedIndex" },
    { name: "service_id", referencedColumnName: "serviceId" },
  ])
  calendar: Calendar;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.trips, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "feed_index", referencedColumnName: "feedIndex" }])
  feedIndex2: FeedInfo;

  @ManyToOne(() => Routes, (routes) => routes.trips)
  @JoinColumn([
    { name: "feed_index", referencedColumnName: "feedIndex" },
    { name: "route_id", referencedColumnName: "routeId" },
  ])
  routes: Routes;

  @ManyToOne(
    () => WheelchairAccessible,
    (wheelchairAccessible) => wheelchairAccessible.trips
  )
  @JoinColumn([
    {
      name: "wheelchair_accessible",
      referencedColumnName: "wheelchairAccessible",
    },
  ])
  wheelchairAccessible: WheelchairAccessible;
}
