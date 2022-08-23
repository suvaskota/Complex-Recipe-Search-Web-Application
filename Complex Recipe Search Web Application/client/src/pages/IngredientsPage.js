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
  Select,
  Row,
  Col,
  Divider,
  Slider,
  Rate,
} from "antd";
import { format } from "d3-format";

import MenuBar from "../components/MenuBar";
import { getFromIngredients } from "../fetcher";
const wideFormat = format(".3r");

const ingrclm = [
  {
    title: "Ingredient",
    dataIndex: "Ingredient",
    key: "Ingredient",
    // sorter: (a, b) => a.RecipeName.localeCompare(b.RecipeName),
    // render: (text, row) => <a href={`/recipes?id=${row.RecipeID}`}>{text}</a>,
  },
];

const recipecolumns = [
    {
      title: "Recipe",
      dataIndex: "RecipeName",
      key: "RecipeName",
      sorter: (a, b) => a.RecipeName.localeCompare(b.RecipeName),
      render: (text, row) => <a href={`/recipe?id=${row.RecipeID}`}>{text}</a>,
    },
    {
      title: "Reviews",
      dataIndex: "ReviewCount",
      key: "ReviewCount",
      sorter: (a, b) => a.ReviewCount - b.ReviewCount,
    },
    //may not need this
    {
      title: "Photo",
      dataIndex: "RecipePhoto",
      key: "RecipePhoto",
    },
    //Total time is a string, need to convert it to int
    {
      title: "Required Time",
      dataIndex: "TotalTime",
      key: "TotalTime",
      sorter: (a, b) => parseInt(a.TotalTime) - parseInt(b.TotalTime),
    },
  ];

class IngredientsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingrQuery: "",
      reviewLowQuery: 0,
      reviewHighQuery: 500,
      prepareTimeLowQuery: 5,
      prepareTimeHighQuery: 60,
      cookTimeLowQuery: 1,
      cookTimeHighQuery: 20,
      totalTimeLowQuery: 5,
      totalTimeHighQuery: 60,
      ingredientslist: [],
      error: "",
      recipes: [],
    };


    this.updateIngredientsList = this.updateIngredientsList.bind(this);
    this.handleIngredientChange = this.handleIngredientChange.bind(this);
    this.handleIngrQueryChange = this.handleIngrQueryChange.bind(this);
    this.setError = this.setError.bind(this);
    this.updateRecipes = this.updateRecipes.bind(this);
  }



  setError(e) {
    this.setState({error: e})
  }

  handleIngredientChange(val) {

  }

  updateRecipes(recipes) {
    this.setState({recipes: recipes});
  }

  handleIngrQueryChange(event) {
    this.setState({ ingrQuery: event.target.value })
  }

  handleReviewQueryChange(value) {
    this.setState({ reviewLowQuery: value[0] });
    this.setState({ reviewHighQuery: value[1] });
  }

  handlePrepareTimeChange(value) {
    this.setState({ prepareTimeLowQuery: value[0] });
    this.setState({ prepareTimeHighQuery: value[1] });
  }

  handleCookTimeChange(value) {
    this.setState({ cookTimeLowQuery: value[0] });
    this.setState({ cookTimeHighQuery: value[1] });
  }

  handleTotalTimeChange(value) {
    this.setState({ totalTimeLowQuery: value[0] });
    this.setState({ totalTimeHighQuery: value[1] });
  }

  updateIngredientsList() {
      //when connected to backend should be this:
    // this.getIngredient(
    //   this.state.ingrQuery
    // ).then((res) => {

    // });

    //only add ingredient if 9 or less ingredients are present in the table
    if(this.state.ingredientslist.length >= 10) {
      //too many ingredients, dont allow the addition
      console.log("too many ingredients")
      this.setState({ingrQuery: ""});
      this.setState({error: "Error: can only search for a max of 10 ingredients"});
      return;
    }
    this.setState({ingredientslist: [...this.state.ingredientslist, {Ingredient: this.state.ingrQuery}]});
    this.setState({ingrQuery: ""});
  }

  handleNewIngredient = (e) => {
    e.preventDefault();
    this.updateIngredientsList();
  }

  //used to remove ingredient from list if we dont want to search for it
  deleteRow = (i) => {
    let newlist = this.state.ingredientslist.slice();
    newlist.splice(i, 1);
    this.setState({ingredientslist: newlist});
  }

  //get recipes from db
  search = async (e) => {
    e.preventDefault();
    let res = await getFromIngredients(this.state.ingredientslist);
    console.log(res);
    if(res.error) {
        this.setError(res.error);
    } else {
        this.updateRecipes(res.data);
    }
  }




  componentDidMount() {
      console.log("baloon");
    // getPlayerSearch(
    //   this.state.nameQuery,
    //   this.state.nationalityQuery,
    //   this.state.clubQuery,
    //   this.state.ratingHighQuery,
    //   this.state.ratingLowQuery,
    //   this.state.potHighQuery,
    //   this.state.potLowQuery,
    //   null,
    //   null
    // ).then((res) => {
    //   this.setState({ playersResults: res.results });
    // });

    // TASK 25: call getPlayer with the appropriate parameter and set update the correct state variable.
    // See the usage of getMatch in the componentDidMount method of MatchesPage for a hint!
  }

  render() {
    return (
      <div>
        <MenuBar />
        <Row>
          {this.state.error}
        </Row>
        <Form style={{ width: "80vw", margin: "0 auto", marginTop: "5vh" }} onSubmit={this.handleNewIngredient}>
          <Row>
            <Col flex={2}>
              <FormGroup style={{ width: "20vw", margin: "0 auto" }}>
                <label>Ingredient</label>
                <FormInput
                  placeholder="Search..."
                  value={this.state.ingrQuery}
                  onChange={this.handleIngrQueryChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "10vw" }}>
                <Button
                  style={{ marginTop: "4vh" }}
                  onClick={this.search}
                >
                  Search
                </Button>
              </FormGroup>
            </Col>
          </Row>
          <br></br>
        </Form>
        <Divider />
        <Table
            dataSource={this.state.ingredientslist}
            columns={ingrclm}
            pagination={false}
            onRow={(record, rowIndex) => {
              return {
                onClick: (e) => {
                  console.log(record);
                  this.deleteRow(rowIndex);
                },
              };
            }}
          />
        <Divider />
        <Table
            dataSource={this.state.recipes}
            columns={recipecolumns}
            pagination={{
                pageSizeOptions: [5, 10, 25, 50],
                defaultPageSize: 10,
                showQuickJumper: true,
              }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (e) => {
                  console.log(record);
                  this.viewRecipe(rowIndex);
                },
              };
            }}
          />

        {this.state.selectedPlayerDetails ? (
          <div style={{ width: "70vw", margin: "0 auto", marginTop: "2vh" }}>
            <Card>
              <CardBody>
                <Row gutter="30" align="middle" justify="center">
                  <Col flex={2} style={{ textAlign: "left" }}>
                    <h3>{this.state.selectedPlayerDetails.Name}</h3>
                  </Col>

                  <Col flex={2} style={{ textAlign: "right" }}>
                    <img
                      src={this.state.selectedPlayerDetails.Photo}
                      referrerpolicy="no-referrer"
                      alt={null}
                      style={{ height: "15vh" }}
                    />
                  </Col>
                </Row>
                <Row gutter="30" align="middle" justify="left">
                  <Col>
                    <h5>{this.state.selectedPlayerDetails.Club}</h5>
                  </Col>
                  <Col>
                    <h5>{this.state.selectedPlayerDetails.JerseyNumber}</h5>
                  </Col>
                  <Col>
                    <h5>{this.state.selectedPlayerDetails.BestPosition}</h5>
                  </Col>
                </Row>
                <br></br>
                <Row gutter="30" align="middle" justify="left">
                  <Col>Age: {this.state.selectedPlayerDetails.Age}</Col>
                  {/* TASK 28: add two more columns here for Height and Weight, with the appropriate labels as above */}
                  <Col flex={2} style={{ textAlign: "right" }}>
                    {this.state.selectedPlayerDetails.Nationality}
                    <img
                      src={this.state.selectedPlayerDetails.Flag}
                      referrerpolicy="no-referrer"
                      alt={null}
                      style={{ height: "3vh", marginLeft: "1vw" }}
                    />
                  </Col>
                </Row>
                <Row gutter="30" align="middle" justify="left">
                  <Col>Value: {this.state.selectedPlayerDetails.Value}</Col>
                  <Col>
                    Release Clause:{" "}
                    {this.state.selectedPlayerDetails.ReleaseClause}
                  </Col>
                  {/* TASK 29: Create 2 additional columns for the attributes 'Wage' and 'Contract Valid Until' (use spaces between the words when labelling!) */}
                </Row>
              </CardBody>
            </Card>

            <Card style={{ marginTop: "2vh" }}>
              <CardBody>
                <Row gutter="30" align="middle" justify="center">
                  <Col flex={2} style={{ textAlign: "left" }}>
                    <h6>Skill</h6>
                    <Rate
                      disabled
                      defaultValue={this.state.selectedPlayerDetails.Skill}
                    />
                    <h6>Reputation</h6>
                    {/* TASK 30: create a star rating component for 'InternationalReputation'. Make sure you use the 'disabled' option as above to ensure it is read-only*/}
                    <Divider />
                    <h6>Best Rating</h6>
                    <Progress
                      style={{ width: "20vw" }}
                      value={this.state.selectedPlayerDetails.BestOverallRating}
                    >
                      {this.state.selectedPlayerDetails.BestOverallRating}
                    </Progress>
                    {/* TASK 31: create the headings and progress bars for 'Potential' and 'Rating'. Use the same style as the one above for 'Best Rating'.*/}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>
        ) : null}
      </div>
    );
  }
}

export default IngredientsPage;