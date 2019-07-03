require('date-utils')

const NeDB = require('nedb')
const path = require('path')
const db = new NeDB({
  filename: path.join(__dirname, 'chat.db'),
  autoload: true
})

const express = require('express')
const app = express()
const portNo = 3001
app.listen(process.env.PORT || portNo, () => {
  console.log('Server running.')
})

app.use('/public', express.static('./public'))
app.get('/', (req, res) => {
  res.redirect(302, '/public')
})

// apiの定義
app.get('/history/list', (req, res) => {
  db.find({}).sort({response_timestamp: 1}).exec((err, data) => {
    if (err) {
      sendJSON(res, false, {logs: [], msg: err})
      return
    }
    console.log(data)
    sendJSON(res, true, {logs: data})
  })
})

// apiの定義
app.get('/chat', (req, res) => {
  // user_input
  const q = req.query
  // bot_response
  var bot_response = ''
  if(q.user_input === 'こんにちは'){
    bot_response = 'こんにちは。'
  }
  if(q.user_input === '今何時?'){
    var now_time = (new Date()).toFormat("HH24"+"時"+"MI"+"分です。")
	bot_response = now_time
  }
  // response_time
  var response_time = (new Date()).toFormat("YYYY-MM-DD"+ "T" +"HH24:MI:SS")
  db.insert({
    user_input: q.user_input,
    bot_response: bot_response,
    response_timestamp: response_time
  }, (err, doc) => {
    if (err) {
      console.error(err)
      sendJSON(res, false, {msg: err})
      return
    }
    sendJSON(res, true, q)
  })
})

function sendJSON (res, result, obj) {
  obj['result'] = result
  res.json(obj)
}