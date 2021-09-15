'use strict';

var scene,
    camera,
    renderer,
    controls,
    keyWDown = false,
    keyADown = false,
    keySDown = false,
    keyDDown = false,
    pause = false,
    idAnimFrame = null,
    world,
    night = false,
    counter = 0,
    posAtt = -9.75,
    tot = -15,
    foggyDay = false,
    numberOfJumps = 0,
    added = false,
    outrun = false,
    pickedAnimal = "Sheep",
    sp = [],
    difficulty = "Easy",
    diffModifier = 0.0,
    numLevels = 1,
    listNumCar = [],
    listSpeed = [],
    speedListWood = [];

var poleLight,
    ambientLight,
    spotLight;

var numOfLevelVisible = 4,
    numOfLevelPrec = 1, //so you will render numOfLevelVisible + numOfLevelPrec tracks
    actualLevelCamera = 0;

var mappingTracks = [];
var actualTrack = 0;
var actualListTracks = [];
var limitMax = -6;
var limitMin = -6;
var numOfFrontActiveLevels = 2;

var animal,
    sky;

var tracks = [];

var width,
    height;

var crash = false;

function startGame(chosedAnimal, dayNight, difficulty){
  pickedAnimal = chosedAnimal;
  night = (dayNight == 'true');
  setDifficulty(difficulty);
  init();
  animate();
  if(night != false){
    night = false;
    toggleNight();
  }
}

function init() {
  width = window.innerWidth,
  height = window.innerHeight;

  scene = new THREE.Scene();

  if(foggyDay){
  {
    const near = 10;
    const far = 50;
    const color = '#e6e1e2';
    scene.fog = new THREE.Fog(color, near, far);
    scene.background = new THREE.Color(color);
  }
  }
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.lookAt(scene.position);
  camera.position.set(0, 20, -15);

  tot = -15;

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enableKeys = false;
  controls.enabled = false;

  addLights();
  drawAnimal();
  drawTerrain();

  world = document.querySelector('.world');
  world.appendChild(renderer.domElement);

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('keyup', onKeyUp, true);
  window.addEventListener('resize', onResize);
}

function addLights() {
  poleLight = new PoleLight();

  spotLight = new THREE.SpotLight( 0xffffff, 1 );
  spotLight.position.set( 60, 30, 80 );
  spotLight.penumbra = 0.05;
  spotLight.decay = 2;
  spotLight.distance = 500;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 200;
  scene.add( spotLight );

  if(night){
    ambientLight = new THREE.AmbientLight( 0xffffff, 0.6 );
    scene.add( ambientLight );

    poleLight.turnOn();

    spotLight.visible = false;
    spotLight.castShadow = false;
    spotLight.angle = 0;

  }
  else{
    ambientLight = new THREE.AmbientLight( 0xffffff, 1.1 );
    scene.add( ambientLight );

    poleLight.turnOff();

    spotLight.visible = true;
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 4;
  }
}

function drawAnimal() {
  if(pickedAnimal == "Sheep"){
    animal = new Sheep();
  }
  else if (pickedAnimal == "Fox"){
    animal = new Fox();
  }
  else{
    animal = new Chicken();
  }
  scene.add(animal.group);
}

function getNewTerrain(posZ = -1){
  var track;
  var pos;
  var numLanes = [1,2,3,4];

  if(posZ == 0){
    track = new GrassStart(posAtt);
    numberOfJumps+=1;
  }
  else if(posZ == 1){
    track = new GrassEnd(posAtt);
  } else {
    if(Math.floor(Math.random()*2) == 0){
      var n = Math.floor(Math.random()*numLanes.length);
      track = new Road(posAtt, numLanes[n]);
      numberOfJumps+=n+2;
    }
    else {
      track = new River(posAtt);
      numberOfJumps+=3;
    }
  }
  pos = track.occupiedSpace*1.5;
  return {
    track: track,
    pos: pos
  };
}

function enableAllLevelObject(object){ //need a group or scene as parameter, object
  var i;
  object.traverse( function( child ) {
    for(i = 0; i < 32; i++)
      child.layers.enable( i );
  } );
}

function disableLevelToChildren(object, level){ //need a group
  object.traverse( function( child ) {
    child.layers.disable( level );
  } );
}

function enableLevelToChildren(object, level){ //need a group
  object.traverse( function( child ) {
    child.layers.enable( level );
  } );
}

