const { cwd } = require('process')

const cleanStack = require('clean-stack')
const stripAnsi = require('strip-ansi')

// Clean stack traces:
//  - remove our internal code, e.g. the logic spawning plugins
//  - remove node modules and Node.js internals
//  - strip process.cwd()
//  - remove colors
// Keep non stack trace lines as is.
// We do not use libraries that patch `Error.prepareStackTrace()` because they
// tend to create issues.
const cleanStacks = function(string) {
  return string.split('\n').reduce(cleanStackLine, '')
}

const cleanStackLine = function(lines, line) {
  const lineA = line.replace(`${cwd()}/`, '')
  const lineB = stripAnsi(lineA)

  if (!STACK_LINE_REGEXP.test(lineB)) {
    return `${lines}\n${lineA}`
  }

  if (isInternalStack(lineB)) {
    return lines
  }

  const lineC = cleanStack(lineB)

  if (lineC === '') {
    return lines
  }

  return `${lines}\n${lineC}`
}

// Check if a line is part of a stack trace
const STACK_LINE_REGEXP = /^\s+at /

const isInternalStack = function(line) {
  return line.includes('build/src/plugins/child/')
}

module.exports = { cleanStacks }
