'use strict'

const { basename } = require('path')
const url = require('url')
const { Router } = require('express')
const request = require('request')
const noCache = require('nocache')

const handle = (u) => basename(url.parse(u).pathname)

module.exports = ({ 'api-key': apiKey, secret }) => {
  const router = Router()
  router.get('/filestack/script.js', noCache(), (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.send(`window.filepicker.setKey(${JSON.stringify(apiKey)})`)
  })
  router.delete('/filestack', (req, res, next) => {
    const { url } = req.query
    if (!url || !url.match(/filestack/)) return res.sendStatus(400)
    request.delete(`https://www.filestackapi.com/api/file/${handle(url)}`, {
      qs: { key: apiKey },
      auth: {
        user: 'app',
        pass: secret
      }
    }).on('error', next)
      .on('response', r => {
        res.writeHead(r.statusCode, r.headers)
        r.pipe(res)
      })
  })
  return router
}
