"use strict"

const state = {
	scene: "Intro",
	inventory: [],
}, scenes = {
	Intro: function() {
		set(Throne)
		set(King, function() {
			say([
				King, "Hello my son!",
				King, "I sent for you because I have a quest for you!",
				King, "I need a special gift for your mother, something that does not exist in my kingdom, something precious.",
				King, "So you will travel strange new lands, and find your mother a gift that will make her proud of you.",
				King, "Bamidele will go with you, for your protection, and to keep you company.",
				Bamidele, "I will!",
				King, "Now go and ask the seer for advice."
			], function() {
				show("Market")
			})
		}, 0, -10, .4, 0, "The king")
		set(MusaBack, null, 25, 18, .5)
		set(Bamidele, null, -26, 5, .5, 0, "Bamidele, the kings guard")
		set(HelmetOnBamidele, null, -26, 5, .5, 0, "Bamidele, the kings guard")
	},
	Market: function() {
		set(Market)
		set(Musa, null, 20, 15, .55, 0)
		set(RedFruits, function() {
			say([Musa, "These are tasty! I like them!"])
		}, 0, 0, 0, 0, "Red fruits")
		set(YellowFruits, function() {
			say([Musa, "Urgh, the yellow ones make me sick."])
		}, 0, 0, 0, 0, "Yellow fruits")
		set(GreenFruits, function() {
			say([Musa, "The green ones are too sour!"])
		}, 0, 0, 0, 0, "Green fruits")
		const letsGo = function() {
			if (state.seer) {
				shade("And so we travel until…", function() {
					show("CampNight")
				})
			} else {
				say([Musa, "I should ask the seer first"])
			}
		}
		set(Seer, function() {
			if (state.seer > 1) {
				say([
					Musa, "Where…",
					Seer, "Bagdad, you should go now or your fate will happen without you.",
					Musa, "Oh!",
				], letsGo)
			} else if (state.seer == 1) {
				say([
					Musa, "Where can I find this silk cloth, again?",
					Seer, "Bagdad, a city in the north east",
					Musa, "Bagdad! Right!",
				], function() {
					++state.seer
				})
			} else {
				say([
					Musa, "Tell me where I can find something very special, something that doesn't exist around here, for my mother. ",
					Seer, "Let me have a look into your future…",
					Seer, "Hmmm, in a land far far away, there exists a cloth, far thinner and smoother than everything we have ever seen. It's called silk, and it's sold in the streets of Bagdad, a city in the north east, hmmm, but…",
					Musa, "Yes?",
					Seer, "…the 13th, oh the 13th can't be a viki…, ah sorry, wrong prophecy, happens, you know? No, no, you get the silk and you're fine!",
					Musa, "Okay!",
					Seer, "And, one last thing: to fullfill your fate, you should not kill unless you have no other choice.",
					Musa, "Good to know.",
				], function() {
					state.seer = 1
				})
			}
		}, -37, 12, .5, 0, "Talk to the seer")
		set(Camel, letsGo, -90, 30, 1, 0, "Let's go!")
		setHotspot(OutOfTown, "Let's go!", letsGo)
		set(Bamidele, function() {
			say([Bamidele, "Hurry up!"])
		}, 45, 20, .55, 0, "Bamidele")
		set(HelmetOnBamidele, null, 45, 20, .55, 0, "Bamidele")
	},
	CampNight: function() {
		set(CampNight)
		set(Tent, function() {
			if (!state.scorpion) {
				say([
					Musa, "We should deal with this scorpion before we get to sleep!",
					Bamidele, "I will kill the beast!",
				])
			} else {
				shade("But the night brought other visitors…", function() {
					show("CampDay")
				})
			}
		}, 0, 0, 1, 0, "Go to sleep")
		if (!state.scorpion) {
			set(Scorpion, function() {
				say([Musa, "Better keep my distance"])
			}, -10, 35, .1, 0, "A scorpion")
		}
		set(Bamidele, function() {
			if (state.scorpion) {
				say([
					Musa, "Let's go to sleep then",
					Bamidele, "You sleep. I take the first watch",
					Bamidele, "And the second",
				])
			} else {
				say([
					Musa, "Any idea how to catch it?",
					Bamidele, "I would just kill it",
					Musa, "The seer said we should not kill unless necessary",
				])
			}
		}, -31, 5, .55, 0, "Talk to my Bamidele")
		if (!state.inventory.includes(Helmet)) {
			set(HelmetOnBamidele, function() {
				say([Musa, "Give me your helmet"], function() {
					say([
						Bamidele, "Why?",
						Musa, "Because I am your prince and I want to catch it!",
						Bamidele, "Fine, have it",
					], function() {
						remove(HelmetOnBamidele)
						addToInventory(Helmet, function() {
							if (state.scorpion) {
								if (state.scene == "CampDay") {
									say([
										currentMusa(), "Want a helmet?",
										Robber, "Give me everything you have!",
										currentMusa(), "Take it"
									], function() {
										removeFromInventory(Helmet)
										shade("Aaaahhh!", function() {
											show("CampDead")
										})
									})
								} else {
									say([currentMusa(), "A scorpion in a helmet"])
								}
							} else {
								remove(Scorpion)
								state.scorpion = 1
								say([
									currentMusa(), "Got you!",
									Bamidele, "You can keep the helmet"
								])
							}
						})
					})
				})
			}, -31, 5, .55, 0, "Bamidele's helmet")
		}
		set(Musa, null, 35, 14, .5, 0)
	},
	CampDay: function() {
		set(CampDay)
		set(Tent)
		set(Robber, function() {
			say([
				MusaBound, "Excuse me…",
				Robber, "Silence! I will sell you for a lot of money!",
				Robber, "Ha ha ha!",
			])
		}, -35, -10, .4, 0, "Robber")
		set(BamideleDead, function() {
		}, -5, 25, .5, 0, "Dead guard")
		set(MusaBound, null, 36, 14, .5, 0)
		set(Chains, null, 36, 24, .13, 0)
		say([Robber, "Good morning, slave!"])
	},
	CampDead: function() {
		set(CampDay)
		set(Tent)
		set(BamideleDead, function() {
		}, -5, 25, .5, 0, "Dead guard")
		set(RobberDead, null, -50, 10, .4, 0, "Dead robber")
		set(Helmet, function() {
			say([currentMusa(), "Won't touch the thing!"])
		}, -37, 10, .05, -22, "Helmet")
		if (!state.inventory.includes(Sword)) {
			set(Sword, function() {
				addToInventory(Sword, function() {
					if (!state.unchained) {
						state.unchained = 1
						shade("Clang!", function() {
							show("CampDead")
						})
					} else {
						noUse()
					}
				})
			}, -40, 15, .2, 100, "Sword")
		}
		if (state.unchained) {
			set(Musa, null, 36, 14, .5, 0)
			if (!state.inventory.includes(Chains)) {
				set(Chains, function() {
					addToInventory(Chains)
				}, 36, 44, .13, 0, "Chains")
			}
			setHotspot(GoDesert, "Continue the journey", function() {
				show("DesertEntry")
			})
		} else {
			set(MusaBound, null, 36, 14, .5, 0)
			set(Chains, null, 36, 24, .13, 0)
		}
	},
	DesertDay: function() {
		set(DesertDay)
		set(Musa, null, 31, 16, .5, 0)
	},
	DesertEntry: function() {
		set(DesertEntry)
		set(Column, function() {
			shade("Whoaa!", function() {
				show("Cave")
			})
		}, 20, 18, .4)
		set(MusaBack, null, -20, 16, .5, 0)
	},
	Cave: function() {
		set(Cave)
		set(Lamp, function() {
			set(Jinn, function() {
				say([Jinn, "The carpet only flies when no one is looking"], function() {
					remove(Jinn)
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
	Bagdad: function() {
		set(Bagdad)
		set(Mongol, function() {
			say([Mongol, "Run!"])
		}, 0, 0, .45)
		set(MusaBack, null, -26, 17, .5, 0)
		say([
			Mongol, "Badad is no more",
			Mongol, "Go away or become a part of history!",
			MusaBack, "Nice meeting you Mongols. Not."
		])
	},
	BeforeCastle: function() {
		set(BeforeCastle)
		set(Tuck, function() {
		}, 0, 0, .45)
		set(MusaBack, null, -31, 17, .5, 0)
	},
	Home: function() {
		set(Throne)
		set(King, null, 0, -10, .4)
		set(MusaBack, null, 25, 18, .5)
		say([
			MusaBack, "I'm home! And I have the gift you asked for!",
			King, "Wonderful! But the gift is having you back, and as the man that you need to be to follow me.",
			King, "Now, you saw the world, and found your place in it.",
			MusaBack, "I have.",
		], function() {
			M.innerHTML = "The End"
			M.style.display = "block"
		})
	},
}, zones = []

let centerX, centerY, hasTouch

function shade(m, f) {
	M.innerHTML = m
	M.style.display = "block"
	setTimeout(function() {
		M.style.display = "none"
		f && f()
	}, 1000 + 200 * m.split(' ').length)
}

function currentMusa() {
	return [Musa, MusaBack, MusaBound].find(dave =>
		dave.style.visibility == "visible")
}

function noUse() {
	say([currentMusa(), "This has no use here"])
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
				noUse()
			}
		}
		x += 10
	})
}

function remove(e) {
	e.style.visibility = "hidden"
	const children = e.children
	for (let i = children.length; i--;) {
		const e = children[i]
		e.onclick = null
	}
	e.onclick = null
	if (e.zone) {
		e.zone.style.visibility = "hidden"
		e.zone = null
	}
}

function removeFromInventory(e) {
	e.style.visibility = "hidden"
	state.inventory = state.inventory.filter(item => item != e)
	updateInventory()
}

function addToInventory(item, f) {
	if (!state.inventory.includes(item)) {
		remove(item)
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

function setHotspot(e, m, f) {
	if (hasTouch) {
		const children = e.children
		for (let i = children.length; i--;) {
			children[i].hoverMessage = m
		}
	} else {
		e.onmousemove = m ? function(event) {
			info(m)
			event.stopPropagation()
		} : null
	}
	if (f) {
		e.onclick = f
	}
}

function set(e, f, x, y, size, deg, hover) {
	// Transform origin at runtime to keep sprite coordinates in the
	// 0-99 range. If the source is centered at 0/0, there are minus
	// signs that make the values a tiny bit worse to compress.
	e.style.transformOrigin = `50px 50px`
	e.style.transform = translate(x, y, size, deg)
	e.style.visibility = "visible"
	setHotspot(e, hover)
	let onclick = null
	if (f) {
		onclick = function(event) {
			B.talking || f()
			event.stopPropagation()
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
			e.zone = z
		}
	}
	const children = e.children
	for (let i = children.length; i--;) {
		children[i].onclick = onclick
	}
}

function show(name) {
	info()
	clear()
	resetZones()
	for (const e of S.getElementsByTagName("g")) {
		e.style.visibility = "hidden"
		e.zone = e.onclick = null
	}
	state.scene = name
	scenes[name]()
	updateInventory()
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
