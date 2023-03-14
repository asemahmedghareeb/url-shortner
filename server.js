const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb+srv://admin:123@cluster0.6oss6gh.mongodb.net/?retryWrites=true&w=majority')
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.get('/:shortUrl',async(req,res)=>{
    const shortUrl=await ShortUrl.findOne({short:req.params.shortUrl}) 
    if(shortUrl==null)return res.sendStatus(404)
    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full) 
})
//create
app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })
  res.redirect('/')
}) 
//read
app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})
//update
app.put('/:id',async(req,res)=>{
    await ShortUrl.findByIdAndUpdate(req.params.id,{full:req.body.fullUrl})
    res.redirect('/')
})
//delete
app.delete('/shortUrls/:id',async(req,res)=>{
    await ShortUrl.findByIdAndDelete(req.params.id)
    res.redirect('/')
})
app.get('/edit/:id',async(req,res)=>{
    const Url = await ShortUrl.findById(req.params.id)
    res.render('edit', { U: Url })
})
 
app.listen(process.env.PORT||3000,()=>{
    console.log('server is running on port 3000')
})
