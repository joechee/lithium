var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-43647847-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var List = function (initialData) {
	var internalList = {};
	var $todolist = document.querySelector('.todolist');
	this.renderItem = function (itemText, itemId) {
		// Renders into the DOM
                var listItem = document.createElement('li');
                listItem.className = "todo-item";
		itemId = itemId || guid();
		listItem.innerHTML = itemText;

                var removeItem = function () {
                    listItem.parentNode.removeChild(listItem);
		    chrome.storage.sync.remove(itemId, function () {
		        console.log(arguments);
		    });
                }; 

                listItem.addEventListener('click', removeItem);

		$todolist.appendChild(listItem);
		internalList[itemId] = itemText;
		return itemId;
	};

	this.addItem = function (itemText) {
                if (!itemText || !itemText.trim()) return;
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
        if (changes[itemId]['newValue']) {
        	todos.renderItem(changes[itemId]['newValue'], itemId);
        }
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

		// var $addItemButton = document.querySelector('.add-item');
		var $itemText = document.querySelector('.item-text');

		// Register button
		// $addItemButton.addEventListener('click', function () {
		// 	todos.addItem($itemText.value);
  //                       $itemText.value = "";
		// });
        var $prompt = document.querySelector('.prompt');
        $prompt.addEventListener("keypress", function (e) {
            if (e.keyCode == 13) {
            	if ($itemText.value === '') {
            		console.log('empty input');
            		return;
            	}
            	if ($itemText.value.indexOf('<script>') !== -1) {
            		console.log('unsafe input');
            		$itemText.value = "";
            		return;
            	}
       			todos.addItem($itemText.value);
            	$itemText.value = "";
            	var $list = document.querySelector('.list-container');
				$list.scrollTop = $list.scrollHeight;
				console.log($list.scrollHeight);
            }
        });

		console.log('loaded!');
	});
};

document.addEventListener('DOMContentLoaded', init, false);
