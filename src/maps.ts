export default {
  "/test/api/user": <ApiMap>{
    name: "UserName",
    contact: {
      _key: "ContactInfo", // 对方的key
      phone: "TelPhone",
    },
    formerName: "NameHistory",
    loginData: {
      _key: "LoginRecord[0]", // 取对方LoginRecord第0个
      time: "LoginTime",
      host: {
        ip: "IP",
      },
    },
    family: {
      _key: "Family",
      _formatter: function (data) {
        // 自定义函数转换
        var result = [];
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const element = data[key];
            result.push({ ...element, type: key });
          }
        }
        return result;
      },
    },
    father: {
      _key: "Family.father",
      _includeKeys: ["name"],
      // _excludeKeys:["age"]
      // name: "name"
    },
    // 取数组
    loginDatas: {
      _key: "LoginRecord",
      time: "LoginTime",
      host: {
        ip: "IP",
      },
    },
  },
};
