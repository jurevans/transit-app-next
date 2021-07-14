import { Column, Entity, Index, OneToMany } from "typeorm";
import { Stops } from "./Stops";
import { Trips } from "./Trips";

@Index("wheelchair_accessible_pkey", ["wheelchairAccessible"], { unique: true })
@Entity("wheelchair_accessible", { schema: "gtfs" })
export class WheelchairAccessible {
  @Column("integer", { primary: true, name: "wheelchair_accessible" })
  wheelchairAccessible: number;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @OneToMany(() => Stops, (stops) => stops.wheelchairAccessible)
  stops: Stops[];

  @OneToMany(() => Trips, (trips) => trips.wheelchairAccessible)
  trips: Trips[];
}
