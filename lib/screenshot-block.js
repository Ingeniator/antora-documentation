/**
 * Extends the AsciiDoc syntax to add support for the inline screenshot macro.
 * This macro makes screenshot and insert that image in page
 * format.
 *
 * Usage:
 *
 * .Google Landing page
 * screenshot::http://google.com[google]
 *
 *
 * @author MironovSV
 */

//const { posix: path } = require('path')

const createImageSrc = (doc, target) => {
    // target - full url for screenshot\
  return "some.gif"
  //const imagesDir = doc.getAttribute('imagesdir') 
      console.log('inline macro: ' + target + attrs)
      const text = target.startsWith('couchbase-cli-') ? target.substr(14) : target
  const shouldFetch = doc.isAttribute('kroki-fetch-diagram')
  let imageUrl
  if (shouldFetch && doc.getSafe() < SAFE_MODE_SECURE) {
    imageUrl = require('./fetch.js').save(krokiDiagram, doc, target, vfs, krokiClient)
  } else {
    imageUrl = krokiDiagram.getDiagramUri(krokiClient.getServerUrl())
  }
  return imageUrl
}

function register (registry, context) {
  registry.blockMacro(function () {
    const self = this
    self.named('screenshot')
    self.process((parent, target, attrs) => {
      const doc = parent.getDocument()

      const blockAttrs = Object.assign({}, attrs)
      let alt
      if (attrs.title) {
        alt = attrs.title
      } else if (attrs.target) {
        alt = attrs.target
      } else {
        alt = 'Screenshot'
      }
      blockAttrs.alt = alt

      blockAttrs.target = createImageSrc(doc, target)
      block = this.createImageBlock(parent, blockAttrs)
    
      if (blockAttrs.title) {
        block['$title='](blockAttrs.title)
      }
      return block
    })
  })
}

module.exports.register = register