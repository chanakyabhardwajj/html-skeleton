/**
 * @author Chanakya Bhardwaj/www.chanakyabhardwaj.com
 */

var gzi=0;
var allDivs=[];
var objs=[];
var objCnt=0;
var containInfo=[];
var str='';
var visited=[];

function init(){
  allDivs=document.getElementsByTagName('DIV');
};

window.onload=init;

function drag(elem,ev){
  var elemTomove;
  var dx,dy;
  elemTomove=elem;  
  elemTomove.style.zIndex=++gzi;
  elemTomove.style.opacity=0.8;
  dx=elem.offsetLeft-ev.clientX;
  dy=elem.offsetTop-ev.clientY;
  
  //Keep a flag to see which blocks have been used.
  elem.used=1;
  
  if (document.addEventListener) {
    document.addEventListener('mousemove', moveElem, false);
    document.addEventListener('mouseup', handleListener, false);
  }

  else if (document.attachEvent) {  // IE 5+ Event Model
      elemTomove.setCapture( );
      elemTomove.attachEvent("onmousemove", moveElem);
      elemTomove.attachEvent("onmouseup", handleListener);
      elemTomove.attachEvent("onlosecapture", handleListener);
  }
  else {  // IE 4 Event Model
      var oldmovehandler = document.onmousemove;
      var olduphandler = document.onmouseup;
      document.onmousemove = moveElem;
      document.onmouseup = handleListener;
  }   

  function moveElem(e){
    if (!e) e = window.event;  // IE Event Model
    
    elemTomove.style.top=e.clientY +dy + 'px';
    elemTomove.style.left=e.clientX +dx + 'px';
  };

  function handleListener(e){
    if (!e) e = window.event;  // IE Event Model
    
    if (document.removeEventListener) {
      document.removeEventListener('mousedown', drag, false);
      document.removeEventListener('mousemove', moveElem, false);
      document.removeEventListener('mouseup', handleListener, false);
    }
    else if (document.detachEvent) {  // IE 5+ Event Model
      elemTomove.detachEvent("onlosecapture", handleListener);
      elemTomove.detachEvent("onmouseup", handleListener);
      elemTomove.detachEvent("onmousemove", moveElem);
      elemTomove.releaseCapture( );
    }
    else {  // IE 4 Event Model
    document.onmouseup = olduphandler;
    document.onmousemove = oldmovehandler;
    }
  };
};


function getDim(obj){
  var wstring=obj.style.width;   
  var w=parseInt(wstring.substring(0,wstring.length-2));
  var hstring=obj.style.height;
  var h=parseInt(hstring.substring(0,hstring.length-2));
  
  obj.x1=obj.offsetLeft;
  obj.y1=obj.offsetTop;  
  obj.x2=obj.x1+w;
  obj.y2=obj.y1;  
  obj.x3=obj.x1+w;
  obj.y3=obj.y1+h;  
  obj.x4=obj.x1;
  obj.y4=obj.y1+h;
};

function createMarkup(){
  for(var x=0;x<containInfo.length;x++){  
    rowMarkup(containInfo[x]);
  };  
  document.getElementById("output").value=str;
  str="";
}

function rowMarkup(row){
  if(visited[row.num]==0){
    var numzeros=0;
    str+=' <' + row.uname +'> ';    
    for(var i=0;i<row.length; i++){       
      if((row[i]==0) && (visited[i]==0)){      
        numzeros++;      
        rowMarkup(containInfo[i]);               
      }     
    }
    visited[row.num]=1;
    str+=' </' + row.uname +'> ';     
  };

  
}


function recordContainData(){  
  for(var c=0;c<objs.length;c++){    
    containInfo[c]=containData(objs[c]); 
    containInfo[c].uname=objs[c].id;
    containInfo[c].num=c;
  };
};

function containData(obj){
  var arr=[]; 
  var i=0; 
  //arr.uname=obj.id;
  for(var c=0;c<objs.length;c++){    
    if((objs[c].x1 > obj.x1) && (objs[c].x2 < obj.x2) && (objs[c].y1 > obj.y1) && (objs[c].y4 < obj.y4)){
      //obj contains objs[c].
      arr[c]=0;
    }
    else if (((objs[c].x1 > obj.x2) && (objs[c].x1 > obj.x2)) || ((objs[c].x2 < obj.x1) && (objs[c].x2 < obj.x1)) || ((objs[c].y4 < obj.y1) && (objs[c].y1 < obj.y1)) || ((objs[c].y1 > obj.y4) && (objs[c].y4 > obj.y4))){
      //obj and objs[c] are totally separate.
      arr[c]=1;
    }
    else if((obj.x1 == objs[c].x1) && (obj.x2 == objs[c].x2) && (obj.y1 == objs[c].y1) && (obj.y4 == objs[c].y4)){
      //exactly overlapping.
      arr[c]=3;
    }
    else{
      //overlapping.
      arr[c]=2;
    };
  };
  return arr;
};

function genSkeleton(){ 
  allDivs=[];
  objs=[];
  objCnt=0;
  containInfo=[];
  str='';
  visited=[];
  init();
  for(var c=0;c<allDivs.length;c++){
    if((allDivs[c].className=='divs' || allDivs[c].className=='tables' || allDivs[c].className=='paras')&&(allDivs[c].used==1)){
      objs[objCnt]=allDivs[c];
      visited[objCnt++]=0;
    }
  };
  for(var c=0;c<objs.length;c++){
    //get the coordinates of each block.
    getDim(objs[c]);     
  };  
  objs.sort(function(x,y){return (x.y1-y.y1);});
  recordContainData();
  createMarkup();
};

