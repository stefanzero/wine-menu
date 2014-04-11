var myutil = {};
myutil.shuffle = function(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

$(document).ready(function(){
	var class_array = [
	  'r1c1','r1c2','r1c3','r1c4',
	  'r2c1','r2c2','r2c3','r2c4',
	  'r3c1','r3c2','r3c3','r3c4',
	];
	var image_prefix = 'images/teddy_bear_toy_';
	var image_name = "";
	var image_array = [
	];
	var i, n=12, ip1;
	for (var i=0; i<6; i++) {
		ip1 = i+1;
		image_name = image_prefix + ip1 + '.png';
		image_array.push(image_name);
		image_array.push(image_name);
	}
	myutil.shuffle(image_array);
	var class_selector, image_url;

	for (i=0; i<n; i++) {
		class_selector = '.' + class_array[i];
		//image_url = 'url(' + image_prefix + i + '.png)';
		image_url = 'url(' + image_array[i] + ')';
		$(class_selector).css({'background-image': image_url});
		//console.log(class_selector + ' = ' + image_url);
	}

    var num_guesses = 0;
    var all_tiles = $('.content td div');
    all_tiles.hide();
	$('.start_button').on('click', function(e){
		e.preventDefault();
		num_guesses = 0;
	});
	var first_tile = true;
	var first_image = "";
	var second_image = "";
	var first_element = null;
	var this_element = null;
	var last_elements = [];
	var guess_element = $('.num_guesses');
	var last_element_item = null;
	var last_element_index = 0;
	$('.content td').on('click', function(e){
		e.preventDefault();
		this_element = $(this).find('div');
		this_element.show();
		//if (this_element in last_elements) {
		if (this_element.hasClass('picked')) {
			console.log('already picked');
			return;
		} else {
			for (last_element_index in last_elements) {
				last_element_item = last_elements[last_element_index];
				last_element_item.hide();
				last_element_item.removeClass('picked');
			}
			if (last_elements.length > 0) {
			  last_elements = [];
			}
		}
		first_tile = !first_tile;
		this_element.addClass('picked');
		if (!first_tile) {
			first_element = this_element;
			first_image = $(this).find('div').css('background-image');
			console.log('first image = ' + first_image);
		} else {
			num_guesses += 1;
			guess_element.html(num_guesses);
			second_image = $(this).find('div').css('background-image');
			console.log('first image = ' + first_image);
			if (first_image === second_image) {
				console.log('Correct');
				first_element.addClass('correct');
				this_element.addClass('correct');
			} else {
				console.log('Guess again');
				//first_element.hide();
				//this_element.hide();
				last_elements.push(first_element);
				last_elements.push(this_element);
			}

		}
	})

});