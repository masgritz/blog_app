const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())

  await Promise.all(promiseArray)
})

test('blogs are in json format and match the initial blog object length', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const res = await api.get('/api/blogs')
  expect(res.body).toHaveLength(helper.initialBlogs.length)
})

test('blogs have a property named "id"', async () => {
  const res = await api.get('/api/blogs')
  expect(res.body[0].id).toBeDefined()
})

test('a valid blog can be added to database', async () => {
  const testBlog = {
    title: 'This is a test post',
    author: 'Test',
    url: '/test-blog'
  }

  await api
    .post('/api/blogs')
    .send(testBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain('This is a test post')
})

test('an invalid blog returns a 400 error', async () => {
  const testBlog = {
    title: '',
    author: '',
    url: ''
  }

  await api
    .post('/api/blogs')
    .send(testBlog)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})