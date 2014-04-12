var wine_constructor = function() {
  /*
   * VARIABLE DECLARATIONS FOR DATA STRUCTURES
   * 
   * config_map = "hard-coded" parameters
   * state_map = data store for wine 
   * jquery_map = cached jquery elements
   */
  var config_map, state_map, jquery_map;
  config_map = {
    /* REST API
      /wine/id
      /wine/id/DELETE
    */
  	ajax: {
  		get: 'http://54.186.151.157/wine',
  		file: 'file://www/jquery/public/BAVC/stefan/day4/wine.json',
  		file_BAVC: 'file://Users/javacrash1/Desktop/stefan/day4/wine.json',
  	},
  	url_prefix: "http://s3-us-west-2.amazonaws.com/sandboxapi/",
  	container_key: '$container',
  	resize_interval: 200,
  	resize_key: '$header',
  	resize_selector: 'header',
  	cart_display_key: '$cart',
  	cart_display_selector: '.cart_quantity',
  	figure_image_key: '$figure_images',
  	figure_image_selector: '.wine_figure img',
  	min_resize_px: 950,
  	initial_container_font_px: 16,
  	min_container_font_px: 10,
  	initial_article_em: 1.5,
  	initial_image_width_px: 250,
  	initial_image_width_pc: '.263',
  	// arbitary price values
  	price_array: [24, 19, 28, 23, 35, 32, 40, 26, 34, 29, 38],
  };
  state_map = {
	wine_object: {},
  	wine_quantity: {},
  	resize_timer_id: null,
  };
  jquery_map = {};
  /*
   * VARIABLE DECLARATIONS FOR FUNCTIONS
   */
  var init_jquery_map, append_jquery_map, set_jquery_map, 
    init_wine_data, add_wine_quantity, set_wine_quantity,
    update_quantity_display, get_total_quantity, 
    get_data, get_heading, get_cart, get_input_div, add_button_handler,
    formatter, resize_display, on_resize, init_module
  init_jquery_map = function(container) {
	  jquery_map[config_map.container_key] = $(container);
  };
  append_jquery_map = function(key, child_selector) {
	var value = jquery_map[config_map.container_key].find(child_selector);
	if (value.size() > 0) {
	  jquery_map[key] = value;
	  return true; 
	} else {
	  console.log('Error append_jquery_map: selector ' + child_selector + ' has no matches');
      return false;
	}
  };
  set_jquery_map = function() {
	append_jquery_map(config_map.resize_key, config_map.resize_selector);
	append_jquery_map(config_map.cart_display_key, config_map.cart_display_selector);
  };
  init_wine_data = function(object_array) {
	var id, wine_object;
  	for (var index in object_array) {
  		//state_map.wine_quantity[object_array[index]["name"]] = 0;
  		wine_object = object_array[index];
  		id = wine_object["id"];
  		wine_object['quantity'] = 0;
  		wine_object['price'] = config_map.price_array.shift();
  		state_map.wine_object[id] = wine_object;
  		state_map.wine_quantity[id] = 0;
  	};
  	console.log("wine_object.length = " + wine_object.length);
  };
  add_wine_quantity = function(id, quantity) {
  	if (id in wine.data.wine_quantity) {
  		state_map.wine_quantity[id] += quantity;
  	}
  };
  set_wine_quantity = function(id, quantity) {
  	if (id in state_map.wine_quantity) {
  		state_map.wine_quantity[id] = quantity;
  	}
  };
  update_quantity_display = function() {
  	var total_quantity = get_total_quantity();
  	jquery_map[config_map.cart_display_key].html(total_quantity);
  };
  get_total_quantity = function() {
  	var total_quantity = 0;
  	var wine_index = "";
  	for (wine_index in state_map.wine_quantity) {
  		total_quantity += parseInt(state_map.wine_quantity[wine_index]);
  	}
  	return total_quantity;
  };  
  get_data = function(callback){
	try {
  	  $.getJSON(config_map.ajax.get, function(data){
  	    init_wine_data(data);
  	    callback(data);
  	  });
	} catch (err) {
	  console.log("Error with .getJSON, try local file");
  	  $.getJSON(config_map.ajax.file, function(data){
  	    init_wine_data(data);
  	    callback(data);
  	  });
	}
  };
  get_heading = function() {
	var my_heading = '<header class=""><h1 class="">Wine Menu</h1>';
	/* http://www.iconarchive.com/show/real-vista-business-icons-by-iconshock/shopping-cart-icon.html */
	my_heading += '<a href="#"><div title="View Cart" class="cart_div"><figure alt="Shopping Cart"><img src="images/shopping-cart-icon.png">' +
	  '<div class="caption_div"><figurecaption>Cart</figurecaption>' + 
	  '<span class="cart_total_quantity"></span></div></div></a></header>';
	var my_heading_html = $.parseHTML(my_heading);
	return my_heading_html;
  };
  get_cart = function() {
	var cart_string = '<article class="cart_article">';
	cart_string += '<table>';
	cart_string += '<tr><th class="cart_name">Wine</th>' + 
	  '<th class="cart_quantity">Number</th>' + 
	  '<th class="cart_price">Price</th>' + 
	  '<th class="cart_total">Total</th></tr>';
	var wine_index = "";
	var wine_object = null;
	var item_total = 0;
	var item_total_string = "";
	var row_string = "";
	for (wine_index in state_map.wine_object) {
	  wine_object = state_map.wine_object[wine_index];
	  item_total = wine_object['price'] * wine_object['quantity'];
	  item_total_string = "$" + item_total;
	  row_string = '<tr><td class="cart_name">' + wine_object['name'] + '</td>' +
	    '<td class="cart_quantity">' + wine_object['quantity'] + '</td>' + 
	    '<td class="cart_price">$' + wine_object['price'] + '</td>' + 
	    '<td class="cart_total">' + item_total_string + '</td></tr>';
	  cart_string += row_string;
	}
	cart_string += '</table>';
	cart_string += '</article>';
	var cart_html = $.parseHTML(cart_string);
	return cart_html;
  },
  get_input_div = function(wine_object) {
  	var wine_id = wine_object["id"];
  	var class_name = 'input_' + wine_id;
  	var input_string = '<div class="input_div">' +
  	  '<span>Price: $' + wine_object['price'] + '</span>' +
  	  '<span>Quantity</span>' +
  	  '<input class="' + class_name + '" type="number" placeholder="1"/>' +
  	  '<button class="' + class_name + '">Add to Cart</button>' +
  	  '</div>';
  	return input_string;
  };
  add_button_handler = function(wine_object) {
  	var wine_id = wine_object["id"];
  	var button_selector = 'button.input_' + wine_id;
  	var input_selector = 'input.input_' + wine_id;
  	$(button_selector).on('click', function(e) {
  		var quantity = $(input_selector).val();
  		set_wine_quantity(wine_id, quantity);
  		update_quantity_display();
  	});
  };
  formatter = {
  	as_article: function(wine_object) {
  	  var key, value, class_name, img_src;
  	  var key_array = ["name", "year", "grapes", "country", "region", "description"];
  	  var article_string = "<article>";
  	  article_string += '<div class="row wine_object_div">';
  	  article_string += '<div class="wine_info">';
  	  for (var i in key_array) {
  	  	key = key_array[i];
  	  	value = wine_object[key];
  	  	class_name = "wine_" + key;
  	    article_string += '<p class="' + class_name + '">' + value + '</p>';
  	  };
  	  article_string += '</div>';
  	  img_src = config_map.url_prefix + wine_object["picture"];
  	  // WORK AROUND WHILE IMAGE SERVER IS DOWN!
  	  img_src = 'images/white_wine.jpg';
  	  article_string += '<figure class="wine_figure"><img src="' + img_src + '" alt="Picture of ' + 
  	    wine_object["name"] + '"></figure>';
  	  article_string += get_input_div(wine_object);
  	  article_string += '</div>';
  	  article_string += "</article>";
  	  var article_html = $.parseHTML(article_string);
  	  return article_html;
    },
    as_money: function(value, decimals, decimal_sep, thousands_sep) { 
  	  /* http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript */
  	  var n = value,
  	  c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
  	  d = decimal_sep || '.', //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)

  	  /*
  	  according to [http://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
  	  the fastest way to check for not defined parameter is to use typeof value === 'undefined' 
  	  rather than doing value === undefined.
  	  */   
  	  t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, //if you don't want to use a thousands separator you can pass empty string as thousands_sep value

  	  sign = (n < 0) ? '-' : '',

  	  //extracting the absolute value of the integer part of the number and converting to string
  	  i = parseInt(n = Math.abs(n).toFixed(c)) + '', 

  	  j = ((j = i.length) > 3) ? j % 3 : 0; 
  	  return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ''); 
  	},
  };
  resize_display = function() {
    var header_width = jquery_map[config_map.resize_key].width();
    console.log ('width = ' + header_width);
    if (header_width >= config_map.min_resize_px) {
    	return;
    }
    var scale = header_width / config_map.min_resize_px;
    //var new_em = config_map.initial_article_em * scale;
    var new_font_px = config_map.initial_container_font_px * scale;
    new_font_px = Math.max(new_font_px, config_map.min_container_font_px);
    new_font_px += "px";
    console.log('font-size: ' + new_font_px);
    jquery_map[config_map.container_key].css({'font-size': new_font_px});
    var new_image_px = config_map.initial_image_width_px * scale;
   jquery_map[config_map.figure_image_key].css({'width': new_image_px});
    
  };
  on_resize = function (){
    if (state_map.timer_id != null) {
    	return true;
    }
    resize_display();
    state_map.resize_timer_id = setTimeout(function(){
      state_map.resize_timer_id = null;	
    }, config_map.resize_interval);
    return true;
  };
  init_module = function(container) {
    init_jquery_map(container);
    var main_div = jquery_map['$container'];
    main_div.append(get_heading());
    // Store the header tag and cart display span in the jquery map
	set_jquery_map();
	// Call the ajax method to retrieve the wine data with anonymous callback function
	get_data(function(json_data){
	  main_div.append(get_cart());
	  // create the article tag for each wine object add to the jquery container
	  var index = "", wine_html;
	  for (index in json_data) {
	  	wine_object = json_data[index];
	    wine_html = formatter.as_article(wine_object);
	    main_div.append(wine_html);
	    add_button_handler(wine_object);
	  }
	  // Store the image tags in the jquery map
	  append_jquery_map(config_map.figure_image_key, config_map.figure_image_selector);
	  on_resize();
	});
    $(window)
      .bind( 'resize', on_resize );
  };

  return {
	init_module: init_module,
  };
};

$(document).ready(function(){
	var wine_app = new wine_constructor();
	wine_app.init_module('.wine_menu_main');
});
