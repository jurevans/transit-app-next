import { Column, Entity, Index, OneToMany } from "typeorm";
import { StopTimes } from "./StopTimes";

@Index("continuous_pickup_pkey", ["continuousPickup"], { unique: true })
@Entity("continuous_pickup", { schema: "gtfs" })
export class ContinuousPickup {
  @Column("integer", { primary: true, name: "continuous_pickup" })
  continuousPickup: number;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @OneToMany(() => StopTimes, (stopTimes) => stopTimes.continuousPickup)
  stopTimes: StopTimes[];
}
