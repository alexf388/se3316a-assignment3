var express = require('express');
var router = express.Router();

/*
 * GET ALL THE TWEEEEEEETS
*/ 
router.get('/alltweets', function(req, res) {
    var db = req.db;
    db.collection('tweetdb').find().toArray(function (err, items) {
        res.json(items);
    });
});


/*
 * GET ONE TWEEET
*/ 
router.get('/alltweets/:id', function(req, res) {
    var db = req.db;
    var tweetToGet = req.params.id;
    db.collection('tweetdb').findById(tweetToGet, function (err, item) {
        res.json(item);
    });
});

/*
* UPDATE ONE TWEET (PUT) TO CHANGE THE NAME (ONLY), NOT THE DATE OR _ID
*/
router.put('/alltweets/:id', function(req, res){
	var db = req.db; 
	db.collection('tweetdb').updateById(req.params.id, {$set:req.body}, {safe: true, multi: false}, function(e, result){

		if (e) return next (e); 
		res.send((result===1)?{msg:'success'}:{msg:'error'})

	}); 
}); 


/*
 * POST to addtweet.  
 */
router.post('/alltweets', function(req, res) {
    var db = req.db;
   
    db.collection('tweetdb').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});


//NEW GET that also sorts the database by date (latest ten tweets will go first) before delivering it to the js  
router.get('/tweetlist', function(req, res) {
    var db = req.db;
    db.collection('tweetdb').find().sort({$natural:-1}).limit(10).toArray(function (err, items) {
	res.json(items);
	});
});


/*
 * DELETE to deletetweet
 */
router.delete('/alltweets/:id', function(req, res) { 
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('tweetdb').removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:' delete tweet error: ' + err });
    });
});


module.exports = router;
