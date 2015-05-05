UPDATE
  "{{tagTableName}}"
SET
  "interesting" = 't'
WHERE
  "k"='{{k}}' AND
  ("v"='{{v}}' OR '{{v}}' = '*'); AND
  (
    SELECT GeometryType("the_geom")
    FROM "{{tableName}}"
    WHERE "{{tableName}}"."osmid" = "{{tagTableName}}"."osmid"
  ) LIKE '%{{geometryType}}';

