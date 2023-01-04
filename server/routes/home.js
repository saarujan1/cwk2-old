import express from 'express'
export const homeRouter = express.Router()

homeRouter.use((req, res, next) => {
  console.log(Date.now(), ': Routing to home')
  next()
})

homeRouter.get('/', function (req, res, next) {
  res.json({ message: 'home.' })
  // const data = { name: 'World' }
  // res.render('index', { data })
})
