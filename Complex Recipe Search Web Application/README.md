# Recipes-and-Ingredients-Web-App-Project

CIS 550 Final Project
Team Members: Suvas Kota, Kevin Lamb, Zhouyang Fang, Aydin Imranov

## Introduction

While some people may be natural and gifted chefs who do not need cookbooks or recipes to make good food, we realized that a lot of people need help to make sure that the food they make is decent - especially college students like us who do not have much time. However, one issue that we run into while using cookbooks is that it takes a while to find a recipe to match our preferences and the ingredients that we currently have in the kitchen. As a result, through the course of this project, we created a web application for people to quickly scan and select potential recipes to cook based on their needs and wishes. Specifically, this web application helps users by allowing them to search for recipes by ingredients, name, nutritional constraints, and countries/cuisines. 

## Architecture

In order to build this application, we used Node.js, React, and a MySQL RDS instance. More specifically, we used Node.js for our backend (server-side) to create an API that is connected to our RDS instance. We then used React to create a frontend (client-side) for our web application that uses the API we built in the backend. We used libraries such as Ant Design, Shards React, and React-Viz to develop our frontend. 

## Databases

For most of the datasets and their respective tables, we obtained them in a CSV file format so we were able to upload them to our RDS Instance after specifying the appropriate primary and foreign keys. There was, however, one exception. Firstly, the Simplified-1M Recipe dataset was provided to us in an NPZ format so we had to use Pandas to extract the two tables from an NPZ array, convert them into Pandas Dataframes and then convert them into a CSV file. 

## Web Application Description

The homepage of our web application consists of a list of all the recipes that users can simply browse or scroll through. For the Recipe page, which is recipe search, users can search for recipes based on name and number of reviews to find recipes based on popularity or any snippets of recipe names that they remember. For the Ingredients page, users can search for recipes based on ingredients that they currently own so that they can find recipes to make without having to make a trip to the grocery store. For the Globe page, users can search for recipes based on one or many cuisines/regions that they select. For the nutrition page, users can search for recipes based on nutritional constraints such as calories, protein, fat and sodium. Lastly, users can view the popular ingredients page to decide which ingredients to buy so as to maximize the number of recipes that they can cook. 

## Usage

We had to shut down the RDS instance due to costs but feel free to clone to repo (make sure React is installed on your laptop), cd into the client folder and run the command 'npm start' to view the front-end of the web application
