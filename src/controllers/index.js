import express from 'express'
import glob from 'glob'
import config from '../../config/env'

const router = express.Router()

router.get('/', function(req, res, next) {
    res.send("hope is hope, nerver lose his way")
})

const path = config.rootPath + '/src/controllers/**.controller.js'
let routes = glob.sync(path)

routes.forEach(function(route) {
  console.log('Loading route：' + route)
  let routeCtrl = require(route)
  router.use(routeCtrl.url, routeCtrl.router)
})

export default router