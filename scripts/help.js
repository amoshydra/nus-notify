const pkgJson = require('../package');

console.log('> Available commands:')
Object.keys(pkgJson.scripts).map((command) => {
  const actualCommand = pkgJson.scripts[command];
  console.log(`  > ${command}`);
});

console.log('');
console.log('> Use \'npm run <command>\'');
