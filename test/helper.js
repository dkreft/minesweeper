import path from 'path'

export { expect } from 'chai'
export { default as sinon } from 'sinon'
export { default as chai } from 'chai'

export function _require(modPath) {
  const fullPath = path.join('../src', modPath)

  const mod = require(fullPath)

  return ( mod.default ) ? mod.default : mod
}
