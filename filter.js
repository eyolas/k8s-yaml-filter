#!/usr/bin/env node
const yaml = require("js-yaml");
const get = require("lodash.get");

const argv = require("yargs")
  .option("i", {
    alias: "in_filter",
    describe: "Print only objects in this comma-sep list [type]",
    type: "string"
  })
  .option("o", {
    alias: "out_filter",
    describe: "Print only objects not this comma-sep list [type]",
    type: "string"
  }).argv;

let next = text => console.log(text);

const docInFilter = (filters, doc) => {
  for (const filter of filters) {
    if (get(doc, filter.type) === filter.value) {
      return true;
    }
  }
  return false;
};

const parseFilter = filters => {
  if (filters === undefined) {
    return undefined;
  }

  return filters.split(",").map(f => {
    let type = "kind";
    let value = f;
    const split = f.split("=");
    if (split.length === 2) {
      type = split[0].replace('/', '.');
      value = split[1];
    }

    return {
      type,
      value
    };
  });
};

if (argv.i || argv.o) {
  const in_filter = parseFilter(argv.i);
  const out_filter = parseFilter(argv.o);
  next = text => {
    for (const doc of yaml.loadAll(text)) {
      if (!in_filter || docInFilter(in_filter, doc)) {
        if (!out_filter || !docInFilter(out_filter, doc)) {
          console.log("---");
          console.log(yaml.dump(doc));
        }
      }
    }
  };
}

const getStdin = require("get-stdin");

getStdin().then(next);
