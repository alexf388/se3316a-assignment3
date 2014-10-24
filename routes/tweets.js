var express = require('express');
var router = express.Router();

/*
 * GET tweetlist.
 
router.get('/tweetlist', function(req, res) {
    var db = req.db;
    db.collection('tweetlist').find().toArray(function (err, items) {
        res.json(items);
    });
});
*/



/*
 * POST to addtweet. POST will also check the database to see if there is already the same 
 */
router.post('/addtweet', function(req, res) {
    var db = req.db;
    db.collection('tweetlist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});


//NEW GET that also sorts the database by date (latest ten tweets will go first) before delivering it to the js  
router.get('/tweetlist', function(req, res) {
    var db = req.db;
    db.collection('tweetlist').find().sort({$natural:-1}).limit(10).toArray(function (err, items) {
	res.json(items);
	});
});



module.exports = router;
