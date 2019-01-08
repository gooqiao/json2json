
import Convert from './src/convert'
import maps from './src/maps'
import config from './src/config'

function main() {
    const map = Maps["/test/api/user"]
    const data = model
    var convert = new Convert(data, map, Config)
    const result = convert.getData(data, map)
    console.log(result, 888)
}
main()