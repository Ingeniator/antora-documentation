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
const puppeteer = require('puppeteer');

function shoot(target, dest) {
  puppeteer.launch({args: ["--no-sandbox"]}).then(browser => {
  browser.newPage()
    .then(page => {
      page.goto(target)
        .then(resp => page.screenshot({path: dest}))
        .then(buffer => browser.close());
    });
});
}
const createImageSrc = (doc, target, name) => {
  // target - full url for screenshot
  // name - full name of image
  shoot(target, name)
  return name
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

      blockAttrs.target = createImageSrc(doc, target, alt)
      block = this.createImageBlock(parent, blockAttrs)
    
      if (blockAttrs.title) {
        block['$title='](blockAttrs.title)
      }
      return block
    })
  })
}

module.exports.register = register