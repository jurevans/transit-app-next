import { Column, Entity, Index, OneToMany } from "typeorm";
import { Stops } from "./Stops";

@Index("location_types_pkey", ["locationType"], { unique: true })
@Entity("location_types", { schema: "gtfs" })
export class LocationTypes {
  @Column("integer", { primary: true, name: "location_type" })
  locationType: number;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @OneToMany(() => Stops, (stops) => stops.locationType)
  stops: Stops[];
}
