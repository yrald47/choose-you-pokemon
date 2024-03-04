import pokeball from './pokeball.svg'
import './App.css';
import Select from "react-select";
import { useEffect, useState } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Tooltip } from "react-tooltip";

function App() {
  const pokeAPI = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
  const [datas, setDatas] = useState([])
  const [selected, setSelected] = useState("")
  const [labelSelected, setLabelSelected] = useState("");
  const [baseExp, setBaseExp] = useState(0)
  const [info, setInfo] = useState({})
  const [desc, setDesc] = useState({});

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  useEffect(() => {
    const getPokemons = async () => {
      const pokemons = await fetch(pokeAPI)
      const value = await pokemons.json()
      const results = value.results.map(data => {
        return {
          label: data.name.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
          value: data.url,
        };
      })
      setDatas(results.sort((a, b) => a.label > b.label ? 1 : -1))
      // setDatas(results.sort((a, b) => a.label.localeCompare(b.label.localeCompare)))
    }
    getPokemons()
  }, [])

  const handleChange = async (event) => {
    if (event) {
      const selectedValue = event.value;
      setSelected(selectedValue);
      setLabelSelected(event.label);

      const detail = await fetch(selectedValue);
      const value = await detail.json();
      // const ability_description = value.abilities.map(async (abilityData) => {
      //   let description = await fetch(abilityData.ability.url)
      //   let desc = await description.json()
      //   const effectEntry  = desc.effect_entries.find(entry => entry.language.name === "en");
      //   // return effectEntry ? effectEntry.effect : "No Description";
      //   return {
      //     ...abilityData,
      //     effectEntry
      //   };
      // })

      const ability_description = value.abilities.map(async (ability) => {
        const abilityResponse = await fetch(ability.ability.url);
        const abilityData = await abilityResponse.json();
        const description = abilityData.effect_entries.find((entry) => entry.language.name === "en")?.effect;
        
        return {
          ...ability.ability,
          description,
        };
      })
      
      setDesc(await Promise.all(ability_description));
      setInfo(value)
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
        <div className="header">
          <codes>Choose Your Pokemon</codes>
        </div>
        <div className="subtitle">
          This is just an app that build for learning. API hit from:{" "}
          <a href={pokeAPI} target="blank">
            {pokeAPI}
          </a>
        </div>
        <img src={pokeball} className="App-logo" alt="logo" />
        <Select
          options={datas}
          className="select"
          isClearable={true}
          onChange={(e) => handleChange(e)}
        />
        <h1 className="result">
          <codes>
            {selected ? `You choose ${labelSelected} (${baseExp} exp)` : ""}
          </codes>
        </h1>
        <button
          disabled={!selected}
          className={`button ${selected ? "info" : "disabled"}`}
          onClick={(e) => handleShow(e)}
        >
          {selected ? `Show ${labelSelected} Info` : "Select Pokemon First"}
        </button>
      </header>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{labelSelected || "Pokemon"} Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="info">
            <div>
              <b>Species:</b>{" "}
              {info && info.species ? info.species.name : "unidentified"}
            </div>
            <div>
              <b>Ability:</b>
              <div className="abilities">
                {info && info.abilities && info.abilities.length > 0
                  ? info.abilities.map((ability, index) => (
                      <>
                        <div
                          className="ability"
                          data-tooltip-id="my-tooltip-styles"
                          data-tooltip-content={
                            desc[index].description || "No Description"
                          }
                        >
                          {ability.ability.name}
                        </div>
                        <Tooltip className="mytooltip" id="my-tooltip-styles" />
                      </>
                    ))
                  : ""}
              </div>
            </div>
            <div>
              <b>Weight:</b>
              {info && info.weight ? info.weight : "unidentified"}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
