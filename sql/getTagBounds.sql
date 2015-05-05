SELECT
  "tags"."k",
  "tags"."v",
  MbrMinX(ST_Union("the_geom")) AS "left",
  MbrMinY(ST_Union("the_geom")) AS "bottom",
  MbrMaxX(ST_Union("the_geom")) AS "right",
  MbrMaxY(ST_Union("the_geom")) AS "top"
FROM
  {{tagTableName}} "tags" JOIN {{tableName}} "geoms" ON "tags"."osmid" = "geoms"."osmid"
WHERE
  "tags"."interesting" = 't'
GROUP BY
  "k",
  "v";
