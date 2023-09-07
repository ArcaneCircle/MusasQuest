"use strict"

const state = {
	scene: "Throne",
}, scenes = {
	Throne: function() {
		set(Throne)
		set(King, function() {
			say([MusaBack, [
				{
					text: () => "What quest, father?",
					action: () => say([King, "Well…"])
				},
				{
					text: () => "Excuse me, I've got to go.",
					action: () => show("Market")
				},
			]])
		}, 0, -20, .4, 0, "The king")
		set(MusaBack, function() {
		}, 25, 22, .5, 0, "Me")
		say([
			King, "Hello my son!",
			King, "I have a quest for you.",
		])
	},
	Market: function() {
		set(Market)
		set(Musa, function() {}, 31, 20, .55, 0, "Still me")
		set(Seer, function() {}, -37, 12, .5, 0, "The seer")
	}
}

let centerX, centerY, hasTouch, zones = []

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
		whoRectHalfWidth = whoRect.width / 2 | 0,
		bubbleRect = B.getBoundingClientRect(),
		bubbleRectHalfWidth = bubbleRect.width / 2 | 0,
		margin = parseFloat(getComputedStyle(B).fontSize) | 0,
		ww = window.innerWidth,
		center = ((whoRect.x || whoRect.left) + whoRectHalfWidth) | 0
	let x = center - bubbleRectHalfWidth
	if (x + bubbleRect.width >= ww) {
		x = Math.min(ww - bubbleRect.width - margin,
			Math.max(margin, x + whoRectHalfWidth - bubbleRectHalfWidth))
	}
	B.style.left = x + "px"
	B.style.top = ((whoRect.y || whoRect.top) -
		bubbleRect.height - margin * 1.5) + "px"
	BP.style.left = (center - margin / 2 - x) + "px"
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
	z.setAttributeNS(null, "fill", "rgba(0, 0, 0, 0)")
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

function translate(x, y, size, deg) {
	return `translate(${
		centerX - 50 + (x || 0)}px, ${
		centerY - 50 + (y || 0)}px) rotateZ(${
		deg || 0}deg) scale(${size || 1})`
}

function hideInfo() {
	Info.style.display = "none"
}

function showInfo(m) {
	Info.innerHTML = m
	Info.style.display = "block"
}

function setHotspot(e, m) {
	if (hasTouch) {
		const children = e.children
		for (let i = children.length; i--;) {
			const e = children[i]
			e.hoverMessage = m
		}
	} else {
		e.onmousemove = function(event) {
			showInfo(m)
			event.stopPropagation()
		}
	}
}

function set(e, f, x, y, size, deg, hover) {
	// Transform origin at runtime to keep sprite coordinates in the
	// 0-99 range. If the source is centered at 0/0, there are minus
	// signs that make the values a tiny bit worse to compress.
	e.style.transformOrigin = `50px 50px`
	e.style.transform = translate(x, y, size, deg)
	e.style.visibility = "visible"
	if (hover) {
		setHotspot(e, hover)
	}
	if (f) {
		const onclick = function() { B.talking || f() },
			children = e.children
		for (let i = children.length; i--;) {
			const child = children[i]
			child.onclick = onclick
		}
		// Add a finger-tip sized hotspot for small targets.
		if (hasTouch) {
			const z = getZone()
			z.style.transformOrigin = `50px 50px`
			z.style.transform = e.style.transform
			z.style.display = "block"
			z.onclick = onclick
		}
	}
}

function show(name) {
	hideInfo()
	clear()
	for (const e of S.getElementsByTagName("g")) {
		e.style.visibility = "hidden"
		e.onclick = null
	}
	state.scene = name
	scenes[name]()
}

function resize() {
	const windowWidth = window.innerWidth,
		windowHeight = window.innerHeight,
		min = Math.min(windowWidth, windowHeight),
		ratio = min / 100,
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
	show(state.scene)
}

window.onload = function() {
	document.onclick = skip
	document.onkeyup = skip
	// Prevent pinch/zoom on iOS 11.
	if ((hasTouch = 'ontouchstart' in document)) {
		document.addEventListener('gesturestart', function(event) {
			event.preventDefault()
		}, false)
		document.addEventListener('gesturechange', function(event) {
			event.preventDefault()
		}, false)
		document.addEventListener('gestureend', function(event) {
			event.preventDefault()
		}, false)
		document.ontouchstart = document.ontouchmove = function(event) {
			const touches = event.touches
			if (touches && touches.length > 0) {
				const t = touches[0],
					e = document.elementFromPoint(t.pageX, t.pageY)
				if (e && e.hoverMessage) {
					showInfo(e.hoverMessage)
				} else {
					hideInfo()
				}
			}
		}
		document.ontouchend = document.ontouchcancel = hideInfo
	} else {
		document.onmousemove = hideInfo
	}
	window.onresize = resize
	resize()
}
