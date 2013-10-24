// JavaScript Document

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

var hits = [];

start();

function checkLevelUp() {
	if ($("#player").data("stats").xp >= nextLevel) {
		setNextLevel();
		levelUp();
		checkLevelUp();
	}
	$("#player_xp").html("xp: " + $("#player").data("stats").xp + "/" + nextLevel);
}

function levelUp() {
	alert("you have gained a level");
	$("#player").data("stats").level++;
	displayStats();
}

function setNextLevel() {
	currentLevel = $("#player").data("stats").level;
	nextLevel += Math.round((currentLevel + (currentLevel * currentLevel * 0.03) + 1) * 97 * currentLevel);
}

/*var controls = {
	place image animation and munipulation functions here
};*/

function Player() {
	this.xp = 0;
	this.level = 1;
	this.inFight = "";

	Object.defineProperty(this, "health", {
		get: function () {
			return 100 + (this.level * 150);
		},
		enumerable: true
	});
	this.currentHealth = this.health;

	Object.defineProperty(this, "strength", {
		get: function () {
			return (this.level * 5);
		},
		enumerable: true
	});

	Object.defineProperty(this, "hitRating", {
		get: function () {
			return 3 + (this.level);
		},
		enumerable: true
	});
}

function displayStats() {
	var statsHtml = "";
	for (var prop in $("#player").data("stats")) {
		if ( prop == "inFight" || prop == "health" ) { continue; }
		var statDisplay = prop.replace(/([A-Z]+)/, camelCaseToSpacedString);
		statsHtml += "<p id = 'player_" + prop + "'>" + statDisplay + ": " +
			$("#player").data("stats")[prop] + "</p>";
	}
	$('.stats').html(statsHtml);
	$("#player_currentHealth").append("/" + $("#player").data("stats").health);
	$("#player_xp").append("/" + nextLevel);
}

function camelCaseToSpacedString(match) {
	return " " + match.toLowerCase();
}

//console.log(player.id);

displayStats();

function start() {

	gameOn = true;

	writeBoard();

	var location = generateEmptySpot();

	$("#" + location).html($("<img>", {
		"src": "http://3.bp.blogspot.com/-kAhN0HX-MBk/T_5bApfhbJI/AAAAAAAAAuI/lUww8xT9yV8/s1600/smileys_001_01.png",
		"class": "onTop displayCurrentHealth",
		"alt": "you",
		"id": "player"
	}).data("stats", new Player() )
	);
	$("#player").data("inFight", false);

	insertMonsters();

}


$(document).on("mouseenter", '.displayCurrentHealth', function (imgName) {
	mouseIsOver, id = imgName.target.id;

	$("#displayHealth").html("remaining health: <span>" +
	$("#" + id).data("stats").currentHealth + "</span>");

	$("#displayHealth").removeClass("hidden");
});

$(document).on("mouseout", '.displayCurrentHealth', function () {
	mouseIsOver = "";

	$("#displayHealth").addClass("hidden");
});

$(document).on("mousemove", '.displayCurrentHealth', function (i) {
	$("#displayHealth").offset(function () {
		var newPos = new Object();
		newPos.left = i.pageX + 5;
		newPos.top = i.pageY - 10;
		return newPos;
	});
});


function writeBoard() {

	for (i = 0 ; i < rows ; i++) {
		boardHtml += "<tr>";
		for (var j = 0 ; j < columns ; j++) {
			var idValue = (i * columns) + j;
			boardHtml += "<td><div class = 'boardSpot' id = '" + idValue + "' ></div></td>";
		}
		boardHtml += "</tr>";
	}

	amountOfBoardSpots = rows * columns;

	$("#board").html(boardHtml);

	boardHtml = "";
}

function insertMonsters() {
	for (var i = 0 ; i < 5 ; i++ ) {
		$("#" + generateEmptySpot()).html($("<img>", {
			"src": "http://1.bp.blogspot.com/-r49xbsaV2D0/UOVsoWRimSI/AAAAAAAAB7U/LAhYb8ZNeRg/s1600/face-sad.png",
			"alt": "bad guy",
			"class": "displayCurrentHealth monster",
			"id": "monster_a" + i
		}).data("stats", new makeMob(1))
		);
	}
	
	for ( i = 0 ; i < 5 ; i++ ) {
		$("#" + generateEmptySpot()).html($("<img>", {
			"src": "http://4.bp.blogspot.com/-wo6VrFt3ER4/UOq47YphNUI/AAAAAAAACCY/e-JnxNYzyWQ/s1600/712324538.png",
			"alt": "bad guy",
			"class": "displayCurrentHealth monster",
			"id": "monster_b" + i
		}).data("stats", new makeMob(2))
		);
	}
	
	for ( i = 0 ; i < 5 ; i++ ) {
		$("#" + generateEmptySpot()).html($("<img>", {
			"src": "http://1.bp.blogspot.com/-BdyPCNCOJCU/UOVsmzE5VsI/AAAAAAAAB7M/iMsU0t0YrPY/s1600/emoticons_12_256.png",
			"alt": "bad guy",
			"class": "displayCurrentHealth monster",
			"id": "monster_c" + i
		}).data("stats", new makeMob(3))
		);
	}
}

