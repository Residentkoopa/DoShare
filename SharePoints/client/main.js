import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

var RADIOUS= 10;
var Dots;
var canvas;
var erase=false;

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}


function paintDots(){
  dotarray=Dots.find({},{sort: { timestamp: 1 }}).fetch();
  if(canvas!==null ){
    console.log("fail");
    var ctx = canvas.getContext("2d");
     // arreglar para que sea del color picker

    for(i=0;i<dotarray.length;i++){
      ctx.beginPath();
      ctx.fillStyle = dotarray[i].color;
      ctx.moveTo(dotarray[i].x+RADIOUS,dotarray[i].y);
      ctx.arc(dotarray[i].x,dotarray[i].y,RADIOUS+1,0,2*Math.PI);
      ctx.stroke();
      ctx.arc(dotarray[i].x,dotarray[i].y,RADIOUS,0,2*Math.PI);
      ctx.fill();
      ctx.closePath();
    }


  }
}

function paintDotsParam(fields){
  //var c = document.getElementById("sheet");
  console.log("fail");
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.fillStyle = fields.color; // arreglar para que sea del color picker
  ctx.moveTo(fields.x+RADIOUS,fields.y);
  ctx.arc(fields.x,fields.y,RADIOUS+1,0,2*Math.PI);
  ctx.stroke();
  ctx.arc(fields.x,fields.y,RADIOUS,0,2*Math.PI);
  ctx.fill();
  ctx.closePath();

}




Template.canvas.onRendered(function(){
  canvas=document.getElementById("sheet");
  Meteor.subscribe("dots",{}, function(){
    Dots=new Mongo.Collection('dots');
    //paintDots();
    Dots.find().observeChanges({
       changed: function (id, fields) {
           paintDots();
       },
       added: function(id,fields){
         if(fields!==null)
            paintDotsParam(fields);
       },
       removed: function (id) {
          canvas.getContext("2d").clearRect(0,0,600,400);
          paintDots();
      }
    });
  });
  $("#refresh").click(function(){
    canvas.getContext("2d").clearRect(0,0,600,400);
    paintDots();
  });
  $("#reset").click(function(){
     Meteor.call('deleteDots',function(err, result) {
        if (err) {
          console.log(err);
        }
        console.log("Puntos Eliminados ");
      });
    });

    $("#erase").click(function(){
      erase= !erase;
    });

});



Template.canvas.events({
  'click canvas'(event, instance) {
    var mousepos=getMousePos(canvas,event);
    if(!erase){
      console.log("enviando punto");
      Meteor.call('addDot', mousepos.x,mousepos.y,$("#color").css("background-color"), function(err, result) {
        if (err) {
          console.log(err);
        }
        console.log("enviado   "+mousepos.x+"   "+mousepos.y);
      });
    }else{
      Meteor.call('removeDot',mousepos.x,mousepos.y,RADIOUS,function(err, result){
        if (err) {
          console.log(err);
        }
      });

    }

  },
});
