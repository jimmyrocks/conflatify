UPDATE
  {{tagTableName}}
SET
  "interesting" = 't'
WHERE
  "k"='{{k}}' AND
  ("v"='{{v}}' OR '{{v}}' = '*'); AND
  (
    SELECT GeometryType(the_geom)
   /*   CASE
        WHEN "type" = 'n' THEN 'n'
        ELSE 'w'
      END AS "type" */
    FROM "{{tableName}}"
    WHERE "{{tableName}}"."osmid" = "{{tagTableName}}"."osmid"
  ) LIKE '%{{geometryType}}';

