import React,{useState} from 'React';
import {render} from 'react-dom';
function E(){
  const [conunt,setCount] = useState(0)
  return (<div>
    <p>click {count} times</p>
    <button onClick={()=> setCount(count+1)}>
      点击
    </button>
  </div>)
}
//E();
render(<h1>jsx</h1>,window.root)