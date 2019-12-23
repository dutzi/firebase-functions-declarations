#!/usr/bin/env node

const rimraf = require('rimraf');
const argv = require('yargs').argv;
const runScript = require('runscript');
const createFunctionIndex = require('./create-function-index');

const { output } = argv;

if (output) {
  console.log(`Deleting existing output path ("${output}")`);
  rimraf(output, {}, () => {
    console.log(`Running tsc on "./functions/src/index.ts"`);
    runScript(
      `tsc ./functions/src/index.ts --outDir ${output} --emitDeclarationOnly --declaration`,
      { stdio: 'pipe' },
    )
      .then(stdio => {
        console.log(`Creating functions index file ("${output}/index.ts")`);
        createFunctionIndex(output);
      })
      .catch(err => {
        console.error(err);
      });
  });
}
