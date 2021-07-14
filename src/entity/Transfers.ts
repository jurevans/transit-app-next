import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Calendar } from "./Calendar";
import { FeedInfo } from "./FeedInfo";
import { Routes } from "./Routes";
import { Stops } from "./Stops";
import { TransferTypes } from "./TransferTypes";

@Entity("transfers", { schema: "gtfs" })
export class Transfers {
  @Column("integer", { name: "min_transfer_time", nullable: true })
  minTransferTime: number | null;

  @ManyToOne(() => Calendar, (calendar) => calendar.transfers)
  @JoinColumn([
    { name: "feed_index", referencedColumnName: "feedIndex" },
    { name: "service_id", referencedColumnName: "serviceId" },
  ])
  calendar: Calendar;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.transfers, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "feed_index", referencedColumnName: "feedIndex" }])
  feedIndex: FeedInfo;

  @ManyToOne(() => Routes, (routes) => routes.transfers)
  @JoinColumn([
    { name: "feed_index", referencedColumnName: "feedIndex" },
    { name: "from_route_id", referencedColumnName: "routeId" },
  ])
  routes: Routes;

  @ManyToOne(() => Routes, (routes) => routes.transfers2)
  @JoinColumn([
    { name: "feed_index", referencedColumnName: "feedIndex" },
    { name: "to_route_id", referencedColumnName: "routeId" },
  ])
  routes2: Routes;

  @ManyToOne(() => Stops, (stops) => stops.transfers)
  @JoinColumn([
    { name: "feed_index", referencedColumnName: "feedIndex" },
    { name: "from_stop_id", referencedColumnName: "stopId" },
  ])
  stops: Stops;

  @ManyToOne(() => Stops, (stops) => stops.transfers2)
  @JoinColumn([
    { name: "feed_index", referencedColumnName: "feedIndex" },
    { name: "to_stop_id", referencedColumnName: "stopId" },
  ])
  stops2: Stops;

  @ManyToOne(() => TransferTypes, (transferTypes) => transferTypes.transfers)
  @JoinColumn([{ name: "transfer_type", referencedColumnName: "transferType" }])
  transferType: TransferTypes;
}
