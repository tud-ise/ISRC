var fileList = [];
const originalOnClicks = {};

const valueMapping = {
	relevance: {
		0: "No",
		1: "Yes",
	},

	researchParadigm: {
		A: "Other",
		D: "Design-Oriented",
		E: "Empirical",
		F: "Formal-Analytical",
	},

	researchMethod: {
		CM: {
			name: "Conceptual Model or Framework",
			group: "A",
		},
		L: {
			name: "Literature Review or Analysis",
			group: "A",
		},
		V: {
			name: "Speculation or Commentary",
			group: "A",
		},
		O: {
			name: "Miscellaneous Other",
			group: "A",
		},
		G: {
			name: "General",
			group: "D",
		},
		SW: {
			name: "Systems or Software",
			group: "D",
		},
		M: {
			name: "Method or Model",
			group: "D",
		},
		CA: {
			name: "Content Analysis",
			group: "E",
		},
		GT: {
			name: "Grounded Theory",
			group: "E",
		},
		CS: {
			name: "Case Study",
			group: "E",
		},
		I: {
			name: "Interview or Delphi Study",
			group: "E",
		},
		OE: {
			name: "Online Experiment",
			group: "E",
		},
		FE: {
			name: "Field Experiment",
			group: "E",
		},
		LE: {
			name: "Lab Experiment",
			group: "E",
		},
		S: {
			name: "Survey",
			group: "E",
		},
		SD: {
			name: "Secondary Data",
			group: "E",
		},
		EO: {
			name: "Other",
			group: "E",
		},
		MMS: {
			name: "Mathematical Modelling or Simulation",
			group: "F",
		},
		SNA: {
			name: "Social Network Analysis",
			group: "F",
		},
	},
};

document.addEventListener('DOMContentLoaded', (event) => {
	
	let dropZone = document.getElementById('drop_zone');
	dropZone.addEventListener('mouseup', (e) => {
		uploadFiles();
	});
	dropZone.addEventListener('dragover', (e) => {
		e.preventDefault();
		e.stopPropagation();
		e.dataTransfer.dropEffect = 'copy';
	});

	dropZone.addEventListener('drop', (e) => {
		e.preventDefault();
		e.stopPropagation();
		let files = e.dataTransfer.files;
		insertFiles(files);
	});
});



function insertFiles(files){

	// activate table and buttons
	let buttons = document.getElementsByClassName("btn");
	document.getElementById('resultTableDiv').style.display = 'block';
	for (let i = 0; i < buttons.length; i++) {
		buttons[i].style.display = "block";
	}
	// scroll into table
	setTimeout(function() {
		var element = document.getElementById('resultTableDiv');
		var rect = element.getBoundingClientRect();
		var scrollTop = window.scrollY || document.documentElement.scrollTop;
		var offsetTop = rect.top + scrollTop;
		window.scrollTo({
			top: offsetTop-30,
			behavior: "smooth"
	   });
	}, 100); 
	
	// Get the table header and body elements
	var tableHeader = document.getElementById("classificationHeaders");
	var tableBody = document.getElementById("classificationResults");

	// If there are no files in the list, clear the table body
	if (fileList.length == 0) {
		tableBody.innerHTML = "";
	}

	// Function to check if a file with a given name exists in the list
	function fileExists(name) {
		for (var obj of fileList) {
			if (obj.name === name) {
				return true;
			}
		}

		return false;
	}

	// For each selected file
	for (var i = 0; i < files.length; i++) {
		// If the file is not a PDF, skip it
        if (files[i].type !== 'application/pdf') {
            continue;
        }
		// If the file does not exist in the list
		if (!fileExists(files[i].name)) {
			// Add the file to the list
			fileList.push(files[i]);

			// Add a new row to the table
			var row = tableBody.insertRow(tableBody.rows.length);

			// Add a cell to the row and set its content to the file name
			var cell = row.insertCell(0);
			cell.innerHTML = files[i].name;

			// For each column in the table header
			for (
				var j = 1;
				j < tableHeader.getElementsByTagName("th").length;
				j++
			) {
				// Add a cell to the row and leave its content empty
				cell = row.insertCell(j);
				cell.innerHTML = "";
			}

			// Add action buttons to the last cell of the row
			row.cells[7].innerHTML =
				'<a class="add" title="Save" data-toggle="tooltip" onclick="saveValues(this)"><i class="material-icons">check</i></a><a class="edit" title="Edit" data-toggle="tooltip" onclick="editRow(this)"><i class="material-icons">&#xE254;</i></a><a class="delete" title="Delete" data-toggle="tooltip" onclick="deleteRow(this)"><i class="material-icons">&#xE872;</i></a>';
		}
	}
	if (fileList.length > 0) {
		// if there are files in the list, make the dropzone smaller
		document.getElementById("drop_zone").classList.add("drop-zone-small");
	}
	additionalButtons();

}