function generateEmptySpot() {
	tryThis = Math.floor(Math.random() * amountOfBoardSpots);
	isThisEmpty = $('#' + tryThis).html();
	if (isThisEmpty == "") {
		return tryThis;
	} else {
		return generateEmptySpot();
	}
}

function makeMob(level) {
	this.inFight = false;
	this.dead = false;

	this.level = level;
	this.health = 100 + (this.level * 200);
	this.currentHealth = this.health;
	this.hitRating = Math.ceil(Math.random() * 3) * ((this.level + 1) / 2);
	str = 2 * (this.level * (3 * ((this.level + 1) / 2)) - this.hitRating);
	str <= 0 ? this.strength = 1 : this.strength = str;
	this.xp = (this.health / 5) * (((this.hitRating / ((this.level + 1) / 2)) / 4) + 1);
}

$(document).on("click", '.boardSpot', function (trigger) {
	if (!gameOn) return;
	valmov = validMove(parseInt(trigger.target.id, 10), parseInt($("#player").closest("div").attr("id"), 10));

	if (valmov) {

		if ( $("#player").data("inFight") ) if ( !runAway() ) return;

		move( $(trigger.target), valmov);

	}
});

$(document).on("click", '.monster', function (trigger) {
	if (!gameOn) return;

	if (!validMove(parseInt($(trigger.target).closest('div').attr("id"), 10), parseInt($("#player").closest('div').attr('id'), 10))) return;

	if (!$("#player").data("inFight") && !$(trigger.target).data("stats").inFight && !$(trigger.target).data("stats").dead ) {
		$(this).data("stats").inFight = true; 
		$("#player").data("inFight", true);
		$("#player").data("stats").inFight = $(this);
		fight($(trigger.target));
	}
});

$(document).on("click", '.healthPack', function (trigger) {
	if (!gameOn) return;
	valmov = validMove( parseInt( $(trigger.target).closest("div").attr("id"), 10), parseInt($("#player").closest("div").attr("id"), 10));

	if (valmov) {
		if ( $("#player").data("inFight") ) if ( !runAway() ) return;

		$(trigger.target).closest('div').html("");

		move( $(trigger.target).closest('div'), valmov );
		
		console.log($(trigger.target).data("abilities"));

		$(trigger.target).data("abilities").heal();
	}
});

function findWithAttr(array, attr, value) {
	for (var i = 0; i < array.length; i += 1) {
		if (array[i][attr] === value) {
			return array[i];
		}
	}
	return false;
}

function runAway() {
	var reallyRun = confirm("are you sure you want to run away?");

	if (reallyRun) {
		$("#player").data("inFight", false);
		$( $("#player").data("stats").inFight ).data("stats").inFight = false;
		return true;
	} else {
		return false;
	}
}

function move(moveTo, direction) {

	switch (direction) {
		case "right":
			$('#player').animate({ left: "+=" + scale }, "slow", function () {
				$(moveTo).append($("#player")); $('#player').attr("style", "");
			});
			break;
		case "left":
			$('#player').animate({ left: "-=" + scale }, "slow", function () {
				$(moveTo).append($("#player")); $('#player').attr("style", "");
			});
			break;
		case "up":
			$('#player').animate({ top: "-=" + (9 * (scale / 10)) }, "slow", function () {
				$(moveTo).append($("#player")); $('#player').attr("style", "");
			});
			break;
		case "down":
			$('#player').animate({ top: "+=" + (9 * (scale / 10)) }, "slow", function () {
				$(moveTo).append($("#player")); $('#player').attr("style", "");
			});
			break;
	}
}

function validMove(clicked, playerLoc) {
	if (clicked == (playerLoc + 1)) return "right";
	if (clicked == (playerLoc - 1)) return "left";
	if (clicked == (playerLoc - columns)) return "up";
	if (clicked == (playerLoc + columns)) return "down";
	else return false;
}

