var express = require('express');
var router = express.Router();

/*
 * GET tweetlist.
 */
router.get('/tweetlist', function(req, res) {
    var db = req.db;
    db.collection('tweetlist').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to addtweet.
 */
router.post('/addtweet', function(req, res) {
    var db = req.db;
    db.collection('tweetlist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});




module.exports = router;
