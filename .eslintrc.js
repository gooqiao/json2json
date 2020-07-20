module.exports = {
    parser: '@typescript-eslint/parser',
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
    },
    plugins: ['@typescript-eslint'],
    rules: {
        // 禁止使用 var
        'no-var': "error",
        // 优先使用 interface 而不是 type
        '@typescript-eslint/consistent-type-definitions': [
            "error",
            "interface"
        ]
    }
}