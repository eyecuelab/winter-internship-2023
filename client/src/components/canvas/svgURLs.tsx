import pinkKart from "./../../src/assets/karts/pinkKart.svg";

function createSvgURLs() {

const svgElement = pinkKart;

// if (svgElement) {
//   let {width, height} = svgElement.getBBox();
// }
 

  return (
    <>
    <img src={pinkKart} alt="SVG" id="svg_element"style={{backgroundColor: "transparent", width: "50px", height: "50px"}}></img>
    </>
  )
}
export default createSvgURLs;