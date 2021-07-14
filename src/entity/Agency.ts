import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { FeedInfo } from "./FeedInfo";
import { FareAttributes } from "./FareAttributes";
import { Routes } from "./Routes";

@Index("agency_pkey", ["agencyId", "feedIndex"], { unique: true })
@Entity("agency", { schema: "gtfs" })
export class Agency {
  @Column("integer", { primary: true, name: "feed_index" })
  feedIndex: number;

  @Column("text", { primary: true, name: "agency_id", default: () => "''" })
  agencyId: string;

  @Column("text", { name: "agency_name", nullable: true })
  agencyName: string | null;

  @Column("text", { name: "agency_url", nullable: true })
  agencyUrl: string | null;

  @Column("text", { name: "agency_timezone", nullable: true })
  agencyTimezone: string | null;

  @Column("text", { name: "agency_lang", nullable: true })
  agencyLang: string | null;

  @Column("text", { name: "agency_phone", nullable: true })
  agencyPhone: string | null;

  @Column("text", { name: "agency_fare_url", nullable: true })
  agencyFareUrl: string | null;

  @Column("text", { name: "agency_email", nullable: true })
  agencyEmail: string | null;

  @Column("text", { name: "bikes_policy_url", nullable: true })
  bikesPolicyUrl: string | null;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.agencies)
  @JoinColumn([{ name: "feed_index", referencedColumnName: "feedIndex" }])
  feedIndex2: FeedInfo;

  @OneToMany(() => FareAttributes, (fareAttributes) => fareAttributes.agency)
  fareAttributes: FareAttributes[];

  @OneToMany(() => Routes, (routes) => routes.agency)
  routes: Routes[];
}
