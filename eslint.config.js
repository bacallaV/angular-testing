// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      /* Custom ESLint rules for TypeScript */
      "no-console": [
        "error",
        {
          "allow": ["error"]
        }
      ],
      "quotes": [
        "error",
        "single"
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/array-type": [
        "error",
        {
          "default": "array"
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "_",
          "args": "all"
        }
      ],
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          "allowedNames": [
            "canActivate",
            "intercept",
            "transform"
          ]
        }
      ],
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          "accessibility": "explicit",
          "overrides": {
            "accessors": "explicit",
            "constructors": "off",
            "methods": "explicit",
            "properties": "explicit",
            "parameterProperties": "explicit"
          },
          "ignoredMethodNames": [
            "canActivate",
            "intercept",
            "transform",
            "ngOnInit",
            "ngOnDestroy",
            "ngOnChanges",
            "ngAfterViewInit",
            "ngAfterViewChecked"
          ]
        }
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-inferrable-types": "off",
      "space-before-blocks": "error",
      "semi": [
        "error"
      ],
      "no-extra-semi": "error",
      "semi-style": [
        "error",
        "last"
      ],
      "semi-spacing": [
        "error",
        {
          "before": false,
          "after": true
        }
      ],
      "@typescript-eslint/no-empty-function": [
        "error",
        {
          "allow": [
            "constructors",
            "arrowFunctions"
          ]
        }
      ],
      "@typescript-eslint/parameter-properties": [
        "error",
        {
          "allow": [
            "public readonly",
            "protected readonly",
            "private readonly"
          ]
        }
      ],
      /* Angular ESLint rules */
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
