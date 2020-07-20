declare var _default: {
    "/test/api/user": {
        name: string;
        contact: {
            _key: string;
            phone: string;
        };
        formerName: string;
        loginData: {
            _key: string;
            time: string;
            host: {
                ip: string;
            };
        };
        family: {
            _key: string;
            _formatter: (data: any) => any[];
        };
        father: {
            _key: string;
            _includeKeys: string[];
        };
        loginDatas: {
            _key: string;
            time: string;
            host: {
                ip: string;
            };
        };
    };
};
export default _default;
