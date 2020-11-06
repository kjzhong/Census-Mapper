class MapHelper {

	// Lets make a method to read in a csv
	// Parameter {number} columnIndex
	// Will also use the globalColumnSelector
	// Will also use globalFilename
	static readTable(columnIndex) {
		$.get(globalFilename, function (personaCSVString) {
			var customerPersonas = Papa.parse(personaCSVString);

			// globalTest = customerPersonas;

			globalColumnName = customerPersonas["data"][0][columnIndex];
			// console.log(globalColumnName);

			globalMinCount = 0;
			globalMaxCount = 0;

			for (var i = 1; i < customerPersonas.data.length; i++) {
				// Lets generate our dictionary, then add each row to the global postcode dictionary
				// i is the row, 0 is the column
				var thisPostcode = customerPersonas.data[i][0];
				var thisValue = parseFloat(customerPersonas.data[i][columnIndex]);

				globalPostcodeDictionary[thisPostcode] = thisValue;

				if (!globalMinCount) globalMinCount = thisValue;
				if (!globalMaxCount) globalMaxCount = thisValue;
				if (thisValue < globalMinCount) globalMinCount = thisValue;
				if (thisValue > globalMaxCount) globalMaxCount = thisValue;
			}

			document.getElementById("title").innerHTML = "Coloured by " + globalColumnName;

		})
	}

	static parseMapfile() {
		$.get("postcodes-geojson/au-postcodes-Visvalingam-0.1.geojson", function (incomingGeoJSON) {
			// $.get("postcodes-geojson/au-postcodes.geojson", function (incomingGeoJSON) {

			var postcodeBoundaries = JSON.parse(incomingGeoJSON);
			if (globalMyLayer) { globalMyLayer.removeFrom(globalMapObject) };


			// filter down our postcodeBoundaries to those in NSW only
			// postcodeBoundaries["features"].forEach(function (item, index) {
			// 	if (parseInt(item["properties"]["POA_CODE16"]) >= "2000"
			// 		&& parseInt(item["properties"]["POA_CODE16"]) < "3000"
			// 	) {
			// 		mappedPostcodes.features.push(item);
			// 	}
			// });

			for (var i = 0; i < postcodeBoundaries.features.length; i++) {
				var thisPostCode = postcodeBoundaries["features"][i]["properties"]["POA_CODE16"];

				var thisPostcodePeople = globalPostcodeDictionary[thisPostCode];
				var thisPostCodePeoplRelativePosition = ColourHelper.valueToPercentile(
					globalMinCount,
					globalMaxCount,
					thisPostcodePeople
				);
				postcodeBoundaries["features"][i]["properties"]["relativePosition"] = thisPostCodePeoplRelativePosition;


				var thisStyle = {
					"color": ColourHelper.colourGradientHTMLString3(
						weakEndRGB, midwayRGB, strongEndRGB, thisPostCodePeoplRelativePosition
					)
				};

				// Adding our colours and the score as a property of each post code
				postcodeBoundaries["features"][i]["properties"]["style"] = thisStyle;
				postcodeBoundaries["features"][i]["properties"]["thisColumnValue"] = thisPostcodePeople;

				// NavbarHelper.addItemToSelector(thisPostCode, thisPostCode);
			}


			// globalTest = postcodeBoundaries;
			// console.log(mappedPostcodes);


			// This does what maphelper does

			var settings = {
				onEachFeature: function (feature, layer) {
					// https://leafletjs.com/examples/geojson/


					// Adds the on-click popup with relevant text
					var preparedString = "";

					if (feature.properties && feature.properties["POA_CODE16"]) {
						preparedString += "<strong>" + feature.properties["POA_CODE16"] + "</strong>";
					}


					if (feature.properties && feature.properties["thisColumnValue"]) {
						preparedString += "<br /><em>" + globalColumnName + ": " + feature.properties["thisColumnValue"] + "</em>";
					}

					if (preparedString.length > 0) {
						layer.bindPopup(preparedString);
					}


					// Colours each post code properly
					if (feature.properties["style"]) {
						layer.setStyle(feature.properties["style"]);
					}

					layer.layerID = feature.properties["POA_CODE16"];

				}
			}

			// var postcodeStyle = {
			// 	onEachFeature: function (feature, layer) {
			// 		if (feature.properties && feature.properties["style"]) {
			// 			settings.style = feature.properties["style"];
			// 		}
			// 	}
			// }

			// Now we need to add each of the postcodes to the navbar
			// If we learn how to do this, next step is to do it with the columns of customer-personas.csv


			globalMyLayer = L.geoJSON(postcodeBoundaries, settings).addTo(globalMapObject);
		});
	}




	// /**
	//  * 
	//  * @param {string} incomingGeoJSON String representation of the geoJSON, with the feature to be added.
	//  * @param {Object.<string, string>} style A dictionary with `color`, `opacity`, `weight`, `dashArray`, etc.
	//  */
	// static processAddedPostcode(incomingGeoJSON, style) {
	// 	var this_id = incomingGeoJSON["features"][0]["properties"]["ID"];
	// 	console.log("this_id = " + this_id);

	// 	var settings = {
	// 		onEachFeature: function (feature, layer) {
	// 			// https://leafletjs.com/examples/geojson/
	// 			var preparedString = "";
	// 			if (feature.properties && feature.properties["name"]) {
	// 				preparedString += "<strong>" + feature.properties["name"] + "</strong>";
	// 			}

	// 			if (feature.properties && feature.properties["author"]) {
	// 				preparedString += "<br /><em>Mapped by " + feature.properties["author"] + "</em>";
	// 			}

	// 			if (feature.properties && feature.properties["ID"]) {
	// 				preparedString += "<br /><em>ID: <code>" + feature.properties["ID"] + "</pre></code>";
	// 			}

	// 			if (feature.properties && feature.properties["description"]) {
	// 				preparedString += "<p>" + feature.properties["description"] + "</p>";
	// 			}

	// 			if (feature.properties && feature.properties["ufoSightings"]) {
	// 				preparedString += "<p>UFO sightings: " + feature.properties["ufoSightings"] + "</p>";
	// 			}

	// 			// For debugging
	// 			if (feature.properties && feature.properties["style"]) {
	// 				preparedString += "<p> Added feature: " + feature.properties["style"] + "</p>";
	// 			}

	// 			if (preparedString.length > 0) {
	// 				layer.bindPopup(preparedString);
	// 			}

	// 			// // https://stackoverflow.com/questions/14756420/emulate-click-on-leaflet-map-item
	// 			if (feature.properties && feature.properties["ID"]) {
	// 				globalPostcodeDictionary[feature["ID"] + ""] = layer._leaflet_id;
	// 			}
	// 		}
	// 	}

	// 	if (style) {
	// 		settings.style = style;
	// 	}


	// 	var addedFeature = L.geoJSON(incomingGeoJSON, settings).addTo(globalMapObject);

	// 	globalPostcodeDictionary[this_id] = {
	// 		"leaflet_id": Object.keys(addedFeature["_layers"])[0],
	// 		"captured_geojson_object": addedFeature
	// 	};
	// }

	// /**
	//  * Simulates a mouse click on a place on the map.
	//  * 
	//  * @param {Object} selectedPlace The logical ID of the place on the map.
	//  */
	// static simulateMouseClick(selectedPlace) {
	// 	var leafletID = globalPostcodeDictionary[selectedPlace]["leaflet_id"];
	// 	var capturedGeoJSONObject = globalPostcodeDictionary[selectedPlace]["captured_geojson_object"];
	// 	var layer = capturedGeoJSONObject.getLayer(leafletID);

	// 	// https://stackoverflow.com/questions/14756420/emulate-click-on-leaflet-map-item
	// 	// fire event 'click' on target layer 
	// 	layer.fireEvent('click');
	// }
}