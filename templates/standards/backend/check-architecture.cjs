const { spawnSync } = require('node:child_process');

const result = spawnSync(
  'depcruise',
  ['--config', '.dependency-cruiser.cjs', 'src', '--output-type', 'json'],
  { encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 },
);

if (result.error) {
  console.error(`No se pudo ejecutar dependency-cruiser: ${result.error.message}`);
  process.exit(1);
}

let report;
try {
  report = JSON.parse(result.stdout);
} catch {
  console.error(result.stderr || 'dependency-cruiser no devolvió JSON válido.');
  process.exit(result.status || 1);
}

const violations = [...(report.summary?.violations || [])].map((violation) =>
  `${violation.rule?.name || violation.type}: ${violation.from} → ${violation.to}`,
);

const modulePath = /^src\/modules\/([^/]+)\//;
for (const source of report.modules || []) {
  const fromMatch = source.source.match(modulePath);
  if (!fromMatch) continue;

  for (const dependency of source.dependencies || []) {
    const target = dependency.resolved || '';
    const toMatch = target.match(modulePath);
    if (!toMatch || fromMatch[1] === toMatch[1]) continue;
    if (new RegExp(`^src/modules/${toMatch[1]}/index\\.(?:[cm]?js|tsx?)$`).test(target)) continue;
    violations.push(`modules-use-public-api: ${source.source} → ${target}`);
  }
}

if (violations.length > 0) {
  console.error(violations.join('\n'));
  process.exit(1);
}

if (result.status !== 0) process.exit(result.status || 1);
console.log('No se encontraron infracciones de dependencias backend.');
