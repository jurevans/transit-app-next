import { Column, Entity, Index, OneToMany } from "typeorm";
import { Transfers } from "./Transfers";

@Index("transfer_types_pkey", ["transferType"], { unique: true })
@Entity("transfer_types", { schema: "gtfs" })
export class TransferTypes {
  @Column("integer", { primary: true, name: "transfer_type" })
  transferType: number;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @OneToMany(() => Transfers, (transfers) => transfers.transferType)
  transfers: Transfers[];
}
