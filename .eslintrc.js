module.exports = {
    "extends": ["plugin:jest/recommended", "airbnb-base"],
    "env": {
      "jest": true,
    },
    "overrides": [
      {
        "files": ["features/**/*.js"],
        "rules": {
          "import/no-extraneous-dependencies": "off"
        }
      },
      {
        "files": ["**/*.js"],
        "rules": {
          "no-use-before-define": ["error",
            {"functions": false, "variables": true}],
            "no-console": "off"
        }
      }
    ]
  };