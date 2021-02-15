const Path = require('path')
const fs = require('fs')
const zip = require('bestzip')

const manifest = require('../code/manifest.json')
const target = Path.resolve(__dirname, '../../releases')
const destination = `${target}/${manifest.name} ${manifest.version}.zip`

if (!fs.existsSync(target)) {
  fs.mkdirSync(target)
}

zip({
  cwd: 'code',
  source: '*',
  destination,
}).then(function () {
  console.log(`at (${target}:0:0)`)
}).catch(function (err) {
  console.error(err.stack)
  process.exit(1)
})
