#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const isProd = process.argv[2] === '--prod';

// Define default values in case there are no defined ones,
// but you should define only non-crucial values here,
// because build should fail if you don't provide the correct values
// for your production environment
const defaultEnvValues = {};

const defaultEnvTpl = fs.readFileSync(path.join(__dirname, '../src/environments/environment.ts.template'), { encoding: 'utf-8' });
const defaultEnv = ejs.render(defaultEnvTpl, Object.assign({}, defaultEnvValues, process.env));
fs.writeFileSync(path.join(__dirname, '../src/environments/environment.ts'), defaultEnv, { encoding: 'utf-8' });

if (isProd) {
  const prodEnvTpl = fs.readFileSync(path.join(__dirname, '../src/environments/environment.prod.ts.template'), { encoding: 'utf-8' });
  const prodEnv = ejs.render(prodEnvTpl, Object.assign({}, defaultEnvValues, process.env));
  fs.writeFileSync(path.join(__dirname, '../src/environments/environment.prod.ts'), prodEnv, { encoding: 'utf-8' });
}

process.exit(0);
