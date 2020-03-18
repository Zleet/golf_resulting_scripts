// =============================================================================
// pgatour.com resulting script
// =============================================================================
// globals go here

// global handle for input window
var input_window = -1;

// global window for results window
var results_window = -1;

// player scores
var player_scores = [];
// =============================================================================
// code to execute
// =============================================================================
// build and open the input window
build_and_open_input_window();

// build and open the result display window
build_and_open_results_window();

// get all the player scorers
extract_all_player_scores();
// =============================================================================
// Build and open the input window.
// The input window will consist of:
// 1. a dropdown menu where the user selects one of:
//    (1) 1st round matches
//    (2) 2nd round matches
//    (3) 3rd round matches
//    (4) 4th round matches
//    (5) Tournament matches
// =============================================================================
function build_and_open_input_window() {

	// build the html for the input window
	var html = '<!DOCTYPE html>';
	html += '<html>';
	html += '<head>';
	html += '<style>';
	html += 'body {';
	html += 'background-color: black;';
	html += 'color: yellow;';
	html += 'font: 12pt arial;';
	html += '}';
	html += 'select {';
	html += 'background-color: black;';
	html += 'color: yellow;';
	html += 'border: 2px solid red;';
	html += 'border-radius: 10px;';
	html += '}';
	html += '#input_textarea {';
	html += 'background-color: black;';
	html += 'color: yellow;';
	html += 'border: 2px solid red;';
	html += 'border-radius: 10px;';
	html += 'height: 460px;';
	html += 'width: 200px;';
	html += '}';
	html += '</style>';
	html += '<head>';
	html += '<body>';
	html += '<table align="center">';
	html += '<tr><td style="text-align: center;"><strong>SELECT EVENT';
	html += '</strong></td></tr>';
	html += '<tr><td align="center">';
	html += '<select id="round_selection_dropdown_menu">';
	html += '<option value="first_round">1st Round 3 Balls</option>';
	html += '<option value="second_round">2nd Round 3 Balls</option>';
	html += '<option value="third_round">3rd Round 3 Balls</option>';
	html += '<option value="fourth_round">4th Round 3 Balls</option>';
	html += '<option value="tournament_matches">Tournament Matches</option>';
	html += '</select>';
	html += '</td></tr>';
	html += '<tr><td style="height: 10px;"></td></tr>';
	html += '<tr><td style="text-align: center;"><strong>TYPE GROUPS OF';
	html += '</strong></td></tr>';
	html += '<tr><td style="text-align: center;"><strong>PLAYER NAMES HERE';
	html += '</strong></td></tr>';
	html += '<tr><td style="text-align: center;"><strong>(SEPARATED BY';
	html += '</strong></td></tr>';
	html += '<tr><td style="text-align: center;"><strong>DOUBLE NEWLINES)';
	html += '</strong></td></tr>';
	html += '<tr><td align="center">';
	html += '<textarea id="input_textarea"></textarea>';
	html += '</td></tr>';
	html += '</table>';
	html += '</body>';
	html += '</html>';
	
	// open the input window
	input_window = window.open("", "", "width=280,height=700");

	// stick the html in the input window
	input_window.document.open();
	input_window.document.write(html);
	input_window.document.close();
	
	// attach an eventlistener to the input textarea to listen for changes to
	// the text contained within it
	var input_textarea = input_window.document.getElementById(
														"input_textarea");
	input_textarea.addEventListener("keyup", input_textarea_content_has_changed);
	
	// attach an eventlistener to the round selection dropdown menu to rebuild
	// the result window content when the user changes the selection in the
	// dropdown menu
	var round_selection_dropdown_menu = input_window.document.getElementById(
												"round_selection_dropdown_menu");
	round_selection_dropdown_menu.addEventListener("change",
											input_textarea_content_has_changed);

	return;
}
// =============================================================================
// Build and open the results window.
// =============================================================================
function build_and_open_results_window() {

	// build the html for the result display window
	var html = '<!DOCTYPE html>';
	html += '<html>';
	html += '<head>';
	html += '<style>';
	html += 'body {';
	html += 'background-color: black;';
	html += 'color: yellow;';
	html += 'font: 12pt arial;';
	html += '}';
	html += '</style>';
	html += '<head>';
	html += '<body>';
	html += '<table align="center">';
	html += '<tr><td style="text-align: center; color: aqua;"><strong>RESULTS';
	html += '</strong></td></tr>';
	html += '<tr><td id="results_type_cell"></td></tr>';
	html += '<tr><td id="results_cell"></td></tr>';
	html += '</table>';
	html += '</body>';
	html += '</html>';
	
	// open the result display window
	results_window = window.open("", "", "width=280,height=700");

	// stick the html in the result display window
	results_window.document.open();
	results_window.document.write(html);
	results_window.document.close();	

	return;
}
// =============================================================================
// Called when the content in the input textarea in the input window changes.
// =============================================================================
function input_textarea_content_has_changed() {

	// get the event from the round selection dropdown menu in the input window
	var dropdown_menu = input_window.document.getElementById(
											"round_selection_dropdown_menu");
	var selected_event = dropdown_menu.value;

	// get the text from the input textarea in the input window
	var textarea = input_window.document.getElementById("input_textarea");
	var text = textarea.value;
	
	// split the text along double newlines
	var text_blocks = text.split("\n\n");
	
	// loop through the text blocks and only keep text blocks that are more than
	// zero characters long after trimming
	var kept_text_blocks = [];
	for (var i = 0; i < text_blocks.length; ++i) {
		var text_block = text_blocks[i].trim();
		if (text_block.length > 0) {
			kept_text_blocks.push(text_block);
		}
	}
	text_blocks = kept_text_blocks;
	
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// loop through text blocks; for each text block:
	// 1. split the text block into lines
	// 2. remove blank lines
	// 3. get the scores for all matching players and build a small table in the
	//    format:
	//    <PLAYER NAME> <SCORE>
	// Each little table should be separated by a div roughly 10 pixels tall
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	var small_html_tables = [];
	for (var i = 0; i < text_blocks.length; ++i) {
		var text_block = text_blocks[i].trim();
		// split the text block into lines
		var lines = text_block.split("\n");
		// loop through lines and keep only non-whitespace lines
		var kept_lines = [];
		for (var j = 0; j < lines.length; ++j) {
			var line = lines[j].trim();
			if (line.length > 0) {
				kept_lines.push(line);
			}
		}
		lines = kept_lines;
		// build the little html table for the bunch of players we're currently
		// resulting
		var small_html_table = build_small_html_result_table(lines,
																selected_event);
		small_html_tables.push(small_html_table);
	}
	
	// use the bunch of small html tables for build the html to stick in the
	// results_cell of the results_window
	var join_html = '<table><tr><td style="height: 10px;"></td></tr></table>';
	var all_results_html = small_html_tables[0];
	for (var i = 1; i < small_html_tables.length; ++i) {
		all_results_html += join_html + small_html_tables[i];
	}
	
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// stick the event the user has selected in the results type cell
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	var event_description = '';
	if (selected_event == 'first_round') {
		event_description = 'FIRST ROUND MATCHES';
	}
	if (selected_event == 'second_round') {
		event_description = 'SECOND ROUND MATCHES';
	}
	if (selected_event == 'third_round') {
		event_description = 'THIRD ROUND MATCHES';
	}
	if (selected_event == 'fourth_round') {
		event_description = 'FOURTH ROUND MATCHES';
	}
	if (selected_event == 'tournament_matches') {
		event_description = 'TOURNAMENT MATCHES';
	}
	var event_description_html = '<table align="center"><tr><td ';
	event_description_html += 'style="text-align: center; color: chartreuse;';
	event_description_html += 'text-decoration: underline;"><strong>';
	event_description_html += event_description + '</strong></td></tr></table>';
	
	var results_type_cell = results_window.document.getElementById(
														"results_type_cell");
	results_type_cell.innerHTML = event_description_html;

	// stick all_results_html in the results cell in the results window
	var results_cell = results_window.document.getElementById('results_cell');
	results_cell.innerHTML = all_results_html;

	return;
}
// =============================================================================
// Build a small html table in the format:
// <player_name>  <score>
// <player_name>  <score>
// <player_name>  <score>
// and return the html
// =============================================================================
function build_small_html_result_table(lines, selected_event) {
	
	// array to hold all matching player objects for the lines passed into
	// the function
	matching_players = [];
	
	// loop through the lines and find all the matching players for each line
	for (var i = 0; i < lines.length; ++i) {
		var line = lines[i];
		// split the line into substrings
		var words = line.split(' ');
		// loop through words and only keep non-whitespace words
		var kept_words = [];
		for (var j = 0; j < words.length; ++j) {
			var word = words[j].trim();
			if (word.length > 0) {
				kept_words.push(word);
			}
		}
		words = kept_words;
		// loop through players
		for (var j = 0; j < player_scores.length; ++j) {
			var player_object = player_scores[j];
			var player_name = player_object["player_name"];
			// loop through words; if all player words are in the player name,
			// push the current player object onto the array matching_players
			var player_name_matches_all_words = 1;
			for (var k = 0; k < words.length; ++k) {
				var word = words[k].toUpperCase();
				if (player_name.indexOf(word) == -1) {
					player_name_matches_all_words = 0;
					break;
				}
			}
			if (player_name_matches_all_words) {
				matching_players.push(player_object);
			}
		}
	}

	// build a table out of the matching players
	var html = '<table align="right" style="border: 2px solid red; ';
	html += 'border-radius: 10px;">';
	for (var i = 0; i < matching_players.length; ++i) {
		var player_object = matching_players[i];
		var player_name = player_object["player_name"];
		html += '<tr><td style="text-align: right; color: aqua;">' + player_name + '</td>';
		// if the user has selected tournament matches, build another five
		// columns of the table, containing all the scores, plus the total score,
		// otherwise build a single column containing the score for the round
		// the user has selected
		if (selected_event == "tournament_matches") {
			// first round score
			html += '<td>' + player_object["first_round_score"] + '</td>';
			// second round score
			html += '<td>' + player_object["second_round_score"] + '</td>';
			// third round score
			html += '<td>' + player_object["third_round_score"] + '</td>';
			// fourth round score
			html += '<td>' + player_object["fourth_round_score"] + '</td>';
			// total tournament score
			var total_score = 0;
			if (string_is_an_integer(player_object["first_round_score"])) {
				total_score = parseInt(player_object["first_round_score"]);
			}
			if (string_is_an_integer(player_object["second_round_score"])) {
				total_score += parseInt(player_object["second_round_score"]);
			}
			if (string_is_an_integer(player_object["third_round_score"])) {
				total_score += parseInt(player_object["third_round_score"]);
			}
			if (string_is_an_integer(player_object["fourth_round_score"])) {
				total_score += parseInt(player_object["fourth_round_score"]);
			}
			html += '<td>' + total_score + '</td></tr>';
		} else {
			if (selected_event == "first_round") {
				html += '<td>' + player_object["first_round_score"] + '</td></tr>';
			}
			if (selected_event == "second_round") {
				html += '<td>' + player_object["second_round_score"] + '</td></tr>';
			}
			if (selected_event == "third_round") {
				html += '<td>' + player_object["third_round_score"] + '</td></tr>';
			}
			if (selected_event == "fourth_round") {
				html += '<td>' + player_object["fourth_round_score"] + '</td></tr>';
			}
		}
	}
	// end of table
	html += '</table>';
	
	return html;
}
// =============================================================================
// Check if a string is an integer. If it is, return 1, otherwise return 0.
// For a string to pass this test, it must consist solely of a selection of
// one of more characters from the set:
// ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].
// =============================================================================
function string_is_an_integer(the_string) {
	
	the_string = the_string.trim();
	
	// empty strings don't qualify as integers
	if (the_string.length === 0) {
		return 0;
	}
	
	var acceptable_characters = [
					'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
								];
	
	for (var i = 0; i < the_string.length; ++i) {
		var current_character = the_string.substring(i, i + 1);
		if (acceptable_characters.indexOf(current_character) == -1) {
			return 0;
		}
	}

	// if we've fallen through, the string consists solely of acceptable
	// characters...

	return 1;
}
// =============================================================================
// Extract all the player scores from the pgatour.com webpage.
// For each player, build a player score object in the form:
// {
//	"player_name"		: "Tiger Woods",
//	"first_round_score"		: 71,
//	"second_round_score"	: 72,
//	"third_round_score"		: 73,
//	"fourth_round_score"	: 74
// }
// Store all the player score objects in the global array player_scores
// =============================================================================
function extract_all_player_scores() {

	// clear out the global array
	player_scores = [];
	
	// extract all the table row objects from the leaderboard
	var row_objects = document.querySelectorAll("tr");
	
	// loop through row objects and keep only the rows that contain the
	// substring '<td class="player-name"' (these are the player rows)
	var sentinel_string = '<td class="player-name"';

	var kept_rows = [];
	for (var i = 0; i < row_objects.length; ++i) {
		var row_object = row_objects[i];
		var row_html = row_object.innerHTML;
		if (row_html.indexOf(sentinel_string) != -1) {
			kept_rows.push(row_object);
		}
	}
	row_objects = kept_rows;
	
	// now loop through row_objects and extract all the results
	for (var i = 0; i < row_objects.length; ++i) {
		var row_object = row_objects[i];
		var row_html = row_object.innerHTML;
		// get player name
		var player_name = extract_substring(row_html, 
			'<div class="player-name-col"', '>', '<');
		if ((player_name.indexOf('(') != -1) && (player_name.indexOf(')') != -1)) {
			if (player_name.indexOf('(') < player_name.indexOf(')')) {
				var open_bracket_loc = player_name.indexOf('(');
				var close_bracket_loc = player_name.indexOf(')');
				var string_to_remove = player_name.substring(
									open_bracket_loc, close_bracket_loc + 1);
				player_name = player_name.replace(string_to_remove, '');
			}
		}
		player_name = player_name.trim();
		// extract the four round scores
		var round_scores = [];
		while (row_html.indexOf('<td class="round-x"') != -1) {
			var round_score = extract_substring(row_html,
							'<td class="round-x', '>', '<');
			round_scores.push(round_score);
			var loc = row_html.indexOf('<td class="round-x') + 18;
			row_html = row_html.substring(loc);
		}
		// build result object and push it onto the array player_scores
		var result_object = {
					"player_name"			: player_name.toUpperCase(),
					"first_round_score"		: round_scores[0],
					"second_round_score"	: round_scores[1],
					"third_round_score"		: round_scores[2],
					"fourth_round_score"	: round_scores[3]
							};
		player_scores.push(result_object);
	}

	return;
}
// =============================================================================
// 1. find sentinel_string within big_string and remove everything before it
//    (if sentinel string is an empty string, skip this step)
// 2. extract the substring between start_string and end_string and return it
//    (without including start_string and end_string)
// =============================================================================
function extract_substring(big_string, sentinel_string, start_string,
                                                                end_string) {
    
    // search variables
    var loc;
    var start;
    var end;
    
    // if sentinel_string is not an empty string AND sentinel_string is in
    // big_string, locate it and remove everything before it
    if ((sentinel_string.length > 0)
        && (big_string.indexOf(sentinel_string) != -1)) {
        loc = big_string.indexOf(sentinel_string);
        big_string = big_string.substring(loc);
    }
    
    // find start_string and remove everything before it (also remove
    // start_string)
    loc = big_string.indexOf(start_string) + start_string.length;
    big_string = big_string.substring(loc);
    
    // find end_string and remove it and everything after it
    loc = big_string.indexOf(end_string);
    var extracted_substring = big_string.substring(0, loc);
    
    return extracted_substring;
}
// ============================================================================