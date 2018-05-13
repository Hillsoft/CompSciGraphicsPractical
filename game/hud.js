var hudElements = {};
var hudTM = null;
var hudShip = null;
var hudControls = null;

function initHUD()
{
	hudElements.lapTime = document.createTextNode("");
	document.getElementById("lapTime").appendChild(hudElements.lapTime);

	hudElements.bestLap = document.createTextNode("");
	document.getElementById("bestLap").appendChild(hudElements.bestLap);

	hudElements.userBest = document.createTextNode("");
	document.getElementById("userBest").appendChild(hudElements.userBest);

	hudElements.worldBest = document.createTextNode("");
	document.getElementById("worldBest").appendChild(hudElements.worldBest);

	hudElements.checkpoints = document.createTextNode("");
	document.getElementById("checkpoints").appendChild(hudElements.checkpoints);

	hudElements.speed = document.createTextNode("");
	document.getElementById("speed").appendChild(hudElements.speed);

	hudElements.motionAssist = document.createTextNode("");
	document.getElementById("motionAssist").appendChild(hudElements.motionAssist);

	hudElements.rotationAssist = document.createTextNode("");
	document.getElementById("rotationAssist").appendChild(hudElements.rotationAssist);

	hudElements.notification = document.createTextNode("");
	document.getElementById("notificationText").appendChild(hudElements.notification);
}

function parseTime(millis)
{
	millis = Math.floor(millis);
	var mins = Math.floor(millis / 60000);
	var secs = "00" + (Math.floor(millis / 1000) % 60);
	secs = secs.substr(secs.length - 2);
	var milliss = "000" + millis % 1000;
	milliss = milliss.substr(milliss.length - 3);
	return mins + ":" + secs + "." + milliss;
}

function updateHUD()
{
	if (userHighscore != null)
	{
		hudElements.userBest.nodeValue = userHighscoreText;
	}

	if (highscore != null)
	{
		hudElements.worldBest.nodeValue = highscoreText;
	}

	if (hudTM != null)
	{
		hudElements.lapTime.nodeValue = parseTime(hudTM.lapTime);
		if (hudTM.bestLap != null)
		{
			hudElements.bestLap.nodeValue = parseTime(hudTM.bestLap);
		}
		var checkpointNum = hudTM.nextCheckpoint;
		if (checkpointNum == 0) checkpointNum = hudTM.checkpoints.length;
		hudElements.checkpoints.nodeValue = checkpointNum + "/" + hudTM.checkpoints.length;
	}

	if (hudShip != null)
	{
		hudElements.speed.nodeValue = (3.6 * length(hudShip.velocity)).toFixed(0) + "km/h";
	}

	if (hudControls != null)
	{
		hudElements.motionAssist.nodeValue = hudControls.motionAssist ? "on" : "off";
		hudElements.rotationAssist.nodeValue = hudControls.rotationAssist ? "on" : "off";
	}
}

function notify(text, time)
{
	hudElements.notification.nodeValue = text;

	$("#notification").fadeIn(400, function() {
		setTimeout(function() {
			$("#notification").fadeOut(400);
		}, time);
	});
}
