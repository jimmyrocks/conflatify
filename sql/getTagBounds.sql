SELECT
 "matched_tags"."k" AS "k",
 "matched_tags"."v" AS "v",
  MbrMinX("matched_tags"."the_geom") AS "left",
  MbrMinY("matched_tags"."the_geom") AS "bottom",
  MbrMaxX("matched_tags"."the_geom") AS "right",
  MbrMaxY("matched_tags"."the_geom") AS "top"
FROM (
  SELECT
    "tags"."k",
    "tags"."v",
    Transform(Buffer(Transform(ST_Union("geoms"."the_geom"),3857),15),4326) AS "the_geom"
  FROM
    "{{tagTableName}}" "tags" JOIN "{{tableName}}" "geoms" ON "tags"."osmid" = "geoms"."osmid"
  WHERE
    "tags"."interesting" = 't'
  GROUP BY
    "k",
    "v"
) "matched_tags";