function drawTerrain() {
  var i;
  var track;
  var values;

  enableAllLevelObject(scene);

  values = getNewTerrain(0);
  track = values.track;
  posAtt += values.pos;
  scene.add(track.group);
  tracks.push(track);
  mappingTracks.push(posAtt);
  limitMax = posAtt;

  for(i = 1; i < numLevels; i++){
    values = getNewTerrain();
    track = values.track;
    posAtt += values.pos;
    scene.add(track.group);
    tracks.push(track);
    mappingTracks.push(posAtt);
  }

  values = getNewTerrain(1);
  track = values.track;
  posAtt += values.pos;
  scene.add(track.group);
  tracks.push(track);
  mappingTracks.push(posAtt);

  actualListTracks = tracks.slice(0, numOfFrontActiveLevels + 1);

  //THIS DOEN'T WORK UP TO 32 LEVELS!

  var initialValue = 0;

  for(var i = 0; i < numOfLevelVisible && i < tracks.length; i++){
    disableLevelToChildren(tracks[i].group, 0);
    for(var j = initialValue; j < i + numOfLevelPrec + 1; j++)
      enableLevelToChildren(tracks[i].group, j);
  }
  for(; i < tracks.length; i++){
    initialValue++;
    disableLevelToChildren(tracks[i].group, 0);
    for(var j = initialValue; j < initialValue + numOfLevelPrec + numOfLevelVisible; j++)
      enableLevelToChildren(tracks[i].group, j);
  }

}

function onResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function onKeyDown(event) {
  switch(event.which) {
    case 87:
      keyWDown = true;
      break;
    case 65:
      keyADown = true;
      break;
    case 83:
      keySDown = true;
      break;
    case 68:
      keyDDown = true;
      break;
    default:
      // Code block
  }
}

function onKeyUp(event) {
    switch(event.which) {
    case 87:
      keyWDown = false;
      break;
    case 65:
      keyADown = false;
      break;
    case 83:
      keySDown = false;
      break;
    case 68:
      keyDDown = false;
      break;
    default:
      // Code block
  }
}

function rad(degrees) {
  return degrees * (Math.PI / 180);
}

function animate() {
  idAnimFrame = requestAnimationFrame(animate);
  render();
}

function render() {

  scene.updateMatrixWorld();
  var referencePositionAnimal = new THREE.Vector3();
  animal.boxReference.getWorldPosition(referencePositionAnimal);
  if(highestScore == numberOfJumps){
    eventMsg("You Win!");
    crash = true;
    pause = true;
  }
  if(!crash){

    if ((tot > referencePositionAnimal.z + 1.5 ) ||
      referencePositionAnimal.x >33 ||
      referencePositionAnimal.x <-33){
      crash = true;
      pause = true;
      outrun = true;
      eventMsg("Outrunned!");
    }
    else if(highestScore != 0){
      if((referencePositionAnimal.z - tot >= 0) && (highestScore < numberOfJumps)){
        tot+=diffModifier*(1+ (referencePositionAnimal.z - tot)/4);
      }
      else if (highestScore < numberOfJumps){
        tot+=diffModifier;
      }

    }
    camera.position.set(0, 15, tot); //TO UNCOMMENT

    if(referencePositionAnimal.z > limitMax){
      actualTrack++;
      limitMin = limitMax;
      limitMax = mappingTracks[actualTrack];
      actualListTracks = tracks.slice(actualTrack - 1, actualTrack + numOfFrontActiveLevels + 1);
      actualLevelCamera++;
      actualLevelCamera = actualLevelCamera % 32;
      camera.layers.set(actualLevelCamera);
      }
    if(referencePositionAnimal.z <= limitMin && actualTrack > 0){
      actualTrack--;
      limitMax = limitMin;
      limitMin = mappingTracks[actualTrack - 1];
      if(actualTrack == 0)
        actualListTracks = tracks.slice(actualTrack, actualTrack + numOfFrontActiveLevels + 1);
      else
        actualListTracks = tracks.slice(actualTrack - 1, actualTrack + numOfFrontActiveLevels + 1);

      actualLevelCamera--;
      actualLevelCamera = actualLevelCamera % 32;
      camera.layers.set(actualLevelCamera);
    }

    animal.actionOnPressKey(referencePositionAnimal);
    var lengthVehicles;
    var i, j;
    var vehicles;
    var length = actualListTracks.length;
    for(i = 0; i < length; i++){
      actualListTracks[i].doCheck(referencePositionAnimal);
      vehicles = actualListTracks[i].vehicles;
      lengthVehicles = vehicles.length;
      for(j = 0; j < lengthVehicles; j++){
        vehicles[j].goForward(referencePositionAnimal);
      }
    }
  }
  else if(pause){
    //need to be before the other controls and then crash control
  }
  else if(!splash){
    if(!outrun) animal.crashAnimation();
  }
  else{
    animal.sunkAnimation();
    activateSplash(referencePositionAnimal.z, referencePositionAnimal.x, 150);
  }
  renderer.render(scene, camera);
}

