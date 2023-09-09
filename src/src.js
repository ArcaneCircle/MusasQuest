"use strict"

const state = {
	scene: "Throne",
	inventory: [],
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
					text: () => "Market",
					action: () => show("Market")
				},
				{
					text: () => "DesertNight",
					action: () => cutAndShow("A few days later…", "DesertNight")
				},
				{
					text: () => "CampNight",
					action: () => show("CampNight")
				},
				{
					text: () => "CampDay",
					action: () => show("CampDay")
				},
				{
					text: () => "DesertDay",
					action: () => show("DesertDay")
				},
				{
					text: () => "DesertEntry",
					action: () => show("DesertEntry")
				},
				{
					text: () => "Cave",
					action: () => show("Cave")
				},
				{
					text: () => "BeforeCity",
					action: () => show("BeforeCity")
				},
				{
					text: () => "BeforeCastle",
					action: () => show("BeforeCastle")
				},
			]])
		}, 0, -10, .4, 0, "Talk to the king")
		set(MusaBack, function() {
		}, 25, 18, .5, 0, "Me")
		set(Guard, function() {
			say([Guard, "At your service, my prince"])
		}, -26, 5, .5, 0, "A guard")
		say([
			King, "Hello my son!",
			King, "I have a quest for you.",
		])
	},
	Market: function() {
		set(Market)
		set(Musa, null, 31, 15, .55, 0)
		set(Guard, function() {
		}, -26, -4, .3, 0, "Talk to my bodyguard")
		set(RedFruits, function() {
			say([Musa, "These are tasty! I like them!"])
		}, 0, 0, 0, 0, "Red fruits")
		set(YellowFruits, function() {
			say([Musa, "Urgh, the yellow ones make me sick."])
		}, 0, 0, 0, 0, "Yellow fruits")
		set(GreenFruits, function() {
			say([Musa, "Green is nice!"])
		}, 0, 0, 0, 0, "Green fruits")
		set(Seer, function() {
			say([
				Musa, "Can you tell me where I can find a gift?",
				Seer, "Sure! Let me have a look into your future…",
				Seer, "Hmmmm",
			])
		}, -37, 12, .5, 0, "Talk to the seer")
	},
	DesertNight: function() {
		set(DesertNight)
		set(Camel, null, -10, 12, .2)
	},
	CampNight: function() {
		set(CampNight)
		set(Scorpion, function() {
			say([Musa, "Better keep my distance."])
		}, -32, 35, .1, 0, "A scorpion")
		set(Guard, function() {
			say([
				Guard, "I will take the first watch",
				Guard, "And the second",
			])
		}, -31, 12, .55, 0, "Talk to my bodyguard")
		set(Musa, null, 35, 14, .5, 0)
	},
	CampDay: function() {
		set(CampDay)
		set(Bandit, null, -35, -10, .4, 0)
		set(GuardDead, null, -5, 25, .5, 0)
		set(MusaBound, null, 36, 14, .5, 0)
	},
	DesertDay: function() {
		set(DesertDay)
		set(Musa, null, 31, 16, .5, 0)
	},
	DesertEntry: function() {
		set(DesertEntry)
		set(Idol, function() {
		}, 20, 7, .4)
		set(MusaBack, null, -20, 16, .5, 0)
	},
	Cave: function() {
		set(Cave)
		set(Lamp, function() {
			set(Jinn, function() {
				say([Jinn, "The carpet only flies when no one is looking"], function() {
					Jinn.style.visibility = "hidden"
				})
			}, 7, 0, .5, 0, "Talk to the Jinn")
		}, 8, 7, .2, 0, "A golden lamp")
		set(Rug, function() {
			addToInventory(Rug, function() {
				say([currentMusa(), "I don't know how"])
			})
		}, 10, 30, .3, 20, "A rug")
		set(Musa, null, -10, 24, .3, 0)
	},
	BeforeCity: function() {
		set(BeforeCity)
		set(Crusader, function() {
		}, 0, 0, .45)
		set(MusaBack, null, -31, 17, .5, 0)
	},
	BeforeCastle: function() {
		set(BeforeCastle)
		set(Tuck, function() {
		}, 0, 0, .45)
		set(MusaBack, null, -31, 17, .5, 0)
	},
}, zones = []

let centerX, centerY, hasTouch

function currentMusa() {
	return [Musa, MusaBack, MusaBound].find(dave =>
		dave.style.visibility == "visible")
}

function updateInventory() {
	let x = 0
	state.inventory.forEach(e => {
		e.style.transformOrigin = "left top"
		e.style.transform = `translate(${x}px, 0px) scale(.1)`
		e.style.visibility = "visible"
		e.onclick = function() {
			if (B.talking) {
				return
			} else if (e.use) {
				e.use()
			} else {
				say([currentMusa(), "This has no use here"])
			}
		}
		x += 35
	})
}

function removeOnClick(e) {
	const children = e.children
	for (let i = children.length; i--;) {
		const e = children[i]
		e.onclick = null
	}
	e.onclick = null
}

function removeFromInventory(e) {
	e.style.visibility = "hidden"
	state.inventory = state.inventory.filter(item => item != e)
	updateInventory()
}

function addToInventory(item, f) {
	if (!state.inventory.includes(item)) {
		removeOnClick(item)
		item.style.visibility = "hidden"
		item.use = f
		state.inventory.push(item)
		updateInventory()
	}
}

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
	if (x < 0) {
		x = margin
	} else if (x + margin + bubbleRect.width >= ww) {
		x = ww - margin - bubbleRect.width
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
	z.setAttributeNS(null, "fill", "rgba(0,0,0,0)")
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

function info(m) {
	I.innerHTML = typeof m == "string" ? m : "&nbsp;"
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
			info(m)
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
		const onclick = function(event) {
			B.talking || f()
			event.stopPropagation()
		}, children = e.children
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
			if (hover) {
				z.hoverMessage = hover
			}
		}
	}
}

function show(name) {
	info()
	clear()
	resetZones()
	for (const e of S.getElementsByTagName("g")) {
		e.style.visibility = "hidden"
		e.onclick = null
	}
	state.scene = name
	scenes[name]()
	updateInventory()
}

function cutAndShow(m, name) {
	M.innerHTML = m
	M.style.display = "block"
	setTimeout(function() {
		M.style.display = "none"
		show(name)
	}, 1000 + 200 * m.split(' ').length)
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
				info(e && e.hoverMessage ? e.hoverMessage : null)
			}
		}
		document.ontouchend = document.ontouchcancel = info
	} else {
		document.onmousemove = info
	}
	window.onresize = resize
	resize()
}
