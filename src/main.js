import "./main.css";

const initialState = '{"scene": "Intro", "inventory": []}';
let state = JSON.parse(localStorage.state || initialState);
const items = {
    Silk: Silk,
    Helmet: Helmet,
    TurbanRope: TurbanRope,
    Sword: Sword,
    Chains: Chains,
    Carpet: Carpet,
    A1: A1,
    A2: A2,
    A3: A3,
    Grass: Grass,
    Cross: Cross,
  },
  itemUse = {
    Helmet: function () {
      if (state.scorpion) {
        if (state.scene == "CampDay") {
          say(
            [
              currentMusa(),
              "Want a helmet?",
              Robber,
              "Give me everything you have!",
              currentMusa(),
              "Take it",
            ],
            function () {
              removeFromInventory("Helmet");
              shade("Aaaahhh!", function () {
                show("CampDead");
              });
            },
          );
        } else {
          say([currentMusa(), "A scorpion in a helmet"]);
        }
      } else {
        remove(Scorpion);
        state.scorpion = 1;
        say([currentMusa(), "Got you!", Bamidele, "You can keep the helmet"]);
      }
    },
    TurbanRope: function () {
      if (state.scene == "TempleEntry") {
        removeFromInventory("TurbanRope");
        show("Temple");
      } else {
        noUse();
      }
    },
    Sword: function () {
      if (state.silk) {
        removeFromInventory("Sword");
        addToInventory("Silk");
        say([
          M3,
          "Nice trading with you",
          currentMusa(),
          "Finally I got the silk!",
          currentMusa(),
          "Time to go home!",
        ]);
      } else if (!state.unchained) {
        state.unchained = 1;
        shade("Clang!", function () {
          show("CampDead");
          say([Musa, "Free again!"]);
        });
      } else {
        noUse();
      }
    },
    Carpet: function () {
      if (state.carpetUsed) {
        say([
          currentMusa(),
          [
            {
              text: () => (state.scene != "Bagdad" ? "Bagdad" : null),
              action: () => {
                fly("Bagdad");
              },
            },
            {
              text: () =>
                state.byzantine && !state.scene.startsWith("Byzantium")
                  ? "Byzantium"
                  : null,
              action: () => {
                fly("Byzantium");
              },
            },
            {
              text: () => "Home",
              action: () => {
                if (state.inventory.includes("Silk")) {
                  fly("Home");
                } else {
                  say([currentMusa(), "I can't go home without the silk"]);
                }
              },
            },
          ],
        ]);
      } else {
        say([
          currentMusa(),
          state.howToSteer ? "Someone is still looking…" : "I don't know how",
        ]);
      }
    },
    A1: buildCross,
    A2: buildCross,
    A3: buildCross,
    Grass: buildCross,
  },
  scenes = {
    Intro: function () {
      set(Throne);
      set(
        King,
        function () {
          say(
            [
              King,
              "Hello my son!",
              King,
              "I sent for you because I have a quest for you!",
              King,
              "I need a special gift for your mother, something that does not exist in my kingdom, something precious.",
              King,
              "So you will travel strange new lands, and find your mother a gift that will make her proud of you.",
              King,
              "Bamidele will go with you, for your protection, and to keep you company.",
              Bamidele,
              "I will!",
              King,
              "Now go and ask the seer for advice.",
            ],
            function () {
              show("Market");
            },
          );
        },
        0,
        -10,
        0.4,
        0,
        "The king",
      );
      set(MusaBack, null, 25, 18, 0.5);
      set(Bamidele, null, -26, 5, 0.5, 0, "Bamidele, the kings guard");
      set(
        HelmetOnBamidele,
        null,
        -26,
        -18,
        0.5,
        0,
        "Bamidele, the kings guard",
      );
    },
    Market: function () {
      set(Market);
      set(Musa, null, 20, 15, 0.55, 0);
      set(
        RedFruits,
        function () {
          say([Musa, "These are tasty! I like them!"]);
        },
        -4,
        5,
        0,
        0,
        "Red fruits",
      );
      set(
        YellowFruits,
        function () {
          say([Musa, "Urgh, the yellow ones make me sick."]);
        },
        -13,
        7,
        0,
        0,
        "Yellow fruits",
      );
      set(
        GreenFruits,
        function () {
          say([Musa, "The green ones are too sour!"]);
        },
        3,
        10,
        0,
        0,
        "Green fruits",
      );
      const letsGo = function () {
        if (state.seer) {
          shade("A few days later", function () {
            show("CampNight");
          });
        } else {
          say([Musa, "I should ask the seer first"]);
        }
      };
      set(
        Seer,
        function () {
          if (state.seer > 1) {
            say(
              [
                Musa,
                "Where…",
                Seer,
                "Bagdad, you should go now or your fate will happen without you.",
                Musa,
                "Oh!",
              ],
              letsGo,
            );
          } else if (state.seer == 1) {
            say(
              [
                Musa,
                "Where can I find this silk cloth, again?",
                Seer,
                "Bagdad, a city in the north east",
                Musa,
                "Bagdad! Right!",
              ],
              function () {
                ++state.seer;
              },
            );
          } else {
            say(
              [
                Musa,
                "Tell me where I can find something very special, something that doesn't exist around here, for my mother. ",
                Seer,
                "Let me have a look into your future…",
                Seer,
                "Hmmm, in a land far, far away, there exists a cloth, far thinner and smoother than everything we have ever seen. It's called silk, and it's sold in the streets of Bagdad, a city far away north east, hmmm…",
                Seer,
                "On your journey the gods will test you many times. Once, twice, but the 13th…",
                Musa,
                "Yes?",
                Seer,
                "…the 13th cannot be a Vikin…, ah sorry, wrong prophecy, happens, you know, no, no, you get the silk and you're fine!",
                Musa,
                "Okay!",
                Seer,
                "And, one last thing: to fullfill your fate, you should not kill unless you have no other choice.",
                Musa,
                "Good to know.",
              ],
              function () {
                state.seer = 1;
              },
            );
          }
        },
        -37,
        14,
        0.5,
        0,
        "Talk to the seer",
      );
      setHotspot(OutOfTown, "Let's go!", letsGo);
      set(
        Bamidele,
        function () {
          say([Bamidele, "Hurry up!"]);
        },
        45,
        20,
        0.55,
        0,
        "Bamidele",
      );
      set(HelmetOnBamidele, null, 45, -5, 0.55, 0, "Bamidele");
    },
    CampNight: function () {
      set(CampNight);
      set(
        Tent,
        function () {
          if (!state.scorpion) {
            say([
              Musa,
              "We should deal with this scorpion before we get to sleep!",
              Bamidele,
              "I will kill the beast!",
              Musa,
              "The seer said we should not kill unless necessary",
            ]);
          } else {
            shade("But the night brought other visitors…", function () {
              show("CampDay");
            });
          }
        },
        0,
        0,
        1,
        0,
        "Go to sleep",
      );
      if (!state.scorpion) {
        set(
          Scorpion,
          function () {
            say([Musa, "Better keep my distance"]);
          },
          -10,
          35,
          0.1,
          0,
          "A scorpion",
        );
      }
      set(
        Bamidele,
        function () {
          if (state.scorpion) {
            say([
              Musa,
              "Let's go to sleep then",
              Bamidele,
              "You sleep. I take the first watch",
              Bamidele,
              "And the second",
            ]);
          } else {
            say([
              Musa,
              "Any idea how to catch it?",
              Bamidele,
              "I would just kill it",
              Musa,
              "The seer said we should not kill unless necessary",
            ]);
          }
        },
        -31,
        5,
        0.55,
        0,
        "Talk to my Bamidele",
      );
      if (!state.inventory.includes("Helmet")) {
        set(
          HelmetOnBamidele,
          function () {
            say([Musa, "Give me your helmet"], function () {
              say(
                [
                  Bamidele,
                  "Why?",
                  Musa,
                  "Because I want to catch it!",
                  Bamidele,
                  "Fine, have it",
                ],
                function () {
                  remove(HelmetOnBamidele);
                  addToInventory("Helmet");
                },
              );
            });
          },
          -31,
          -21,
          0.55,
          0,
          "Bamidele's helmet",
        );
      }
      set(Musa, null, 35, 14, 0.5, 0);
    },
    CampDay: function () {
      set(CampDay);
      set(Tent);
      set(
        Robber,
        function () {
          say([
            MusaBound,
            "Excuse me…",
            Robber,
            "Silence! I will sell you for a lot of money!",
            Robber,
            "Ha ha ha!",
          ]);
        },
        -32,
        -10,
        0.4,
        0,
        "Robber",
      );
      set(BamideleDead, null, -5, 25, 0.5, 0, "Dead Bamidele");
      set(BamideleTurban, null, -25, 16, 0.5, 0, "Dead Bamidele");
      set(MusaBound, null, 36, 14, 0.5, 0);
      set(Chains, null, 36, 24, 0.13, 0);
      if (!state.morning) {
        state.morning = 1;
        say([
          Robber,
          "Good morning, slave!",
          MusaBound,
          "Poor Bamidele…",
          Robber,
          "He's ventured too far! Ha ha ha!",
        ]);
      }
    },
    CampDead: function () {
      set(CampDay);
      set(Tent);
      set(BamideleDead, null, -5, 25, 0.5, 0, "Dead Bamidele");
      if (!state.inventory.includes("TurbanRope")) {
        set(
          BamideleTurban,
          function () {
            if (state.lookForRope) {
              say([Musa, "That will do!"]);
              remove(BamideleTurban);
              addToInventory("TurbanRope");
            }
          },
          -25,
          16,
          0.5,
          0,
          state.lookForRope ? "Turban" : "Dead Bamidele",
        );
      }
      set(RobberDead, null, -50, 14, 0.4, 0, "Dead robber");
      set(
        Helmet,
        function () {
          say([currentMusa(), "Won't touch the thing!"]);
        },
        -37,
        14,
        0.05,
        -22,
        "Helmet",
      );
      if (!state.inventory.includes("Sword")) {
        set(
          Sword,
          function () {
            addToInventory("Sword");
          },
          -40,
          19,
          0.2,
          100,
          "Sword",
        );
      }
      if (state.unchained) {
        set(Musa, null, 36, 14, 0.5, 0);
        if (!state.inventory.includes("Chains")) {
          set(
            Chains,
            function () {
              addToInventory("Chains");
            },
            36,
            44,
            0.13,
            0,
            "Chains",
          );
        }
      } else {
        set(MusaBound, null, 36, 13, 0.5, 0);
        set(Chains, null, 36, 23, 0.13, 0);
      }
      set(
        ColumnDistant,
        function () {
          if (state.unchained) {
            show("TempleEntry");
          } else {
            say([MusaBound, "Have to free myself first"]);
          }
        },
        -40,
        -3,
        0.06,
        0,
        "Something in the distance",
      );
    },
    TempleEntry: function () {
      set(TempleEntry);
      set(
        Column,
        function () {
          if (state.inventory.includes("TurbanRope")) {
            removeFromInventory("TurbanRope");
            show("Temple");
          } else {
            state.lookForRope = 1;
            say([Musa, "I need a rope to get down there"]);
          }
        },
        26,
        22,
        0.4,
        0,
        "An opening to a buried temple",
      );
      set(
        Tent,
        function () {
          show("CampDead");
        },
        -43,
        6,
        0.2,
        0,
        "Back to the camp",
      );
      set(Musa, null, -20, 12, 0.5, 0);
    },
    Temple: function () {
      set(Temple);
      set(TempleFront);
      set(
        Lamp,
        function () {
          set(
            Jinn,
            function () {
              say([
                Musa,
                [
                  {
                    text: () => (state.wishes ? null : "My three wishes are…"),
                    action: () => {
                      say([Jinn, "Sorry, no wishes today, kid"]);
                      state.wishes = 1;
                    },
                  },
                  {
                    text: () =>
                      state.inventory.includes("Carpet")
                        ? "How do I use the carpet?"
                        : "How do I get to Bagdad?",
                    action: () => {
                      if (state.inventory.includes("Carpet")) {
                        say([
                          Jinn,
                          "The carpet only flies when noone is looking",
                          Musa,
                          "Hmmm",
                        ]);
                        state.howToSteer = 1;
                      } else {
                        say([
                          Jinn,
                          "I would take the flying carpet here",
                          Musa,
                          "Oh!",
                        ]);
                      }
                    },
                  },
                  {
                    text: () =>
                      state.howToSteer
                        ? "And how do I steer the carpet?"
                        : null,
                    action: () => {
                      say(
                        [
                          Jinn,
                          "Just tell it where to go",
                          Musa,
                          "Bagdad!",
                          Jinn,
                          "Someone is still looking…",
                        ],
                        function () {
                          remove(Jinn);
                          state.saidBagdad = 1;
                        },
                      );
                    },
                  },
                ],
              ]);
            },
            11,
            0,
            0.5,
            0,
            "Talk to the Jinn",
          );
          if (state.jinn) {
            say([Jinn, "How can I help you?"]);
          } else {
            state.jinn = 1;
            say([Jinn, "Hello my friend!", Musa, "Whoaa!"]);
          }
        },
        12,
        14,
        0.2,
        0,
        "A golden lamp",
      );
      set(
        Carpet,
        function () {
          addToInventory("Carpet");
          say([Musa, "Got a carpet, need a house!"]);
        },
        10,
        28,
        0.3,
        20,
        "A carpet",
      );
      set(Musa, null, -12, 20, 0.4, 0);
    },
    Bagdad: function () {
      set(Bagdad);
      set(
        Mongol,
        function () {
          if (state.byzantine) {
            say([
              Mongol,
              "I said we meet in Byzantium or should I chop your ugly head off right now?!",
              MusaBack,
              "Better wait until Byzantium if you don't mind",
            ]);
          } else if (state.bagdad) {
            say([
              MusaBack,
              "But where can I find silk now?",
              Mongol,
              "Try Byzantium, ha ha ha!",
              Mongol,
              "I will meet you there…",
            ]);
            state.byzantine = 1;
          } else {
            say([
              MusaBack,
              "Is this Bagdad?",
              Mongol,
              "Bagdad, and everything in it, belongs to us Mongols now!",
            ]);
            state.bagdad = 1;
          }
        },
        0,
        0,
        0.45,
        0,
        "Mongol",
      );
      set(MusaBack, null, -26, 17, 0.5, 0);
      const takeArrow = function (a) {
        if (state.arrow) {
          say([MusaBack, "I already have an arrow"]);
        } else {
          addToInventory(a);
          state.arrow = 1;
        }
      };
      if (!state.inventory.includes("A1")) {
        set(A1, () => takeArrow("A1"), 20, 18, 0.2, -35, "Broken Arrow");
      }
      if (!state.inventory.includes("A2")) {
        set(A2, () => takeArrow("A2"), -5, 32, 0.2, -55, "Broken Arrow");
      }
      if (!state.inventory.includes("A3")) {
        set(A3, () => takeArrow("A3"), 40, 28, 0.2, -15, "Broken Arrow");
      }
    },
    Byzantium: function () {
      set(Byzantium);
      set(
        Crusader,
        function () {
          if (state.inventory.includes("Cross")) {
            say([Crusader, "You may pass"]);
          } else {
            say([
              Crusader,
              "Are you a Christian?",
              MusaBack,
              "No, I am Musa",
              Crusader,
              "Very funny. You can't enter. Only Christians today.",
            ]);
          }
        },
        -21,
        11,
        0.5,
        0,
        "A crusader",
      );
      set(MusaBack, null, 34, 18, 0.5, 0);
      setHotspot(Enter, "Enter Byzantium", function () {
        if (state.inventory.includes("Cross")) {
          show("ByzantiumMarket");
        } else {
          say([Crusader, "Not so fast!"]);
        }
      });
      if (!state.inventory.includes("Grass")) {
        set(
          Grass,
          function () {
            addToInventory("Grass");
          },
          46,
          16,
          0.13,
          0,
          "Some grass",
        );
      }
    },
    ByzantiumMarket: function () {
      set(ByzantiumMarket);
      set(
        M1,
        function () {
          say([
            M1,
            "Want to buy some porcelain?",
            MusaBack,
            "No, not my cup of tea",
          ]);
        },
        -29,
        -13,
        1,
        0,
        "Porcelain",
      );
      set(
        M2,
        function () {
          say([M2, "Want to buy some jade?", MusaBack, "No, thanks"]);
        },
        0,
        -11,
        1,
        0,
        "Jade",
      );
      set(
        M3,
        function () {
          if (state.inventory.includes("Silk")) {
            say([
              M3,
              "Want to buy some more silk?",
              MusaBack,
              "No, thanks, that's enough",
            ]);
          } else {
            state.silk = 1;
            say([
              M3,
              "Want to buy some silk?",
              MusaBack,
              "Very much!",
              M3,
              "Do you have something to trade?",
            ]);
          }
        },
        28,
        -10,
        1,
        0,
        "Silk",
      );
      set(MusaBack, null, 11, 9, 0.5, 0);
    },
    Home: function () {
      state.inventory.length = 0;
      updateInventory();
      set(Throne);
      set(King, null, 0, -10, 0.4);
      set(MusaBack, null, 25, 18, 0.5);
      say(
        [
          MusaBack,
          "I'm home! And I have the gift you asked for!",
          King,
          "Wonderful! But the gift is having you back, and as the man that you need to be to follow me.",
          King,
          "Now, you saw the world, and will be a wise king one day.",
          MusaBack,
          "I will be.",
        ],
        function () {
          M.onclick = null;
          M.innerHTML = "The End";
          M.style.display = "block";
          const info = `${window.webxdc.selfName} won Musa's Quest!`;
          window.webxdc.sendUpdate(
            {
              payload: null,
              info,
            },
            "",
          );
          state = JSON.parse(initialState); // reset game
        },
      );
    },
  };

