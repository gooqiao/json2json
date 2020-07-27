import Convert from "../src/main";

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
