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

			globalMinCount = NaN;
			globalMaxCount = NaN;

			for (var i = 1; i < customerPersonas.data.length; i++) {

				// Generate our dictionary, then add each row to the global postcode dictionary
				// i is the row, 0 is the column
				var thisPostcode = customerPersonas.data[i][0];
				var thisValue = customerPersonas.data[i][columnIndex];

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

			var postcodeBoundaries = JSON.parse(incomingGeoJSON);

			// Strip old (coloured) tiles
			if (globalMyLayer) { globalMyLayer.removeFrom(globalMapObject) };


			// Define each postcode's properties
			for (var i = 0; i < postcodeBoundaries.features.length; i++) {
				var thisPostCode = postcodeBoundaries["features"][i]["properties"]["POA_CODE16"];

				// Read score from global dictionary (see MapHelper.readTable) and calculate colour
				var thisPostcodeScore = globalPostcodeDictionary[thisPostCode];
				var thisPostCodePeoplRelativePosition = ColourHelper.valueToPercentile(
					globalMinCount,
					globalMaxCount,
					thisPostcodeScore
				);
				postcodeBoundaries["features"][i]["properties"]["relativePosition"] = thisPostCodePeoplRelativePosition;


				var thisStyle = {
					"color": ColourHelper.colourGradientHTMLString3(
						weakEndRGB, midwayRGB, strongEndRGB, thisPostCodePeoplRelativePosition
					)
				};

				// Add our colours and the score as a property of each post code feature
				postcodeBoundaries["features"][i]["properties"]["style"] = thisStyle;
				postcodeBoundaries["features"][i]["properties"]["thisColumnValue"] = thisPostcodeScore;
			}

			// globalTest = postcodeBoundaries;

			var settings = {
				onEachFeature: function (feature, layer) {
					// https://leafletjs.com/examples/geojson/


					// Adds the on-click popup with relevant text
					var preparedString = "";

					if (feature.properties && feature.properties["POA_CODE16"]) {
						preparedString += "<strong>" + feature.properties["POA_CODE16"] + "</strong>";
					}


					if (feature.properties && feature.properties["thisColumnValue"]) {
						preparedString += "<br /><em>(" + globalColumnName + ") Percentile: " + feature.properties["thisColumnValue"] + "</em>";
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
			globalMyLayer = L.geoJSON(postcodeBoundaries, settings).addTo(globalMapObject);
		});
	}
}