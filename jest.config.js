const path = require('path');

const setupTestFile = path.resolve('setup-tests.ts')

module.exports = {
  ...require('@ttteam-org/frontend-configs/jest/jest.config')({ setupFilesAfterEnv: setupTestFile }),
};
