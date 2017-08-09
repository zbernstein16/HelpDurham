var mongoose = require('mongoose');


var EventSchema = new mongoose.Schema({
    title: {
      type:String,
      required:true
    },
    date: Date,
    desc: String,
    orgName: {
      type:String,
      required:true
    }
});


var Event = mongoose.model('Event', EventSchema, 'Events');
module.exports = Event;
