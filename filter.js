#!/usr/bin/env node
const yaml = require("js-yaml");

const argv = require("yargs")
  .option("i", {
    alias: "in_filter",
    describe: "Print only objects in this comma-sep list kind",
    type: "string"
  })
  .option("o", {
    alias: "out_filter",
    describe: "Print only objects not this comma-sep list",
    type: "string"
  }).argv;

let next = text => console.log(text);

if (argv.i || argv.o) {
  const in_filter = argv.i ? argv.i.split(",") : undefined;
  const out_filter = argv.o ? argv.o.split(",") : undefined;
  next = text => {
    for (const doc of yaml.loadAll(text)) {
      if (!in_filter || in_filter.includes(doc["kind"])) {
        if (!out_filter || !out_filter.includes(doc["kind"])) {
          console.log("---");
          console.log(yaml.dump(doc));
        }
      }
    }
  };
}

const getStdin = require("get-stdin");

getStdin().then(next);
