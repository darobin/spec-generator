#!/usr/bin/env node

import { argv, cwd } from "node:process";
import { isAbsolute, join, dirname } from "node:path";
import { program } from 'commander';
import IpseityRunner from "../lib/runner.js";
import makeRel from '../lib/rel.js';
import loadJSON from '../lib/load-json.js';
import die from "../lib/die.js";

const rel = makeRel(import.meta.url);
const { version } = await loadJSON(rel('../package.json'));

program
  .name('ipseity')
  .description('Spec generator for the Interplanetary Stack')
  .version(version)
  .requiredOption('-c, --config <path>', 'path to the configuration file')
  .option('-w, --watch', 'watches the input directory and re-runs with every change', false)
;
program.parse(argv);

let { config, watch } = program.opts();
config = resolve(cwd(), config);
const options = await loadJSON(config);
const configDir = dirname(config);
['input', 'output', 'template'].forEach(k => {
  if (!options[k]) die(`Missing "${k}" field in configuration.`);
  options[k] = resolve(configDir, options[k]);
});
options.runMode = watch ? 'serve' : 'build';

const ir = new IpseityRunner(options);
if (watch) await ir.serve();
else await ir.run();

function resolve (cur, pth) {
  return isAbsolute(pth) ? pth : join(cur, pth)
}
