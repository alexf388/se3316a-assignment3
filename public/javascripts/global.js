/*
// tweetslist data array for filling in info box
var tweetListData = [];
*/

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Add User button click
    $('#btnAddTweet').on('click', addTweet);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/tweets/tweetlist', function( data ) {

	
        // every item in our JSON is addded  to a table row and their specific cells to the content string
        $.each(data, function(){
	    //first we must conver the this.date from ISOString back to Date object in javascript, so it's easily visible
	    var dateObject = new Date(this.date);

            tableContent += '<tr>';
            tableContent += '<td>' + this.tweet + '</td>';
            tableContent += '<td>' + dateObject + '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#tweetList table tbody').html(tableContent);
    });
};



// Add tweet
function addTweet(event) {
    event.preventDefault();

    //boolean variables, one for noInput, and one for visible hashtag, and one if there are spaces 
    var noInput = false;
    var visibleHashtag = true;
    var noSpaces = true; 

    
    // Makes sure that there is actually input in the tweet box 
    $('#addTweet input').each(function(index, val) {
        if($(this).val() === '') { 
		noInput = true; 
		alert("Please fill in something in the hashtag input");  }
    });	

    if (noInput === true){
	//do nothing, move on to the next if statement because the input is already invalid
    }
    else{
    	// checks to see if the hashtag sign is in front, if not... 
    	$('#addTweet input').each(function(index, val) {
		var inputString = $(this).val().toString();         
		//alert ("inputString[0]:" + inputString.charAt(0)); 
	
		if (inputString.charAt(0) != '#') { 
			visibleHashtag = false; 
			alert ("No hashtag in front! Please type '#' in front of tag" ); 
		}
    	});
    }

    if (noInput === true || visibleHashtag === false){
	//do nothing, move on to the next if statement because the input is already invalid
    }
    else{
	$('#addTweet input').each(function(index, val) {
       		var inputString = $(this).val().toString();  

		if (inputString.indexOf(' ') >= 0){
			noSpaces = false; 
			alert ("No spaces in between hashtags!" ); 			
		}
	}); 
    }
    

    // Check and make sure all conditions have been fulfilled 
    if(noInput === false && visibleHashtag === true && noSpaces ===true) {

	//get the current date and time of the tweet
	var d = new Date(); 
	//MongoDB only accepts dates in ISO string, so we must conver it to ISO String 
	var ISOdate = d.toISOString(); 

        // If it is, compile all user info into one object
        var newTweet = {
            'tweet': $('#addTweet fieldset input#inputTweetName').val(),
            'date': ISOdate 
        }

        // Use AJAX to post the object to our addtweet service
        $.ajax({
            type: 'POST',
            data: newTweet,
            url: '/tweets/addtweet',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs so the user doesn't have to backspace them everytime 
                $('#addTweet fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    
};