function fight(monster) { 
	
	if(!gameOn || !$("#player").data("inFight") )return;

	attack($("#player").data("stats"), monster.data("stats"),$("#player"),monster);
	
	if (monster.data("stats").currentHealth <= 0){
		monsterDead( monster.data("stats"), monster.parent() );
	}
	
	if ( !monster.data("stats").inFight ) { return; }
		
	setTimeout(monsterAtt,850,monster);

}

function monsterAtt (monster) {
	attack(monster.data("stats"), $("#player").data("stats"),monster,$("#player"));

	$("#player").data("stats").currentHealth <= 0 ?
		setTimeout(function () { alert(" you lose"); gameOn = false },1300 ):

		timeOutVar = setTimeout(fight, 1350, monster);
}

function attack(attacker, defender,attimg,defimg) {
	hitPower = Math.floor(Math.random() * attacker.hitRating * 100);
	if (hitPower < 100) {
		healthLost = "miss";
	} else {
		healthLost = Math.round(( attacker.strength * ( hitPower / 2 ) ) / 10);
		defender.currentHealth -= healthLost;
		healthLost = "-" + healthLost;
	}

	if (mouseIsOver == defimg.id) {
		$("#displayHealth").html("remaining health: <span>" + defender.currentHealth + "</span>");
	}

	fightAnimation(attimg, defimg, healthLost);

}

function fightAnimation(attacker, defender, x) {

	direction = validMove(parseInt(defender.closest("div").attr("id"), 10), parseInt(attacker.closest("div").attr("id"), 10));

	switch (direction) {
		case "right":
			attacker.animate({ left: "+=" + (scale / 10) }, 250, function () {
				displayHitsplat(defender, x);
				attacker.animate({ left: "-=" + (scale / 10) }, 500 );
			});
			break;
		case "left":
			attacker.animate({ left: "-=" + (scale / 10) }, 250, function () {
				displayHitsplat(defender, x);
				attacker.animate({ left: "+=" + (scale / 10) }, 500 );
			});
			break;
		case "up":
			attacker.animate({ top: "-=" + (scale / 10) }, 250, function () {
				displayHitsplat(defender, x);
				attacker.animate({ top: "+=" + (scale / 10) }, 500 );
			});
			break;
		case "down":
			attacker.animate({ top: "+=" + (scale / 10) }, 250, function () {
				displayHitsplat(defender, x);
				attacker.animate({ top: "-=" + (scale / 10) }, 500 );
			});
			break;
	}
}

function displayHitsplat(defender, healthLost){	
	var display = $("<div class='healthLostTest'>");
	display.html(healthLost);
	display.css("top",5);
	
	defender.closest('div').append(display);
	display.animate( {
		opacity: 0,
		top: "-=" + ( 3 * (scale / 10) )
	}, 1000, function() {
		$(this).remove();
		//console.log(defender.id);
		if ( defender.attr("id") == "player" ) {
			console.log("here");
			$("#player_currentHealth").html("current health: " + defender.data("stats").currentHealth +
				"/" + defender.data("stats").health);
		}
	});
}

function monsterDead(monster, loc) {
	monster.dead = true;
	monster.inFight = false;
	//monster.respawn();
	$("#player").data("inFight", false);
	setTimeout(displayMonsterDead, 1000, monster, loc);
	$("#player").data("stats").xp += monster.xp;
}

function displayMonsterDead(monster, loc) {
	checkLevelUp();
	$myImg = $("<img>", {
		"src": 'http://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Red_Cross_icon.svg/600px-Red_Cross_icon.svg.png',
		"class": 'healthPack'
	}).data( "abilities", new makeHealthPack(monster) );
	console.log($myImg.data("abilities"));
	loc.html( $myImg );
}

function makeHealthPack(deadMonster) {
	this.healthValue = deadMonster.health / 4;
	this.heal = heal;
	function heal() {
		if ( $("#player").data("stats").currentHealth + this.healthValue <= player.health ) {
			$("#player").data("stats").currentHealth += this.healthValue;
		} else {
			$("#player").data("stats").currentHealth = player.health;
		}
		$("#player_currentHealth").html("current health: " + player.currentHealth + "/" + player.health);
	}
}

$(document).on("mouseenter", '.healthPack', function (imgName) {
	$("#displayHealth").removeClass("hidden");
	$("#displayHealth").html("move here to gain some health");
});

$(document).on("mouseout", '.healthPack', function () {
	$("#displayHealth").addClass("hidden");
});

$(document).on("mousemove", '.healthPack', function (i) {

	$("#displayHealth").offset(function () {
		var newPos = new Object();
		newPos.left = i.pageX + 5;
		newPos.top = i.pageY - 10;
		//alert(newPos);
		return newPos;
	});
});























