#Chain-reaction

Simple flow-control functions for javascript

##Install

    $npm install chain-reaction

###Usage


```javascript
var chain=require('chain-reaction');

chain
    .next(function(done){
        done(null,1);
    })
    .next(function(arg1,done){
        //arg1==1
        done(null,2);
    })
    .done(function(err,arg){
        //arg==2
    });

chain
    .parallel(function(done){
        done(null,1);
    })
    .parallel(function(done){
        done(null,2);
    })
    .done(function(err,args){
        //args==[1,2]
    });

 chain
    .next(function(done){
        done(null,1);
    })
    .parallel(function(arg1,done){
        //arg1==1
        done(null,2);
    })
    .parallel(function(arg1,done){
        //arg1==1
        done(null,3);
    })
    .next(function(args,done){
        //args=[2,3]
        done(null,4);
    })
    .done(function(err,arg4){
        //arg4==4
    });

```