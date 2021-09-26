const hightRoad = 0.1;
const widthRoad = 2.5;
const depthRoad = 90;
const distRoad = 1.3;
const highGrass = hightRoad;
const widthGrass = widthRoad;
const depthGrass =  depthRoad/3;
const distGrass = depthGrass;
var flag = false;
var texture;
var texture1;
var flagPoleLight = 0;

class Road {
  constructor(posZ, numLanes) {
    this.occupiedSpace = 0;
    this.group = new THREE.Group();
    this.group.position.y = -1.35;

    this.group.position.z = posZ;
    this.group.scale.set(1.5, 1.5, 1.5);
    this.group.rotation.y = rad(-90);

    this.materialAsphalt = new THREE.MeshPhongMaterial({color: 0x393D49, flatShading: true});
    this.materialLine = new THREE.MeshPhongMaterial({color: 0xf0f0f0, flatShading: true });
    this.materialMiddle = new THREE.MeshPhongMaterial({color: 0x8f7971, flatShading: true});
    this.materialLeft = new THREE.MeshPhongMaterial({color: 0x8f7971, flatShading: true});
    this.materialRight = new THREE.MeshPhongMaterial({color: 0x8f7971, flatShading: true});

    this.vAngle = 0;

    this.drawParts(numLanes, posZ);

  }

  drawParts(numLanes, posZ) {
    this.middleGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( widthGrass, highGrass, depthGrass), this.materialMiddle);
    this.middleGrass.receiveShadow = true;
    this.group.add(this.middleGrass);

    this.leftGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( widthGrass, highGrass, depthGrass), this.materialLeft);
    this.leftGrass.position.z = - distGrass;
    this.leftGrass.receiveShadow = true;
    this.middleGrass.add(this.leftGrass);

    this.rightGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( widthGrass, highGrass, depthGrass), this.materialRight);
    this.rightGrass.position.z = distGrass;
    this.rightGrass.receiveShadow = true;
    this.middleGrass.add(this.rightGrass);

    this.occupiedSpace += widthGrass;

    this.prec = this.middleGrass;
    this.vehicles = [];
    var road = null;
    var j = 0;

    var listInitial = [-20, -25, -30, -35, -40]; //add 5 to every body if car are too close
    var listDistance = [5, 10, 15];
    var newSpeed;
    var newInitial;
    var newDirection;
    var totalDistance = 0;

    var k;
    var car;

    for(var i = 0; i < (numLanes*2)-1; i++){
      if(i%2 == 0){
        var road = new THREE.Mesh(new THREE.BoxBufferGeometry( widthRoad, hightRoad, depthRoad),  this.materialAsphalt);
        if(i>0){
          road.position.x = widthRoad/2-0.05;
          road.rotateX(rad(90));
          road.position.z = -0.07;
        } else road.position.x = widthRoad;
        road.receiveShadow = true;
        this.prec.add(road);
        this.prec = road;
        this.occupiedSpace += widthRoad;

        newSpeed = listSpeed[Math.floor(Math.random()*listSpeed.length)];
        newInitial = listInitial[Math.floor(Math.random()*listInitial.length)];
        if(Math.floor(Math.random()*2))
          newDirection = 1;
        else
          newDirection = -1

        var numCarPerStreet = listNumCar[Math.floor(Math.random()*listNumCar.length)];

        for(k = 0; k < numCarPerStreet; k++){

          car = new Car(character, newSpeed, newInitial + totalDistance, newDirection);
          this.vehicles.push(car);
          this.prec.add(this.vehicles[j].group);
          j++;

          totalDistance += listDistance[Math.floor(Math.random()*listDistance.length)];

        }

        totalDistance = 0;
      }
      else{
        road = new THREE.Mesh(new THREE.PlaneBufferGeometry(widthRoad/4, depthRoad),  this.materialLine);
        road.position.x = distRoad;
        road.position.y = 0.07;
        road.rotateX(rad(-90));
        road.receiveShadow = true;
        this.prec.add(road);
        this.prec = road;
      }

      for (let i=0; i<numLanes; i++){
        var tunnel = new Tunnel(posZ, i);
        this.prec.add(tunnel.trunk);
      }
    }
    
    this.trees = [];
    var tree = new Tree();
    this.rightGrass.add(tree.group);
    this.trees.push(tree);
  }

  doCheck(){

  }
}


