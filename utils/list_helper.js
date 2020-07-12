const dummy = (blogs) => {
  return blogs ? 1 : 0
}

const totalLikes = (blogs) => {
  return blogs.reduce((likes, blog) => {
    return likes + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  const { title, author, likes } = blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  })

  return { title, author, likes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}