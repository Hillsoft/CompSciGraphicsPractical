var pressedKeys = {};
var mouseLocked = false;

var gamepadInputListeners = {
	next: null
};

var registerGamepadInputListener = llAdd(gamepadInputListeners);
var unregisterGamepadInputListener = llRemove(gamepadInputListeners);

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

function GamepadOnPressMonitor()
{
	this.tick = function(dt)
	{
		var gp = navigator.getGamepads()[0];
		var pressed = gp.buttons;
		for (var i = 0; i < pressed.length; i++)
			pressed[i].index = i;
		var pressed = gp.buttons.filter(x => x.pressed).map(x => x.index);

		for (var i = 0; i < pressed.length; i++)
		{
			if (this.lastPressed.indexOf(pressed[i]) == -1)
			{
				var listener = gamepadInputListeners.next;
				while (listener != null)
				{
					listener.val.gamepadButtonPressed(pressed[i]);
					listener = listener.next;
				}
			}
		}

		this.lastPressed = pressed;
	}

	this.lastPressed = [];

	registerTickObject(this);

	return this;
}