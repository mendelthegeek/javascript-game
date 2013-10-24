// JavaScript Document

var gameBoard = document.getElementById("board");

var monsterIdPlacholder = 0;

var mouseIsOver;

var amountOfBoardSpots = 0;

var timeOutVar;

var boardHtml = "";

var monsters = [];

var monsterLocations = [];

var gameOn = false;

var healthPacks = [];

var nextLevel = 185;

var rows = 10;

var columns = 20;

var scale = 50;

function checkLevelUp() {
	if ( player.xp >= nextLevel ) {
		setNextLevel();
		levelUp();
		checkLevelUp();
	}
	$("#player_xp").html( "xp: " + player.xp + "/" + nextLevel );
}

function levelUp() {
	alert("you have gained a level");
	player.level++;
	displayStats();
}

function setNextLevel() {
	nextLevel += Math.round( ( player.level + ( player.level * 0.03 ) + 1 ) * 97 );
}

function Player(id) {
    this.id = id;
    this.healthid = this.id + "health";
    this.displayText = "<img src = 'http://3.bp.blogspot.com/-kAhN0HX-MBk/T_5bApfhbJI/AAAAAAAAAuI/lUww8xT9yV8/s1600/smileys_001_01.png'" +
        "class='onTop displayCurrentHealth' id='" + this.id + "' alt='you' border='0' />" +
        "<div id = '" + this.healthid + "' class = 'healthLost hide'></div>";
    this.inFight = false;
	this.currentLocation = 0;
	this.xp = 0;
	this.level = 1;
	
	Object.defineProperty( this, "health", { get: function () { 
        return 100 + (this.level * 150); },
        enumerable: true
    });
    this.currentHealth = this.health;

    Object.defineProperty( this, "strength", { get: function () {
        return (this.level * 5); },
        enumerable: true
    });

    Object.defineProperty( this, "hitRating", { get: function () {
        return 3 + (this.level); },
        enumerable: true
    });
}

var player = new Player('player');

function displayStats() {
	var statsHtml = "";
	for ( var prop in player ) {
		if ( prop != "inFight" && prop != "currentLocation" && prop != "displayText" && prop != "id" && prop != "healthid"
			&& prop != "health" ) {
			var statDisplay = prop.replace(/([A-Z]+)/, camelCaseToSpacedString );
			statsHtml += "<p id = 'player_" + prop + "'>" + statDisplay + ": " + player[prop] + "</p>";
		}
	}
	$('.stats').html( statsHtml);
	$( "#player_currentHealth" ).append( "/" + player.health );
	$( "#player_xp" ).append( "/" + nextLevel );
}
	
	function camelCaseToSpacedString (match) { 
		return " " + match.toLowerCase(); 
	}

	//console.log(player.id);


displayStats();

function start(){
	
	gameOn = true;

	writeBoard();
	
	player.currentLocation = generateEmptySpot();

	startingPoint = document.getElementById(player.currentLocation);

	startingPoint.innerHTML = player.displayText;

	insertMonsters();

}

start();

//	$(document).ready(function(){
		$(document).on("mouseenter", '.displayCurrentHealth',function (imgName) {
			mouseIsOver = imgName.target.id;
			
			objectName = eval(imgName.target.id);
			$("#displayHealth").html( "remaining health: <span>" + objectName.currentHealth + "</span>" );
			
			$("#displayHealth").removeClass("hidden");
			});
			
		$(document).on("mouseout", '.displayCurrentHealth',function () {
			mouseIsOver = "";
			
			$("#displayHealth").addClass("hidden");
		});
		
		$(document).on("mousemove", '.displayCurrentHealth',function (i) {
            $("#displayHealth").offset(function(){ 
                var newPos = new Object();
                newPos.left = i.pageX + 5;
                newPos.top = i.pageY - 10;
                //alert(newPos);
                return newPos; 
            });
            
		});
//	});

function writeBoard(){
	for ( i = 0 ; i < rows ; i++ ) {
	boardHtml += "<tr>";
	for ( var j = 0 ; j < columns ; j++ ) {
		var idValue = ( i *  columns ) + j;
			//write cell
		boardHtml += "<td><div class = 'boardSpot' id = '" + idValue + "' ></div></td>";
	}
	boardHtml += "</tr>";
}

amountOfBoardSpots = rows * columns;

//console.log(rows + " " + columns + " " + amountOfBoardSpots);

gameBoard.innerHTML = boardHtml;

}

