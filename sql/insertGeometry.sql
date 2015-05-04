INSERT INTO {{tableName}} (
  "osmid",
  "type",
  "meta",
  "the_geom"
) VALUES (
  {{id}},
  '{{type}}',
  '{{meta}}',
  ST_MakeValid(GeomFromGeoJSON('{{geometry}}'))
);
