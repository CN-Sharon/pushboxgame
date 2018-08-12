window.onload=function(){
	Game.exe();
};

var Game = {

	//找到wrap
	oWrap : document.getElementById('wrap'),

	//第几关
	level : 0,

	//步骤数目
	stepNum : 0 ,

	//执行函数
	exe : function(){
		this.oWrap.style.cssText='width:'+(this.size.x*35)+'px;height:'+(this.size.y*35)+'px;';
		this.createMap(this.level);
		document.getElementById('auto').onclick = this.autoBtn;
		document.getElementById('prev').onclick = this.prev;
		document.getElementById('top_level').onclick = this.top_level;
		document.getElementById('next_level').onclick = this.next_level;

	},

	//16*16
	size : {x : 16 , y : 16 } ,

	//创建地图Map
	createMap : function(lv){
		var This= this;
		var oPerson ,oDiv,oImg;
		this.oWrap.innerHTML='';
		this.step.person=[];
		this.step.box=[];
		this.stepNum=0;
		//创建很多小格子的div
		for(var i=0;i<This.size.x*This.size.y;i++){
			
			switch(this.mapData[lv][i]){
				case 1 :
					addDiv.call(this,i);
					oImg.src='img/wall.png';
					oDiv.className='wall';
					break ;
				case 2 :
					addDiv.call(this,i);
					oImg.src='img/ball.png'; 
					oDiv.className='ball';
					oDiv.style.zIndex=0;
					break ;
				case 3 :
					addDiv.call(this,i);
					oImg.src='img/box.png'; 
					oDiv.className='box';
					break ;
				case 4 :
					addDiv.call(this,i);
					oImg.src='img/down.png'; 
					oDiv.className='person';
					oPerson=oImg;
					break ;
			}
		}
		this.controlPerson(oPerson);
		function addDiv(i){
			var x=i % This.size.x;
			var y=parseInt(i / This.size.x );
			oDiv=document.createElement('div');
			oDiv.x=x;
			oDiv.y=y;
			oDiv.style.cssText='left:'+x*35+'px;top:'+y*35+'px;z-index:'+(y*this.size.x)+';';	
			oImg= new Image();//js语言创建图片对象 
			oDiv.appendChild(oImg); 
			this.oWrap.appendChild(oDiv);
		}
	},

	//控制人物
	controlPerson : function(op){
		var This=this;
		var oParent=op.parentNode;
		
		document.onkeydown =function(ev){
			ev=ev||window.event;
			var keyCode=ev.keyCode;
			This.controlFn(op , oParent , keyCode);
			switch(keyCode){
				//↑
				case 38:
				//↓
				case 40:
				//←
				case 37:
				//→ 
				case 39:
					return false;
					break;
			}
			
		}
	},

	//控制人物移动（上下左右）
	controlFn : function(op , oParent , keyCode ){
		var This=Game;
		This.step.person[This.stepNum] = {};
		This.step.person[This.stepNum].src = oParent.children[0].src;
		switch(keyCode){
				//↑
				case 38:
					op.src='img/up.png';
					This.movePerson({y:-1},oParent);
					break;
				//↓
				case 40:
					op.src='img/down.png';
					This.movePerson({y:1},oParent);
					break;
				//←
				case 37:
					op.src='img/left.png';
					This.movePerson({x:-1},oParent);
					break;
				//→ 
				case 39:
					op.src='img/right.png';
					This.movePerson({x:1},oParent);
					break;
			}
	},

	//人物移动
	movePerson : function(mJson,oParent){
		
		var x = mJson.x || 0;
		var y = mJson.y || 0;
		var oBox=this.getClass(this.oWrap,'box');
		if(this.mapData[this.level][(oParent.x+x)+(oParent.y+y)*this.size.x] !=1){
			
			this.step.person[this.stepNum].x = oParent.x;
			this.step.person[this.stepNum].y = oParent.y;
			oParent.x +=x;
			oParent.y +=y;
			oParent.style.left= oParent.x *35 +'px';
			oParent.style.top= oParent.y *35 +'px';
			oParent.style.zIndex=oParent.x+oParent.y*this.size.x;
			this.stepNum++;
			for(var i=0;i<oBox.length;i++){
				if(oBox[i].x==oParent.x && oBox[i].y==oParent.y){
					if(this.mapData[this.level][(oParent.x+x)+(oParent.y+y)*this.size.x] !=1 ){
						if(this.collision(oBox[i],x,y)){
							this.step.box[this.stepNum-1]={};
							this.step.box[this.stepNum-1].index=i;
							this.step.box[this.stepNum-1].x=oBox[i].x;
							this.step.box[this.stepNum-1].y=oBox[i].y;
							oBox[i].x +=x;
							oBox[i].y +=y;
							oBox[i].style.left= oBox[i].x *35 +'px';
							oBox[i].style.top= oBox[i].y *35 +'px';
							oBox[i].style.zIndex=oBox[i].y*this.size.x;
							this.pass();
						}else{
							oParent.x -=x;
							oParent.y -=y;
							oParent.style.left= oParent.x *35 +'px';
							oParent.style.top= oParent.y *35 +'px';
							oParent.style.zIndex=oParent.x+oParent.y*this.size.x;
							this.stepNum--;
							this.step.person.pop();
						}
						
					}else{
						oParent.x -=x;
						oParent.y -=y;
						oParent.style.left= oParent.x *35 +'px';
						oParent.style.top= oParent.y *35 +'px';
						oParent.style.zIndex=oParent.x+oParent.y*this.size.x;
						this.stepNum--;
						this.step.person.pop();
					}
					
				}
			}	
		}
	},

	// 相撞检测
	collision : function(obj,x,y){
		var oBox=this.getClass(this.wrap,'box');
		for(var i=0;i<oBox.length;i++){
			if(oBox[i] != obj){
				if(obj.x+x == oBox[i].x && obj.y+y == oBox[i].y){
					return false;
				}
			}
		}
		return true;
	},
	
	//过关检测
	pass : function(){
		var oBall=this.getClass(this.oWrap,'ball');
		var oBox=this.getClass(this.oWrap,'box');
		var passNum=0;
		for(var i=0;i<oBall.length;i++){
			for(var j=0;j<oBox.length;j++){
				if(oBall[i].x==oBox[j].x && oBall[i].y==oBox[j].y){
					passNum++;
				}
			}
		}
		if(passNum==oBall.length){
			this.level++;
			this.createMap(this.level);
		}
	},
	
	//移动步骤存储
	step : {
		//人物步骤存储
		person : [],
		//箱子步骤存储
		box : []

	},

	prev : function(){
		var This=Game;
		var oPerson=This.getClass(This.oWrap,'person')[0];
		var oBox=This.getClass(This.oWrap,'box');
		var oBoxNow;
		if(This.stepNum!=0){
			oPerson.x=This.step.person[This.stepNum-1].x;
			oPerson.y=This.step.person[This.stepNum-1].y;
			oPerson.style.left= oPerson.x *35 +'px';
			oPerson.style.top= oPerson.y *35 +'px';
			oPerson.children[0].src = This.step.person[This.stepNum-1].src;
			oPerson.style.zIndex=oPerson.x+oPerson.y*This.size.x;
			if(This.step.box[This.stepNum-1]){
				oBoxNow=oBox[This.step.box[This.stepNum-1].index];
				oBoxNow.x=This.step.box[This.stepNum-1].x;
				oBoxNow.y=This.step.box[This.stepNum-1].y;
				oBoxNow.style.left=oBoxNow.x*35+'px';
				oBoxNow.style.top=oBoxNow.y*35+'px';
				oBoxNow.style.zIndex = oBoxNow.y*This.size.x;
			}
			This.stepNum--;
		}else{
			oPerson.x=This.step.person[This.stepNum].x;
			oPerson.y=This.step.person[This.stepNum].y;
			oPerson.style.left= oPerson.x *35 +'px';
			oPerson.style.top= oPerson.y *35 +'px';
			oPerson.children[0].src = This.step.person[This.stepNum].src;
			oPerson.style.zIndex=oPerson.x+oPerson.y*This.size.x;
		}
		
	},

	//上一关
	top_level : function(){
		var This=Game;
		if(This.level>0){
			This.level--;
		}else{
			alert('这已经是第一关了。');
		}
		This.createMap(This.level);
	} ,

	//下一关
	next_level : function(){
		var This=Game;
		if(This.level<This.mapData.length-1){
			This.level++;

		}else{
			alert('没有下一关啦！');
		}	
		This.createMap(This.level);
	} ,

	//自动通关按钮
	autoBtn : function(){
		var This=Game;
		This.createMap(This.level);
		var keyNum =0 ;
		var oParent=This.getClass(This.oWrap,'person')[0];
		var op=oParent.children[0];
		var timer = setInterval(function(){
			var keyCode = This.auto[This.level][keyNum];
			This.controlFn(op , oParent ,keyCode); 
			keyNum++;
			if ( keyNum == This.auto[This.level].length ){
				clearInterval( timer );
			}
		},500);
	},
	//自动通关
	auto : [
		[40,38,37,37,39,38,38,40,39,39],
		[
		39,39,40,40,40,40,39,40,40,37,37,38,39,40,39,
		38,37,38,39,39,39,40,39,38,38,40,37,37,37,37,
		38,38,38,38,37,37,40,39,38,39,40,40,40,40,39,
		40,40,37,37,38,39,40,39,38,37,38,39,39,39,40,
		39,38,37,37,37,37,38,38,38,37,37,40,39,38,39,
		40,40,40,39,40,40,37,37,38,39,40,39,38,37,38,
		39,39,39
		]
	],

	//关卡数据(数组里面有数组)
	mapData : [
		/*1:墙 2:球 3:箱子 4:人*/
		//第一关数据
		[
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,
				0,0,0,0,0,0,1,2,1,0,0,0,0,0,0,0,
				0,0,0,0,0,0,1,0,1,1,1,1,0,0,0,0,
				0,0,0,0,1,1,1,3,0,3,2,1,0,0,0,0,
				0,0,0,0,1,2,0,3,4,1,1,1,0,0,0,0,
				0,0,0,0,1,1,1,1,3,1,0,0,0,0,0,0,
				0,0,0,0,0,0,0,1,2,1,0,0,0,0,0,0,
				0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
		],
		//第二关数据
		[
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,
				0,0,0,0,1,4,0,0,1,0,0,0,0,0,0,0,
				0,0,0,0,1,0,3,3,1,0,1,1,1,0,0,0,
				0,0,0,0,1,0,3,0,1,0,1,2,1,0,0,0,
				0,0,0,0,1,1,1,0,1,1,1,2,1,0,0,0,
				0,0,0,0,0,1,1,0,0,0,0,2,1,0,0,0,
				0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,
				0,0,0,0,0,1,0,0,0,1,1,1,1,0,0,0,
				0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
		],
		//第三关数据
		[
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,
				0,0,1,1,1,1,1,1,1,0,0,0,1,0,0,0,
				0,0,1,0,0,0,1,0,0,3,0,0,1,0,0,0,
				0,0,1,0,0,0,3,0,0,1,2,2,1,0,0,0,
				0,0,1,1,3,0,0,0,3,1,2,2,1,0,0,0,
				0,0,1,0,4,3,1,3,0,1,2,2,1,0,0,0,
				0,0,1,0,0,0,0,0,0,1,1,1,1,0,0,0,
				0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
		],
		//第四关数据
		[
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,
				0,0,0,0,1,0,4,2,2,2,1,0,0,0,0,0,
				0,0,0,0,1,0,0,0,1,1,1,1,0,0,0,0,
				0,0,0,1,1,1,3,0,0,0,0,1,0,0,0,0,
				0,0,0,1,0,0,0,1,3,1,0,1,0,0,0,0,
				0,0,0,1,0,3,0,1,0,0,0,1,0,0,0,0,
				0,0,0,1,0,0,0,1,1,1,1,1,0,0,0,0,
				0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
		],

			/*
				[
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
		],
		*/
	],
//获取类选择器名
getClass :function ( obj , cName){
		var obj =obj || document;
		if(obj.getElementByClassName){
			obj.getElementByClassName(cName);
		}else{
			var arr=[];
			var alls=obj.getElementsByTagName('*');
			for(var i=0;i<alls.length;i++){
				var cNameall=alls[i].className.split(' ');
				for(var j=0;j<cNameall.length;j++){
					if(cNameall[j] == cName){
						arr.push(alls[i]);
						break;
					}
				}
			}
			return arr;
		}
	}
};