function insertMonsters() {

	var i = 0;

	function loop(x,level){
		for(; i < x; i++){
			monsters[i] = new createMonster("monster",generateEmptySpot(),level);
			document.getElementById(monsters[i].currentLocation).innerHTML = monsters[i].displayText;
		}
	}
	
	loop(10,1);
	
	loop(15,2)
	
	loop(20,3);
}

function generateEmptySpot() {
	tryThis = Math.floor( Math.random() * amountOfBoardSpots );
	isThisEmpty = $('#' + tryThis ).html();
	if ( isThisEmpty == "" ) {
		return tryThis;
	} else {
		return generateEmptySpot();
	}
}
//
function createMonster(name,startingPoint,level) {
	this.id = "monsters[" + monsterIdPlacholder + "]";
	this.healthid = "monsters" + monsterIdPlacholder++ + "health";
	if ( level == 1 ) {
	this.displayText = "<img src='http://1.bp.blogspot.com/-r49xbsaV2D0/UOVsoWRimSI/AAAAAAAAB7U/LAhYb8ZNeRg/s1600/face-sad.png'" +
		"alt='bad guy' class = 'displayCurrentHealth monster' border='0' id = '" + this.id + "' />";
	} else if ( level == 2 ) {
	this.displayText = "<img src='http://4.bp.blogspot.com/-wo6VrFt3ER4/UOq47YphNUI/AAAAAAAACCY/e-JnxNYzyWQ/s1600/712324538.png'" +
		"alt='bad guy' class = 'displayCurrentHealth monster' border='0' id = '" + this.id + "' />";
	} else if ( level == 3 ) {
		this.displayText = "<img src='http://1.bp.blogspot.com/-BdyPCNCOJCU/UOVsmzE5VsI/AAAAAAAAB7M/iMsU0t0YrPY/s1600/emoticons_12_256.png'" +
		"alt='bad guy' class = 'displayCurrentHealth monster' border='0' id = '" + this.id + "' />";
	}
		//console.log(this.displayText);
	this.displayText += "<div id = '" + this.healthid + "' class = 'healthLost'></div>";
	this.name = name;
	this.inFight = false;
	this.currentLocation = startingPoint;
	this.dead = false;
	
	this.level = level;
	this.health = 100 + ( this.level * 200 );
	this.currentHealth = this.health;
	this.hitRating = Math.ceil( Math.random() *  3  ) * ( ( this.level + 1 ) / 2 );
	str = 2 * ( this.level * (  3  * ( ( this.level + 1 ) / 2 ) ) - this.hitRating );
	if ( str <= 0 ) this.strength =  1; else this.strength = str;
	this.xp = ( this.health / 5 ) * ( ( ( this.hitRating / ( ( this.level + 1 ) / 2 ) ) / 4 ) + 1 );
}

$(document).on("click", '.boardSpot',function (trigger) {
	valmov = validMove( parseInt( trigger.target.id ) , parseInt( player.currentLocation ) );
	if ( valmov ) {
		
		if ( !gameOn ) return;
	
		if ( player.inFight ) if ( !runAway() ) return;
		
		move( parseInt( trigger.target.id ),valmov );	
		
	}
});

$(document).on("click", '.monster',function (trigger) {
	if ( !validMove( parseInt( $( trigger.target ).closest('div').attr('id') ) , parseInt( player.currentLocation ) ) ) return;
	var monster = findWithAttr( monsters, "currentLocation" , parseInt( $( trigger.target ).closest('div').attr('id') ) );
	if ( !player.inFight && !monster.inFight ) fight( monster );
});

$(document).on("click", '#healthPack',function (trigger) {
	valmov = validMove( parseInt( $( trigger.target ).closest('div').attr('id') ) , parseInt( player.currentLocation ) );
	if ( !valmov || !gameOn ) return;
	if ( player.inFight ) if ( !runAway() ) return;
	var healthPack = findWithAttr( healthPacks, "currentLocation" , parseInt( $( trigger.target ).closest('div').attr('id') ) );
	move( parseInt( $( trigger.target ).closest('div').attr('id') ),valmov );
	healthPack.heal();
});

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return array[i];
        }
    }
    return false;
}

function runAway(){
	var reallyRun = confirm( "are you sure you want to run away?" );
	
	if ( reallyRun ) {
		player.inFight = false;
		for ( var i in monsters ) {
			monsters[i].inFight = false;
		}
		window.clearTimeout(timeOutVar);
		return true;
	} else {
		return false;
	}
}