class RoadWithPoleLights {
  constructor(posZ, numLanes) {
    this.occupiedSpace = 0;
    this.group = new THREE.Group();
    this.group.position.y = -1.35;

    this.group.position.z = posZ;
    this.group.scale.set(1.5, 1.5, 1.5);
    this.group.rotation.y = rad(-90);

    this.materialAsphalt = new THREE.MeshPhongMaterial({color: 0x393D49, flatShading: true});
    this.materialLine = new THREE.MeshPhongMaterial({color: 0xf0f0f0, flatShading: true });
    this.materialMiddle = new THREE.MeshPhongMaterial({color: 0xbaf455, flatShading: true});
    this.materialLeft = new THREE.MeshPhongMaterial({color: 0x99C846, flatShading: true});
    this.materialRight = new THREE.MeshPhongMaterial({color: 0x99C846, flatShading: true});

    this.vAngle = 0;

    this.drawParts(numLanes, posZ);

  }

  drawParts(numLanes, posZ) {
    this.middleGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( widthGrass, highGrass, depthGrass), this.materialMiddle);
    this.middleGrass.receiveShadow = true;
    this.group.add(this.middleGrass);

    this.leftGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( widthGrass, highGrass, depthGrass), this.materialLeft);
    this.leftGrass.position.z = - distGrass;
    this.leftGrass.receiveShadow = true;
    this.middleGrass.add(this.leftGrass);

    this.rightGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( widthGrass, highGrass, depthGrass), this.materialRight);
    this.rightGrass.position.z = distGrass;
    this.rightGrass.receiveShadow = true;
    this.middleGrass.add(this.rightGrass);

    this.occupiedSpace += widthGrass;

    this.prec = this.middleGrass;
    this.vehicles = [];
    var road = null;
    var j = 0;

    var listInitial = [-20, -25, -30, -35, -40]; //add 5 to every body if car are too close
    var listDistance = [5, 10, 15];
    var newSpeed;
    var newInitial;
    var newDirection;
    var totalDistance = 0;

    var k;
    var car;

    for(var i = 0; i < (numLanes*2)-1; i++){
      if(i%2 == 0){
        var road = new THREE.Mesh(new THREE.BoxBufferGeometry( widthRoad, hightRoad, depthRoad),  this.materialAsphalt);
        if(i>0){
          road.position.x = widthRoad/2-0.05;
          road.rotateX(rad(90));
          road.position.z = -0.07;
        } else road.position.x = widthRoad;
        road.receiveShadow = true;
        this.prec.add(road);
        this.prec = road;
        this.occupiedSpace += widthRoad;

        newSpeed = listSpeed[Math.floor(Math.random()*listSpeed.length)];
        newInitial = listInitial[Math.floor(Math.random()*listInitial.length)];
        if(Math.floor(Math.random()*2))
          newDirection = 1;
        else
          newDirection = -1

        var numCarPerStreet = listNumCar[Math.floor(Math.random()*listNumCar.length)];

        for(k = 0; k < numCarPerStreet; k++){

          car = new Car(character, newSpeed, newInitial + totalDistance, newDirection);
          this.vehicles.push(car);
          this.prec.add(this.vehicles[j].group);
          j++;

          totalDistance += listDistance[Math.floor(Math.random()*listDistance.length)];

        }

        totalDistance = 0;
      }
      else{
        road = new THREE.Mesh(new THREE.PlaneBufferGeometry(widthRoad/4, depthRoad),  this.materialLine);
        road.position.x = distRoad;
        road.position.y = 0.07;
        road.rotateX(rad(-90));
        road.receiveShadow = true;
        this.prec.add(road);
        this.prec = road;
      }

      for (let i=0; i<numLanes; i++){
        var tunnel = new Tunnel(posZ, i);
        this.prec.add(tunnel.trunk);
      }
    }

    flagPoleLight = flagPoleLight+1;
    console.log(flagPoleLight);
    if(flagPoleLight % 3 == 0) {
      poleLight = new PoleLight(posZ);
      this.prec.add(poleLight.pole);
    }

    this.trees = [];
    var tree = new Tree();
    this.rightGrass.add(tree.group);
    this.trees.push(tree);
  }

  doCheck(){

  }
}


