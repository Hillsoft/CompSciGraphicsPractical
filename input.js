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