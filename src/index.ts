import Convert from "./main.js";
import Maps from "./maps.js";
import Config from "./config";
import model from "./model.js";

function main() {
  const map = Maps["/test/api/user"];
  const data = model;
  var convert = new Convert(data, map, Config);
  const result = convert.getData(data, map);
  console.log(result);
}

main();
