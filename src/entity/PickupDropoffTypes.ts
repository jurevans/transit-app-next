import { Column, Entity, Index, OneToMany } from "typeorm";
import { StopTimes } from "./StopTimes";

@Index("pickup_dropoff_types_pkey", ["typeId"], { unique: true })
@Entity("pickup_dropoff_types", { schema: "gtfs" })
export class PickupDropoffTypes {
  @Column("integer", { primary: true, name: "type_id" })
  typeId: number;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @OneToMany(() => StopTimes, (stopTimes) => stopTimes.dropOffType)
  stopTimes: StopTimes[];

  @OneToMany(() => StopTimes, (stopTimes) => stopTimes.pickupType)
  stopTimes2: StopTimes[];
}
