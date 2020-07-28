const blogRouter = require('express').Router()
const auth = require('../middleware/auth')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
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

blogRouter.post('/', auth, async (req, res) => {
  const { title, author, url } = req.body
  const user = await User.findById(req.user.id)

  const blog = new Blog({
    title,
    author,
    url,
    user: user._id,
    likes: 0
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

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