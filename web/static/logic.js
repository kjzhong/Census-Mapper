// keep track of Leaflet map for use between functions
var globalMapObject;
// keep track of which map tiles have been selected
var globalCurrentTilesSelection;
var globalCurrentTiles;

var globalPostcodeDictionary = {};
var globalMinCount;
var globalMaxCount;
var globalFilename = "postcodes-data/persona_tables.csv";

// Select which column in our customer-personas csv to visualise
var globalColumnSelector = 1;
var globalColumnName;
var globalMyLayer;

// var globalTest;

// Colours
var weakEndRGB = { red: 0, green: 255, blue: 0 };
var midwayRGB = { red: 255, green: 255, blue: 0 };
var strongEndRGB = { red: 255, green: 0, blue: 0 };

function bodyDidLoad() {
	// Set up our tiles and navbar
	globalCurrentTilesSelection = "CartoDB_Positron";
	globalCurrentTiles = MapTileHelper.tileLayers[globalCurrentTilesSelection];
	ShowtimeHelper.initialiseSelect2();

	// OK - Ready to Initialise the map! :)
	globalMapObject = L.map('mapid').setView([-33.918, 151.23], 17);
	globalCurrentTiles.addTo(globalMapObject);

	// I want to first create a dictionary of our features, then attach these features to the stuf that gets added to the map
	MapHelper.readTable(globalColumnSelector);

	// Add column names to drop-down menu
	$.get(globalFilename, function (personaCSVString) {
		var customerPersonas = Papa.parse(personaCSVString, { "dynamicTyping": true });

		columnNames = customerPersonas["data"][0];

		for (var i = 1; i < columnNames.length; i++) {
			columnName = columnNames[i];
			NavbarHelper.addItemToSelector(i, columnName);
		}
	})

	// Add all the postcodes to the map
	MapHelper.parseMapfile();
}