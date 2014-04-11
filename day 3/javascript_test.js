/* javascript_test.js */
$(document).ready(function(){

    var content_div = $('.content');

    var test_numbers = false;
    if (test_numbers) {

		var my_int = 1;
	    var my_float = 1.5;
	    var my_array = ['apples', 'oranges', 'lemons'];
	    var my_object = {
		  key1: my_int,
		  key2: my_float
	    };
	    var html_string = "";
	    for (var key in my_object) {
	    	console.log('my_object[' + key + '] = ' + my_object[key]);
	    	html_string += '<p>' + 'my_object[' + key + '] = ' + my_object[key] + '</p>';
	    }
	    var new_html = $.parseHTML(html_string);
	    for (var item in new_html) {
	      $('.content').append(new_html[item]);
	    }
    }


    var my_string_array = ["I ", "want ", "pizza for lunch!"];
    var my_string = "";
    while (my_string_array.length > 0) {
      my_string += my_string_array.shift();
    }
    $('.content').append(my_string);

    var test_math = false;
    if (test_math) {
	    var my_math_members = Object.getOwnPropertyNames(Math);
	    var my_math_string = "";
	    for (var i in my_math_members){
	    	my_math_string += '<li>' + my_math_members[i] + '</li>';
	    }
	    my_math_string = '<ol>' + my_math_string + '</ol>';
	    var my_math_html = $.parseHTML(my_math_string);
	    $('.math_content').html(my_math_html);
	    $('.math_content ol').css({"margin-left": "80px", "font-size" : ".5em"});
    }

    var test_alerts = false;
    if (test_alerts) {
	    var answer = prompt("Do you want to play a game?");
		if (answer == "y") {
			alert("Let's play Bingo!");
			var confirm_result = confirm("Are you sure");
			alert("OK - let's start playing!");
		}
    }

    var test_ages = true;
    if (test_ages) {
    	var form_string = '<form class="my_form">'
    	  + '<label>Enter your age:</label>'
    	  + '<input id="my_age_input" type="text"></input>'
    	  + '<button type="submit" value="submit">Submit</button>'
    	  + '<form>'
    	  + '<div class="message_div"></div>';
        var form_html = $.parseHTML(form_string);
        $('.my_main').append(form_html);        
        $('.my_form button').on('click', function(e) {
        	e.preventDefault();
        	var age = $('#my_age_input').val();
        	console.log("Your age = " + age);
        	var age_child = 12;
        	var age_adult = 21;
        	var age_middle_age = 55;
        	var age_old = 75;
        	var message = "";
        	if (age <= age_child) {
        		message = "You get into movies with a discount!";
        	} else if (age < age_adult) {
        		message = "You can join FaceBook";
        	} else if (age <= age_middle_age) {
        		message = "You can drink alcohol!";
        	} else if (age <= age_old) {
        		message = "You can join AARP";
        	} else {
        		message = "You can buy a Colonial Penn Life Insurance Policy";
        		//message = "Time for your colonoscopy";
        	}
        	message = '<p>' + message + '</p>';
        	var messageHtml = $.parseHTML(message)
        	$('.message_div').html(messageHtml);
        	$('.message_div').css({'font-size': '2em', 'font-family': 'Georgia'})
        });
    }

    var test_functions = true;
    if (test_functions) {
    	var my_var_fun = function() {
    		var num_args = arguments.length;
    		var message = 'You entered ' + num_args + ' arguments to the function';
        	message = '<p>' + message + '</p>';
        	var messageHtml = $.parseHTML(message)
        	$('.my_function_form .message_div').html(messageHtml);
        	$('.my_function_form .message_div').css({'font-size': '2em', 'font-family': 'Georgia'})
    	}
    	var form_string = '<form class="my_function_form">'
    	  + '<label>Enter argument 0:</label>'
    	  + '<input id="my_arg_0" type="text"></input>'
    	  + '<label>Enter argument 1:</label>'
    	  + '<input id="my_arg_1" type="text"></input>'
    	  + '<label>Enter argument 2:</label>'
    	  + '<input id="my_arg_2" type="text"></input>'
    	  + '<button type="submit" value="submit">Submit</button>'
    	  + '<form>'
    	  + '<div class="message_div"></div>';
        var form_html = $.parseHTML(form_string);
        $('.my_main').append(form_html);        
        $('.my_function_form button').on('click', function(e) {
        	e.preventDefault();
        	var my_args_array = [];
        	var arg0 = $('#my_arg_0').val();
        	if (arg0 != "") {
        		my_args_array.push(arg0)
        	}
        	var arg1 = $('#my_arg_1').val();
        	if (arg1 != "") {
        		my_args_array.push(arg1)
        	}
        	var arg2 = $('#my_arg_2').val();
        	if (arg2 != "") {
        		my_args_array.push(arg2)
        	}
        	my_var_fun.apply(null, my_args_array);

        });

    }

});