function additionalButtons() {
	var startClassificationButton = document.getElementById("startClassification");
	var secondaryButtonsDiv = document.getElementById("secondaryButtons");

	if (startClassificationButton.offsetTop > 965) {
		secondaryButtonsDiv.style.display = "inherit";
	} else {
		secondaryButtonsDiv.style.display = "none";
	}
}

function uploadFiles() {

    // Create a new input element
    var input = document.createElement("input");

    // Set the input type to file
    input.type = "file";

    // Only accept .pdf files
    input.accept = ".pdf";

    // Allow multiple files to be selected
    input.multiple = true;

    // When files are selected, this function will be called
    input.onchange = function (event) {
		insertFiles(event.target.files);
    };

    // Programmatically click the input element to open the file dialog
    input.click();
}

function exportResults() {
	var resultTable = document.getElementById("resultTable");
	var csv = [];

	for (var row of resultTable.rows) {
		var rowArray = [];
		for (var i = 0; i < row.cells.length - 1; i++) {
			var cell = row.cells[i];
			var select = cell.querySelector("select");
			if (select) {
				rowArray.push(select.value);
			} else {
				rowArray.push(cell.innerText);
			}
		}
		csv.push(rowArray.join(","));
	}

	var csvContent = csv.join("\n");
	var blob = new Blob([csvContent], { type: "text/csv" });

	var a = document.createElement("a");
	a.href = window.URL.createObjectURL(blob);
	a.download = "classification_results.csv";
	a.style.display = "none";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

function classify() {
	// Show the waiting icon
	document.getElementById("loader").style.display = "flex";
	disableButtons(true);
	var table = document.getElementById("classificationResults");
	function alreadyClassified(filename) {
		for (let i = 0; i < table.rows.length; i++) {
			const name = table.rows[i].cells[0].textContent;

			if (name === filename) {
				return table.rows[i].cells[1].textContent != "";
			}
		}
	}

	var formData = new FormData();
	for (var i = 0; i < fileList.length; i++) {
		if (!alreadyClassified(fileList[i].name)) {
			formData.append("files", fileList[i]);
		}
	}

	// Here, you can add code to fetch the content of the file based on the filename.
	// You may need to use server-side logic or a file input element to achieve this.

	// Make a POST request to your Python script's endpoint
	fetch("/classify", {
		method: "POST",
		body: formData,
	})
		.then((response) => response.json())
		.then((result) => {
			// Hide the waiting icon when the request is complete
			document.getElementById("loader").style.display = "none";
			disableButtons(false);
			console.log(result);

			var rows = table.rows;

			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				var cells = row.cells;
				
				// Assuming you have a "label" for each row
				var filename = cells[0].textContent;

				// Check if the label exists in the "result" object
				if (result.hasOwnProperty(filename)) {
					// Update the content of the cells with the relevant values from the "result" object
					cells[1].textContent =
						valueMapping.relevance[result[filename]["relevance"]];
					row.selectedRelevance = cells[1].textContent;
					cells[2].textContent = isNaN(
						result[filename]["relevance_probability"]
					)
						? ""
						: (result[filename]["relevance_probability"] * 100).toFixed(2) +
						"%";
					cells[3].textContent =
						valueMapping.researchParadigm[result[filename]["group"]];
					cells[4].textContent = isNaN(result[filename]["group_probability"])
						? ""
						: (result[filename]["group_probability"] * 100).toFixed(2) + "%";
					cells[5].textContent =
						result[filename]["relevance"] != 1
							? ""
							: valueMapping.researchMethod[result[filename]["method"]]["name"];
					row.selectedMethod = cells[5].textContent;
					cells[6].textContent = isNaN(result[filename]["method_probability"])
						? ""
						: (result[filename]["method_probability"] * 100).toFixed(2) + "%";

						row.getElementsByClassName("edit")[0].style.display = "inline";
				} else {
					// Handle the case where the label doesn't exist in the "result" object
					console.log("Label not found in result:", filename);
				}

				// lowlight row if no context
				if (cells[1].textContent == "No"){
					row.classList.add("noIS")
				}

			}
		})
		.catch((error) => {
			console.error("Error calling Python script:", error);
			// Hide the waiting icon on error
			document.getElementById("loader").style.display = "none";
			disableButtons(false);
		});
}

