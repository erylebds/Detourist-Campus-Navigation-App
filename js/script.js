// Navbar color on scroll
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// Announcement modal
const modal = document.getElementById("announcement-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.querySelector(".modal-close-btn");

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

// ===== Hamburger Menu =====
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

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



// ===== Map Routing =====
// Draw route based on user input
document.getElementById("norm-route").addEventListener("click", () => {
  const source = String(document.getElementById("source-room").value).trim();
  if (!source) {
    alert("The name of the source room was not given.");
    return;
  }

  const destination = String(document.getElementById("destination-room").value).trim();
  if (!destination) {
    alert("The name of the destination room was not given.");
    return;
  }

  if (source == destination) {
    alert("The source and the destination rooms cannot be the same.");
    return;
  }

  try {
    drawRoute(source, destination);
  } catch (err) {
    alert(err);
  }
});

document.getElementById("er-route").addEventListener("click", () => {
  const source = String(document.getElementById("source-room").value).trim();
  if (!source) {
    alert("The name of the source room was not given.");
    return;
  }

  try {
    drawEmergencyRoute(source);
  } catch (err) {
    alert(err);
  }
})

// Get label names and coordinates from the database then draw the labels on the map
var textCanvas = document.getElementById("map-text-canvas");
var textContext = textCanvas.getContext("2d");
textContext.font = "15px Arial";
fetch("database/roomLabels.php")
  .then(res => res.json())
  .then(data => {
    data.forEach(roomLabel => {
      textContext.fillText(roomLabel.name, roomLabel.x_coord, roomLabel.y_coord);
    });
  });

function drawRoute(source, destination) {
  fetch("database/mapNodes.php")
    .then(res => res.json())
    .then(nodeList => {
      const startNodes = [];
      const endNodes = [];

      nodeList.forEach(node => {
        if (String(node.name).toLowerCase() == source.toLowerCase()) {
          startNodes.push(node);
        } else if (String(node.name).toLowerCase() == String(destination).toLowerCase()) {
          endNodes.push(node);
        }
      });

      drawBetweenEndPoints(nodeList, startNodes, endNodes, "blue");
    });
}

function drawEmergencyRoute(source) {
  fetch("database/mapNodes.php")
    .then(res => res.json())
    .then(nodeList => {
      const startNodes = [];
      const endNodes = [];

      nodeList.forEach(node => {
        if (String(node.name).toLowerCase() == source.toLowerCase()) {
          startNodes.push(node);
        } else if (node.type == "exit") {
          endNodes.push(node);
        }
      });

      drawBetweenEndPoints(nodeList, startNodes, endNodes, "red");
    });
}

// Account for rooms with multiple entrances
function drawBetweenEndPoints(nodeList, startNodes, endNodes, lineColor) {
  if (startNodes.length == 0) {
    alert("The source room was not found.");
    return;
  }

  if (endNodes.length == 0) {
    alert("The destination room was not found.");
    return;
  }

  let nearestEndPoints = findNearestEndPoints(startNodes, endNodes);
  let nearestStart = nearestEndPoints.nearestStartingPoint;
  let nearestEnd = nearestEndPoints.nearestEndingPoint;

  const visited = findShortestPath(nodeList, nearestStart.id,);
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

var points, t;
var lineCanvas = document.getElementById("map-line-canvas");
var lineContext = lineCanvas.getContext("2d");
function drawRouteLines(currentNode, lineColor) {
  // Clear all lines and set the color
  lineContext.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
  lineContext.strokeStyle = lineColor;

  // Get the x & y coordinates of each node and store them in order from start to end
  let vertices = [];
  while (currentNode) {
    // Unshift instead of push because we are going backwards from the end node
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
  // draw a line segment from the last waypoint
  // to the current waypoint
  lineContext.beginPath();
  lineContext.moveTo(points[t - 1].x, points[t - 1].y);
  lineContext.lineTo(points[t].x, points[t].y);
  lineContext.stroke();
  // increment "t" to get the next waypoint
  t++;
}

// Create additional increments between the nodes for smoother animation
function calcWaypoints(vertices) {
  var waypoints = [];
  for (var i = 1; i < vertices.length; i++) {
    var point0 = vertices[i - 1];
    var point1 = vertices[i];
    var dx = point1.x - point0.x; // Change in x
    var dy = point1.y - point0.y; // Change in y
    for (var j = 0; j < 5; j++) {
      waypoints.push({
        x: (point0.x + (dx * (j / 5))),
        y: (point0.y + (dy * (j / 5)))
      });
    }
  }
  return (waypoints);
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
  let visited = [];
  let currentNode;

  // Assign tentative distances to each node
  unvisited.forEach(node => {
    if (node.id == sourceId) {
      currentNode = node;
      node.distance = 0;
      startSelected = true;
    } else {
      node.distance = Infinity;
    }
  });

  do {
    // For the current node, calculate the distances to all unvisited neighbors
    currentNode.adjacent_node_ids.forEach(nodeId => {
      const adjacentNode = getNodeFromId(unvisited, nodeId);
      if (adjacentNode != undefined) {
        // If the new distance is shorter, replace the old distance
        if (updateNodeDistance(currentNode, adjacentNode)) {
          // Store current node as the previous node if the neighbor's distance was updated
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

    // Get the unvisited node with the shortest distance
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

function nodeIsVisited(node, visited) {
  for (let i = 0; i < visited.length; i++) {
    if (visited[i].id == node.id) {
      return true;
    }
  }
  return false;
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
  while (node.previous != undefined) {
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
  const distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
  // Ensure the distance is positive
  if (distance < 0) {
    return distance * -1;
  }
  return distance;
}

// Temporary function for help in finding coordinates (to be removed later)
// Click on map then check console for coordinates
textCanvas.addEventListener('mousedown', (event) => {
  const rect = textCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  console.log(`Clicked at: x=${x}, y=${y}`);
});

