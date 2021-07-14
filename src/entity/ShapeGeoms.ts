import { Column, Entity, Index } from "typeorm";

@Index("shape_geom_pkey", ["feedIndex", "shapeId"], { unique: true })
@Entity("shape_geoms", { schema: "gtfs" })
export class ShapeGeoms {
  @Column("integer", { primary: true, name: "feed_index" })
  feedIndex: number;

  @Column("text", { primary: true, name: "shape_id" })
  shapeId: string;

  @Column("numeric", { name: "length", precision: 12, scale: 2 })
  length: string;

  @Column("geometry", { name: "the_geom", nullable: true })
  theGeom: string | null;
}
