const config = require("./config.json");
const mysql = require("mysql");
const e = require("express");

const regions = [
  "United States of America",
  "Italy",
  "Southern Asia",
  "Mexico",
  "France",
  "Canada",
  "Caribbean",
  "Northern Europe",
  "Western Asia",
  "China",
  "Greece",
  "Spain",
  "Thailand",
  "Africa",
  "South-Eastern Asia",
  "Japan",
  "Eastern Europe",
  "Australia and New Zealand",
  "Western Europe",
  "United Kingdom",
  "South America",
  "South Korea",
  "Portugal",
  "Netherlands",
  "Belgium",
  "Central America",
];

// TODO: fill in your connection details here
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect();

// ********************************************
//            SIMPLE ROUTE EXAMPLE
// ********************************************

async function hello(req, res) {
  // a GET request to /hello?name=Steve
  if (req.query.name) {
    res.send(`Hello, ${req.query.name}! Welcome to the FIFA server!`);
  } else {
    res.send(`Hello! Welcome to the FIFA server!`);
  }
  console.log("finished running hello");
}

// Route 1 (handler)
async function recipes(req, res) {
  // This is the case where page is defined.
  // The SQL schema has the attribute OverallRating, but modify it to match spec!
  // TODO: query and return results here:
  const page = req.query.page;
  const pagesize = req.query.pagesize ? req.query.pagesize : 10;
  const begin = (page - 1) * pagesize;
  const end = page * pagesize;
  connection.query(
    `with ratings as (select avg(rate) AverageRating, RecipeID
    from Reviews
    group by RecipeID)
    select *
    from Recipes natural join RecipesTime natural join ratings
    LIMIT ${begin}, ${end};`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 2 (handler)
// made a change to to req.params.choice and instead wrote req.query.choice
async function recipe(req, res) {
  const page = req.query.page;
  const pagesize = req.query.pagesize ? req.query.pagesize : 10;
  const begin = (page - 1) * pagesize;
  const end = page * pagesize;
  connection.query(
    `SELECT *
    FROM Reviews
    WHERE RecipeID = ${req.query.id}
    LIMIT ${begin}, ${end};`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ results: [] });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Recipe search
async function search_recipes(req, res) {
  console.log("Im in search_recipes");
  const reviewLow = req.query.ReviewCountLow ? req.query.ReviewCountLow : 0;
  const reviewHigh = req.query.ReviewCountHigh
    ? req.query.ReviewCountHigh
    : 100;
  const prepareTimeLow = req.query.PrepareTimeLow
    ? req.query.PrepareTimeLow
    : 0;
  const prepareTimeHigh = req.query.PrepareTimeHigh
    ? req.query.PrepareTimeHigh
    : 100;
  const cookTimeLow = req.query.CookTimeLow ? req.query.CookTimeLow : 0;
  const cookTimeHigh = req.query.CookTimeHigh ? req.query.CookTimeHigh : 100;
  const totalTimeLow = req.query.TotalTimeLow ? req.query.TotalTimeLow : 0;
  const totalTimeHigh = req.query.TotalTimeHigh ? req.query.TotalTimeHigh : 100;

  if (req.query.page && !isNaN(req.query.page)) {
    const page = req.query.page;
    const pagesize = req.query.pagesize ? req.params.league : 10;
    const offset = (page - 1) * pagesize;

    connection.query(
      `SELECT *
        FROM Recipes
        where Name like '%${req.query.Name}%'
        and CookTime between ${cookTimeLow} and ${cookTimeHigh}
        and PrepareTime between ${prepareTimeLow} and ${prepareTimeHigh}
        and TotalTime between ${totalTimeLow} and ${totalTimeHigh}
        and ReviewCount between ${reviewLow} and ${reviewHigh}
        ORDER BY Name
        OFFSET ${offset} ROWS FETCH NEXT ${pagesize} ROWS ONLY;`,
      function (error, results, fields) {
        if (error) {
          res.json({ results: [] });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  } else {
    //console.log("Name query: " + req.query.Name);
    connection.query(
      `SELECT *
        FROM Recipes
        where RecipeName like '%${req.query.Name}%'
        and CookTime between ${cookTimeLow} and ${cookTimeHigh}
        and PrepareTime between ${prepareTimeLow} and ${prepareTimeHigh}
        and TotalTime between ${totalTimeLow} and ${totalTimeHigh}
        and ReviewCount between ${reviewLow} and ${reviewHigh}
        ORDER BY RecipeName`,
      function (error, results, fields) {
        if (error) {
          //console.log("results: " + results);
          res.json({ results: [] });
        } else if (results) {
          //console.log("results: " + results);
          res.json({ results: results });
        }
      }
    );
  }
}

// Route 3 (handler)
async function nutritionSearch(req, res) {
  const ratingLow = req.query.ratingLow ? req.query.ratingLow : 0;
  const ratingHigh = req.query.ratingHigh ? req.query.ratingHigh : 5;
  const caloriesLow = req.query.caloriesLow ? req.query.caloriesLow : 0;
  const caloriesHigh = req.query.caloriesHigh ? req.query.caloriesHigh : 10000;
  const fatLow = req.query.fatLow ? req.query.fatLow : 0;
  const fatHigh = req.query.fatHigh ? req.query.fatHigh : 10000;
  const proteinLow = req.query.proteinLow ? req.query.proteinLow : 0;
  const proteinHigh = req.query.proteinHigh ? req.query.proteinHigh : 10000;
  const sodiumLow = req.query.sodiumLow ? req.query.sodiumLow : 0;
  const sodiumHigh = req.query.sodiumHigh ? req.query.sodiumHigh : 10000;

  const page = req.query.page;
  const pagesize = req.query.pagesize ? req.query.pagesize : 10;
  const begin = (page - 1) * pagesize;
  const end = page * pagesize;
  connection.query(
    `SELECT *
    FROM Nutrition
    WHERE rating between ${ratingLow} and ${ratingHigh}
    AND calories between ${caloriesLow} and ${caloriesHigh}
    AND fat between ${fatLow} and ${fatHigh}
    AND protein between ${proteinLow} and ${proteinHigh}
    AND sodium between ${sodiumLow} and ${sodiumHigh}
    LIMIT ${begin}, ${end};`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 4 (handler)
async function popularity(req, res) {
  const ratingLow = req.query.ratingLow ? req.query.ratingLow : 0;
  const ratingHigh = req.query.ratingHigh ? req.query.ratingHigh : 5;
  const reviewCountLow = req.query.reviewCountLow
    ? req.query.reviewCountLow
    : 0;
  const reviewCountHigh = req.query.reviewCountHigh
    ? req.query.reviewCountHigh
    : 10000;

  const page = req.query.page;
  const pagesize = req.query.pagesize ? req.query.pagesize : 10;
  const begin = (page - 1) * pagesize;
  const end = page * pagesize;
  connection.query(
    `with ratings as (select avg(rate) AverageRating, RecipeID
    from Reviews
    group by RecipeID)
    select *
    from Recipes natural join RecipesTime natural join ratings
    where rating between ${ratingLow} and ${ratingHigh}
    AND reviewCount between ${reviewCountLow} and ${reviewCountHigh}
    LIMIT ${begin}, ${end};`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 7 (handler)
async function time(req, res) {
  const hoursLow = req.query.hoursLow ? req.query.hoursLow : 0;
  const hoursHigh = req.query.hoursHigh ? req.query.hoursHigh : 100;
  let timeRange = []
  for (let i = hoursLow; i < hoursHigh; i++) {
    timeRange.push(i);
  }
  let likeClauses = '';
  timeRange.forEach((time) => {
    likeClauses = likeClauses.concat(`TotalTime LIKE '${time} h%' OR `);
  });
  likeClauses = likeClauses.slice(0, -3);
  if (hoursLow == 0) {
    likeClauses = likeClauses.concat(`Or (TotalTime NOT LIKE '%h%' AND TotalTime NOT LIKE '%X%' AND TotalTime NOT LIKE '%d%')`);
  }
  console.log(likeClauses);

  const page = req.query.page;
  const pagesize = req.query.pagesize ? req.query.pagesize : 10;
  const begin = (page - 1) * pagesize;
  const end = page * pagesize;
  connection.query(
    `with ratings as (select avg(rate) AverageRating, RecipeID
    from Reviews
    group by RecipeID)
    select *
    from Recipes natural join RecipesTime natural join ratings
    where ${likeClauses}
    LIMIT ${begin}, ${end};`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

async function get_from_ingredients(req, res) {
  //first construct the big like/and statement
  let ingr = req.body.ingredients;
  let similarities = ``;
  ingr.forEach((i) => {
    similarities = similarities.concat(
      ` `,
      `Recipes.Ingredients LIKE '%${i}%' AND`
    );
  });
  similarities = similarities.slice(0, -3);
  console.log(similarities);
  connection.query(
    `SELECT RecipeName, ReviewCount, TotalTime, RecipePhoto
    FROM Recipes
    WHERE ${similarities};`,
    function (err, results, fields) {
      if (err) {
        console.log(err);
        res.json({ error: err, data: null });
      } else {
        console.log("successful query");
        console.log(results);
        res.json({ error: null, data: results });
      }
    }
  );
}

//return the number of recipes in the db by cuisine
async function region_counts(req, res) {
  connection.query(
    `SELECT Cuisine AS region, COUNT(*) AS count
  FROM Cuisines
  GROUP BY Cuisine
  ORDER BY count desc;`,
    function (err, results, fields) {
      if (err) {
        console.log(err);
        res.json({ error: err, data: null });
      } else {
        console.log("success");
        console.log(results);
        res.json({ error: null, data: results });
      }
    }
  );
}

async function recipes_bycountry(req, res) {
  //first we need to dissolve the provided countries in the list of regions
  //its referring to that are found in the database
  console.log(req.body.countries);
  let queryregions = req.body.countries.map((geo) => {
    /*
    Basically checking if country name, subregion, or continent is in our db and 
    keeping the most specific selection if it is
    */
    if (regions.includes(geo.NAME)) return geo.NAME;
    if (regions.includes(geo.SUBREGION)) return geo.SUBREGION;
    if (regions.includes(geo.CONTINENT)) return geo.CONTINENT;
  });
  console.log(queryregions);
  /*
  now we should have an array of regions that are present in the database.
  if we had [Italy, France], we want to convert this to a string:
  WHERE C.region IN ("Italy", "France")
  */
  let list = `(`;
  queryregions.forEach((region) => {
    list = list.concat(``, `"${region}", `);
  });
  list = list.slice(0, -2);
  list = list.concat(``, `)`);
  console.log(list);

  //ready to send the query now
  connection.query(
    `WITH cuisine AS (
    SELECT *
    FROM Cuisines
    WHERE Source = "EPICURIOUS"
    AND Cuisine IN ${list}
    )
    SELECT C.Cuisine, N.title, N.rating
    FROM Nutrition N JOIN cuisine C ON C.title = TRIM(N.title)
    ORDER BY N.rating DESC;`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error, data: null });
      } else {
        console.log("success");
        res.json({ error: null, data: results });
      }
    }
  );
}

/*
I have to go to dinner but wanted to put this route here in case anyone wants to work with it:
This gets all of the recipes that are in the nutrition table and the cuisines table
(i renamed 01_Recipes_Details to Cuisines):
WITH cuisine AS (
    SELECT *
    FROM Cuisines
    WHERE Source = "EPICURIOUS"
)
SELECT *
FROM Nutrition N JOIN cuisine C ON C.title = TRIM(N.title);

The trim is necessary because theres a trailing whitespace in all recipe titles in nutrition table.

The route w this query will have as input an array of countries, we want to see all where
C.Cuisine = (those countries)
*/

module.exports = {
  hello,
  recipes,
  recipe,
  nutritionSearch,
  popularity,
  time,
  get_from_ingredients,
  region_counts,
  recipes_bycountry,
  search_recipes,
};
