SELECT
  A.osmid AS new_id,
  B.osmid AS osm_id,
  (
    SELECT group_concat("k",'<f2e7651932b5400eb3ed2b358ae00767>')
    FROM "{{tagTableNameA}}" "TAK"
    WHERE "A"."osmid" = "TAK"."osmid" AND
      substr("k", 0, 4) != 'nps:'
    ORDER BY "k"
  ) AS "new_keys",
  (
    SELECT group_concat("v",'<f2e7651932b5400eb3ed2b358ae00767>')
    FROM "{{tagTableNameA}}" "TAV"
    WHERE "A"."osmid" = "TAV"."osmid" AND
      substr("k", 0, 4) != 'nps:'
    ORDER BY "k"
  ) AS "new_values",
  AsGeoJSON(A.the_geom) as new_geom,
  AsGeoJSON(B.the_geom) as osm_geom
FROM
  "{{tableNameA}}" A LEFT JOIN "{{tableNameB}}" B ON
    MbrIntersects(A.the_geom, B.the_geom) = 1 AND -- First we check the Mbr to make the query faster
    Intersects(Buffer(Transform(A.the_geom,3857),1), Buffer(Transform(B.the_geom,3857),1)) = 1 -- See if they actually intersect
WHERE
  (A.type = 'w' OR A.type = 'r') AND
  (B.type = 'w' OR B.type = 'r' OR B.type IS NULL) AND
  (GeometryType(A.the_geom) = 'POLYGON' OR GeometryType(A.the_geom) = 'MULTIPOLYGON') AND
  (GeometryType(B.the_geom) = 'POLYGON' OR GeometryType(B.the_geom) = 'MULTIPOLYGON' OR B.the_geom IS NULL)
ORDER BY
 new_id;
