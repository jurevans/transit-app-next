import { Column, Entity, Index, OneToMany } from "typeorm";
import { StopTimes } from "./StopTimes";

@Index("timepoints_pkey", ["timepoint"], { unique: true })
@Entity("timepoints", { schema: "gtfs" })
export class Timepoints {
  @Column("integer", { primary: true, name: "timepoint" })
  timepoint: number;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @OneToMany(() => StopTimes, (stopTimes) => stopTimes.timepoint)
  stopTimes: StopTimes[];
}
