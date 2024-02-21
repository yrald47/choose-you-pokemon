import pokeball from './pokeball.svg'
import './App.css';
import Select from "react-select";
import { useEffect, useState } from 'react';

function App() {
  const [datas, setDatas] = useState([])
  const [selected, setSelected] = useState("")
  const [labelSelected, setLabelSelected] = useState("");
  const [isShow, setIsShow] = useState(false)
  const [baseExp, setBaseExp] = useState(0)
  
  const getPokemons = async () => {
    const pokemons = await fetch("https://pokeapi.co/api/v2/pokemon/")
    const value = await pokemons.json()
    const results = value.results.map(data => {
      return {
        label: data.name
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        value: data.url,
      };
    })
    setDatas(results.sort((a, b) => a.label > b.label ? 1 : -1))
    // setDatas(results.sort((a, b) => a.label.localeCompare(b.localeCompare)))
    // console.log(results)
    console.log(datas)
  }
  useEffect(() => {
    getPokemons()
  }, [])

  // const handleSubmit = async () => {
  //   console.log(selected)
  //   setIsShow(state => !state)
  //   const detail = await fetch(selected)
  //   const value = await detail.json()
  //   setBaseExp(value.base_experience)
  // }

  const handleChange = async (event) => {
    if (event) {
      const selectedValue = event.value;
      setSelected(selectedValue);
      setLabelSelected(event.label);

      const detail = await fetch(selectedValue);
      const value = await detail.json();
      setBaseExp(value.base_experience);
    }
    else{
      setSelected("");
      setLabelSelected("");
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <code>Choose Your Pokemon</code>
        </p>
        <img src={pokeball} className="App-logo" alt="logo" />
        <Select
          options={datas}
          className="select"
          isClearable={true}
          onChange={(e) => handleChange(e)}
        />
        {/* <button className="button" onClick={() => handleSubmit()} >
          <code>{isShow ? "Hide Value" : "Show Value"}</code>
        </button> */}
        <h1>
          <code>
            {selected ? `You choose ${labelSelected} (${baseExp} exp)` : ""}
          </code>
        </h1>
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}

export default App;