let centerX, centerY, hasTouch;

function shade(m, f) {
  M.innerHTML = m;
  M.style.display = "block";
  M.onclick = function () {
    clearTimeout(id);
    M.style.display = "none";
    f && f();
  };
  const id = setTimeout(M.onclick, 1000 + 200 * m.split(" ").length);
}

function fly(to) {
  shade("Woooooooosh!", function () {
    show(to);
  });
}

function currentMusa() {
  return [Musa, MusaBack, MusaBound].find(
    (musa) => musa.style.visibility == "visible",
  );
}

function newZone(size) {
  const z = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  z.setAttributeNS(null, "cx", 50);
  z.setAttributeNS(null, "cy", 50);
  z.setAttributeNS(null, "r", 5 * size);
  z.setAttributeNS(null, "fill", "rgba(0,0,0,0)");
  return z;
}

function removeZone(e) {
  if (e.zone) {
    S.removeChild(e.zone);
    e.zone = null;
  }
}

function addZone(e, size) {
  if (!e.zone || e.zone.size != size) {
    if (e.zone) {
      removeZone(e);
    }
    e.zone = newZone(1 / size);
    e.zone.size = size;
    S.appendChild(e.zone);
  }
  const z = e.zone;
  z.style.transformOrigin = e.style.transformOrigin;
  z.style.transform = e.style.transform;
  z.style.display = "block";
  z.style.visibility = "visible";
  z.onclick = e.onclick;
  z.hoverMessage = e.hoverMessage;
}

