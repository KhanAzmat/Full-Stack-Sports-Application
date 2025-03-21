

/**This component changes the theme based on selected color index */



import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import React, { useEffect } from 'react'
//import { useSelector } from "react-redux";
import { panelColor } from './themeColor'
///import {theme as initTheme} from '../maintheme'
//import { buttonColor } from "./CustomButton";
import { themeColor } from "./themeColor";
//import { palette } from "@mui/system";


  // Primary Colors : #F39200 #5B3F18 #151B29
  // Secondary Colors : #FEFEFE #F2A532


const initTheme = createTheme(adaptV4Theme({
  palette: {
    primary: {
      main: "#F39200",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#F2A532",
      contrastText: "#5B3F18",
    },
  },
}));

const CustomThemeProvider = (props) => {
  //let colorIndex = useSelector((state)=>state.colorIndex.index)
  let colorIndex = useSelector((state) => state.color.colorIndex);
  const [theme, setTheme] = React.useState(initTheme);

  useEffect(() => {
    setTheme(
      createTheme(adaptV4Theme({
        palette: {
          primary: {
            main: themeColor[colorIndex][0],
            //contrastText : "#ffffff"
          },
          secondary: {
            main: themeColor[colorIndex][1],
            contrastText: "#ffffff",
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: "5px",
              },
              contained: {
                background: `linear-gradient(60deg,${themeColor[colorIndex][0]},${themeColor[colorIndex][1]})`,
                color: "#fff",
              },
              outlined: {
                backgroundColor: panelColor[colorIndex].p1,
                color: themeColor[colorIndex][1],
              },
            },
          },

          /* MuiListItemButton :{
                    styleOverrides:{
                        root:{
                            borderRadius: "20px",
                            '&:hover .MuiAvatar-root .MuiListItemAvatar-root': {
                             //background:theme.palette.primary.main,
                            //
                            //background: 'linear-gradient(45deg, #022CFA 30%, #2BFF36 90%)',
                             color : "#fff",
                             backgroundColor : "transparent"
    
                             },
                             '&:hover': {
  
                            background: `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`,
                            color : "#fff",
                        }
                     }
                    }
                  
                },
                MuiListItemIcon:{
                    styleOverrides:{
                       root:{
                        //color: themeColor[colorIndex][0],
                        background: `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`,
                        color : "#fff",
                        //borderRadius : "50%",
                        //width: "50%",
                        backgroundColor:themeColor[colorIndex][0],
                        borderRadius: "10%"
                       }
                    }
                }
            }*/
        },
      }))
    );
  }, [colorIndex]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {console.log(colorIndex)}
        {props.children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};



const mapStateToProps =(state)=>({
    colorIndex : state.color.colorIndex
})

export default CustomThemeProvider

