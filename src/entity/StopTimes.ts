import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { ContinuousPickup } from "./ContinuousPickup";
import { PickupDropoffTypes } from "./PickupDropoffTypes";
import { FeedInfo } from "./FeedInfo";
import { Stops } from "./Stops";
import { Trips } from "./Trips";
import { Timepoints } from "./Timepoints";

@Index("arr_time_index", ["arrivalTimeSeconds"], {})
@Index("dep_time_index", ["departureTimeSeconds"], {})
@Index("stop_times_pkey", ["feedIndex", "stopSequence", "tripId"], {
  unique: true,
})
@Index("stop_times_key", ["feedIndex", "stopId", "tripId"], {})
@Entity("stop_times", { schema: "gtfs" })
export class StopTimes {
  @Column("integer", { primary: true, name: "feed_index" })
  feedIndex: number;

  @Column("text", { primary: true, name: "trip_id" })
  tripId: string;

  @Column("interval", { name: "arrival_time", nullable: true })
  arrivalTime: any | null;

  @Column("interval", { name: "departure_time", nullable: true })
  departureTime: any | null;

  @Column("text", { name: "stop_id", nullable: true })
  stopId: string | null;

  @Column("integer", { primary: true, name: "stop_sequence" })
  stopSequence: number;

  @Column("text", { name: "stop_headsign", nullable: true })
  stopHeadsign: string | null;

  @Column("numeric", {
    name: "shape_dist_traveled",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  shapeDistTraveled: string | null;

  @Column("integer", { name: "continuous_drop_off", nullable: true })
  continuousDropOff: number | null;

  @Column("integer", { name: "arrival_time_seconds", nullable: true })
  arrivalTimeSeconds: number | null;

  @Column("integer", { name: "departure_time_seconds", nullable: true })
  departureTimeSeconds: number | null;

  @ManyToOne(
    () => ContinuousPickup,
    (continuousPickup) => continuousPickup.stopTimes
  )
  @JoinColumn([
    { name: "continuous_pickup", referencedColumnName: "continuousPickup" },
  ])
  continuousPickup: ContinuousPickup;

  @ManyToOne(
    () => PickupDropoffTypes,
    (pickupDropoffTypes) => pickupDropoffTypes.stopTimes
  )
  @JoinColumn([{ name: "drop_off_type", referencedColumnName: "typeId" }])
  dropOffType: PickupDropoffTypes;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.stopTimes, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "feed_index", referencedColumnName: "feedIndex" }])
  feedIndex2: FeedInfo;

  @ManyToOne(() => Stops, (stops) => stops.stopTimes)
  @JoinColumn([
    { name: "feed_index", referencedColumnName: "feedIndex" },
    { name: "stop_id", referencedColumnName: "stopId" },
  ])
  stops: Stops;

  @ManyToOne(() => Trips, (trips) => trips.stopTimes)
  @JoinColumn([
    { name: "feed_index", referencedColumnName: "feedIndex" },
    { name: "trip_id", referencedColumnName: "tripId" },
  ])
  trips: Trips;

  @ManyToOne(
    () => PickupDropoffTypes,
    (pickupDropoffTypes) => pickupDropoffTypes.stopTimes2
  )
  @JoinColumn([{ name: "pickup_type", referencedColumnName: "typeId" }])
  pickupType: PickupDropoffTypes;

  @ManyToOne(() => Timepoints, (timepoints) => timepoints.stopTimes)
  @JoinColumn([{ name: "timepoint", referencedColumnName: "timepoint" }])
  timepoint: Timepoints;
}
