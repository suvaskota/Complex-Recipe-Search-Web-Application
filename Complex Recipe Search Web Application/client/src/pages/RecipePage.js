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

import MenuBar from "../components/MenuBar";
import { getAllRecipes, getRecipe } from "../fetcher";

//Work on styling a bit and add a back button and have a list of ingredients stacked on top of each other

class RecipePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRecipeId: window.location.search
        ? window.location.search.substring(1).split("=")[1]
        : 7000,
      selectedRecipeDetails: null,
    };
  }

  componentDidMount() {
    getAllRecipes().then((res) => {
      this.setState({ recipesResults: res.results });
      console.log("All recipes: " + res.results); //remove this?
    });
    getRecipe(this.state.selectedRecipeId).then((res) => {
      console.log(res);
      this.setState({ selectedRecipeDetails: res.results[0] });
      console.log(res.results[0]);
      console.log("RecipeID: " + this.state.selectedRecipeId);
    });
  }

  //{RecipeName, RecipeID, ReviewCount, RecipePhoto, Author, PrepareTime, CookTime, TotalTime, Ingredients, Directions}).
  render() {
    return this.state.selectedRecipeDetails ? (
      <div>
        <MenuBar />
        <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
          <Card>
            <CardBody>
              <CardTitle>
                <b> {this.state.selectedRecipeDetails.RecipeName} </b>
              </CardTitle>
              <Row>
                <Col>
                  <p>By {this.state.selectedRecipeDetails.Author}</p>
                </Col>
              </Row>
              <Row>
                <Col flex={2}>
                  <img
                    src={this.state.selectedRecipeDetails.RecipePhoto}
                    alt={this.state.selectedRecipeDetails.RecipeName}
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col flex={4} style={{ marginTop: 4 }}>
                  <b>Ingredients: </b>
                  <p>
                    {this.state.selectedRecipeDetails.Ingredients.replaceAll(
                      "**",
                      " "
                    ).replaceAll("***", " ")}
                  </p>
                  <b>Directions: </b>
                  <p>
                    {this.state.selectedRecipeDetails.Directions.replaceAll(
                      "***",
                      " "
                    ).replaceAll("**", " ")}
                  </p>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </div>
    ) : (
      <div>
        <MenuBar />
        <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
          <Card>
            <CardBody>
              <CardTitle>Loading...</CardTitle>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}

export default RecipePage;