function noUse() {
  say([currentMusa(), "This has no use here"]);
}

function updateInventory() {
  console.log(`Inventory: ${JSON.stringify(state.inventory)}`);
  let x = 0;
  state.inventory.forEach((itemId) => {
    const e = items[itemId];
    e.style.transformOrigin = "0 0";
    e.style.transform = `translate(${x}px, 0px) scale(.1)`;
    e.style.visibility = "visible";
    e.onclick = function () {
      if (B.talking) {
        return;
      } else if (itemUse[itemId]) {
        itemUse[itemId]();
      } else {
        noUse();
      }
    };
    if (hasTouch) {
      addZone(e, 0.1);
    }
    x += 10;
  });
}

function remove(e) {
  e.style.visibility = "hidden";
  const children = e.children;
  for (let i = children.length; i--; ) {
    const e = children[i];
    e.onclick = null;
  }
  e.onclick = null;
  removeZone(e);
}

function removeFromInventory(itemId) {
  const e = items[itemId];
  e.style.visibility = "hidden";
  removeZone(e);
  state.inventory = state.inventory.filter((item) => item != itemId);
  updateInventory();
}

function addToInventory(itemId) {
  if (!state.inventory.includes(itemId)) {
    const item = items[itemId];
    remove(item);
    item.style.visibility = "hidden";
    state.inventory.push(itemId);
    updateInventory();
  }
}

