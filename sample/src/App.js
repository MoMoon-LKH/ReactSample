import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

function Header(props){ // 함수 -> 컴포넌트, 매개변수 -> Prop 라고 불림
  return <header>
        <h1><a href='/' onClick={(event)=>{
          event.preventDefault();
          props.onchangetMode();
        }}>{props.title}</a></h1>
      </header>
}



function Nav(props){
  const lis = [];

  for(let i = 0; i < props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}><a id={t.id} href={'/read' + t.id} onClick={(event)=>{
      event.preventDefault();
      props.onchangetMode(Number(event.target.id));
    }
    }>{t.title}</a></li>);
  }

  return       <nav>
  <ol>
    {lis}
  </ol>
</nav>

}


function Article(props){
  return <article>
        <h2>{props.title}</h2>
        {props.body}
      </article>
}

function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);

    }}>
      <p><input type="text" name="title" placeholder="title"></input></p>
      <p><textarea name='body' placeholder='body'></textarea></p>
      <p><input type="submit" value="Create"></input></p>
    </form>
  </article>
}

function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  
  return <article>
  <h2>Update</h2>
  <form onSubmit={event=>{
    event.preventDefault();
    const title = event.target.title.value;
    const body = event.target.body.value;
    props.onUpdate(title, body);

  }}>
    <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
      setTitle(event.target.value);
    }}></input></p>
    <p><textarea name='body' placeholder='body' value={body} onChange={event=>{
      setBody(event.target.value);
    }}></textarea></p>
    <p><input type="submit" value="Update"></input></p>
  </form>
</article>
}
// 기존의 값이 value 값으로 주었을 때 state 값으로 변경 후 set
// props 사용자가 외부에서 전달받은 값으로 내부에서 값 변경 x

function App() {
  /* const _mode = useState('WELCOME');
  const mode = _mode[0];
  const setMode = _mode[1]; */

  const [mode, setMode] = useState('WELCOME');
  // prop 컴포넌트를 사용하는 외부자를 위한 데이터
  // state 컴포넌트를 사용하는 내부자를 위한 데이터
  // setMode를 통해 상태를 변경하면 해당 함수가 한번 더 실행됨 
  
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ....'},
    {id:2, title:'css', body:'css is ....'},
    {id:3, title:'js', body:'javascript is ....'},
  ]);

  let content = null;
  let contextControl = null;
  if(mode === 'WELCOME'){
      content = <Article title='Welcome' body='Hello, WEB'></Article>;
       
  } else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <><li><a href={'/update' + id} onClick={event=>{
      event.preventDefault();
      setMode("UPDATE");
    }}>Update</a></li>
    <li>
      <input type='button' value='Delete' onClick={()=>{
        const newTopics = []
        for(let i=0; i<topics.length; i++){
          if(topics[i].id !== id){
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');
      }}></input>
    </li>
    </>
    

  } else if(mode === "CREATE"){
      content = <Create onCreate={(title, body)=>{
        const newTopic = {id:nextId, title:title, body:body}
        const newTopics = [...topics];
        newTopics.push(newTopic);
        setTopics(newTopics);
        setMode('READ');
        setId(nextId);
        setNextId(nextId + 1);
              
      }}></Create>;
  } else if(mode === "UPDATE"){

    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }

    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      const newTopics = [...topics];
      const updatedTopic = {id:id, title:title, body:body};
      
      for(let i = 0; i < newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
        }
      }

      setTopics(newTopics);
      setMode('READ');
      setId(id);

    }}></Update>
  }

  return (
    <div>
      <Header title='WEB' onchangetMode={function(){
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onchangetMode={(id) =>{
        setMode('READ');
        setId(id);
      }}></Nav>  
      {content}
      <ul>
        <li>
          <a href='/create' onClick={event => {
            event.preventDefault();
            setMode('CREATE');
          }}>Create</a>
        </li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
