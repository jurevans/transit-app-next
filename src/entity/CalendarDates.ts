import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { ExceptionTypes } from "./ExceptionTypes";
import { Calendar } from "./Calendar";

@Index("calendar_dates_dateidx", ["date"], {})
@Entity("calendar_dates", { schema: "gtfs" })
export class CalendarDates {
  @Column("date", { name: "date" })
  date: string;

  @ManyToOne(
    () => ExceptionTypes,
    (exceptionTypes) => exceptionTypes.calendarDates
  )
  @JoinColumn([
    { name: "exception_type", referencedColumnName: "exceptionType" },
  ])
  exceptionType: ExceptionTypes;

  @ManyToOne(() => Calendar, (calendar) => calendar.calendarDates)
  @JoinColumn([
    { name: "feed_index", referencedColumnName: "feedIndex" },
    { name: "service_id", referencedColumnName: "serviceId" },
  ])
  calendar: Calendar;
}
