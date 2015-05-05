INSERT INTO {{tableName}} (
  "osmid",
  "type",
  "meta",
  "the_geom"
) VALUES (
  {{id}},
  '{{type}}',
  '{{meta}}',
  SetSRID(ST_MakeValid(GeomFromGeoJSON('{{geometry}}')), 4326)
);
