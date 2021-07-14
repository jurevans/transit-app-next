import { Column, Entity, Index, OneToMany } from "typeorm";
import { Stops } from "./Stops";

@Index("wheelchair_boardings_pkey", ["wheelchairBoarding"], { unique: true })
@Entity("wheelchair_boardings", { schema: "gtfs" })
export class WheelchairBoardings {
  @Column("integer", { primary: true, name: "wheelchair_boarding" })
  wheelchairBoarding: number;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @OneToMany(() => Stops, (stops) => stops.wheelchairBoarding)
  stops: Stops[];
}
