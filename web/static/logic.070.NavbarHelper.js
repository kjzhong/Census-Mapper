class ShowtimeHelper {
	static initialiseSelect2() {
		$('#selectPlace').select2({
			theme: 'bootstrap4',
			width: '15rem',
		});
	}
}

class NavbarHelper {

	/**
	 * Handle user selection of place to simulate mouse click on.
	 */
	static selectionDidChange() {
		var selectedPlace = $("#selectPlace").val();
		globalColumnSelector = selectedPlace;

		if (selectedPlace != "-1") {

			MapHelper.readTable(globalColumnSelector);

			$("#selectPlace").val(-1);
			$("#selectPlace").trigger('change');

			MapHelper.parseMapfile();
		}
	}

	/**
	 * Handles user selection of the theme (map tiles being used 🗺), also potentially navbar dark mode.
	 * 
	 * @param {Object} selectedMap The Leaflet `L.tileLayer` objects, as made available through `MapTileHelper`.
	 */
	static changeMapTiles(selectedMap) {
		// remove old
		$("#togglefor_" + globalCurrentTilesSelection).removeClass("active");
		globalCurrentTiles.removeFrom(globalMapObject);

		// set new
		globalCurrentTilesSelection = selectedMap;
		globalCurrentTiles = MapTileHelper.tileLayers[selectedMap];

		// implement new
		$("#togglefor_" + selectedMap).addClass("active");
		globalCurrentTiles.addTo(globalMapObject);

		// dark mode
		if (selectedMap == "CartoDB_DarkMatter") {
			NavbarHelper.setNavbarDarkMode(true);
		} else {
			NavbarHelper.setNavbarDarkMode(false);
		}
	}

	/**
	 * Sets navbar dark mode (for the navigation bar only!) 😎
	 * 
	 * @param {boolean} isDarkMode `true` for dark mode, `false` for light mode
	 */
	static setNavbarDarkMode(isDarkMode) {
		if (isDarkMode) {
			$("#mynavbar").removeClass("navbar-light");
			$("#mynavbar").removeClass("bg-light");
			$("#mynavbar").addClass("navbar-dark");
			$("#mynavbar").addClass("bg-dark");
		} else {
			$("#mynavbar").removeClass("navbar-dark");
			$("#mynavbar").removeClass("bg-dark");
			$("#mynavbar").addClass("navbar-light");
			$("#mynavbar").addClass("bg-light");
		}
	}


	static addItemToSelector(id, name) {
		var newOption = new Option(name, id, false, false);
		$('#selectPlace').append(newOption).trigger('change');
	}
}