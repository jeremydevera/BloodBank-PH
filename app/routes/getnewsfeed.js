const express = require('express');
const router = express.Router();
var newsfeed_model = require('../models/newsfeed');

router.get('/',(req,res,next)=>{
    newsfeed_model
    .find()
    .then(
        function(values){
            console.log("get newsfeed");
            if(values.length > 0){
                res.status(200).send(values);

            }else{
                res.status(404).json({
                    message: "No entries found"
                })
            }
        }
    )
})

module.exports = router;