function buildCross() {
  if (state.arrow && state.inventory.includes("Grass")) {
    removeFromInventory("A1");
    removeFromInventory("A2");
    removeFromInventory("A3");
    removeFromInventory("Grass");
    addToInventory("Cross");
    say([currentMusa(), "Now I can pass the crusader"]);
  } else {
    noUse();
  }
}

function clear() {
  clearTimeout(B.tid);
  B.time = Date.now();
  B.style.display = "none";
}

function skip() {
  if (B.next && Date.now() - B.time > 300) {
    clear();
    B.next();
  }
}

function say(a, f, cont) {
  if (!cont && B.talking) {
    return;
  }
  clear();
  const who = a.shift(),
    what = a.shift();
  // Set this for getBoundingClientRect() to work as expected.
  B.style.left = "0px";
  B.style.top = "0px";
  B.style.display = "block";
  if (Array.isArray(what)) {
    BM.innerText = "";
    const ol = document.createElement("ol");
    what.map(function (option) {
      const text = option.text();
      if (text) {
        const li = document.createElement("li"),
          a = document.createElement("a");
        a.href = "javascript:void(0)";
        a.onclick = option.action;
        a.innerHTML = text;
        li.appendChild(a);
        ol.appendChild(li);
      }
    });
    BM.appendChild(ol);
    B.next = null;
  } else {
    BM.innerHTML = what;
    B.talking = a.length > 0 || f != null ? 1 : 0;
    B.time = Date.now();
    B.next = function () {
      if (a.length > 0) {
        say(a, f, 1);
      } else {
        clear();
        B.next = null;
        B.talking = 0;
        f && f();
      }
    };
    B.tid = setTimeout(B.next, 1000 + 200 * what.split(" ").length);
  }
  const whoRect = who.getBoundingClientRect(),
    whoRectHalfWidth = (whoRect.width / 2) | 0,
    bubbleRect = B.getBoundingClientRect(),
    bubbleRectHalfWidth = (bubbleRect.width / 2) | 0,
    margin = parseFloat(getComputedStyle(B).fontSize) | 0,
    ww = window.innerWidth,
    center = ((whoRect.x || whoRect.left) + whoRectHalfWidth) | 0;
  let x = center - bubbleRectHalfWidth;
  if (x < 0) {
    x = margin;
  } else if (x + margin + bubbleRect.width >= ww) {
    x = ww - margin - bubbleRect.width;
  }
  B.style.left = x + "px";
  B.style.top =
    (whoRect.y || whoRect.top) - bubbleRect.height - margin * 1.5 + "px";
  BP.style.left = center - margin / 2 - x + "px";
}

