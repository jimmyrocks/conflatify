INSERT INTO {{tagTableName}} (
  "osmid",
  "k",
  "v",
  "interesting"
) VALUES (
  {{id}},
  '{{k}}',
  '{{v}}',
  'f'
);
