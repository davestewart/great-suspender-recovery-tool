const Path = require('path')
const fs = require('fs')
const zip = require('bestzip')

const target = Path.resolve(__dirname, '../../releases')
const manifest = require('../code/manifest.json')

if (!fs.existsSync(target)) {
  fs.mkdirSync(target)
}

zip({
  cwd: 'code',
  source: '*',
  destination: `${target}/${manifest.name} ${manifest.version}.zip`,
}).then(function () {
  console.log('All done!')
}).catch(function (err) {
  console.error(err.stack)
  process.exit(1)
})
