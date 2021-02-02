import Convert from "../src/index";

let convert = new Convert({
  unknownField: "exclude",
});

const model = {
  Family: {
    father: {
      name: "jjkjj",
    },
  },
};

test("测试_formatter", () => {
  const res = convert.getData(model, {
    family: {
      _key: "Family",
      name: {
        _key: "father",
        _formatter: function (data, source) {
          // 自定义函数转换
          let result = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const element = data[key];
              result.push({ ...element, type: key });
            }
          }
          expect(result.length === 1);
          expect(result[0].type === "name");

          return result;
        },
      },
    },
  });
});

test("深度key时_formatter参数", () => {
  const res = convert.getData(model, {
    family: {
      _key: "Family",
      name: {
        _key: "father.name",
        _formatter: function (data, source) {
          expect((source as any).Family !== undefined);

          expect(((data as unknown) as string) === "jjkjj");
          return data;
        },
      },
    },
  });
});

test("未知key", () => {
  const res = new Convert({
    unknownField: "exclude",
  }).getData(model, {
    family: {
      _key: "Family",
      name: {
        kkk: "kkkk",
        _key: "father",
      },
    },
  });
  const name = (res as any).family.name;
  expect(name.kkk).toEqual(undefined);
  expect(name.hasOwnProperty("name")).toEqual(false);
});

test("未知key & include unknownField", () => {
  const res = new Convert({
    unknownField: "include",
  }).getData(model, {
    family: {
      _key: "Family",
      name: {
        kkk: "kkkk",
        _key: "father",
      },
    },
  });
  const name = (res as any).family.name;
  expect(name.kkk).toEqual(undefined);
  expect(name.hasOwnProperty("name")).toEqual(true);
});

test("基本类型值的key", () => {
  expect(() => {
    convert.getData(model, {
      family: {
        _key: "Family",
        name: {
          kkk: "kkkk",
          _key: "father.name",
        },
      },
    });
  }).toThrow(Error);
});

test("_excludeKeys", () => {
  const res = new Convert({
    unknownField: "include",
  }).getData(model, {
    family: {
      _key: "Family",
      name: {
        _key: "father",
        _excludeKeys: ["name"],
      },
    },
  });
  const data = (res as any).family;
  expect(data).toEqual({});
});

test("_includeKeys", () => {
  const res = new Convert({
    unknownField: "exclude",
  }).getData(model, {
    family: {
      _key: "Family",
      father: {
        _key: "father",
        _includeKeys: ["name"],
      },
    },
  });
  const data = (res as any).family;
  expect(data).toEqual({ father: { name: "jjkjj" } });
});

test("_includeKeys、_excludeKeys 同时存在, 只应用_includeKeys, ", () => {
  const res = new Convert({
    unknownField: "exclude",
  }).getData(model, {
    family: {
      _key: "Family",
      father: {
        _key: "father",
        _excludeKeys: ["name"],
        _includeKeys: ["name"],
      },
    },
  });
  const data = (res as any).family;
  expect(data).toEqual({ father: { name: "jjkjj" } });
});
