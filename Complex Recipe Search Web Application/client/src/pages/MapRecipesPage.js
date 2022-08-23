import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ReactTooltip from "react-tooltip";
import { getRecipesByCountry } from "../fetcher"
import {
    Table,
    Select,
    Row,
    Col,
    Divider,
    Slider,
    Rate,
  } from "antd";

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

import MapChart from "../components/MapChart";
import MenuBar from "../components/MenuBar";

import "../styles/mappage.css"

const countryColumns = [
    {
      title: "Countries",
      dataIndex: "NAME",
      key: "NAME",
      // sorter: (a, b) => a.RecipeName.localeCompare(b.RecipeName),
      // render: (text, row) => <a href={`/recipes?id=${row.RecipeID}`}>{text}</a>,
    },
  ];

  const recipeColumns = [
    {
      title: "Recipe",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.RecipeName.localeCompare(b.RecipeName),
      render: (text, row) => <a href={`/recipe?id=${row.RecipeID}`}>{text}</a>,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      sorter: (a, b) => a.ReviewCount - b.ReviewCount,
    },
  ];

function MapRecipesPage() {
  const [content, setContent] = useState("");
  const [countries, setCountries] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const addCountry = (input) => {
      console.log(input);
      setCountries(countries => [...countries, input]);
  }

  const search = async () => {
      //TODO: add backend search functionality here
      //actually, this button should probably bring up a dropdown with all the possible params
      //we can search on.
      console.log(countries);
      let res = await getRecipesByCountry(countries);
      if(res.error) {
        console.log("something went wrong!")
        setRecipes([{title: "something went wrong...", rating: 0}])
      } else {
        console.log("success");
        setRecipes(res.data);
      }
  }

  return (
    <>
    <MenuBar />
    <div>
        <div id="map">
            <MapChart setTooltipContent={setContent} addCountry={addCountry} />
            <ReactTooltip>{content}</ReactTooltip>
        </div>
        <div id="query-display">
        <Row>
            <Col>
                <FormGroup style={{ width: "10vw" }}>
                    <Button
                    style={{ marginTop: "4vh" }}
                    onClick={search}
                    >
                    Search
                    </Button>
                </FormGroup>
            </Col>
            <Col>
                <FormGroup style={{ width: "10vw" }}>
                    <Button
                    style={{ marginTop: "4vh" }}
                    onClick={() => setCountries([])}
                    >
                    Clear
                    </Button>
                </FormGroup>
            </Col>
        </Row>
        <Table
            dataSource={countries}
            columns={countryColumns}
            pagination={{
                pageSizeOptions: [5, 10, 25, 50],
                defaultPageSize: 5,
                showQuickJumper: true,
              }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (e) => {
                  console.log(record);
                },
              };
            }}
          />
          <Table
            dataSource={recipes}
            columns={recipeColumns}
            pagination={{
                pageSizeOptions: [5, 10, 25, 50],
                defaultPageSize: 5,
                showQuickJumper: true,
              }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (e) => {
                  console.log(record);
                },
              };
            }}
          />
        </div>
    </div>
    </>
  );
}

export default MapRecipesPage;