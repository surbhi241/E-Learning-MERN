import React, { Component } from 'react';
import axios from 'axios';
import NavBar from "../components/NavBar";
import { toast } from "react-toastify";

const ShowCat = props => (
    <option key={props.todo.categoryName} value={props.todo.categoryName}>{props.todo.categoryName}</option>
    
            
);
export default class EditCourse extends Component{
    constructor(props) {
        super(props);
        // initialize the state with an empty todos array
        this.state = {todos: [],
            Cat:[]
        }
    }
    componentDidMount() {
       
        axios.get('/api/course?id='+this.props.match.params.id)
            .then(response => {
                this.setState({ todos: response.data });
            })
            .catch(function (error){
                console.log(error);
            })

        axios.get('/api/categories/')
        .then(response => {
            this.setState({ Cat: response.data });
        })
        .catch(function (error){
            console.log(error);
        })
        }
    
        CatList() {
            return this.state.Cat.map(function(currentTodo, i){
                //  console.log(currentTodo.categoryName)
                return <ShowCat todo={currentTodo} key={i} />;
    
            })
        }

        onChange = (e) => {
            const state = this.state.todos
            state[e.target.name] = e.target.value;
            this.setState({todos:state});
            

          }
        
        //   toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });
       
    
        handleChange(e) {
          var whoIsChecked = {...this.state.whoIsChecked}
          whoIsChecked.allowDestroyAll = e.target.value
          this.setState({whoIsChecked}, ()=> {console.log(this.state)})
          
     }
    
        onSubmit = (e) => {
            e.preventDefault();
        
            const data = new FormData();

            const { courseName, courseDescription, category, instructor } = this.state.todos;

            data.append("courseName", courseName);
            data.append("courseDescription", courseDescription);
            data.append("instructor",  instructor);
            data.append("category",  category);

            if (this.state.selectedFile) {
              for (var x = 0; x < this.state.selectedFile.length; x++) {
                data.append("file", this.state.selectedFile[x]);
              }
            }

            console.log(data)
            axios.put('/api/course?id='+this.state.todos._id, data)
            .then((result) => {
              this.props.history.push("/ShowCourseList/")
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
    render(){
         var message='You selected '+this.state.todos._id
        return(
          <div>
            <NavBar />
            <div class="container">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">
                Edit Course
              </h3>
            </div>
            <div class="panel-body">
             
              {/* <a href={"/showcourses/"} class="btn btn-primary btn active" role="button" aria-pressed="true">Back</a> */}
              <form onSubmit={this.onSubmit}>
                <div class="form-group">
                  <label for="First Name">Course Title:</label>
                  <input type="text" class="form-control" name="courseName" value={this.state.todos.courseName} onChange={this.onChange} placeholder="Course Title" />
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
                <div class="form-group">
                  <label for="Last Name">Course Description:</label>
                  <textarea type="text" class="form-control" name="courseDescription" value={this.state.todos.courseDescription} onChange={this.onChange} placeholder="Description" />
                </div>
                
                            <br />
                
                <button type="submit" class="btn btn-dark">Update</button> &nbsp;
                {/* <button onClick={this.delete.bind(this, this.state.todos._id)} class="btn btn-danger">Delete</button> */}
                {/* <p>{message}</p> */}
              
            
               </form>
            </div>
          </div>
        </div>
        </div>
        )
    }
}