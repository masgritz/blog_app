const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  res.send(users)
})

userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (password.length < 8) {
    return logger.error('Invalid password! Must be at least 8 characters long.')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  res.send(savedUser)
})

module.exports = userRouter