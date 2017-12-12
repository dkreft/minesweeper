import path from 'path'
import chai from 'chai'
import sinonChai from 'sinon-chai'

export { expect } from 'chai'
export { default as sinon } from 'sinon'

chai.use(sinonChai)

export { chai }

export function _require(modPath) {
  const fullPath = path.join('../src', modPath)

  const mod = require(fullPath)

  return ( mod.default ) ? mod.default : mod
}
