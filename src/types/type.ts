interface ConfigOptions {
  unknownField?: "include" | "exclude";
}

interface ApiMap {
  [key: string]: StringKey | MapOptions | ApiMap;
}

type StringKey = string | string[];

interface MapOptions {
  _key?: string;
  _formatter?: <Data = unknown>(data: Data, source?: Model) => any;
  _includeKeys?: string[];
  _excludeKeys?: string[];
}

type Model = unknown;

// type MapResult =
