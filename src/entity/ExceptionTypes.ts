import { Column, Entity, Index, OneToMany } from "typeorm";
import { CalendarDates } from "./CalendarDates";

@Index("exception_types_pkey", ["exceptionType"], { unique: true })
@Entity("exception_types", { schema: "gtfs" })
export class ExceptionTypes {
  @Column("integer", { primary: true, name: "exception_type" })
  exceptionType: number;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @OneToMany(
    () => CalendarDates,
    (calendarDates) => calendarDates.exceptionType
  )
  calendarDates: CalendarDates[];
}
