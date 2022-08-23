import React, { memo, useEffect, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import {
    Table,
    Select,
    Row,
    Col,
    Divider,
    Slider,
    Rate,
  } from "antd";

import { getRecipeNumberByRegion } from "../fetcher"

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const rounded = num => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
  }
};

const MapChart = ({ setTooltipContent, addCountry }) => {

    const [counts, setCounts] = useState([]);
    const [max, setMax] = useState(0);
    const [opacities, setOpacities] = useState(null);
    const [colorsfound, setColorsFound] = useState(false)
    const [colors, setColors] = useState(new Map());
    
    //get recipe counts on page load
    useEffect(() => {
    const getcounts = async () => {
      let stuff = await getRecipeNumberByRegion();
      if(stuff.err) {
        console.log("something went wrong...");
      } else {
        console.log(stuff.data);
        let dummy = stuff.data.map(x => {
          if(x.region === "United States of America") {
            return {
              region : x.region,
              count: 7503
            }
          } else {
            return x
          }
        })
        let max = Math.max(...dummy.map(o => o.count));
        let opacities = dummy.map(o => {
          return {
            region: o.region,
            opacity: (o.count/max),
          }
        });
        setMax(max);
        setOpacities(opacities);
        setCounts(stuff.data);
      }
    }

    getcounts();
    }, [])

    useEffect(() => {
      //when opacities get updated
    }, [opacities])
    
    const handleClick = (e) => {
        console.log(e);
        let country = e.properties
        addCountry(country);
    }

    const addColor = (country, color) => {
      setColors(colors => new Map(colors.set(country, color)));
    }

    const recipeCount = (geo) => {
      let country = counts.find(elm => elm.region === geo.NAME)
      let region = counts.find(elm => elm.region === geo.SUBREGION)
      let continent = counts.find(elm => elm.region === geo.CONTINENT)
      let a = country ? country.count : 0
      let b = region ? region.count : 0
      let c = continent ? continent.count : 0
      return a + b + c

    }

    //scale the opacity of the country color based on how many recipes there are from that region
    const getColor = (geo) => {
      // if(colors.get(geo.NAME)) {return "rgba(1, 77, 21, "+colors.get(geo.NAME)+")"}
      //if name or region found in opacities array, set opacity to that. 
      //otherwise, set to 0
      // console.log(geo.NAME)
      let country = counts.find(elm => elm.region === geo.NAME)
      let region = counts.find(elm => elm.region === geo.SUBREGION)
      let continent = counts.find(elm => elm.region === geo.CONTINENT)
      let countryopacity = country ? country.count : 0;
      let regionopacity = region ? region.count : 0;
      let continentopacity = continent ? continent.count : 0; 
      // console.log(regionopacity)
      // console.log(countryopacity)
      let opacity = 0.1+0.8*Math.sqrt(continentopacity + regionopacity + countryopacity)/Math.sqrt(max);
      // addColor(geo.NAME, opacity)
      return "hsl(136, 55%, "+(1-opacity)*100+"%)"
      // return "rgba(1, 77, 21, "+opacity+")"
    }

    return (
        <>
        <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
            <ZoomableGroup>
            <Geographies geography={geoUrl}>
                {({ geographies }) =>
                geographies.map(geo => (
                    <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                        const { NAME, SUBREGION } = geo.properties;
                        setTooltipContent(`${NAME} — ${SUBREGION}
                        
                        ${recipeCount(geo.properties)}`);
                    }}
                    onMouseLeave={() => {
                        setTooltipContent("");
                    }}
                    onClick={() => handleClick(geo)}
                    style={{
                        default: {
                        fill: opacities ? getColor(geo.properties) : "#D6D6D6",
                        outline: "none"
                        },
                        hover: {
                        fill: "#F53",
                        outline: "none"
                        },
                        pressed: {
                        fill: "#E42",
                        outline: "none"
                        }
                    }}
                    />
                ))
                }
            </Geographies>
            </ZoomableGroup>
        </ComposableMap>
        </>
    );
};

export default memo(MapChart);