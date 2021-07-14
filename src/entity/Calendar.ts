import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { FeedInfo } from "./FeedInfo";
import { CalendarDates } from "./CalendarDates";
import { FareRules } from "./FareRules";
import { Transfers } from "./Transfers";
import { Trips } from "./Trips";

@Index("calendar_pkey", ["feedIndex", "serviceId"], { unique: true })
@Index("calendar_service_id", ["serviceId"], {})
@Entity("calendar", { schema: "gtfs" })
export class Calendar {
  @Column("integer", { primary: true, name: "feed_index" })
  feedIndex: number;

  @Column("text", { primary: true, name: "service_id" })
  serviceId: string;

  @Column("integer", { name: "monday" })
  monday: number;

  @Column("integer", { name: "tuesday" })
  tuesday: number;

  @Column("integer", { name: "wednesday" })
  wednesday: number;

  @Column("integer", { name: "thursday" })
  thursday: number;

  @Column("integer", { name: "friday" })
  friday: number;

  @Column("integer", { name: "saturday" })
  saturday: number;

  @Column("integer", { name: "sunday" })
  sunday: number;

  @Column("date", { name: "start_date" })
  startDate: string;

  @Column("date", { name: "end_date" })
  endDate: string;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.calendars, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "feed_index", referencedColumnName: "feedIndex" }])
  feedIndex2: FeedInfo;

  @OneToMany(() => CalendarDates, (calendarDates) => calendarDates.calendar)
  calendarDates: CalendarDates[];

  @OneToMany(() => FareRules, (fareRules) => fareRules.calendar)
  fareRules: FareRules[];

  @OneToMany(() => Transfers, (transfers) => transfers.calendar)
  transfers: Transfers[];

  @OneToMany(() => Trips, (trips) => trips.calendar)
  trips: Trips[];
}
