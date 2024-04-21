
import { useState } from 'react';


const App = () => {
  const [error, setError] = useState("");
  const [value,setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  const surpriseOptions = [
    'Who was the first programmer?',
     'How be a billionaire?',
     'Is it possible to be software engineer without coding?'
  ];


  const surprise = () => {

    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    setValue(randomValue);
  }

  
  const clear = () => {
    setChatHistory([]);
    setError("")
    setValue("");
  }


  const getResponse = async () =>
  {
    if(!value){
      setError("Error! Please ask a question");
      return;
    }

    try {
      const options = {
        method : 'POST',
        body: JSON.stringify({
          history : chatHistory,
          message : value
        }),
        headers : {
          'Content-Type' : 'Application/json'
        }
      }
      isLoading = true;
      const response = await fetch('http://localhost:8000/gemini', options);
      const data = await response.text();
      isLoading = false;
      console.log(data);
      setChatHistory(oldChatHistory => [...oldChatHistory, {
        role : "user",
        parts : value
      },

      {
        role : 'model',
        parts : data
      }
    ]);

    setValue("");

    } catch (error) {
      console.error(error);
      setError("Something went wrong! Please try again later");
    }
  }

  return (
  
     <div className='app'>
     <p>What do you want to know?
     <button className='surprise' onClick={surprise} disabled={!chatHistory} >Surprise Me</button>
     </p>

     <div className='input-container'>
      <input

       value = {value}
       placeholder='Write what you want to know'
       onChange = {(e) => setValue(e.target.value)}

      />
      {!error && <button onClick={getResponse}>Ask Me</button>}
      {error &&  <button onClick={clear}>Clear</button>}

     </div>

     {error && <p>{error}</p>}
     {isLoading && <p>Loading...</p>}
     
     <div className='search-results'>
      
      {chatHistory.map((chatItem, _index) => <div key={_index}>

        <p className='answer'>{chatItem.role} : {chatItem.parts}</p>
      </div>)}

     </div>


     </div>
 
  );
}

export default App;