function move(moveTo,direction) {
	
	//if( !validMove(moveTo) ) return;
	
		//document.getElementById(player.currentLocation).innerHTML = "";
		
		switch(direction){
			case "right":
				$('#player').animate( { left: "+=" + scale },"slow",function(){
					$( "#" + player.currentLocation ).html("");
					player.currentLocation = moveTo;
					$( "#" + player.currentLocation ).html(player.displayText);});
				break;
			case "left":
				$('#player').animate( { left: "-=" + scale },"slow",function(){
					$( "#" + player.currentLocation ).html("");
					player.currentLocation = moveTo;
					$( "#" + player.currentLocation ).html(player.displayText);});
				break;
			case "up":
				$('#player').animate( { top: "-=" + ( 9 * ( scale / 10 ) ) },"slow",function(){
					$( "#" + player.currentLocation ).html("");
					player.currentLocation = moveTo;
					$( "#" + player.currentLocation ).html(player.displayText);});
				break;
			case "down":
				$('#player').animate( { top: "+=" + ( 9 * ( scale / 10 ) ) },"slow",function(){
					$( "#" + player.currentLocation ).html("");
					player.currentLocation = moveTo;
					$( "#" + player.currentLocation ).html(player.displayText);});
				break;
		}
	
		
}

function validMove(clicked,playerLoc){
	//console.log(columns);
	if ( clicked == ( playerLoc + 1 ) ) return "right";
	if ( clicked == ( playerLoc - 1 ) ) return "left";
	if ( clicked == ( playerLoc - columns ) ) return "up";
	if ( clicked == ( playerLoc + columns ) ) return "down";
	else return false;
}

function fight( monster ) {

	monster.inFight = true;
	player.inFight = true;
	console.log(player);
	console.log(monster);
	
	attack( player, monster );
		if ( monster.currentHealth <= 0 ) {
			monsterDead( monster );
		} if ( monster.inFight == true ) {

	attack( monster, player );
		if ( player.currentHealth <= 0 ) {
			gameOn = false;
			setTimeout( function() {alert(" you lose" )}, 2250 );
		} else {
			timeOutVar = setTimeout( fight, 2000, monster);
		}
	}
}
	
function checkMonster( monster ) {
		
	if ( !monster.dead ) {
		if ( !monster.inFight ) {
			monster.inFight = true;
		}
		return monster;
	}
}
						
function attack( attacker, defender ) {
	hitPower = Math.floor( Math.random() * attacker.hitRating * 100 );
	if ( hitPower < 100 ) {
		healthLost = "miss";
	} else {
		healthLost = Math.round(( attacker.strength * ( hitPower / 2 ) ) / 10);
		//console.log(hitPower + "/" + healthLost + "/" + defender.currentHealth );
		defender.currentHealth -= healthLost;
		
		healthLost = "-" + healthLost;
		
	}
	
	if (attacker.id == "player") {
		fightAnimation( attacker, defender );
	} else setTimeout( function() { $("#player_currentHealth").html( "current health: " + player.currentHealth + "/" + player.health ) }, 1e3 );

		if ( mouseIsOver == defender.id ) {
			$("#displayHealth").html( "remaining health: <span>" + defender.currentHealth + "</span>" );
		}
		
		//$( ".healthLost" ).promise().done(function() {
			
			var displayHealthDivId = defender.healthid;
			
			//console.log(displayHealthDivId);
			
			//console.log(defender.displayText);
			
			var ObjectA = { 
				opacity: 100,
				top: "+=" + ( 3 * ( scale / 10 ) ) 
			}
			
			var ObjectB = {
				opacity: 0,
				top: "-=" + ( 3 * ( scale / 10 ) ) 
			}

		if( defender.name == "monster" ) {
			$( "#" + displayHealthDivId ).delay( 250 ).animate( ObjectA,0);
			$( "#" + displayHealthDivId ).html( healthLost );
			$( "#" + displayHealthDivId )/*.delay( 1000 )*/.animate(  ObjectB,1e3,function(){
				$( "#" + displayHealthDivId ).addClass("hide");
				//$( "#" + displayHealthDivId ).animate( { opacity: 100,top: "+=25"},2);
			});} else {
			$( "#" + displayHealthDivId ).delay( 1e3 ).animate( ObjectA,0);
			$( "#" + displayHealthDivId ).html( healthLost );
			$( "#" + displayHealthDivId ).animate(  ObjectB,1e3,function(){
				$( "#" + displayHealthDivId ).addClass("hide");
			//	$( "#" + displayHealthDivId ).animate( { opacity: 100,top: "+=25"},0);
			});}
		/*$( "#" + displayHealthDivId ).addClass("hide");
		$( "#" + displayHealthDivId ).css("opacity", 0,"top","5px");*/
			
	//	});
}