const treeHeights = [1.0,1.5,2.0,2.5,3.0];
const treePositions = [1.0,1.4,1.8,-1.0,-1.4,-1.8,2.0,2.4,2.8,3.0,-2.0,-2.4,-2.8,-3.0];

class Tree {
  constructor(positionZ = -1) {
    this.group = new THREE.Group();
    this.group.position.y = 2.3;
    if(positionZ == -1) this.group.position.z = treePositions[Math.floor(Math.random()*treePositions.length)];
    else this.group.position.z = positionZ
    this.group.scale.set(1.5, 1.5, 1.5);
    this.group.rotation.x = rad(-90);

    var texture1 = new THREE.TextureLoader().load( 'texture/treebark.jpg' );
    var texture1n = new THREE.TextureLoader().load( 'texture/treebarknormal.jpg' );
    var texture2 = new THREE.TextureLoader().load( 'texture/treebark2.jpg' );
    var texture2n = new THREE.TextureLoader().load( 'texture/treebark2normal.jpg' );

    //load texture for the tree
    this.materialTree = [new THREE.MeshStandardMaterial({map: texture2, normalMap : texture2n}),
        new THREE.MeshStandardMaterial({map: texture2, normalMap : texture2n}),
        new THREE.MeshStandardMaterial({map: texture1, normalMap : texture1n}),
        new THREE.MeshStandardMaterial({map: texture1, normalMap : texture1n}),
        new THREE.MeshStandardMaterial({map: texture2, normalMap : texture2n}),
        new THREE.MeshStandardMaterial({map: texture2, normalMap : texture2n})];

     texture1 = new THREE.TextureLoader().load( 'texture/bush.jpg' );
     texture1n = new THREE.TextureLoader().load( 'texture/bushnormal.jpg' );
     texture2 = new THREE.TextureLoader().load( 'texture/bush2.jpg' );
     texture2n = new THREE.TextureLoader().load( 'texture/bush2normal.jpg' );

     //load texture for the tree
     this.materialCrown = [new THREE.MeshStandardMaterial({map: texture2, normalMap : texture2n}),
         new THREE.MeshStandardMaterial({map: texture2, normalMap : texture2n}),
         new THREE.MeshStandardMaterial({map: texture1, normalMap : texture1n}),
         new THREE.MeshStandardMaterial({map: texture1, normalMap : texture1n}),
         new THREE.MeshStandardMaterial({map: texture2, normalMap : texture2n}),
         new THREE.MeshStandardMaterial({map: texture2, normalMap : texture2n})];

    this.vAngle = 0;

    this.drawParts();
  }

  drawParts() {
    this.trunk = new THREE.Mesh( new THREE.BoxBufferGeometry( 1.0, 1.0, 3.0 ), this.materialTree );
    this.trunk.position.z = -1.0;
    this.trunk.castShadow = true;
    this.trunk.receiveShadow = true;
    this.group.add(this.trunk);

    this.sideX = 0.5*1.5; //lato box / 2
    this.sideZ = 0.5*1.5;

    this.height = treeHeights[Math.floor(Math.random()*treeHeights.length)];
    var i = 0;
    this.crown = new THREE.Mesh( new THREE.BoxBufferGeometry( 1.5, 1.5, 1.5), this.materialCrown);
    this.crown.position.z = 1;
    this.crown.castShadow = true;
    this.crown.receiveShadow = false;
    this.group.add(this.crown);
  }
}

class Tunnel {
  constructor(posZ, i) {
    this.materialTunnel = new THREE.MeshPhongMaterial({color: 0x000000, flatShading: true});
    const heightTunnel = 4;
    const widthTunnel = 2.5;
    this.drawParts(posZ, i, widthTunnel, heightTunnel);
  }

