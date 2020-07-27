import Convert from "./main";
import Maps from "./maps";
import Config from "./config";
import model from "./model";

function main() {
  const map = Maps["/test/api/user"];
  const data = model;
  let convert = new Convert(data, map, Config);
  const result = convert.getData(data, map);
  console.log(JSON.stringify(result));
}

main();
