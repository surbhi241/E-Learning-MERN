import React, { Component } from "react";
import axios from "axios";
class PublicCourseList extends Component {
  state = {
    data: []
  };
  async componentDidMount() {
    //this.onTextSubmit("react tutorials");

    const response = await axios
      .get("/api/courses")
      .then(result => {
        console.log(result.data[0]);
        return result;
      });

    this.setState({
      data: response.data
    });
  }
  render() {
    let data = this.state.data;

    let Datalist = data.map((val, i) => {
      return (
        <div
          className="col-lg-4 col-md-6 col-12 section-space--bottom--30"
          key={i}
        >
          <div className="service-grid-item">
            <div className="service-grid-item__image">
              <div className="service-grid-item__image-wrapper">
                <a
                  href={
                    `${process.env.PUBLIC_URL}/` +
                    `course-viewer/` +
                    `${val._id}`
                  }
                >
                  <img
                    src={val.image}
                    className="img-fluid"
                    alt="Service Grid"
                  />
                </a>
              </div>

             
            </div>
            <div className="service-grid-item__content">
                <h3 className="title">
                  <a
                    href={
                      `${process.env.PUBLIC_URL}/` +
                      `course-viewer/` +
                      `${val._id}`
                    }
                  >
                    {val.courseName}
                  </a>
                 
                </h3>
                <p className="subtitle">{val.courseDescription}</p>
              </div>
          </div>
          <div className="clearfix"></div>
        </div>
      );
    });

    return (
        <div className="service-item-wrapper">
            <div className="row">{Datalist}</div>

        </div>
    );
  }
}

export default PublicCourseList;
