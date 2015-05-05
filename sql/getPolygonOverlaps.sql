SELECT
  A.osmid AS aid,
  B.osmid AS bid,
  GeometryType(A.the_geom) as ageom,
  GeometryType(B.the_geom) as bgeom
FROM
  {{tableNameA}} A JOIN {{tableNameB}} B ON
    A.osmid != B.osmid AND -- Don't try to match things that are already matched
    MbrIntersects(A.the_geom, B.the_geom) = 1 AND -- First we check the Mbr to make the query faster
    Intersects(Buffer(Transform(A.the_geom,3857),5), Buffer(Transform(B.the_geom,3857),5)) = 1 -- See if they actually intersect
WHERE
  (A.type = 'w' OR A.type = 'r') AND
  (B.type = 'w' OR B.type = 'r') AND
  (GeometryType(A.the_geom) = 'POLYGON' OR GeometryType(A.the_geom) = 'MULTIPOLYGON') AND
  (GeometryType(B.the_geom) = 'POLYGON' OR GeometryType(B.the_geom) = 'MULTIPOLYGON')
ORDER BY
 aid;
