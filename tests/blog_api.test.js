const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

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

describe('tests that require an authentication token', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })
  test('a valid blog can be added to database', async () => {
    const req = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const testBlog = {
      title: 'This is a test post',
      author: 'Test',
      url: '/test-blog'
    }

    await api
      .post('/api/blogs')
      .auth(req.body.token, { type: 'bearer' })
      .send(testBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('This is a test post')
  })

  test('login with incorrect credentials returns a 401 status code', async () => {
    await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekreto' })
      .expect(401)
  })

  test('adding a blog unathenticated should return a 401 status code', async () => {
    const testBlog = {
      title: 'This is another test post',
      author: 'Test',
      url: '/test-blog-vengence'
    }

    await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('an invalid blog returns a 400 error', async () => {
    const req = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const testBlog = {
      title: '',
      author: '',
      url: ''
    }

    await api
      .post('/api/blogs')
      .auth(req.body.token, { type: 'bearer' })
      .send(testBlog)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})