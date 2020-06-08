const { getBinPath } = require('get-bin-path')

const { runFixtureCommon, FIXTURES_DIR } = require('./common')

const ROOT_DIR = `${__dirname}/../..`

const runFixture = async function(t, fixtureName, { env: envOption, flags = {}, ...opts } = {}) {
  return runFixtureCommon(t, fixtureName, {
    ...opts,
    binaryPath: await BINARY_PATH,
    flags: { telemetry: false, buffer: true, ...flags },
    env: {
      BUILD_TELEMETRY_DISABLED: '',
      // Ensure local tokens aren't used during development
      NETLIFY_AUTH_TOKEN: '',
      ...envOption,
    },
  })
}

// Use a top-level promise so it's only performed once at load time
const BINARY_PATH = getBinPath({ cwd: ROOT_DIR })

module.exports = { runFixture, FIXTURES_DIR }
