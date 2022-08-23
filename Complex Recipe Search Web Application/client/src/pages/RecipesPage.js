import React from "react";
import {
  Form,
  FormInput,
  FormGroup,
  Button,
  Card,
  CardBody,
  CardTitle,
  Progress,
} from "shards-react";

import {
  Table,
  Pagination,
  Select,
  Row,
  Col,
  Divider,
  Slider,
  Rate,
} from "antd";
import { format } from "d3-format";

import MenuBar from "../components/MenuBar";
import { getRecipeSearch, getRecipe, getAllRecipes } from "../fetcher";

// Convert the time to an integer
function convertTime(time) {
  var totalTime = 0;
  console.log("This is the time: " + time);
  if (time.includes("X") || time === "" || time === " " || time === null) {
    return 0;
  } else {
    if (time.includes("d") && time.includes("h") && time.includes("m")) {
      var days = time.split("d")[0];
      var hours = time.split("h")[1];
      var minutes = time.split("m")[2];
      totalTime =
        parseInt(days) * 24 * 60 + parseInt(hours) * 60 + parseInt(minutes);
    } else if (time.includes("d") && time.includes("h")) {
      var days = time.split("d")[0];
      var hours = time.split("h")[1];
      totalTime = parseInt(days) * 24 * 60 + parseInt(hours) * 60;
    } else if (time.includes("d") && time.includes("m")) {
      var days = time.split("d")[0];
      var minutes = time.split("m")[1];
      totalTime = parseInt(days) * 24 * 60 + parseInt(minutes);
    } else if (time.includes("h") && time.includes("m")) {
      var hours = time.split("h")[0];
      var minutes = time.split("m")[1];
      totalTime = parseInt(hours) * 60 + parseInt(minutes);
    } else if (time.includes("h")) {
      var hours = time.split("h")[0];
      totalTime = parseInt(hours) * 60;
    } else if (time.includes("m")) {
      var minutes = time.split("m")[0];
      totalTime = parseInt(minutes);
    } else {
      totalTime = parseInt(time);
    }
  }

  console.log(totalTime);

  return totalTime;
}

const recipesColumns = [
  //may not need this
  {
    title: "Photo",
    dataIndex: "RecipePhoto",
    key: "RecipePhoto",
    render: (imageUrl) => <img src={imageUrl} width={150} height={150} />,
  },
  {
    title: "Name",
    dataIndex: "RecipeName",
    key: "RecipeName",
    sorter: (a, b) => a.RecipeName.localeCompare(b.RecipeName),
    render: (text, row) => <a href={`/recipe?id=${row.RecipeID}`}>{text}</a>,
  },
  {
    title: "Reviews",
    dataIndex: "ReviewCount",
    key: "ReviewCount",
    sorter: (a, b) => (a.ReviewCount ? a.ReviewCount - b.ReviewCount : 0),
  },
  // Not sure if this is needed
  //   {
  //     title: "Author",
  //     dataIndex: "Author",
  //     key: "Author",
  //     sorter: (a, b) => a.Author.localeCompare(b.Author),
  //   },
  //Total time is a string, need to convert it to int
  {
    title: "Time",
    dataIndex: "TotalTime",
    key: "TotalTime",
    sorter: (a, b) =>
      a.TotalTime && a.TotalTime !== "X"
        ? convertTime(a.TotalTime) - convertTime(b.TotalTime)
        : 0, //parseInt(a.TotalTime) - parseInt(b.TotalTime),
  },
  {
    title: "Ingredients",
    dataIndex: "Ingredients",
    key: "Ingredients",
    //if a and b are undefined, we have to do not compare them
    sorter: (a, b) =>
      a.Ingredients ? a.Ingredients.localeCompare(b.Ingredients) : 0,
    render: (text) =>
      text
        ? text.replaceAll("***", " ").replaceAll("**", " ").substring(0, 50) +
          "..."
        : "",
  },
];

class RecipesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameQuery: "",
      reviewLowQuery: 0,
      reviewHighQuery: 500,
      prepareTimeLowQuery: 5,
      prepareTimeHighQuery: 60,
      cookTimeLowQuery: 1,
      cookTimeHighQuery: 20,
      totalTimeLowQuery: 5,
      totalTimeHighQuery: 60,
      //unsure about how this works, might need a rework
      selectedRecipeId: window.location.search
        ? window.location.search.substring(1).split("=")[1]
        : 7003, //default to 7000, which is the first recipe
      selectedRecipeDetails: null,
      recipeResults: [],
    };

    this.handleNameQueryChange = this.handleNameQueryChange.bind(this);
    this.handleReviewQueryChange = this.handleReviewQueryChange.bind(this);
    this.handlePrepareTimeQueryChange =
      this.handlePrepareTimeQueryChange.bind(this);
    this.handleCookTimeQueryChange = this.handleCookTimeQueryChange.bind(this);
    this.handleTotalTimeQueryChange =
      this.handleTotalTimeQueryChange.bind(this);
    this.updateSearchResults = this.updateSearchResults.bind(this);
  }

  handleReviewQueryChange(value) {
    this.setState({ reviewLowQuery: value[0] });
    this.setState({ reviewHighQuery: value[1] });
  }

  handlePrepareTimeQueryChange(value) {
    this.setState({ prepareTimeLowQuery: value[0] });
    this.setState({ prepareTimeHighQuery: value[1] });
  }

  handleCookTimeQueryChange(value) {
    this.setState({ cookTimeLowQuery: value[0] });
    this.setState({ cookTimeHighQuery: value[1] });
  }

  handleTotalTimeQueryChange(value) {
    this.setState({ totalTimeLowQuery: value[0] });
    this.setState({ totalTimeHighQuery: value[1] });
  }

  handleNameQueryChange(event) {
    this.setState({ nameQuery: event.target.value });
  }

  updateSearchResults() {
    getRecipeSearch(
      this.state.nameQuery,
      this.state.reviewLowQuery,
      this.state.reviewHighQuery,
      this.state.prepareTimeLowQuery,
      this.state.prepareTimeHighQuery,
      this.state.cookTimeLowQuery,
      this.state.cookTimeHighQuery,
      this.state.totalTimeLowQuery,
      this.state.totalTimeHighQuery
    );
  }

  componentDidMount() {
    getRecipeSearch(
      this.state.nameQuery,
      this.state.reviewLowQuery,
      this.state.reviewHighQuery,
      this.state.prepareTimeLowQuery,
      this.state.prepareTimeHighQuery,
      this.state.cookTimeLowQuery,
      this.state.cookTimeHighQuery,
      this.state.totalTimeLowQuery,
      this.state.totalTimeHighQuery,
      null,
      null
    ).then((res) => {
      this.setState({ recipeResults: res.results });
    });

    getRecipe(this.state.selectedRecipeId).then((res) => {
      this.setState({ selectedRecipeDetails: res.results[0] });
      console.log(
        "Current recipe : " +
          JSON.stringify(this.state.selectedRecipeDetails, null, 4)
      );
      console.log(
        "Recipe name: " + this.state.selectedRecipeDetails.RecipeName
      );
    });

    getAllRecipes().then((res) => {
      this.setState({ recipeResults: res.results });
      console.log(res.results); //remove this?
    });
  }

  render() {
    return (
      <div>
        <MenuBar />
        <Form style={{ width: "80vw", margin: "0 auto", marginTop: "5vh" }}>
          <Row>
            <Col flex={2}>
              <FormGroup style={{ width: "20vw", margin: "0 auto" }}>
                <label>Title</label>
                <FormInput
                  placeholder="Chicken Fingers"
                  value={this.state.nameQuery}
                  onChange={this.handleNameQueryChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "20vw", margin: "0 auto" }}>
                <label>Reviews</label>
                <Slider
                  range
                  defaultValue={[0, 500]}
                  onChange={this.handleReviewQueryChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "20vw", margin: "0 auto" }}>
                <label>Prepare Time</label>
                <Slider
                  range
                  defaultValue={[5, 60]}
                  onChange={this.handlePrepareTimeQueryChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "20vw", margin: "0 auto" }}>
                <label>Cook Time</label>
                <Slider
                  range
                  defaultValue={[1, 20]}
                  onChange={this.handleCookTimeQueryChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "20vw", margin: "0 auto" }}>
                <label>Total Time</label>
                <Slider
                  range
                  defaultValue={[5, 60]}
                  onChange={this.handleTotalTimeQueryChange}
                />
              </FormGroup>
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col flex={2}>
              <FormGroup style={{ width: "10vw" }}>
                <Button
                  style={{ marginTop: "4vh" }}
                  onClick={this.updateSearchResults}
                >
                  Search
                </Button>
              </FormGroup>
            </Col>
          </Row>
          <Table
            dataSource={this.state.recipeResults}
            columns={recipesColumns}
            pagination={{
              pageSizeOptions: [5, 10],
              defaultPageSize: 5,
              showQuickJumper: true,
              loading: true,
              ellipsis: true,
            }}
          />
        </Form>
        <Divider />
      </div>
    );
  }
}

export default RecipesPage;
