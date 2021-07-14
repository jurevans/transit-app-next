import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { FareRules } from "./FareRules";
import { Agency } from "./Agency";
import { FeedInfo } from "./FeedInfo";
import { RouteTypes } from "./RouteTypes";
import { Transfers } from "./Transfers";
import { Trips } from "./Trips";

@Index("routes_pkey", ["feedIndex", "routeId"], { unique: true })
@Entity("routes", { schema: "gtfs" })
export class Routes {
  @Column("integer", { primary: true, name: "feed_index" })
  feedIndex: number;

  @Column("text", { primary: true, name: "route_id" })
  routeId: string;

  @Column("text", {
    name: "route_short_name",
    nullable: true,
    default: () => "''",
  })
  routeShortName: string | null;

  @Column("text", {
    name: "route_long_name",
    nullable: true,
    default: () => "''",
  })
  routeLongName: string | null;

  @Column("text", { name: "route_desc", nullable: true, default: () => "''" })
  routeDesc: string | null;

  @Column("text", { name: "route_url", nullable: true })
  routeUrl: string | null;

  @Column("text", { name: "route_color", nullable: true })
  routeColor: string | null;

  @Column("text", { name: "route_text_color", nullable: true })
  routeTextColor: string | null;

  @Column("integer", { name: "route_sort_order", nullable: true })
  routeSortOrder: number | null;

  @OneToMany(() => FareRules, (fareRules) => fareRules.routes)
  fareRules: FareRules[];

  @ManyToOne(() => Agency, (agency) => agency.routes)
  @JoinColumn([
    { name: "feed_index", referencedColumnName: "feedIndex" },
    { name: "agency_id", referencedColumnName: "agencyId" },
  ])
  agency: Agency;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.routes, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "feed_index", referencedColumnName: "feedIndex" }])
  feedIndex2: FeedInfo;

  @ManyToOne(() => RouteTypes, (routeTypes) => routeTypes.routes)
  @JoinColumn([{ name: "route_type", referencedColumnName: "routeType" }])
  routeType: RouteTypes;

  @ManyToOne(() => RouteTypes, (routeTypes) => routeTypes.routes2)
  @JoinColumn([{ name: "route_type", referencedColumnName: "routeType" }])
  routeType2: RouteTypes;

  @OneToMany(() => Transfers, (transfers) => transfers.routes)
  transfers: Transfers[];

  @OneToMany(() => Transfers, (transfers) => transfers.routes2)
  transfers2: Transfers[];

  @OneToMany(() => Trips, (trips) => trips.routes)
  trips: Trips[];
}
