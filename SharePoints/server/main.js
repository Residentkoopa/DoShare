import { Meteor } from 'meteor/meteor';

Dots = new Mongo.Collection('dots');

Meteor.startup(() => {
  Meteor.publish('dots', function() {
    return Dots.find({}, {
      sort: { timestamp: 1 }
    });
  });

  Meteor.methods({
    addDot: function(x,y,color) {
      Dots.insert({
        x: x,
        y:y,
        color:color,
        timestamp: new Date()
      });

    },
    deleteDots:function(){
      Dots.remove({});
    },

    removeDot:function(x,y,radious){
      var dot=Dots.findOne({x:{$gt:x-radious , $lt:x+radious},y:{$gt:y-radious , $lt:y+radious}},{sort: {"timestamp": -1}});
      if(dot!=null){
        var xDif=dot.x-x;
        var yDif=dot.y-y;
        if(Math.sqrt(xDif*xDif+yDif*yDif)<=radious){
          Dots.remove({_id:dot._id});
        }
      }
    }
  });
});
