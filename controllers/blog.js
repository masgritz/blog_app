const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (req, res) => {
  Blog.find({}).then(blogs => {
    res.send(blogs)
  })
})

blogRouter.post('/', (req, res, next) => {
  const { title, author, url } = req.body

  const blog = new Blog({
    title,
    author,
    url,
    date: new Date(),
    likes: 0
  })

  blog.save().then(savedBlog => {
    res.send(savedBlog)
  }).catch(error => next(error))
})

module.exports = blogRouter