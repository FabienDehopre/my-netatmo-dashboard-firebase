#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const isProd = process.argv[2] === '--prod';
const environmentFilesDirectory = path.join(__dirname, '../src/environments');
const targetEnvironmentTemplateFileName = isProd ? 'environment.prod.ts.template' : 'environment.ts.template';
const targetEnvironmentFileName = isProd ? 'environment.prod.ts' : 'environment.ts';

// Define default values in case there are no defined ones,
// but you should define only non-crucial values here,
// because build should fail if you don't provide the correct values
// for your production environment
const defaultEnvValues = {};

// Load template file
const environmentTemplate = fs.readFileSync(path.join(environmentFilesDirectory, targetEnvironmentTemplateFileName), { encoding: 'utf-8' });

// Generate output data
const output = ejs.render(environmentTemplate, Object.assign({}, defaultEnvValues, process.env));
// Write environment file
fs.writeFileSync(path.join(environmentFilesDirectory, targetEnvironmentFileName), output, { encoding: 'utf-8' });

process.exit(0);