  drawParts(posZ, i, widthTunnel, heightTunnel) {
    this.trunk = new THREE.Mesh(new THREE.BoxBufferGeometry(widthTunnel, heightTunnel, 0.3), this.materialTunnel);
    this.trunk.position.x = 0; //  + i*3.5
    this.trunk.position.y = 1;
    this.trunk.position.z = -22.5;
    this.trunk.castShadow = false;
    this.trunk.receiveShadow = false;
  }
}

class Wall {
  constructor(){

    texture = new THREE.TextureLoader().load( 'texture/brickwall2.png' ); //brickwall2.jpg
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 40, 1 );

    this.materialWall = new THREE.MeshPhongMaterial({ map: texture }); //

    const heightWall = 4.5;
    const widthWall = 400;
    const depthWall = 0.5;

    this.wall = new THREE.Mesh( new THREE.BoxBufferGeometry( widthWall, heightWall+5, depthWall ), this.materialWall );
    this.wall.position.set(34, heightWall/2+2, 200);
    this.wall.castShadow = true;
    this.wall.receiveShadow = true;
    this.wall.rotation.set(0, rad(-90), 0)
    this.wall.scale.set(1.5, 1.5, 1.5);
    scene.add(this.wall);
  }
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

class PoleLight {

  constructor(posZ){

    this.materialPole = new THREE.MeshPhongMaterial({
      color: 0x808080,
      flatShading: true
    });

    const heightPole = 5.0;
    const sidePole = 0.2;
    const i = randomIntFromInterval(1, 6);

    this.pole = new THREE.Mesh( new THREE.BoxBufferGeometry( sidePole, heightPole, sidePole ), this.materialPole );
    this.pole.position.set(2.5, heightPole/2, -20);   ////////// posZ, heightPole/2, 1
    this.pole.castShadow = true;
    this.pole.receiveShadow = true;
    this.pole.rotation.set(0, rad(-90), 0)
    this.pole.scale.set(1.5, 1.5, 1.5);
    scene.add(this.pole);

    this.poleHead = new THREE.Mesh( new THREE.BoxBufferGeometry( 0.8, 0.3, 0.5 ), this.materialPole );
    this.poleHead.position.set(sidePole/2 + 0.3/2, heightPole/2, 0);
    //this.poleHead.castShadow = true; //occhio, se è attivo spegni la luce!!!
    this.poleHead.receiveShadow = true;
    this.pole.add(this.poleHead);

    
    this.spotLight = new THREE.SpotLight( 0xffffff, 0.6 );
    this.spotLight.position.set( 0, 0, 0 );
    this.spotLight.angle = Math.PI / 4;
    this.spotLight.penumbra = 0.05;
    this.spotLight.decay = 2;
    this.spotLight.distance = 500;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.spotLight.shadow.camera.near = 0.1;
    this.spotLight.shadow.camera.far = 200;
    this.poleHead.add( this.spotLight );

    scene.add(this.spotLight.target);
    this.spotLight.target.position.set(-100, 0, posZ);

  }

  turnOff(){
    //this.spotLight.color = 0x000000;
    this.spotLight.visible = false;
    this.spotLight.castShadow = false;
    this.spotLight.angle = 0;
  }
  turnOn(){
    this.spotLight.visible = true;
    this.spotLight.castShadow = true;
    this.spotLight.angle = Math.PI / 4;
  }
  
}














class GrassStart {
  constructor(positionZ) {
    this.occupiedSpace = 0;
    this.group = new THREE.Group();
    this.group.rotation.y = rad(-90);
    this.group.position.y = -1.35;
    this.group.position.z = positionZ;
    this.group.scale.set(1.5, 1.5, 1.5);

    this.materialMiddle = new THREE.MeshPhongMaterial({color: 0x8f7971, flatShading: true});

    this.materialLeft = new THREE.MeshPhongMaterial({color: 0x8f7971, flatShading: true});

    this.vAngle = 0;

    this.drawParts();


    // load a texture, set wrap mode to repeat
    /*
    var texture = new THREE.TextureLoader().load( "grass.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 4, 4 );*/

    this.vehicles = [];
  }

