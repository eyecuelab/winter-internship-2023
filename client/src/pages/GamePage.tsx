import React from "react";
import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import Canvas from "../components/canvas/Canvas";
import pinkKart from "./../assets/karts/pinkKart.svg";

const GamePage = () => {
  const { gameId } = useParams();

  const svgRef = useRef<SVGSVGElement>(null);
  const blobUrlRef = useRef<string|null>(null);

  console.log("pinkKart: " + pinkKart);
  useEffect(() => {
    if (svgRef.current) {
      const bbox = svgRef.current.getBBox();
      console.log(bbox); 
      const svgElement = document.getElementById('pinkKart') as SVGGraphicsElement | null;
      //   const svgElement = document.getElementById('pinkKart');
      console.log("svgElement " + svgElement);
    if (svgElement) {
      let bBox = svgElement.getBBox(); 
      console.log("bBox: top: " + bBox.top)
      console.log("bBox: left: " + bBox.left)
      console.log("bBox: width: " + bBox.width)
      console.log("bBox: height: " + bBox.height)
      let clonedSvgElement = svgElement.cloneNode(true) as SVGElement;
      let outerHTML = clonedSvgElement.outerHTML
      let blob = new Blob([outerHTML],{type:'image/svg+xml;charset=utf-8'});
      let URL = window.URL || window.webkitURL || window;
      let blobUrl = URL.createObjectURL(blob);
      blobUrlRef.current = blobUrl;
      console.log(blobUrlRef.current)
    }
    }
  }, []);


  return (
    <div>
      <Canvas gameId={gameId} blobUrl={blobUrlRef.current}/>
      <svg ref={svgRef} style={{backgroundColor: "transparent", width: "50px", height: "50px"}} xmlns="http://www.w3.org/2000/svg" width="147" height="151" viewBox="0 0 147 151" fill="none" id="pinkKart">
      <rect x="26" y="20" width="93" height="3" fill="#303030"/>
      <rect x="23" y="130" width="110" height="3" fill="#303030"/>
      <rect x="138" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 138 151)" fill="#303030"/>
      <rect x="16" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 16 151)" fill="#303030"/>
      <rect x="26" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 26 41)" fill="#303030"/>
      <rect x="129" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 129 41)" fill="#303030"/>
      <rect x="132" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 132 151)" fill="#303030"/>
      <rect x="10" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 10 151)" fill="#303030"/>
      <rect x="20" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 20 41)" fill="#303030"/>
      <rect x="123" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 123 41)" fill="#303030"/>
      <rect x="126" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 126 151)" fill="#303030"/>
      <rect x="4" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 4 151)" fill="#303030"/>
      <rect x="14" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 14 41)" fill="#303030"/>
      <rect x="117" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 117 41)" fill="#303030"/>
      <rect width="38.8284" height="3" transform="matrix(-0.707107 0.707107 0.707107 0.707107 116.456 22)" fill="#303030"/>
      <rect x="30.1213" y="22" width="38.8284" height="3" transform="rotate(45 30.1213 22)" fill="#303030"/>
      <path d="M122 118C122 115.239 124.239 113 127 113H142C144.761 113 147 115.239 147 118V144C147 146.761 144.761 149 142 149H127C124.239 149 122 146.761 122 144V118Z" fill="#303030"/>
      <path d="M0 118C0 115.239 2.23858 113 5 113H20C22.7614 113 25 115.239 25 118V144C25 146.761 22.7614 149 20 149H5C2.23858 149 0 146.761 0 144V118Z" fill="#303030"/>
      <path d="M12 12C12 9.23858 14.2386 7 17 7H28C30.7614 7 33 9.23858 33 12V34C33 36.7614 30.7614 39 28 39H17C14.2386 39 12 36.7614 12 34V12Z" fill="#303030"/>
      <path d="M115 12C115 9.23858 117.239 7 120 7H131C133.761 7 136 9.23858 136 12V34C136 36.7614 133.761 39 131 39H120C117.239 39 115 36.7614 115 34V12Z" fill="#303030"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M69.5044 0H59.8186C56.1556 0 44.556 12.7372 39.2142 19.1059V23.4254L54.0071 38.2117V49.7111C54.0071 50.7878 50.82 52.7533 46.6884 55.3013C41.6394 58.4151 35.1799 62.3987 31.4027 66.6931C29.9351 67.9668 27 71.0459 27 73.1725C27 74.5016 27.5 92.3378 28 110.174C28.5 128.01 29 145.847 29 147.176C29 149.302 31.9351 149.945 33.4027 150H69.5044H77.2531H113.355C114.822 149.945 117.758 149.302 117.758 147.176C117.758 145.847 118.258 128.01 118.758 110.174C119.258 92.3378 119.758 74.5016 119.758 73.1725C119.758 71.0459 116.822 67.9668 115.355 66.6931C111.578 62.3987 105.118 58.4151 100.069 55.3013C95.9375 52.7533 92.7504 50.7878 92.7504 49.7111V38.2117L107.543 23.4254V19.1059C102.201 12.7372 90.6019 0 86.9389 0H77.2531H69.5044Z" fill="#F06ACA"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M65.2401 57C59.3131 59.4703 46.7783 64.6723 44.0544 65.7186C41.3306 66.7648 41.6584 71.3856 42.1629 73.5653C45.8899 85.4016 48.5832 106.223 50.1366 118.232C50.7381 122.882 51.1687 126.211 51.4222 127.184C52.5571 131.544 67.1316 133.723 70.9148 133.723L72.2579 133.723L73.563 133.723L74.9061 133.723C78.6892 133.723 93.2637 131.544 94.3987 127.185C94.6521 126.211 95.0827 122.882 95.6843 118.232C97.2376 106.223 99.931 85.4016 103.658 73.5653C104.162 71.3856 104.49 66.7648 101.766 65.7186C99.0425 64.6723 86.5077 59.4703 80.5808 57L73.563 57L65.2401 57Z" fill="#BA4499"/>
      <rect width="6.53599" height="25.4904" rx="3.268" transform="matrix(-0.674767 -0.738031 -0.738031 0.674767 64.2229 6.82379)" fill="#F27CD1"/>
      <circle cx="72.5" cy="99.5" r="21.5" fill="#FFC327"/>
      <rect x="57" y="66" width="32" height="6" rx="3" fill="#303030"/>
      <path d="M90 95C93 93.9048 99 90.1371 99 83.8286C99 77.52 94.0588 73.3143 91.5882 72" stroke="#FFC227" stroke-width="6"/>
      <path d="M55 95C52 93.9048 46 90.1371 46 83.8286C46 77.52 50.9412 73.3143 53.4118 72" stroke="#FFC227" stroke-width="6"/>
      <path d="M72.7957 113.414C70.2325 113.834 64.2211 113.372 60.6813 108.163C57.1415 102.954 57.9912 97.3008 58.8586 95.125" stroke="#FFE39C" stroke-width="6" stroke-linecap="round"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M63.4175 66.2H59.8C58.2536 66.2 57 67.4536 57 69C57 70.5464 58.2536 71.8 59.8 71.8H63.4175C62.3374 74.2723 59.8704 76 57 76C53.134 76 50 72.866 50 69C50 65.134 53.134 62 57 62C59.8704 62 62.3374 63.7277 63.4175 66.2Z" fill="#CDAD5C"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M82 66.2H85.6175C87.1639 66.2 88.4175 67.4536 88.4175 69C88.4175 70.5464 87.1639 71.8 85.6175 71.8H82C83.0802 74.2723 85.5471 76 88.4175 76C92.2835 76 95.4175 72.866 95.4175 69C95.4175 65.134 92.2835 62 88.4175 62C85.5471 62 83.0802 63.7277 82 66.2Z" fill="#CDAD5C"/>
    </svg>
    </div>
  );
};

GamePage.propTypes = {};

export default GamePage;
