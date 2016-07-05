
import {mapObject, zip} from "./utils";

class TypeNode { }

function makeNodeFactory({plainFields, childFields, objectFields, listField}, name) {
  const argList = (plainFields || []).concat(childFields || []).concat(objectFields || []);

  return (...args) => {
    let node = new TypeNode();
    node.name = name;
    node.meta = {};

    const plainArgs = args.slice(0, argList.length),
          listArgs = args.slice(argList.length);

    zip(argList, plainArgs)
      .forEach(([fieldName, value]) => node[fieldName] = value);

    if (listField) node[listField] = listArgs;

    return node;
  };
}

const schema = {
  string: {},
  boolean: {},
  function: {},
  object: {},
  number: {},
  any: {},
  literal: {
    plainFields: ["value"]
  },
  array: {
    childFields: ["contents"]
  },
  laxStruct: {
    objectFields: ["fields"]
  },
  strictStruct: {
    objectFields: ["fields"]
  },
  dictionary: {
    childFields: ["keys", "values"]
  },
  optional: {
    childFields: ["contents"]
  },
  reference: {
    plainFields: ["referenceName"]
  },
  custom: {
    plainFields: ["label"],
    listField: "args"
  },
  intersection: {
    listField: "parents"
  },
  alternatives: {
    listField: "options"
  }
};

const core = mapObject(schema, makeNodeFactory);

export { core, schema, TypeNode };

