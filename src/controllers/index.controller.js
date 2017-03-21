import express from 'express'

const router = express.Router()

router.get('/new', function(req, res) {
  res.render('index', {
    title: 'index lks'
  })
})

export default {
	router,
	url: '/posts'
}
