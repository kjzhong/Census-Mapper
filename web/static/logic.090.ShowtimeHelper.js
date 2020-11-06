class ShowtimeHelper {
	static initialiseSelect2() {
		$('#selectPlace').select2({
			theme: 'bootstrap4',
			width: '15rem',
			// https://stackoverflow.com/questions/28762180/how-to-sort-the-select2-jquery-plugin-options-alphabetically/28764371
			sorter: data => data.sort((a, b) => a.text.localeCompare(b.text))
		});
	}
}