function info(m) {
  I.innerHTML = typeof m == "string" ? m : "&nbsp;";
}

function setHotspot(e, m, f) {
  if (hasTouch) {
    const children = e.children;
    for (let i = children.length; i--; ) {
      children[i].hoverMessage = m;
    }
    e.hoverMessage = m;
  } else {
    e.onmousemove = m
      ? function (event) {
          info(m);
          event.stopPropagation();
        }
      : null;
  }
  if (f) {
    e.onclick = f;
  }
}

function set(e, f, x, y, size, deg, hover) {
  size = size || 1;
  // Transform origin at runtime to keep sprite coordinates in the
  // 0-99 range. If the source is centered at 0/0, there are minus
  // signs that make the values a tiny bit worse to compress.
  e.style.transformOrigin = "50px 50px";
  e.style.transform = `translate(${centerX - 50 + (x || 0)}px, ${
    centerY - 50 + (y || 0)
  }px) rotateZ(${deg || 0}deg) scale(${size})`;
  e.style.visibility = "visible";
  setHotspot(e, hover);
  if (f) {
    e.onclick = function (event) {
      B.talking || f();
      event.stopPropagation();
    };
    if (hasTouch) {
      addZone(e, size);
    }
  }
}

function show(name) {
  console.log(`Scene: ${name}`);
  info();
  clear();
  for (const e of S.getElementsByTagName("g")) {
    e.style.visibility = "hidden";
    e.onclick = null;
    removeZone(e);
  }
  state.scene = name;
  scenes[name]();
  updateInventory();
}

