// import React, { useState } from "react";
// import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
// import { Tooltip } from "react-tooltip";
// import "./InteractiveMap.css";

// // Ссылка на географические данные Армении
// const geoUrl = "https://cdn.jsdelivr.net/npm/armenia-atlas@0.2.0/armenia-provinces.json";
// const locations = [
//   { name: "Yerevan", coordinates: [44.5126, 40.1772], desc: "The pink city & heart of Armenia" },
//   { name: "Garni & Geghard", coordinates: [44.73, 40.12], desc: "Ancient temple and rock-cut monastery" },
//   { name: "Lake Sevan", coordinates: [45.01, 40.55], desc: "The blue pearl of Armenia" },
//   { name: "Dilijan", coordinates: [44.86, 40.74], desc: "Armenian Switzerland" },
//   { name: "Tatev", coordinates: [46.25, 39.38], desc: "Wings of Tatev & medieval monastery" },
//   { name: "Khor Virap", coordinates: [44.57, 39.87], desc: "Best view of Mount Ararat" },
// ];

// const InteractiveMap = () => {
//   const [content, setContent] = useState("");

//   return (
//     <div className="interactive-map-container">
//       <div className="map-header text-center mb-5">
//         <h2 className="section-title">Explore Your Next Adventure</h2>
//         <p className="text-muted">Hover over the markers to see popular destinations</p>
//       </div>

//       <div className="map-wrapper">
//         <ComposableMap
//           projection="geoMercator"
//           // Эти настройки центрируют карту именно на Армении
//           projectionConfig={{
//             scale: 14000,
//             center: [45.1, 40.1],
//           }}
//         >
//           <Geographies geography={geoUrl}>
//             {({ geographies }) =>
//               geographies.map((geo) => (
//                 <Geography
//                   key={geo.rsmKey}
//                   geography={geo}
//                   className="map-province"
//                 />
//               ))
//             }
//           </Geographies>

//           {locations.map(({ name, coordinates, desc }) => (
//             <Marker 
//               key={name} 
//               coordinates={coordinates}
//               onMouseEnter={() => setContent(`${name}: ${desc}`)}
//               onMouseLeave={() => setContent("")}
//               data-tooltip-id="map-tooltip"
//               data-tooltip-content={`${name}: ${desc}`}
//             >
//               <circle r={6} className="map-marker-dot" />
//               <circle r={12} className="map-marker-ring" />
//             </Marker>
//           ))}
//         </ComposableMap>
        
//         <Tooltip id="map-tooltip" className="custom-tooltip" />
//       </div>
//     </div>
//   );
// };

// export default InteractiveMap;