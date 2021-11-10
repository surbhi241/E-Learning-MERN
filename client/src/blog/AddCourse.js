import React, { Component } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
// import ShowCategory from './ShowCategory';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowCat = props => (
  <option key={props.todo._id} value={props.todo.categoryName}>
    {props.todo.categoryName}
  </option>
);
export default class AddCourse extends Component {
  constructor(props) {
    super(props);

    /** Setting the initial state of the component by assigned an object to this.state **/
    this.state = {
      courseName: "",
      courseDescription: "",
      instructor: this.props.match.params.id,
      category: "",
      todos: []
    };
    this.onChangeCourseName = this.onChangeCourseName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    //to get data from mongo link
    axios
      .get("/api/categories/")
      .then(response => {
        // console.log(response.data);
        this.setState({
          todos: response.data,
          category: response.data[0].categoryName
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  CatList() {
    return this.state.todos.map(function(currentTodo, i) {
      //  console.log(currentTodo.categoryName)
      return <ShowCat todo={currentTodo} key={i} />;
    });
  }

  onChangeCourseName(e) {
    this.setState({
      courseName: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      courseDescription: e.target.value
    });
  }

  onChangeCategory(e) {
    this.setState({
      category: e.target.value
    });
  }
  onSubmit(e) {
    e.preventDefault(); //ensure that the default HTML form submit behaviour is prevented

    console.log(`Form submitted:`);
    console.log(`Todo name: ${this.state.courseName}`);
    console.log(`Todo description: ${this.state.courseDescription}`);
    console.log(`Todo instructor: ${this.state.instructor}`);
    console.log(`Todo category: ${this.state.category}`);

    const newTodo = {
      courseName: this.state.courseName,
      courseDescription: this.state.courseDescription,
      instructor: this.props.match.params.id,
      category: this.state.category
      // todo_completed: this.state.todo_completed
    };

    const data = new FormData();
    data.append("courseName", this.state.courseName);
    data.append("courseDescription", this.state.courseDescription);
    data.append("instructor",  this.props.match.params.id);
    data.append("category",  this.state.category);

    if (this.state.selectedFile) {
      for (var x = 0; x < this.state.selectedFile.length; x++) {
        data.append("file", this.state.selectedFile[x]);
      }
    }

    axios
      .post("/api/course/add", data)

      .then(result => {
        this.props.history.push("/add-lecture/" + this.props.match.params.id);
      });
  }
  checkMimeType = event => {
    //getting file object
    let files = event.target.files;
    //define message container
    let err = [];
    // list allow mime type
    const types = ["image/jpeg", "image/jpg", "image/x-png", "image/png"];
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (types.every(type => files[x].type !== type)) {
        // create error message and assign to container
        err[x] = files[x].type + " is not a supported format\n";
      }
    }
    for (var z = 0; z < err.length; z++) {
      // if message not same old that mean has error
      // discard selected file
      toast.error(err[z]);
      event.target.value = null;
    }
    return true;
  };
  maxSelectFile = event => {
    let files = event.target.files;
    if (files.length > 3) {
      const msg = "Only 3 images can be uploaded at a time";
      event.target.value = null;
      toast.warn(msg);
      return false;
    }
    return true;
  };
  checkFileSize = event => {
    let files = event.target.files;
    let size = 2000000000000000;
    let err = [];
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] = files[x].type + "is too large, please pick a smaller file\n";
      }
    }
    for (var z = 0; z < err.length; z++) {
      // if message not same old that mean has error
      // discard selected file
      toast.error(err[z]);
      event.target.value = null;
    }
    return true;
  };
  onChangeHandler = event => {
    var files = event.target.files;
    if (
      this.maxSelectFile(event) &&
      this.checkMimeType(event) &&
      this.checkFileSize(event)
    ) {
      // if return true allow to setState
      this.setState({
        selectedFile: files,
        loaded: 0
      });
    }
  };
  render() {
    var message = "You selected " + this.state.category;
    return (
      <div>
        <NavBar />
        <div className="container">
          <div className="row">
            <div className="col-md-6 mt-5 mx-auto">
              <form onSubmit={this.onSubmit}>
                <h1 className="h3 mb-3 font-weight-normal">Add Course</h1>
                <div className="form-group">
                  <label>Course Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="coursename"
                    placeholder="Enter Course name"
                    value={this.state.courseName}
                    onChange={this.onChangeCourseName}
                  />
                </div>
                <div className="form-group">
                <label>Course Main Image </label>
                  <input
                    type="file"
                    name="file"
                    className="form-control"
                    multiple
                    onChange={this.onChangeHandler}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    type="text"
                    className="form-control"
                    name="description"
                    placeholder="Enter Description"
                    value={this.state.courseDescription}
                    onChange={this.onChangeDescription}
                  />
                </div>
                <div>
                  <label>Course Category</label>
                  <br />

                  <select
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid lightgray",
                      borderRadius: "5px"
                    }}
                    name="category"
                    id="ada"
                    onChange={this.onChangeCategory}
                    value={this.state.category}
                  >
                    {this.CatList()}
                    {/* <option value="Mobile Development">Android Development</option> */}
                  </select>
                </div>
                <p>{message}</p>
                <br />
                <button
                  type="submit"
                  value="add course"
                  className="btn btn-lg btn-primary btn-block"
                >
                  Add Course
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
