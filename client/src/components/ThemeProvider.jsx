/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";


export const ThemeProvider = ({children}) => {

    const { theme }= useSelector((state)=>state.theme);
    //console.log(theme);

  return (
      <>
        <div data-theme={theme}>{children}</div>

      {/* {theme==='light'?<div data-theme="light">{children}</div>
        :<div data-theme="dark">{children}</div>} */}
      </>
  )
}
