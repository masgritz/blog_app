const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.send(blogs)
})

blogRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog) {
    res.send(blog)
  } else {
    res.status(404).end()
  }
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

blogRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body

  const blog = {
    title,
    author,
    url,
    likes
  }

  const updatedBlog = Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
  res.send(updatedBlog)
})

blogRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

module.exports = blogRouter