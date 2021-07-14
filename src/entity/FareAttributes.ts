import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Agency } from "./Agency";
import { FeedInfo } from "./FeedInfo";
import { PaymentMethods } from "./PaymentMethods";
import { FareRules } from "./FareRules";

@Index("fare_attributes_pkey", ["fareId", "feedIndex"], { unique: true })
@Entity("fare_attributes", { schema: "gtfs" })
export class FareAttributes {
  @Column("integer", { primary: true, name: "feed_index" })
  feedIndex: number;

  @Column("text", { primary: true, name: "fare_id" })
  fareId: string;

  @Column("double precision", { name: "price", precision: 53 })
  price: number;

  @Column("text", { name: "currency_type" })
  currencyType: string;

  @Column("integer", { name: "transfers", nullable: true })
  transfers: number | null;

  @Column("integer", { name: "transfer_duration", nullable: true })
  transferDuration: number | null;

  @ManyToOne(() => Agency, (agency) => agency.fareAttributes)
  @JoinColumn([
    { name: "feed_index", referencedColumnName: "feedIndex" },
    { name: "agency_id", referencedColumnName: "agencyId" },
  ])
  agency: Agency;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.fareAttributes, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "feed_index", referencedColumnName: "feedIndex" }])
  feedIndex2: FeedInfo;

  @ManyToOne(
    () => PaymentMethods,
    (paymentMethods) => paymentMethods.fareAttributes
  )
  @JoinColumn([
    { name: "payment_method", referencedColumnName: "paymentMethod" },
  ])
  paymentMethod: PaymentMethods;

  @OneToMany(() => FareRules, (fareRules) => fareRules.fareAttributes)
  fareRules: FareRules[];
}