var sign1 = 1;
var sign2 = 1;
function activateSplash(posZ,posX,howMany){
  var splashParts;
  if(!added){
    for(var i = 0; i < howMany; i++){
      splashParts = new splashParticles(posZ, posX, sign1, sign2);
      enableAllLevelObject(splashParts.group);
      sp.push(splashParts);
      sign2 = sign1*sign2;
      sign1 = sign1 * -1;
      scene.add(sp[i].group);
    }
    added = true;
  }
  else{
    for(var i = 0; i < howMany; i++){
      sp[i].animateParticles();
    }
  }
}

function checkTrees(position){

  var lengthTrees;
  var i, j;
  var trees;
  var referencePosition = new THREE.Vector3();
  var length = actualListTracks.length;
  for(i = 0; i < length; i++){
    trees = actualListTracks[i].trees;
    lengthTrees = trees.length;
    for(j = 0; j < lengthTrees; j++){
      trees[j].trunk.getWorldPosition(referencePosition);
      if( (Math.abs(referencePosition.x - position.x) <= animal.sideX + trees[j].sideX) &&
          (Math.abs(referencePosition.z - position.z) <= animal.sideZ + trees[j].sideZ) ){
            return true;
          }
    }
  }
  return false;

}

const toggleBtn = document.querySelector('.toggle');
toggleBtn.addEventListener('click', toggleNight);

function toggleNight() {
  night = !night;
  toggleBtn.classList.toggle('toggle-night');
  world.classList.toggle('world-night');
  if(night){
    poleLight.turnOn();
    ambientLight.intensity = 0.6;
    spotLight.visible = false;
    spotLight.castShadow = false;
    spotLight.angle = 0;
  }
  else{
    poleLight.turnOff();
    ambientLight.intensity = 1.1;
    spotLight.visible = true;
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 4;
  }
}

var toggleMenuBtn = document.getElementById('toggle-menu');
toggleMenuBtn.addEventListener('click', toggleMenu);

function toggleMenu() {
  document.getElementById("resume").style.display = "block";
  //document.getElementById("restart").style.display = "block";
  document.getElementById("menuBtn").style.display = "block";
  document.getElementById('toggle-menu').style.display="none";
  pause = !pause;
  crash = !crash;
}

function resumeAnim() {
  pause = !pause;
  crash = !crash;
  document.getElementById("resume").style.display = "none";
  //document.getElementById("restart").style.display = "none";
  document.getElementById("menuBtn").style.display = "none";
  document.getElementById('toggle-menu').style.display="block";
}

function restartGame(){
  //cancelAnimationFrame(idAnimFrame);
  location.reload();
  pause = !pause;
  crash = !crash;
  startGame(pickedAnimal, night, difficulty);
  document.getElementById("resume").style.display = "none";
  //document.getElementById("restart").style.display = "none";
  document.getElementById("menuBtn").style.display = "none";
  document.getElementById('toggle-menu').style.display="block"
}

function eventMsg(msg) {
  pause = !pause;
  document.getElementById('toggle-menu').style.display="none";
  document.getElementById("event").style.display = "inline-block";
  document.getElementById("event").innerHTML = msg;
  //document.getElementById("restart").style.display = "block";
  document.getElementById("menuBtn").style.display = "block";
}

function setDifficulty(diff){
  if(diff == "Easy"){
    numLevels = 6;
    listNumCar = [0,2,3];
    listSpeed = [0.04, 0.05, 0.06, 0.12];
    speedListWood = [0.01, 0.02, 0.05];
    diffModifier = 0.035;
  }
  else if (diff == "Normal"){
    numLevels = 10;
    listNumCar = [1,2,3];
    listSpeed = [0.06, 0.08, 0.15];
    speedListWood = [0.03, 0.04, 0.1];
    diffModifier = 0.04;
  }
  else{
    numLevels = 16;
    listNumCar = [2,3,4];
    listSpeed = [0.15, 0.18, 0.25];
    speedListWood = [0.05, 0.06, 0.13];
    diffModifier = 0.05;
  }
}

//DECOMMENT these to skip the start page
//init();
//animate();
