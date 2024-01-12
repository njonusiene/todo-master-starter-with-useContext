import { useEffect, useRef, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Input from "./components/Input";
import List from "./components/List";
import TodosContext from "./contexts/TodosContext";

function App() {
  const [listData, setListData] = useState([])
  const firstRender = useRef(true)

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch("https://jsonplaceholder.typicode.com/todos");
      const result = await resp.json();
      const fiveItems = result.slice(0, 5);
      setListData(fiveItems);
    };
    fetchData();
  }, []);

  
  useEffect(() => {
    if(firstRender.current) {
      firstRender.current = false
      return;
    }

    localStorage.setItem("listData", JSON.stringify(listData))
  }, [listData])

  return (
   <TodosContext.Provider value={{listData, setListData}}>
      <Header/>
      <Input/>
      <List/>
    </TodosContext.Provider>
  );
}

export default App;