function disableButtons(disable) {
	const buttons = document.querySelectorAll('button');

	buttons.forEach((button) => {
		button.disabled = disable;
	});

	const addIcons = document.querySelectorAll('a.add');

	addIcons.forEach((icon) => {
		if(disable){
			originalOnClicks["save"] = icon.getAttribute('onclick');
			icon.removeAttribute('onclick');
		} else {
			icon.setAttribute('onclick', originalOnClicks["save"]);
		}
	});

	const editIcons = document.querySelectorAll('a.edit');

	editIcons.forEach((icon) => {
		if(disable){
			originalOnClicks["edit"] = icon.getAttribute('onclick');
			icon.removeAttribute('onclick');
		} else {
			icon.setAttribute('onclick', originalOnClicks["edit"]);
		}
	});

	const deleteIcons = document.querySelectorAll('a.delete');

	deleteIcons.forEach((icon) => {
		if(disable){
			originalOnClicks["delete"] = icon.getAttribute('onclick');
			icon.removeAttribute('onclick');
		} else {
			icon.setAttribute('onclick', originalOnClicks["delete"]);
		}
	});
}

function deleteRow(row) {
	let selectedRow = row.closest("tr");
	if (selectedRow) {
		for (var i = 0; i < fileList.length; i++) {
			if (fileList[i].name === selectedRow.cells[0].textContent) {
				fileList.splice(i, 1);
				i--;
			}
		}
		selectedRow.remove();
	}
	var tableBody = document.getElementById("classificationResults");
	if (tableBody.rows.length == 0) {
		document.getElementById("drop_zone").classList.remove("drop-zone-small");
		tableBody.innerHTML =
		"<tr><td><div class='min-height'></div></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
	}
	additionalButtons();
}

function dropTable() {
	var tableBody = document.getElementById("classificationResults");
	document.getElementById("drop_zone").classList.remove("drop-zone-small");
	tableBody.innerHTML =
	"<tr><td><div class='min-height'></div></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
	fileList = [];
	additionalButtons();
}

function editRow(editButton) {
	var possibleResearchMethods = [];

	for (var key in valueMapping.researchMethod) {
		if (valueMapping.researchMethod.hasOwnProperty(key)) {
			possibleResearchMethods.push(valueMapping.researchMethod[key].name);
		}
	}

	function createDropdown(values) {
		var select = document.createElement("select");
		for (var option of values) {
			var optionElement = document.createElement("option");
			optionElement.value = option;
			optionElement.text = option;
			select.appendChild(optionElement);
		}

		return select;
	}

	function getResearchParadigm(selectedMethod) {
		for (var key in valueMapping.researchMethod) {
			if (valueMapping.researchMethod[key].name === selectedMethod) {
				return valueMapping.researchParadigm[
					valueMapping.researchMethod[key].group
				];
			}
		}

		return "";
	}

	let selectedRow = editButton.closest("tr");
	var relevanceSelection = createDropdown(
		Object.values(valueMapping.relevance)
	);

	relevanceSelection.addEventListener("change", function () {
		var selectedValue = this.value;
		selectedRow.selectedRelevance = selectedValue;
	});

	var methodSelection = createDropdown(possibleResearchMethods);
	methodSelection.addEventListener("change", function () {
		var selectedValue = this.value;
		var researchParadigm = selectedRow.cells[3];
		selectedRow.selectedMethod = selectedValue;
		researchParadigm.textContent = getResearchParadigm(selectedValue);
	});


	var cells = selectedRow.cells;
	relevanceSelection.value = cells[1].innerText;
	cells[1].innerHTML = "";
	cells[1].appendChild(relevanceSelection);

	methodSelection.value = cells[5].innerText;
	cells[5].innerHTML = "";
	cells[5].appendChild(methodSelection);

	editButton.style.display = "none"
	selectedRow.getElementsByClassName("add")[0].style.display = "inline";

}

function saveValues(saveButton){
	let selectedRow = saveButton.closest("tr");
	var cells = selectedRow.cells;
	cells[1].innerText = selectedRow.selectedRelevance ? selectedRow.selectedRelevance : "";
	cells[2].innerText = "";
	cells[4].innerText = "";
	cells[5].innerText = selectedRow.selectedMethod ? selectedRow.selectedMethod : "";
	cells[6].innerText = "";
	saveButton.style.display = "none"
	selectedRow.getElementsByClassName("edit")[0].style.display = "inline";

	// remove lowlight row if context
	if (cells[1].textContent == "Yes"){
		selectedRow.classList.remove("noIS")
	}
}
