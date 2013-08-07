var List = function (initialData) {
	var internalList = {};
	var $todolist = document.querySelector('.todolist');
	this.renderItem = function (itemText, itemId) {
		// Renders into the DOM
		var listItem = document.createElement('li');
		itemId = itemId || guid();
		listItem.innerHTML = itemText;

		$todolist.appendChild(listItem);
		internalList[itemId] = itemText;
		return itemId;
	};

	this.addItem = function (itemText) {
		var write = {};
		write[guid()] = itemText;
		chrome.storage.sync.set(write, function () {
			console.log(arguments);
		});
	};

	this.reset = function (data) {
		internalList = data;
		$todolist.innerHTML = '';
		for (var datum in data) {
			this.renderItem(data[datum], datum);
		}
	};

	this.reset(initialData);

	return this;
}

chrome.storage.onChanged.addListener(function (changes, areaName) {
	for (itemId in changes) {
		todos.renderItem(changes[itemId], itemId);
	}
});


function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

function init() {
	chrome.storage.sync.get(function (data) {
		todos = new List(data);

		var $addItemButton = document.querySelector('.add-item');
		var $itemText = document.querySelector('.item-text');

		// Register button
		$addItemButton.addEventListener('click', function () {
			todos.addItem($itemText.value);
		});

		console.log('loaded!');
	});
};

document.addEventListener('DOMContentLoaded', init, false);