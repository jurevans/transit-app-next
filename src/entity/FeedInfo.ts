import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Agency } from "./Agency";
import { Calendar } from "./Calendar";
import { FareAttributes } from "./FareAttributes";
import { FareRules } from "./FareRules";
import { Frequencies } from "./Frequencies";
import { Routes } from "./Routes";
import { StopTimes } from "./StopTimes";
import { Transfers } from "./Transfers";
import { Trips } from "./Trips";

@Index("feed_info_pkey", ["feedIndex"], { unique: true })
@Entity("feed_info", { schema: "gtfs" })
export class FeedInfo {
  @PrimaryGeneratedColumn({ type: "integer", name: "feed_index" })
  feedIndex: number;

  @Column("text", { name: "feed_publisher_name", nullable: true })
  feedPublisherName: string | null;

  @Column("text", { name: "feed_publisher_url", nullable: true })
  feedPublisherUrl: string | null;

  @Column("text", { name: "feed_timezone", nullable: true })
  feedTimezone: string | null;

  @Column("text", { name: "feed_lang", nullable: true })
  feedLang: string | null;

  @Column("text", { name: "feed_version", nullable: true })
  feedVersion: string | null;

  @Column("date", { name: "feed_start_date", nullable: true })
  feedStartDate: string | null;

  @Column("date", { name: "feed_end_date", nullable: true })
  feedEndDate: string | null;

  @Column("text", { name: "feed_id", nullable: true })
  feedId: string | null;

  @Column("text", { name: "feed_contact_url", nullable: true })
  feedContactUrl: string | null;

  @Column("text", { name: "feed_contact_email", nullable: true })
  feedContactEmail: string | null;

  @Column("date", { name: "feed_download_date", nullable: true })
  feedDownloadDate: string | null;

  @Column("text", { name: "feed_file", nullable: true })
  feedFile: string | null;

  @OneToMany(() => Agency, (agency) => agency.feedIndex2)
  agencies: Agency[];

  @OneToMany(() => Calendar, (calendar) => calendar.feedIndex2)
  calendars: Calendar[];

  @OneToMany(
    () => FareAttributes,
    (fareAttributes) => fareAttributes.feedIndex2
  )
  fareAttributes: FareAttributes[];

  @OneToMany(() => FareRules, (fareRules) => fareRules.feedIndex)
  fareRules: FareRules[];

  @OneToMany(() => Frequencies, (frequencies) => frequencies.feedIndex2)
  frequencies: Frequencies[];

  @OneToMany(() => Routes, (routes) => routes.feedIndex2)
  routes: Routes[];

  @OneToMany(() => StopTimes, (stopTimes) => stopTimes.feedIndex2)
  stopTimes: StopTimes[];

  @OneToMany(() => Transfers, (transfers) => transfers.feedIndex)
  transfers: Transfers[];

  @OneToMany(() => Trips, (trips) => trips.feedIndex2)
  trips: Trips[];
}
