const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.send(blogs)
})

blogRouter.post('/', async (req, res) => {
  const { title, author, url } = req.body

  const blog = new Blog({
    title,
    author,
    url,
    likes: 0
  })

  const savedBlog = await blog.save()
  res.send(savedBlog)
})

module.exports = blogRouter