/*
- Route generation (normal/emergency) with error checks
- Canvas label rendering and clickable room detection
- Popup display with room info and quick-set buttons
- Pathfinding using a Dijkstra's algorithm
- Smooth route line animation between map nodes
*/

var currentFloor = 5;
const upFloorBtn = document.getElementById("upFloor");
const downFloorBtn = document.getElementById("downFloor");

upFloorBtn.addEventListener('click', goToUpperFloor);
downFloorBtn.addEventListener('click', goToLowerFloor);

function goToUpperFloor() {
  if (currentFloor != 6) {
    currentFloor++;
  }
  updateFloorView();
}

function goToLowerFloor() {
  if (currentFloor != 4) {
    currentFloor--;
  }
  updateFloorView();
}

function updateFloorView() {
  document.getElementById("floor-number").innerHTML = currentFloor;
  document.getElementById("floor-image").src = `admin/public/assets/floors/floor${currentFloor}.png`;
  updateRoomLabels();
}

const normRouteBtn = document.getElementById("norm-route");
const erRouteBtn = document.getElementById("er-route");
const sourceInput = document.getElementById("source-room");
const destInput = document.getElementById("destination-room");

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

const textCanvas = document.getElementById("map-text-canvas");
const textContext = textCanvas.getContext("2d");
textContext.font = "15px Arial";

let mapLabelsData = [];

function updateRoomLabels() {
  const params = new URLSearchParams();
  params.append("current_floor", currentFloor);
  fetch(`client/database/roomLabels.php?${params}`)
    .then(res => res.json())
    .then(data => {
      textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);
      mapLabelsData = data;
      data.forEach(roomLabel => {
        drawRoomLabel(roomLabel.name, roomLabel.x_coord, roomLabel.y_coord);
      });
    })
    .catch(err => console.error("Error loading room labels:", err));
}

// Split long labels into multiple lines
function drawRoomLabel(name, x, y) {
  lines = name.trim().split(" ");
  lineHeight = 15;
  for (i = 0; i < lines.length; i++) {
    line = lines[i];
    if ((line.length < 5) && (i + 1 < lines.length)) {
      line = `${line} ${lines[i + 1]}`;
      textContext.fillText(line, x, y + (i * lineHeight));
      i++;
    } else {
      textContext.fillText(line, x, y + (i * lineHeight))
    }
  }
}

textCanvas.addEventListener('click', (e) => {
  const rect = textCanvas.getBoundingClientRect();

  const scaleX = textCanvas.width / rect.width;
  const scaleY = textCanvas.height / rect.height;
  const clickX = (e.clientX - rect.left) * scaleX;
  const clickY = (e.clientY - rect.top) * scaleY;

  const hitbox = 25;
  let clickedRoom = null;

  mapLabelsData.forEach(room => {
    const dist = Math.sqrt(Math.pow(room.x_coord - clickX, 2) + Math.pow(room.y_coord - clickY, 2));

    if (dist < hitbox) {
      clickedRoom = room;
    }
  });

  if (clickedRoom) {
    showPopup(clickedRoom, e.pageX, e.pageY);
  } else {
    document.getElementById('map-popup').style.display = 'none';
  }
});

function showPopup(room, pageX, pageY) {
  const popup = document.getElementById('map-popup');
  document.getElementById('popup-title').innerText = room.name;

  let info = room.building_name || "Campus";

  if (room.wing && room.wing != "0") {
    info += ` • Wing ${room.wing}`;
  }
  document.getElementById('popup-desc').innerText = info;

  const imgPath = room.room_image_path ? room.room_image_path : 'assets/backgrounds/maryheights-campus.jpg';
  document.getElementById('popup-img').src = imgPath;

  popup.style.left = (pageX + 15) + 'px';
  popup.style.top = (pageY - 100) + 'px';
  popup.style.display = 'block';

  document.getElementById('btn-set-source').onclick = function () {
    document.getElementById('source-room').value = room.name;
    popup.style.display = 'none';
  };

  document.getElementById('btn-set-dest').onclick = function () {
    document.getElementById('destination-room').value = room.name;
    popup.style.display = 'none';
  };

  document.getElementById('popup-close').onclick = function () {
    popup.style.display = 'none';
  };
}

function drawRoute(source, destination) {
  const params = new URLSearchParams();
  params.append("current_floor", currentFloor);
  fetch(`client/database/mapNodes.php?${params}`)
    .then(res => nodeList = res.json())
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
      console.error("Error getting map nodes:", err);
      alert("Could not get map nodes from the server.");
    });
}

function drawEmergencyRoute(source) {
  const params = new URLSearchParams();
  params.append("current_floor", currentFloor);
  fetch(`client/database/mapNodes.php?${params}`)
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

function drawBetweenEndPoints(nodeList, startNodes, endNodes, lineColor) {
  if (startNodes.length === 0) {
    alert("The source room was not found.");
    return;
  }

  if (endNodes.length === 0) {
    alert("The destination room was not found.");
    return;
  }

  const traceBackNode = findNearestTraceBackNode(nodeList, startNodes, endNodes);
  drawRouteLines(traceBackNode, lineColor);
}

function findNearestTraceBackNode(nodeList, startNodes, endNodes) {
  let shortestDistance = Infinity;
  let nearestTraceBackNode;

  startNodes.forEach(startNode => {
    const visited = findShortestPaths(nodeList, startNode.id);
    endNodes.forEach(endNode => {
      const traceBackNode = findNodeById(visited, endNode.id);
      let distance = traceBackNode.distance;
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestTraceBackNode = traceBackNode;
      }
    });
  });
  return nearestTraceBackNode;
}

let points, t;
const lineCanvas = document.getElementById("map-line-canvas");
const lineContext = lineCanvas.getContext("2d");

function drawRouteLines(traceBackNode, lineColor) {
  lineContext.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
  lineContext.strokeStyle = lineColor;

  let vertices = [];
  let currentNode = traceBackNode;
  while (currentNode) {
    vertices.unshift({
      x: Number(currentNode.x_coord),
      y: Number(currentNode.y_coord)
    });
    currentNode = currentNode.previous;
  }

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

function findShortestPaths(nodeList, sourceId) {
  const unvisited = cloneObject(nodeList);
  const visited = [];
  let currentNode;

  unvisited.forEach(node => {
    if (node.id == sourceId) {
      currentNode = node;
      node.distance = 0;
    } else {
      node.distance = Infinity;
    }
  });

  do {
    currentNode.adjacent_node_ids.forEach(nodeId => {
      const adjacentNode = getNodeFromId(unvisited, nodeId);
      if (adjacentNode !== undefined) {
        if (updateNodeDistance(currentNode, adjacentNode)) {
          adjacentNode.previous = currentNode;
        }
      }
    });

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

function cloneObject(object) {
  return JSON.parse(JSON.stringify(object));
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

updateFloorView();

textCanvas.addEventListener('mousedown', (event) => {
  const rect = textCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  console.log(`Clicked at: x=${x}, y=${y}`);
});
