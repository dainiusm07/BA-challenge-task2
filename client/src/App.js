import React, {useState, useEffect} from 'react';
import './App.css';
import TextField from '@material-ui/core/textfield';
import Button from '@material-ui/core/button';
import axios from 'axios';

function App() {
  function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Sausio','Vasario','Kovo','Balandžio','Gegužės','Birželio','Liepos','Rugpjūčio','Rugsėjo','Spalio','Lapkričio','Gruodžio'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = year + ' ' + month + ' ' + date;
    return time;
  }

  const [ feedbacks , setFeedbacks ] = useState([])

  const [ firstname , setFirstname ] = useState('')
  const handleFirstnameChange  = (event) => { setFirstname(event.target.value) }

  const [ lastname , setLastname ] = useState('')
  const handleLastnameChange  = (event) => { setLastname(event.target.value) }

  const [ comment , setComment ] = useState('')
  const handleCommentChange  = (event) => { setComment(event.target.value) }

  const [ email , setEmail ] = useState('')
  const handleEmailChange  = (event) => { setEmail(event.target.value) }

  const [validation, setValidation] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (firstname==='' || lastname===''
    || email==='' || comment==='') {
      setValidation(true);
      return;
    } 

    axios({
      method: 'post',
      url: '/feedbacks',
      data: {
        firstname,
        lastname,
        email,
        date: Date.now(),
        comment
      }
    }).then( e => window.location.reload());
  }

  function disclaimer () {
    if (comment !== '')
        return (<div className="feedback" style={{
          textAlign: 'center',
          backgroundColor: '#3f51b5',
          textTransform: 'uppercase',
          color: 'white',
          fontWeight: 'bold'}}>
          {feedbacks.some(feedback => feedback.comment.split(' ').some( word => comment.split(' ').includes(word)))? 'Panašūs atsiliepimai' : 'Panašių atsiliepimų nėra'}
          </div>);
    
  }

  useEffect( ()=> {
    axios.get('/feedbacks').then(result => {setFeedbacks(result.data.body); console.log(feedbacks)})
  }, [])

  return (
    <React.Fragment>
      <form noValidate autoComplete="off" className="feedback" onSubmit={handleSubmit}>
        <span className="feedback-date">{ timeConverter(Date.now()/1000) }</span>

        <div className="feedback-row">
          <TextField
          label="Vardas"
          variant="outlined"
          style={{width: '48%'}}
          value={firstname}
          onChange={handleFirstnameChange}
          error={!validation ? false : firstname === '' ? true : false}
          />

          <TextField
          label="Pavardė"
          variant="outlined"
          style={{width: '48%'}}
          value={lastname}
          onChange={handleLastnameChange}
          error={!validation ? false : lastname === '' ? true : false}
          />
        </div>

        <div className="feedback-row">
          <TextField 
          label="El. paštas"
          variant="outlined"
          fullWidth value={email}
          onChange={handleEmailChange}
          error={!validation ? false : email === '' ? true : false}
          />
        </div>

        <div className="feedback-row">
          <TextField
            fullWidth
            placeholder="Komentaras"
            multiline={true}
            rows={6}
            variant="outlined"
            value={comment}
            onChange={handleCommentChange}
            error={!validation ? false : comment === '' ? true : false}
          />
        </div>

        <div className="feedback-row">
        <Button variant="contained" color="primary" fullWidth type="submit">
          Palikti atsiliepimą
        </Button>
        </div>
      </form>
      {disclaimer()}
      {/* Similar comments */}
      {feedbacks.map(feedback => {
        if(feedback.comment.split(' ').some( word => comment.split(' ').includes(word)))
        return (
          <div className="feedback">
            <span className="feedback-date">{ timeConverter(feedback.date/1000) }</span>
            <div className="feedback-row">
              <div style={{fontWeight: 'bold'}}>{feedback.firstname + ' ' + feedback.lastname}</div>
            </div>
            <div className="feedback-row">
              <div>{feedback.email}</div>
            </div>
            <div className="feedback-row">
              <div>{feedback.comment}</div>
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
}

export default App;
