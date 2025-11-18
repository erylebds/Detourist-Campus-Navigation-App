// =======================
// Navbar color on scroll
// =======================
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// =======================
// Announcement modal (for static fallback cards)
// =======================
const modal = document.getElementById("announcement-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.querySelector(".modal-close-btn");

if (modal && modalTitle && modalBody && closeBtn) {
  document.querySelectorAll(".announcement-card").forEach(card => {
    card.addEventListener("click", () => {
      modalTitle.textContent = card.dataset.title;
      modalBody.textContent = card.dataset.body;
      modal.classList.add("active");
    });
  });

  closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  window.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("active");
  });
}

// =======================
// Hamburger Menu
// =======================
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("open");
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });
}

// =======================
// Map Routing
// =======================

// Only run the routing code if the elements exist (avoids errors on other pages)
const normRouteBtn = document.getElementById("norm-route");
const erRouteBtn = document.getElementById("er-route");
const sourceInput = document.getElementById("source-room");
const destInput = document.getElementById("destination-room");
const textCanvas = document.getElementById("map-text-canvas");
const lineCanvas = document.getElementById("map-line-canvas");

if (normRouteBtn && erRouteBtn && sourceInput && destInput && textCanvas && lineCanvas) {
  // ----- Route buttons -----
  normRouteBtn.addEventListener("click", () => {
    const source = String(sourceInput.value).trim();
    if (!source) {
      alert("The name of the source room was not given.");
      return;
    }

    const destination = String(destInput.value).trim();
    if (!destination) {
      alert("The name of the destination room was not given.");
      return;
    }

    if (source.toLowerCase() === destination.toLowerCase()) {
      alert("The source and the destination rooms cannot be the same.");
      return;
    }

    try {
      drawRoute(source, destination);
    } catch (err) {
      console.error(err);
      alert("There was a problem drawing the route.");
    }
  });

  erRouteBtn.addEventListener("click", () => {
    const source = String(sourceInput.value).trim();
    if (!source) {
      alert("The name of the source room was not given.");
      return;
    }

    try {
      drawEmergencyRoute(source);
    } catch (err) {
      console.error(err);
      alert("There was a problem drawing the emergency route.");
    }
  });

  // ----- Draw room labels from DB -----
  const textContext = textCanvas.getContext("2d");
  textContext.font = "15px Arial";

  // IMPORTANT: root-relative path (no ../ now)
  fetch("database/roomlabels.php")
    .then(res => res.json())
    .then(data => {
      data.forEach(roomLabel => {
        textContext.fillText(roomLabel.name, roomLabel.x_coord, roomLabel.y_coord);
      });
    })
    .catch(err => console.error("Error loading room labels:", err));

  // =======================
  // Routing functions
  // =======================

  function drawRoute(source, destination) {
    fetch("database/mapNodes.php")
      .then(res => res.json())
      .then(nodeList => {
        const startNodes = [];
        const endNodes = [];

        nodeList.forEach(node => {
          if (String(node.name).toLowerCase() === source.toLowerCase()) {
            startNodes.push(node);
          } else if (String(node.name).toLowerCase() === destination.toLowerCase()) {
            endNodes.push(node);
          }
        });

        drawBetweenEndPoints(nodeList, startNodes, endNodes, "blue");
      })
      .catch(err => {
        console.error("Error loading map nodes:", err);
        alert("Could not load map nodes from the server.");
      });
  }

  function drawEmergencyRoute(source) {
    fetch("database/mapNodes.php")
      .then(res => res.json())
      .then(nodeList => {
        const startNodes = [];
        const endNodes = [];

        nodeList.forEach(node => {
          if (String(node.name).toLowerCase() === source.toLowerCase()) {
            startNodes.push(node);
          } else if (node.type === "exit") {
            endNodes.push(node);
          }
        });

        drawBetweenEndPoints(nodeList, startNodes, endNodes, "red");
      })
      .catch(err => {
        console.error("Error loading map nodes:", err);
        alert("Could not load map nodes from the server.");
      });
  }

  // Account for rooms with multiple entrances
  function drawBetweenEndPoints(nodeList, startNodes, endNodes, lineColor) {
    if (startNodes.length === 0) {
      alert("The source room was not found.");
      return;
    }

    if (endNodes.length === 0) {
      alert("The destination room was not found.");
      return;
    }

    let { nearestStartingPoint: nearestStart, nearestEndingPoint: nearestEnd } =
      findNearestEndPoints(startNodes, endNodes);

    const visited = findShortestPath(nodeList, nearestStart.id);
    const traceBackNode = findNodeById(visited, nearestEnd.id);

    drawRouteLines(traceBackNode, lineColor);
  }

  function findNearestEndPoints(startNodes, endNodes) {
    let shortestDistance = Infinity;
    let nearestStart, nearestEnd;

    startNodes.forEach(startNode => {
      endNodes.forEach(endNode => {
        let distance = calculateDistanceBetween(startNode, endNode);
        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestStart = startNode;
          nearestEnd = endNode;
        }
      });
    });
    return { nearestStartingPoint: nearestStart, nearestEndingPoint: nearestEnd };
  }

  let points, t;
  const lineContext = lineCanvas.getContext("2d");

  function drawRouteLines(currentNode, lineColor) {
    // Clear all lines and set the color
    lineContext.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
    lineContext.strokeStyle = lineColor;

    // Get the x & y coordinates of each node and store them in order from start to end
    let vertices = [];
    while (currentNode) {
      vertices.unshift({
        x: Number(currentNode.x_coord),
        y: Number(currentNode.y_coord)
      });
      currentNode = currentNode.previous;
    }

    // Animate the drawing of the lines
    points = calcWaypoints(vertices);
    t = 1;
    animate();
  }

  function animate() {
    if (t < points.length - 1) {
      requestAnimationFrame(animate);
    }
    lineContext.beginPath();
    lineContext.moveTo(points[t - 1].x, points[t - 1].y);
    lineContext.lineTo(points[t].x, points[t].y);
    lineContext.stroke();
    t++;
  }

  // Create additional increments between the nodes for smoother animation
  function calcWaypoints(vertices) {
    const waypoints = [];
    for (let i = 1; i < vertices.length; i++) {
      const point0 = vertices[i - 1];
      const point1 = vertices[i];
      const dx = point1.x - point0.x;
      const dy = point1.y - point0.y;
      for (let j = 0; j < 5; j++) {
        waypoints.push({
          x: (point0.x + (dx * (j / 5))),
          y: (point0.y + (dy * (j / 5)))
        });
      }
    }
    return waypoints;
  }

  function findNodeById(nodeList, targetId) {
    let result;
    nodeList.forEach(node => {
      if (node.id == targetId) {
        result = node;
      }
    });
    return result;
  }

  function findShortestPath(unvisited, sourceId) {
    const visited = [];
    let currentNode;

    // Assign tentative distances to each node
    unvisited.forEach(node => {
      if (node.id == sourceId) {
        currentNode = node;
        node.distance = 0;
      } else {
        node.distance = Infinity;
      }
    });

    do {
      // For the current node, calculate the distances to all unvisited neighbors
      currentNode.adjacent_node_ids.forEach(nodeId => {
        const adjacentNode = getNodeFromId(unvisited, nodeId);
        if (adjacentNode !== undefined) {
          if (updateNodeDistance(currentNode, adjacentNode)) {
            adjacentNode.previous = currentNode;
          }
        }
      });

      // Mark current node as visited and remove from unvisited
      visited.push(currentNode);
      for (let i = 0; i < unvisited.length; i++) {
        if (unvisited[i].id == currentNode.id) {
          unvisited.splice(i, 1);
          break;
        }
      }

      currentNode = getShortestNode(unvisited);
    } while (unvisited.length > 0);

    return visited;
  }

  function getShortestNode(unvisited) {
    let shortest = Infinity;
    let nearest;
    unvisited.forEach(node => {
      if (node.distance < shortest) {
        shortest = node.distance;
        nearest = node;
      }
    });
    return nearest;
  }

  function getNodeFromId(nodeList, nodeId) {
    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].id == nodeId) {
        return nodeList[i];
      }
    }
  }

  function updateNodeDistance(currentNode, adjacentNode) {
    let newDistance = calculateDistanceBetween(currentNode, adjacentNode);
    newDistance = newDistance + calculateDistanceFromStart(currentNode);
    if (newDistance < adjacentNode.distance) {
      adjacentNode.distance = newDistance;
      return true;
    }
    return false;
  }

  function calculateDistanceFromStart(node) {
    let distance = 0;
    while (node.previous !== undefined) {
      distance += calculateDistanceBetween(node.previous, node);
      node = node.previous;
    }
    return distance;
  }

  function calculateDistanceBetween(node1, node2) {
    const x1 = node1.x_coord;
    const y1 = node1.y_coord;
    const x2 = node2.x_coord;
    const y2 = node2.y_coord;
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return Math.abs(distance);
  }

  // Helper for finding coords on canvas (debug)
  textCanvas.addEventListener('mousedown', (event) => {
    const rect = textCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log(`Clicked at: x=${x}, y=${y}`);
  });
}
