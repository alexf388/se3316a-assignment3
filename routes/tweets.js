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
 * POST to addtweet.  
 */
router.post('/addtweet', function(req, res) {
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
router.delete('/deletetweet/:id', function(req, res) { 
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('tweetdb').removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:' delete tweet error: ' + err });
    });
});


module.exports = router;
