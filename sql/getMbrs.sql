SELECT
  MbrMinX(all_geoms) AS left,
  MbrMinY(all_geoms) AS bottom,
  MbrMaxX(all_geoms) AS right,
  MbrMaxY(all_geoms) AS top
FROM (
  SELECT
    ST_UNION(the_geom) AS all_geoms
  FROM
    {{tableName}}_geoms
  );
