const express = require("express");
const mysql = require("mysql");
var cors = require("cors");

const routes = require("./routes");
const config = require("./config.json");

const app = express();
app.use(express.json());

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ["http://localhost:3000"] }));

app.get("/hello", routes.hello);

app.get("/recipes", routes.recipes);

app.get("/recipe", routes.recipe);

app.get("/time", routes.time);

app.get("/nutrition/search", routes.nutritionSearch);

app.post("/ingredients/search", routes.get_from_ingredients);

//get counts of recipes for eact region
app.get("/regioncounts", routes.region_counts);

//get recipes from the provided regions
app.post("/recipes/bycountry", routes.recipes_bycountry);

// Recipe search route
app.get("/search/recipes", routes.search_recipes);

console.log(config.server_port);
app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
