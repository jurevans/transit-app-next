import { Column, Entity, Index } from "typeorm";

@Index("shapes_shape_key", ["shapeId"], {})
@Entity("shapes", { schema: "gtfs" })
export class Shapes {
  @Column("integer", { name: "feed_index" })
  feedIndex: number;

  @Column("text", { name: "shape_id" })
  shapeId: string;

  @Column("double precision", { name: "shape_pt_lat", precision: 53 })
  shapePtLat: number;

  @Column("double precision", { name: "shape_pt_lon", precision: 53 })
  shapePtLon: number;

  @Column("integer", { name: "shape_pt_sequence" })
  shapePtSequence: number;

  @Column("double precision", {
    name: "shape_dist_traveled",
    nullable: true,
    precision: 53,
  })
  shapeDistTraveled: number | null;
}