function fightAnimation( attacker, defender ) {
		
	direction = validMove( parseInt (defender.currentLocation ) , parseInt (attacker.currentLocation ) );

	var monsterId = (defender.id).replace(/([\[\]])/g, '\\$1');
	
	//console.log(monsterId);
	
		switch(direction){
			case "right":
				$( '#' + attacker.id).animate( { left: "+=" + ( scale / 10 ) },100,function(){
					$( '#' + attacker.id).animate( { left: "-=" + ( scale / 10 ) },500,function() {
						$('#' + monsterId).animate( { left: "-=" + ( scale / 10 ) },250,function(){
							$( '#' + monsterId).animate( { left: "+=" + ( scale / 10 ) },500,function() {
							});
						});
					});
				});
				break;
			case "left":
				$('#' + attacker.id).animate( { left: "-=" + ( scale / 10 ) },250,function(){
					$( '#' + attacker.id).animate( { left: "+=" + ( scale / 10 ) },500,function() {
						$( '#' + monsterId).animate( { left: "+=" + ( scale / 10 ) },250,function() {
							$( '#' + monsterId).animate( { left: "-=" + ( scale / 10 ) },500,function() {
							});
						});
					});
				});
				break;
			case "up":
				$('#' + attacker.id).animate( { top: "-=" + ( scale / 10 ) },250,function(){
					$( '#' + attacker.id).animate( { top: "+=" + ( scale / 10 ) },500,function() {
						$('#' + monsterId).animate( { top: "+=" + ( scale / 10 ) },250,function(){
							$('#' + monsterId).animate( { top: "-=" + ( scale / 10 ) },500,function(){
							});
						});
					});
				});
				break;
			case "down":
				$('#' + attacker.id).animate( { top: "+=" + ( scale / 10 ) },250,function(){
					$('#' + attacker.id).animate( { top: "-=" + ( scale / 10 ) },500,function(){
						$('#' + monsterId).animate( { top: "-=" + ( scale / 10 ) },250,function(){
							$( '#' + monsterId).animate( { top: "+=" + ( scale / 10 ) },500,function() {
							});
						});
					});
				});
				break;
		}
}

function monsterDead( monster ) {
	monster.dead = true;
	/*monsters = jQuery.grep(monsters, function(object, index) { return (object.dead == false); });
	if ( !monsters.length ) writeBoss();*/
	monster.inFight = false;
	player.inFight = false;
	window.setTimeout(finishMonsterDead, 1000, monster);
}

function finishMonsterDead( monster ) {
	healthPacks.push( new healthPack( monster ) );
	player.xp += monster.xp;
	checkLevelUp();
	console.log(player.xp);
}

/*function writeBoss() {
	monsters[5] = new createMonster("monster",generateEmptySpot(),3);
	document.getElementById(monsters[5].currentLocation).innerHTML = monsters[5].displayText;
}*/

function healthPack( deadMonster ) {
	this.displayText = "<img src = 'http://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Red_Cross_icon.svg/600px-Red_Cross_icon.svg.png'" +
	" id = 'healthPack' />";
	this.currentLocation = deadMonster.currentLocation;
	document.getElementById( this.currentLocation ).innerHTML = this.displayText;
	
	this.healthValue = deadMonster.health / 4;
	this.heal = heal;
	function heal() { 
		if( player.currentHealth + this.healthValue <= player.health ) {
			player.currentHealth += this.healthValue;
		}
		else {
			player.currentHealth = player.health;
		}
		$("#player_currentHealth").html( "current health: " + player.currentHealth + "/" + player.health );
	}
}

	$(document).on("mouseenter", '#healthPack',function (imgName) {
			$("#displayHealth").removeClass("hidden");
		});
		
	$(document).on("mouseout", '#healthPack',function () {
			$("#displayHealth").addClass("hidden");
	});		
	
	$(document).on("mousemove", '#healthPack',function (i) {
		$("#displayHealth").html("move here to gain some health");
		
		$("#displayHealth").offset(function(){ 
            var newPos = new Object();
            newPos.left = i.pageX + 5;
            newPos.top = i.pageY - 10;
            //alert(newPos);
            return newPos; 
        });
	});






















