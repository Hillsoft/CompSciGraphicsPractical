var pressedKeys = {};
var mouseLocked = false;

function handleKeyDown(event)
{
	pressedKeys[event.keyCode] = true;
}

function handleKeyUp(event)
{
	pressedKeys[event.keyCode] = false;
}

document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function pointerLockChange(event)
{
	if (document.pointerLockElement !== null &&
        document.mozPointerLockElement !== null &&
        document.webkitPointerLockElement !== null)
	{
		mouseLocked = true;
	}
	else
	{
		mouseLocked = false;
	}
}

function gamepadAxisMap(x)
{
	var mag = Math.abs(x);
	mag = Math.max(0, (mag - 0.2) * 1/0.8);
	if (x < 0) { mag = -mag; }
	return mag;
}