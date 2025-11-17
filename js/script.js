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
  const source = document.getElementById("source-room").value;
  const destination = document.getElementById("destination-room").value;
  clearLines();
  drawRoute(source, destination);
});

document.getElementById("er-route").addEventListener("click", () => {
  const source = document.getElementById("source-room").value;
  clearLines();
  drawEmergencyRoute(source);
})

// Get label names and coordinates from the database then draw the labels on the map
var c = document.getElementById("map-text-canvas");
var ctx = c.getContext("2d");
ctx.font = "15px Arial";
fetch("database/roomLabels.php")
  .then(res => res.json())
  .then(data => {
    data.forEach(roomLabel => {
      ctx.fillText(roomLabel.name, roomLabel.x_coord, roomLabel.y_coord);
    });
  });

/* Uncomment code below to visualize the map nodes */
// fetch("database/mapNodes.php")
//   .then(res => res.json())
//   .then(data => {
//     data.forEach(mapNode => {
//       ctx.fillStyle = "red";
//       ctx.fillRect(mapNode.x_coord, mapNode.y_coord, 3, 3);
//     });
//   });

function clearLines() {
  const canvas = document.getElementById("map-line-canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawRoute(source, destination) {
  fetch("database/mapNodes.php")
    .then(res => res.json())
    .then(nodeList => {
      const startNodes = [];
      const endNodes = [];

      nodeList.forEach(node => {
        if (String(node.name).toLowerCase() == String(source).toLowerCase()) {
          startNodes.push(node);
        } else if (node.name == destination) {
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
        if (String(node.name).toLowerCase() == String(source).toLowerCase()) {
          startNodes.push(node);
        } else if (node.type == "exit") {
          endNodes.push(node);
        }
      });

      drawBetweenEndPoints(nodeList, startNodes, endNodes, "red");
    });
}

function drawBetweenEndPoints(nodeList, startNodes, endNodes, lineColor) {
  // Account for rooms with multiple entrances
  let nearestEndPoints = findNearestEndPoints(startNodes, endNodes);
  let nearestStart = nearestEndPoints.nearestStartingPoint;
  let nearestEnd = nearestEndPoints.nearestEndingPoint;

  const visited = findShortestPath(nodeList, nearestStart.id,);
  const traceBackNode = findNodeById(visited, nearestEnd.id);

  drawRouteLines(nearestStart.id, traceBackNode, lineColor);
}

function findNearestEndPoints(startNodes, endNodes) {
  let shortestDistance = Infinity;
  let nearestStart;
  let nearestEnd;

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

function drawRouteLines(startNodeId, currentNode, lineColor) {
  const canvas = document.getElementById("map-line-canvas");
  const ctx = canvas.getContext("2d");
  while (currentNode.id != startNodeId) {
    ctx.beginPath();
    ctx.moveTo(currentNode.x_coord, currentNode.y_coord);
    ctx.lineTo(currentNode.previous.x_coord, currentNode.previous.y_coord);
    ctx.strokeStyle = lineColor;
    ctx.stroke();
    currentNode = currentNode.previous;
  }
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

function findShortestPath(nodeList, sourceId) {
  let unvisited = nodeList;
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
c.addEventListener('mousedown', (event) => {
  const rect = c.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  console.log(`Clicked at: x=${x}, y=${y}`);
});

