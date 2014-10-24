// tweetslist data array for filling in info box
var tweetListData = [];

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

    // Makes sure that there is actually input in the tweet box 
    var errorCount = 0;
    $('#addTweet input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

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

                // Clear the form inputs
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
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in something!');
        return false;
    }
};
