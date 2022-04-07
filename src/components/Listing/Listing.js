import React, { Component } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "../Navbar/Navbar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
// var testUser = require("../../contexts/AuthContext");

function TodosData({ children }) {
  const todos = useAuth();
  return children(todos);
}
function injectTodos(Component) {
  const InjectedTodos = function (props) {
    const todos = useAuth(props);
    return <Component {...props} todos={todos} />;
  };
  return InjectedTodos;
}

class Listing extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: "",
      username: "",
      items: [],
      user: null,
      synopsis: "",
      uid: "",
      grade: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleChange1 = (event) => this.setState({ grade: event.target.value });

  onChange(e) {
    e.preventDefault();
    const { currentUser } = this.props.todos;
    const file = e.target.files[0];
    const pathName = currentUser.uid + "/" + file.name;
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(pathName);
    fileRef.put(file).then(() => {
      console.log("Uploaded a file");
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { currentUser, logout } = this.props.todos;
    const itemsRef = firebase.database().ref("items");
    const item = {
      title: this.state.currentItem,
      user: this.state.username,
      uid: currentUser.uid,
      synopsis: this.state.synopsis,
      grade: this.state.grade
    };
    itemsRef.push(item);
    this.setState({
      currentItem: "",
      username: "",
      synopsis: "",
      grade: ""
    });
  }

  componentDidMount() {
    const itemsRef = firebase.database().ref("items");
    itemsRef.on("value", (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user,
          uid: items[item].uid,
          synopsis: items[item].synopsis,
          grade: items[item].grade
        });
      }
      this.setState({
        items: newState
      });
    });
  }
  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }

  render() {
    return (
      <div className="app">
        <Navbar />
        <header>
          <div className="wrapper">
            <h1>Movie Listing</h1>
          </div>
        </header>
        <div className="container">
          <section className="add-item">
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "30rem" }
              }}
              noValidate
              autoComplete="off"
            >
              <form onSubmit={this.handleSubmit}>
                <TextField
                  required
                  id="outlined-required"
                  label="Movie Name"
                  type="text"
                  name="username"
                  placeholder="Movie name?"
                  value={this.state.username}
                  onChange={this.handleChange}
                />

                <TextField
                  required
                  id="outlined-required"
                  label="Production Studios"
                  type="text"
                  name="currentItem"
                  placeholder="Production Studios name?"
                  onChange={this.handleChange}
                  value={this.state.currentItem}
                />

                <TextField
                  required
                  id="outlined-multiline-static"
                  label="synopsis (summary)"
                  name="synopsis"
                  multiline
                  rows={4}
                  value={this.state.synopsis}
                  onChange={this.handleChange}
                />

                <FormControl sx={{ m: 1, minWidth: "30ch" }}>
                  <InputLabel required id="demo-simple-select-label">
                    Grade
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.grade}
                    label="Grade"
                    onChange={this.handleChange1}
                  >
                    <MenuItem value={"A"}>A</MenuItem>
                    <MenuItem value={"B"}>B</MenuItem>
                    <MenuItem value={"C"}>C</MenuItem>
                  </Select>
                </FormControl>
                <br />

                <Button
                  sx={{ m: 1, minWidth: "30ch" }}
                  variant="outlined"
                  component="label"
                >
                  Upload File
                  <input type="file" hidden onChange={this.onChange} />
                </Button>
                <Button
                  sx={{ m: 1, minWidth: "30ch" }}
                  type="submit"
                  variant="contained"
                >
                  Submit
                </Button>
              </form>
            </Box>
          </section>
          <section className="display-item">
            <div className="wrapper">
              <ul>
                {this.state.items.map((item) => {
                  const { currentUser, logout } = this.props.todos;
                  return currentUser.uid == item.uid ? (
                    <li key={item.id}>
                      <p>Movie name: {item.user} </p>
                      <p>Movie Production: {item.title}</p>
                      <p>Movie synopsis: {item.synopsis}</p>
                      <p>Movie grade: {item.grade}</p>
                      <p>User UID: {item.uid}</p>

                      <p>
                        <button onClick={() => this.removeItem(item.id)}>
                          Remove Item
                        </button>
                        <TodosData>
                          {({ currentUser, logout }) => {
                            console.log("erre", currentUser.uid);
                            return <br />;
                          }}
                        </TodosData>
                      </p>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          </section>
          <div className="container">
            {/* .. */}
            {/* <section className="display-item">
              <div className="wrapper">
                <ul>
                  {this.state.items.map((item) => {
                    return (
                      <li key={item.id}>
                        <h3>{item.title}</h3>
                        <p>
                          brought by: {item.user}
                          {item.user === this.state.testUser.displayName ||
                          item.user === this.state.testUser.email ? (
                            <button onClick={() => this.removeItem(item.id)}>
                              Remove Item
                            </button>
                          ) : null}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section> */}
          </div>
        </div>
      </div>
    );
  }
}
export default injectTodos(Listing);
