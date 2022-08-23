const path = require('path')
const fs = require('fs-extra')

const distPath = path.resolve(__dirname, '../dist')

function deleteDist(path) {
  if (fs.existsSync(path)) {
    fs.removeSync(path)
  }
}

deleteDist(distPath)
