import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Calendar } from "./Calendar";
import { FareAttributes } from "./FareAttributes";
import { FeedInfo } from "./FeedInfo";
import { Routes } from "./Routes";

@Entity("fare_rules", { schema: "gtfs" })
export class FareRules {
  @Column("text", { name: "origin_id", nullable: true })
  originId: string | null;

  @Column("text", { name: "destination_id", nullable: true })
  destinationId: string | null;

  @Column("text", { name: "contains_id", nullable: true })
  containsId: string | null;

  @ManyToOne(() => Calendar, (calendar) => calendar.fareRules)
  @JoinColumn([
    { name: "feed_index", referencedColumnName: "feedIndex" },
    { name: "service_id", referencedColumnName: "serviceId" },
  ])
  calendar: Calendar;

  @ManyToOne(() => FareAttributes, (fareAttributes) => fareAttributes.fareRules)
  @JoinColumn([
    { name: "feed_index", referencedColumnName: "feedIndex" },
    { name: "fare_id", referencedColumnName: "fareId" },
  ])
  fareAttributes: FareAttributes;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.fareRules, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "feed_index", referencedColumnName: "feedIndex" }])
  feedIndex: FeedInfo;

  @ManyToOne(() => Routes, (routes) => routes.fareRules)
  @JoinColumn([
    { name: "feed_index", referencedColumnName: "feedIndex" },
    { name: "route_id", referencedColumnName: "routeId" },
  ])
  routes: Routes;
}
