const express = require('express')
const multer = require('multer')
const crypto = require('crypto')
const path = require('path')
const bodyParser = require('body-parser')
const _ = require('lodash')
const storage = multer.diskStorage({
  destination: 'upload',
  filename: function(req, file, callback){
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return callback(err)
      callback(null, raw.toString('hex') + path.extname(file.originalname))
    })
  },
  fileFilter: function(req, file, callback) {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif']
    if(_.includes(allowedMimes, file.mimetype)) {
      cb(null, true)
    }else{
      cb(new Error('invalid File Type'))
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10mb
  }
})
const upload = multer({ storage: storage })

const app = express()
const port = 8081

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', express.static(path.join(__dirname, 'upload')))

app.post('/upload', upload.single('file'), function(req, res, next){
  const file = req.file
  if(!file){
    return res.send({
      success: false
    })
  }else{
    return res.send({
      success: true,
      ...files
    })
  }
})

app.post('/upload/multiple', upload.array('files', 10), function(req, res, next){
  const files = req.files
  if(!files){
    return res.send({
      success: false
    })
  }else{
    return res.send({
      success: true,
      ...files
    })
  }
})

app.listen(port, () => console.log(`filehost service running on port ${port}`))