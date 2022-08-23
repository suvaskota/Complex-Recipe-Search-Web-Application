import React from "react";
import { Table, Pagination, Select } from "antd";

import MenuBar from "../components/MenuBar";
import { getAllMatches, getAllPlayers, getAllRecipes } from "../fetcher";
const { Column, ColumnGroup } = Table;
const { Option } = Select;

const playerColumns = [
  {
    title: "Name",
    dataIndex: "Name",
    key: "Name",
    sorter: (a, b) => a.Name.localeCompare(b.Name),
    render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>,
  },
  {
    title: "Nationality",
    dataIndex: "Nationality",
    key: "Nationality",
    sorter: (a, b) => a.Nationality.localeCompare(b.Nationality),
  },
  {
    title: "Rating",
    dataIndex: "Rating",
    key: "Rating",
    sorter: (a, b) => a.Rating - b.Rating,
  },
  {
    title: "Potential",
    dataIndex: "Potential",
    key: "Potential",
    sorter: (a, b) => a.Potential - b.Potential,
  },
  {
    title: "Club",
    dataIndex: "Club",
    key: "Club",
    sorter: (a, b) => a.Club.localeCompare(b.Club),
  },
  {
    title: "Value",
    dataIndex: "Value",
    key: "Value",
  },
];

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
    sorter: (a, b) => parseInt(a.TotalTime) - parseInt(b.TotalTime),
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
class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      matchesResults: [],
      matchesPageNumber: 1,
      matchesPageSize: 10,
      playersResults: [],
      recipesResults: [],
      pagination: null,
    };

    this.leagueOnChange = this.leagueOnChange.bind(this);
    this.goToMatch = this.goToMatch.bind(this);
  }

  goToMatch(matchId) {
    window.location = `/matches?id=${matchId}`;
  }

  leagueOnChange(value) {
    getAllMatches(null, null, value).then((res) => {
      this.setState({ matchesResults: res.results });
    });
  }

  componentDidMount() {
    getAllMatches(null, null, "D1").then((res) => {
      this.setState({ matchesResults: res.results });
    });

    getAllPlayers().then((res) => {
      this.setState({ playersResults: res.results });
      console.log(res.results); //remove this?
      // TASK 1: set the correct state attribute to res.results
    });

    getAllRecipes().then((res) => {
      this.setState({ recipesResults: res.results });
      console.log(res.results); //remove this?
      // TASK 1: set the correct state attribute to res.results
    });
  }

  render() {
    return (
      <div>
        <MenuBar />
        <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
          <h3>Recipes</h3>
          <Table
            dataSource={this.state.recipesResults}
            columns={recipesColumns}
            pagination={{
              pageSizeOptions: [5, 10],
              defaultPageSize: 5,
              showQuickJumper: true,
            }}
          />
        </div>
        <div style={{ width: "70vw", margin: "0 auto", marginTop: "2vh" }}>
          <h3>Matches</h3>
          <Select
            defaultValue="D1"
            style={{ width: 120 }}
            onChange={this.leagueOnChange}
          >
            <Option value="D1">Bundesliga</Option>
            <Option value="SP1">La Liga</Option>
            <Option value="F1">Ligue 1</Option>
            <Option value="I1">Serie A</Option>
            <Option value="E0">Premier League</Option>
            {/* TASK 3: Take a look at Dataset Information.md from MS1 and add other options to the selector here  */}
          </Select>

          <Table
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  this.goToMatch(record.MatchId);
                }, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter
              };
            }}
            dataSource={this.state.matchesResults}
            pagination={{
              pageSizeOptions: [5, 10],
              defaultPageSize: 5,
              showQuickJumper: true,
            }}
          >
            <ColumnGroup title="Teams">
              {/* TASK 4: correct the title for the 'Home' column and add a similar column for 'Away' team in this ColumnGroup */}
              <Column
                title="Home"
                dataIndex="Home"
                key="Home"
                sorter={(a, b) => a.Home.localeCompare(b.Home)}
              />
              <Column
                title="Away"
                dataIndex="Away"
                key="Away"
                sorter={(a, b) => a.Away.localeCompare(b.Away)}
              />
            </ColumnGroup>
            <ColumnGroup title="Goals">
              {/* TASK 5: add columns for home and away goals in this ColumnGroup, with the ability to sort values in these columns numerically */}
              <Column
                title="Home"
                dataIndex="HomeGoals"
                key="HomeGoals"
                sorter={(a, b) => a.Home - b.Home}
              />
              <Column
                title="Away"
                dataIndex="AwayGoals"
                key="AwayGoals"
                sorter={(a, b) => a.Away - b.Away}
              />
            </ColumnGroup>
            <Column title="Date" dataIndex="Date" key="Date" />
            <Column title="Time" dataIndex="Time" key="Time" />
            {/* TASK 6: create two columns (independent - not in a column group) for the date and time. Do not add a sorting functionality */}
          </Table>
        </div>
      </div>
    );
  }
}

export default HomePage;
