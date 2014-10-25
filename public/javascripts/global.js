
// tweetslist data array and //dateListData for containing the different tweet and dates 
//assumption: both arrays will have the same size i 
var tweetString = ""; 
var tweetJSON; 
var dateString = ""; 
var dateJSON; 

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Add User button click, on click it will run function addTweet located below 
    $('#btnAddTweet').on('click', addTweet);

	
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/tweets/tweetlist', function( data ) {

	
        // every item in our JSON is added  to a table row and their specific cells to the content string
        $.each(data, function(){
	    //first we must conver the this.date from ISOString back to Date object in javascript, so it's easily visible
	    var dateObject = new Date(this.date);

            tableContent += '<tr>';
	    tableContent += '<td id="'+ this.tweet +'">' + this._id + '</td>';
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
        if($(this).val() === '' || $(this).val() === '#') { 
		noInput = true; 
		alert("Please fill in something in the hashtag input (input cannot be just hashtag as well)");  }
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

	//create variables to be added later to local array 
	tweetString =  $('#addTweet fieldset input#inputTweetName').val().toString(); 
	tweetJSON = $('#addTweet fieldset input#inputTweetName').val(); 
	dateString = d.toString();
	dateJSON =ISOdate; 
	//alert ("tweetString: " + tweetString + ", dateString: " + dateString);  

	//check database for similarities
	checkDatabase(); 
	
    }
    
};

//checks the database first to see if there are any existing hashtags with the same hashtag name 
function checkDatabase(){
    // jQuery AJAX call for JSON
    //alert("running!!!"); 

    $.getJSON( '/tweets/alltweets', function( data ) {

	
        // every item in our JSON is added  to a table row and their specific cells to the content string
        $.each(data, function(){
	    //first we must convert the this.date from ISOString back to Date object in javascript, so it's easily visible
	    var eachDate = new Date(this.date);
	    
	    //same thing with tweet name 
	    var eachTweet = this.tweet;
	    
	    //alert("eachTweet from alltweets: " + eachTweet + "  , tweetString: " + tweetString); 
	    
 
	    //compare eachTweet with tweetString 
	    if (eachTweet === tweetString){
		//alert("tweet comparison found!");

		//get the id 
		//TODO: figure out a way to get ID 
		var id = this._id; 
		//alert ("id of the found tweet: " + id); 
		deleteTweet(id);  
		//var id = document.getElementById(tweetString).childNodes[0].nodeValue; 	
		//alert ("id: " + id);
		//alert ("o_id: " + o_id); 

	    }
		
	    	
            
        });

	//at the end we call the AJAXAddTweet() to add the tweet 
	AJAXAddTweet(); 

    });

}; 


function deleteTweet(o_id){
		//call for DELETE
		// Use AJAX to delete the object from our addtweet service 
		//alert ("we are here with in the final mode" ); 

        	$.ajax({
            		type: 'DELETE',
            		url: '/tweets/alltweets/' + o_id
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

}; 


function AJAXAddTweet(){
	var newTweet = {
		'tweet': tweetJSON, 
		'date': dateJSON
	}	

	// Use AJAX to post the object to our addtweet service
        $.ajax({
            type: 'POST',
            data: newTweet,
            url: '/tweets/alltweets',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs so the user doesn't have to backspace them everytime 
                $('#addTweet fieldset input').val('');
		
		//alert("table about to be populated");  
                // Update the table                
		populateTable(); 

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });


}; 




