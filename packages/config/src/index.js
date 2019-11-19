const { dirname } = require('path')

const configorama = require('configorama')

const { getConfigPath } = require('./path')
const { addEnvVars } = require('./env')
const { validateConfig } = require('./validate/main')
const { normalizeConfig } = require('./normalize')
const { handleFiles } = require('./files')
const { LIFECYCLE } = require('./lifecycle')

const resolveConfig = async function(configFile, { cwd, context } = {}) {
  const configPath = await getConfigPath(configFile, cwd)
  const baseDir = dirname(configPath)

  const config = await configorama(configPath, {
    options: { context },
    variableSources: [
      {
        /* Match variables ${context:xyz} */
        match: /^context:/,
        async resolver(varToProcess, { context = 'production' }) {
          const objectPath = varToProcess.replace('context:', '')
          return `\${self:context.${context}.${objectPath}}`
        },
      },
    ],
  })

  const configA = addEnvVars(config)

  validateConfig(configA)

  const configB = normalizeConfig(configA)
  const configC = await handleFiles(configB, baseDir)
  return configC
}

module.exports = resolveConfig
module.exports.formatUtils = configorama.format
module.exports.getConfigPath = getConfigPath
module.exports.LIFECYCLE = LIFECYCLE