  drawParts() {
    this.trees = [];
    var prev = null;
    for(var i=0; i<2; i++){
      this.middleGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( 2*widthGrass, highGrass, depthGrass), this.materialMiddle);
      if(i==0) this.middleGrass.position.x = widthGrass/2;
      else this.middleGrass.position.x = -(2*widthGrass-widthGrass/2.25);
      this.middleGrass.receiveShadow = true;
      if(prev != null) prev.add(this.middleGrass);
      else this.group.add(this.middleGrass);
      prev = this.middleGrass;

      this.leftGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( 2*widthGrass, highGrass, depthGrass), this.materialLeft);
      this.leftGrass.position.z = - distGrass;
      this.leftGrass.receiveShadow = true;
      this.middleGrass.add(this.leftGrass);

      this.rightGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( 2*widthGrass, highGrass, depthGrass), this.materialLeft);
      this.rightGrass.position.z = distGrass;
      this.rightGrass.receiveShadow = true;
      this.middleGrass.add(this.rightGrass);

      this.occupiedSpace += widthGrass;

      var now = -depthGrass*2-(depthGrass-1.8)/2;
      var tree = null;
      while(now < (depthGrass-1.5)/2){
        tree = new Bush(now);
        tree.group.position.y = 3;
        tree.group.position.x = -2;
        this.rightGrass.add(tree.group);
        this.trees.push(tree);
        now+=4;
      }
    }
  }

  doCheck(){

  }
}

class GrassEnd {
  constructor(positionZ) {
    this.occupiedSpace = 0;
    this.group = new THREE.Group();
    this.group.rotation.y = rad(90);
    this.group.position.y = -1.35;
    this.group.position.z = positionZ;
    this.group.scale.set(1.5, 1.5, 1.5);

    this.materialMiddle = new THREE.MeshPhongMaterial({color: 0x8f7971, flatShading: true});
    this.materialHouse = new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true});

    this.vAngle = 0;

    this.drawParts();

    this.vehicles = [];
  }

  drawParts() {
    this.trees = [];
    var prev = null;

    for(var i=0; i<9; i++){
      this.middleGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( 2*widthGrass, highGrass, depthGrass), this.materialMiddle);
      if(i==0) this.middleGrass.position.x = -widthGrass/2;
      else this.middleGrass.position.x = -(2*widthGrass-widthGrass/2.25);
      this.middleGrass.receiveShadow = true;
      if(prev != null) prev.add(this.middleGrass);
      else this.group.add(this.middleGrass);
      prev = this.middleGrass;

      this.leftGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( 2*widthGrass, highGrass, depthGrass), this.materialMiddle);
      this.leftGrass.position.z = - distGrass;
      this.leftGrass.receiveShadow = true;
      this.middleGrass.add(this.leftGrass);

      this.rightGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( 2*widthGrass, highGrass, depthGrass), this.materialMiddle);
      this.rightGrass.position.z = distGrass;
      this.rightGrass.receiveShadow = true;
      this.middleGrass.add(this.rightGrass);

      this.occupiedSpace += widthGrass;
    }
  }
  doCheck(){}
}

const bushHeights = [3.0,3.2,3.5,3.8,4.0];
class Bush{
  constructor(positionZ = -1) {
    this.group = new THREE.Group();
    if(positionZ == -1) this.group.position.z = treePositions[Math.floor(Math.random()*treePositions.length)];
    else this.group.position.z = positionZ
      this.group.scale.set(1.5, 1.5, 1.5);
    this.group.rotation.x = rad(-90);

    texture = new THREE.TextureLoader().load( 'texture/bush.jpg' );
    texture1 = new THREE.TextureLoader().load( 'texture/bushnormal.jpg' );


    this.material = new THREE.MeshStandardMaterial( { map: texture, normalMap: texture1 });

    this.vAngle = 0;

    this.drawParts();
  }

  drawParts() {
    this.height = bushHeights[Math.floor(Math.random()*bushHeights.length)];

    this.sideX = ((this.height+1)/3)*1.5; //lato box / 2
    this.sideZ = ((this.height+1)/3)*1.5;

    this.trunk = new THREE.Mesh( new THREE.DodecahedronBufferGeometry(this.height/3, 1), this.material);
    this.trunk.position.z = -this.height/2;
    //this.trunk.castShadow = true;
    this.trunk.receiveShadow = false;
    this.group.add(this.trunk);
  }
}

