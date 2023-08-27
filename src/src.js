"use strict"

let centerX, centerY, zones = []

function clear() {
	clearTimeout(B.tid)
	B.time = Date.now()
	B.style.display = "none"
}

function skip() {
	if (B.next && Date.now() - B.time > 300) {
		clear()
		B.next()
	}
}

function say(a, f, cont) {
	if (!cont && B.talking) {
		return
	}
	clear()
	const who = a.shift(),
		what = a.shift()
	// Set this for getBoundingClientRect() to work as expected.
	B.style.left = "0px"
	B.style.top = "0px"
	B.style.display = "block"
	if (Array.isArray(what)) {
		BM.innerText = ""
		const ol = document.createElement('ol')
		what.map(function(option) {
			const text = option.text()
			if (text) {
				const li = document.createElement('li'),
					a = document.createElement('a')
				a.href = "javascript:void(0)"
				a.onclick = option.action
				a.innerHTML = text
				li.appendChild(a)
				ol.appendChild(li)
			}
		})
		BM.appendChild(ol)
		B.next = null
	} else {
		BM.innerHTML = what
		B.talking = (a.length > 0 || f != null) ? 1 : 0
		B.time = Date.now()
		B.next = function() {
			if (a.length > 0) {
				say(a, f, 1)
			} else {
				clear()
				B.next = null
				B.talking = 0
				f && f()
			}
		}
		B.tid = setTimeout(B.next, 1000 + 200 * what.split(' ').length)
	}
	const whoRect = who.getBoundingClientRect(),
		bubbleRect = B.getBoundingClientRect(),
		margin = parseFloat(getComputedStyle(B).fontSize),
		whoRectHalfWidth = whoRect.width / 2,
		ww = window.innerWidth
	let x = whoRect.x || whoRect.left,
		cx = x + whoRectHalfWidth
	if (x + bubbleRect.width >= ww) {
		x = Math.min(ww - bubbleRect.width - margin,
			Math.max(margin, x + whoRectHalfWidth - bubbleRect.width / 2))
	}
	B.style.left = x + "px"
	B.style.top = ((whoRect.y || whoRect.top) -
		bubbleRect.height - margin * 1.5) + "px"
	BP.style.left = (cx - x) + "px"
}

function translate(x, y, size, deg) {
	return `translate(${
		centerX - 50 + (x || 0)}px, ${
		centerY - 50 + (y || 0)}px) rotateZ(${
		deg || 0}deg) scale(${size || 1})`
}

function resetZones() {
	zones.forEach(z => z.style.display = "none")
	zones.next = 0
}

function newZone() {
	const z = document.createElementNS("http://www.w3.org/2000/svg","circle")
	z.setAttributeNS(null, "cx", 50)
	z.setAttributeNS(null, "cy", 50)
	z.setAttributeNS(null, "r", 10)
	z.setAttributeNS(null, "fill", "rgba(0, 0, 0, .1)")
	return z
}

function getZone() {
	const next = zones.next++
	if (zones.length > next) {
		return zones[next]
	}
	const z = newZone()
	S.appendChild(z)
	zones.push(z)
	return z
}

function set(e, f, x, y, size, deg) {
	e.style.transformOrigin = `50px 50px`
	e.style.transform = translate(x, y, size, deg)
	if (f) {
		const z = getZone()
		z.style.transform = e.style.transform
		z.style.display = "block"
		z.onclick = function() { B.talking || f() }
	}
}

function resize() {
	const windowWidth = window.innerWidth,
		windowHeight = window.innerHeight,
		min = Math.min(windowWidth, windowHeight),
		ratio = min / 300,
		stageWidth = windowWidth / ratio,
		stageHeight = windowHeight / ratio

	centerX = stageWidth >> 1
	centerY = stageHeight >> 1

	const style = S.style
	style.width = stageWidth + "px"
	style.height = stageHeight + "px"
	style.transformOrigin = "top left"
	style.transform = `scale(${ratio})`
	style.display = "block"

	resetZones()
	set(World)
	set(Guy, function() {
		say([Guy, "Hello World!"])
	})
	set(Dude, function() {
		say([Dude, "Hi!"])
	}, 20, 20)
}

window.onload = function() {
	document.onclick = skip
	document.onkeyup = skip
	// Prevent pinch/zoom on iOS 11.
	if ('ontouchstart' in document) {
		document.addEventListener('gesturestart', function(event) {
			event.preventDefault()
		}, false)
		document.addEventListener('gesturechange', function(event) {
			event.preventDefault()
		}, false)
		document.addEventListener('gestureend', function(event) {
			event.preventDefault()
		}, false)
	}
	window.onresize = resize
	resize()
}
