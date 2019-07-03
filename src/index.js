import React from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent'

class ChatForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user_input: '',
      bot_response: '',
	  response_timestamp: ''
    }
  }
  user_input_Changed (e) {
    this.setState({user_input: e.target.value})
  }
  // 送信
  post (e) {
    request
      .get('/chat')
      .query({
        user_input: this.state.user_input,
        bot_response: this.state.bot_response,
		response_timestamp: this.state.response_timestamp
      })
      .end((err, data) => {
        if (err) {
          console.error(err)
        }
        this.setState({user_input: ''})
        if (this.props.onPost) {
          this.props.onPost()
        }
      })
  }
  render () {
    return (
      <div>
        <input type='text' value={this.state.user_input}
          onChange={e => this.user_input_Changed(e)} />
        <button onClick={e => this.post()}>送信</button>
      </div>
    )
  }
}

// メインコンポーネントを定義
class ChatApp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      items: []
    }
  }
  // 履歴表示
  loadLogs () {
    request
      .get('/history/list')
      .end((err, data) => {
        if (err) {
          console.error(err)
          return
        }
        this.setState({items: data.body.logs})
      })
  }
  render () {
    const itemsHtml = this.state.items.map(e => (
	  <li key={e._id}>{e.response_timestamp.substring(11)} You: {e.user_input} <br/>
	  {e.response_timestamp.substring(11)} Bot: {e.bot_response}</li>
    ))
	return(
	  <div>
		<ChatForm onPost={e => this.loadLogs()} />
		<ul>{itemsHtml}</ul>
	  </div>
	)
  }
}

// DOMにメインコンポーネントを書き込む
ReactDOM.render(
  <ChatApp />,
  document.getElementById('root'))
