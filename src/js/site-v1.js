var container;
var camera, scene, raycaster, renderer, parentTransform, sphereInter;
var mouse = new THREE.Vector2();
var el = document.getElementById('screen');
var commitDesc = document.getElementById('commit-desc');
var commitDate = document.getElementById('commit-date');
var radius = 100,
  theta = 0;
var currentIntersected;
init();
animate();

function updateInfo(i) {
  //console.log(o);
  commitDesc.innerHTML = "test";
  commitDate.innerHTML = "test2";
}

function fakeData() {
  var data = new Array(50);
  var len = data.length;
  while (len--) {
    data[len] = ({
      created_at: new Date(),
      commit: "test " + Math.random(),
      lines_added: Math.round(Math.random() * 100),
      lines_removed: Math.round(Math.random() * 100)
    })
  }
  return data;
}

function init() {
  // temporary until github
  var data = fakeData();

  container = document.createElement('div');
  el.appendChild(container);
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
  scene = new THREE.Scene();
  var geometry = new THREE.SphereGeometry(5);
  var material = new THREE.MeshBasicMaterial({
    color: 0x999999
  });
  sphereInter = new THREE.Mesh(geometry, material);
  sphereInter.visible = false;
  scene.add(sphereInter);
  var geometry = new THREE.Geometry();
  var point = new THREE.Vector3();
  var direction = new THREE.Vector3();
  // 50 would be lines length
  for (var i = 0; i < 50; i++) {
    var materialx = new THREE.LineBasicMaterial({
            color: "0xFF00FF",
            lineWidth: 1
    });
    direction.x += Math.random() - 0.5;
    direction.y += Math.random() - 0.5;
    direction.z += Math.random() - 0.5;
    direction.normalize().multiplyScalar(10);
    point.add(direction);
    geometry.vertices.push(point.clone());
  }
  parentTransform = new THREE.Object3D();
  parentTransform.position.x = Math.random() * 40 - 20;
  parentTransform.position.y = Math.random() * 40 - 20;
  parentTransform.position.z = Math.random() * 40 - 20;
  parentTransform.rotation.x = Math.random() * 2 * Math.PI;
  parentTransform.rotation.y = Math.random() * 2 * Math.PI;
  parentTransform.rotation.z = Math.random() * 2 * Math.PI;
  parentTransform.scale.x = Math.random() + 0.5;
  parentTransform.scale.y = Math.random() + 0.5;
  parentTransform.scale.z = Math.random() + 0.5;
  for (var i = 0; i < data.length /*50*/ ; i++) {
    var object;
    if (Math.random() > 0.5) {
      object = new THREE.Line(geometry);
    } else {
      object = new THREE.LineSegments(geometry);
    }
    object.position.x = Math.random() * 400 - 200;
    object.position.y = Math.random() * 400 - 200;
    object.position.z = Math.random() * 400 - 200;
    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;
    object.scale.x = Math.random() + 0.5;
    object.scale.y = Math.random() + 0.5;
    object.scale.z = Math.random() + 0.5;
    parentTransform.add(object);
  }
  scene.add(parentTransform);
  raycaster = new THREE.Raycaster();
  raycaster.linePrecision = 3;
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(0x999999, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  //
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
//
function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  theta += 0.1;
  camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
  camera.position.y = radius * Math.sin(THREE.Math.degToRad(theta));
  camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
  camera.lookAt(scene.position);
  camera.updateMatrixWorld();
  // find intersections
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(parentTransform.children, true);
  if (intersects.length > 0) {
    if (currentIntersected !== undefined) {
      currentIntersected.material.linewidth = 1;
    }
    currentIntersected = intersects[0].object;
    updateInfo(currentIntersected);
    currentIntersected.material.linewidth = 5;
    sphereInter.visible = true;
    sphereInter.position.copy(intersects[0].point);
  } else {
    if (currentIntersected !== undefined) {
      currentIntersected.material.linewidth = 1;
    }
    currentIntersected = undefined;
    sphereInter.visible = false;
  }
  renderer.render(scene, camera);
}

