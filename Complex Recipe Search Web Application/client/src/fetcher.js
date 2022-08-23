import config from "./config.json";

const getAllMatches = async (page, pagesize, league) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/matches/${league}?page=${page}&pagesize=${pagesize}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const getAllPlayers = async (page, pagesize) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/players?page=${page}&pagesize=${pagesize}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

// get all recipes from the database
const getAllRecipes = async (page, pagesize) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/recipes?page=${page}&pagesize=${pagesize}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const getMatch = async (id) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/match?id=${id}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

//get individual recipe
const getRecipe = async (id) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/recipe?id=${id}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const getPlayer = async (id) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/player?id=${id}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const getMatchSearch = async (home, away, page, pagesize) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/search/matches?Home=${home}&Away=${away}&page=${page}&pagesize=${pagesize}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const getPlayerSearch = async (
  name,
  nationality,
  club,
  rating_high,
  rating_low,
  pot_high,
  pot_low,
  page,
  pagesize
) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/search/players?Name=${name}&Nationality=${nationality}&Club=${club}&RatingLow=${rating_low}&RatingHigh=${rating_high}&PotentialHigh=${pot_high}&PotentialLow=${pot_low}&page=${page}&pagesize=${pagesize}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

//search bar for recipes, need to add all the parameters
const getRecipeSearch = async (
  name,
  review_low,
  review_high,
  prepareTime_low,
  prepareTime_high,
  cookTime_low,
  cookTime_high,
  totalTime_low,
  totalTime_high,
  page,
  pagesize
) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/search/recipes?Name=${name}&ReviewCountLow=${review_low}&ReviewCountHigh=${review_high}&PrepareTimeLow=${prepareTime_low}&PrepareTimeHigh=${prepareTime_high}&CookTimeLow=${cookTime_low}&CookTimeHigh=${cookTime_high}&TotalTimeLow=${totalTime_low}&TotalTimeHigh=${totalTime_high}&page=${page}&pagesize=${pagesize}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const getFromIngredients = async (ingredients) => {
  console.log(ingredients);
  //must map the array of json objects to just the ingredient
  const reqbody = JSON.stringify({
    ingredients: ingredients.map((a) => a.Ingredient),
  });
  let res = await fetch(
    `http://${config.server_host}:${config.server_port}/ingredients/search`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: reqbody,
    }
  )
  return res.json();
};

const getRecipeNumberByRegion = async () => {
  let res = await fetch(`http://${config.server_host}:${config.server_port}/regioncounts`);
  return res.json();
}

const getRecipesByCountry = async (countries) => {
  const reqbody = JSON.stringify({countries: countries})
  let res = await fetch(`http://${config.server_host}:${config.server_port}/recipes/bycountry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: reqbody,
  });
  return res.json();
}

export {
  getAllMatches,
  getAllPlayers,
  getMatch,
  getPlayer,
  getMatchSearch,
  getPlayerSearch,
  getAllRecipes,
  getRecipe,
  getRecipeSearch,
  getFromIngredients,
  getRecipeNumberByRegion,
  getRecipesByCountry,
};