function resize() {
  const windowWidth = window.innerWidth,
    windowHeight = window.innerHeight,
    min = Math.min(windowWidth, windowHeight),
    ratio = min / 100,
    stageWidth = windowWidth / ratio,
    stageHeight = windowHeight / ratio;

  centerX = stageWidth >> 1;
  centerY = stageHeight >> 1;

  const style = S.style;
  style.width = stageWidth + "px";
  style.height = stageHeight + "px";
  style.transformOrigin = "top left";
  style.transform = `scale(${ratio})`;
  style.display = "block";

  show(state.scene);
}

function checkSaidBagdad() {
  if (state.saidBagdad) {
    fly("Bagdad");
    state.carpetUsed = 1;
    state.saidBagdad = undefined;
  }
}

window.onload = function () {
  document.onclick = skip;
  document.onkeyup = skip;
  // Prevent pinch/zoom on iOS 11.
  if ((hasTouch = "ontouchstart" in document)) {
    document.addEventListener(
      "gesturestart",
      function (event) {
        event.preventDefault();
      },
      false,
    );
    document.addEventListener(
      "gesturechange",
      function (event) {
        event.preventDefault();
      },
      false,
    );
    document.addEventListener(
      "gestureend",
      function (event) {
        event.preventDefault();
      },
      false,
    );
    document.ontouchstart = document.ontouchmove = function (event) {
      const touches = event.touches;
      if (touches && touches.length > 0) {
        const t = touches[0],
          e = document.elementFromPoint(t.pageX, t.pageY);
        info(e && e.hoverMessage ? e.hoverMessage : null);
      }
    };
    document.ontouchend = document.ontouchcancel = info;
  } else {
    document.onmousemove = info;
  }
  window.onresize = resize;
  resize();
  checkSaidBagdad();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      checkSaidBagdad();
    }
    localStorage.state = JSON.stringify(state);
  });
};
