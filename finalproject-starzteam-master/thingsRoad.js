const hightRoad = 0.1;
const widthRoad = 2.5;
const depthRoad = 90;
const distRoad = 1.3;
const highGrass = hightRoad;
const widthGrass = widthRoad;
const depthGrass =  depthRoad/3;
const distGrass = depthGrass;
const highRiver = hightRoad;
const widthRiver = 2*widthRoad;
const depthRiver = depthRoad;
const highWood = 3*hightRoad;
const widthWood = widthRoad-widthRoad/4;
const numWood = 6;
const depthWood = 5.0;
var splash = false;
var texture;
var texture1;

class Road {
  constructor(positionZ, numLanes) {
    this.occupiedSpace = 0;
    this.group = new THREE.Group();
    this.group.position.y = -1.35;

    this.group.position.z = positionZ;
    this.group.scale.set(1.5, 1.5, 1.5);
    this.group.rotation.y = rad(-90);

    this.materialAsphalt = new THREE.MeshPhongMaterial({
      color: 0x393D49,
      flatShading: true
    });

    this.materialLine = new THREE.MeshPhongMaterial({
      color: 0x454A59,
      flatShading: true
    });

    this.materialMiddle = new THREE.MeshPhongMaterial({
      color: 0xbaf455,
      flatShading: true
    });

    this.materialLeft = new THREE.MeshPhongMaterial({
      color: 0x99C846,
      flatShading: true
    });

    this.materialRight = new THREE.MeshPhongMaterial({
      color: 0x99C846,
      flatShading: true
    });

    this.vAngle = 0;

    this.drawParts(numLanes);

  }

  drawParts(num) {
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

    for(var i = 0; i < (num*2)-1; i++){
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

          car = new Car(animal, newSpeed, newInitial + totalDistance, newDirection);
          this.vehicles.push(car);
          this.prec.add(this.vehicles[j].group);
          j++;

          totalDistance += listDistance[Math.floor(Math.random()*listDistance.length)];

        }

        totalDistance = 0;
      }else{
        road = new THREE.Mesh(new THREE.PlaneBufferGeometry(widthRoad/4, depthRoad),  this.materialLine);
        road.position.x = distRoad;
        road.position.y = 0.07;
        road.rotateX(rad(-90));
        road.receiveShadow = true;
        this.prec.add(road);
        this.prec = road;
      }
    }
    this.trees = [];


    var tree = new Tree();
    this.rightGrass.add(tree.group);
    this.trees.push(tree);

    tree = new Tree();
    this.leftGrass.add(tree.group);
    this.trees.push(tree)
  }

  doCheck(){

  }
}

class River{
  constructor(positionZ) {
    this.occupiedSpace = 0;
    this.group = new THREE.Group();
    this.group.position.y = -1.35;
    this.group.scale.set(1.5, 1.5, 1.5);
    this.group.rotation.y = rad(90);
    this.group.position.z = positionZ;

    texture = new THREE.TextureLoader().load( "texture/waterCartoon.png" );

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 10 );
    this.materialRiver = new THREE.MeshStandardMaterial( { map: texture } );


    this.materialMiddle = new THREE.MeshPhongMaterial({
      color: 0xbaf455,
      flatShading: true
    });

    this.materialLeft = new THREE.MeshPhongMaterial({
      color: 0x99C846,
      flatShading: true
    });

    this.materialRight = new THREE.MeshPhongMaterial({
      color: 0x99C846,
      flatShading: true
    });

    this.vAngle = 0;

    this.drawParts();

  }

  drawParts() {
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

    this.river = new THREE.Mesh(new THREE.BoxBufferGeometry( widthRiver, highRiver, depthRiver),  this.materialRiver);
    this.river.receiveShadow = true;
    this.river.position.x = -0.75*widthRiver;
    this.river.position.y = -0.1;
    this.middleGrass.add(this.river);
    this.occupiedSpace += widthRiver;

    this.sideX = 1.5*depthRiver/2;
    this.sideZ = 1.5*widthRiver/2;

    this.vehicles = [];

    var listInitial = [20];
    var listDistance = [6, 7, 8, 9, 10, 11, 12];
    var newSpeed;
    var newInitial;
    var newDirection;
    var totalDistance = 0;

    var trunk;

    //First side
    if(Math.floor(Math.random()*2))
      newDirection = 1;
    else
      newDirection = -1

    newSpeed = speedListWood[Math.floor(Math.random()*speedListWood.length)];
    newInitial = newDirection*listInitial[Math.floor(Math.random()*listInitial.length)];

    var i;
    for(i = 0; i < numWood; i++){

      trunk = new Wood(1.2, newDirection, newSpeed);
      trunk.group.position.z = newInitial + totalDistance;
      this.vehicles.push(trunk);

      totalDistance += -newDirection*listDistance[Math.floor(Math.random()*listDistance.length)];

    }

    totalDistance = 0;

    //Second side
    if(Math.floor(Math.random()*2))
      newDirection = 1;
    else
      newDirection = -1

    newSpeed = speedListWood[Math.floor(Math.random()*speedListWood.length)];
    newInitial = newDirection*listInitial[Math.floor(Math.random()*listInitial.length)];

    for(i = 0; i < numWood; i++){

      trunk = new Wood(-1.2, newDirection, newSpeed);
      trunk.group.position.z = newInitial + totalDistance;
      this.vehicles.push(trunk);

      totalDistance += -newDirection*listDistance[Math.floor(Math.random()*listDistance.length)];

    }

    var length = this.vehicles.length;
    var i;
    for(i = 0; i < length; i++){
      this.river.add(this.vehicles[i].group);
    }

    this.trees = [];

    var now = -depthGrass/2+1.5;
    var tree = null;
    while(now <= depthGrass/3){
      if(Math.floor(Math.random()*2) == 0){
        tree = new Tree();
        this.rightGrass.add(tree.group);
        this.trees.push(tree);
      }
      now+=4;
    }

    now = -depthGrass/3;
    while(now <= depthGrass/2+1.5){
      if(Math.floor(Math.random()*2) == 0){
        tree = new Tree();
        this.leftGrass.add(tree.group);
        this.trees.push(tree);
      }
      now+=4;
    }

  }

  doCheck(referencePositionAnimal){

    var referencePosition = new THREE.Vector3();
    this.river.getWorldPosition(referencePosition);

    var checkIsWood = false;
    var length = this.vehicles.length;
    var i;
    for(i = 0; i < length; i++){
      checkIsWood = checkIsWood || this.vehicles[i].isWood;
    }

    if( (Math.abs(referencePosition.x - referencePositionAnimal.x) <= this.sideX) &&
        (Math.abs(referencePosition.z - referencePositionAnimal.z) <= this.sideZ) &&
        referencePositionAnimal.y <= animal.restHeight && !checkIsWood){
          crash = true;
          splash = true;
    }

  }
}

class Wood{
  constructor(posX, dir, speed){

    this.group = new THREE.Group();
    this.group.position.set(posX, 0, 0);

    texture = new THREE.TextureLoader().load( 'texture/sidelog.jpg' );
    texture1 = new THREE.TextureLoader().load( 'texture/sidelognormal.jpg' );
    var texture2 = new THREE.TextureLoader().load( 'texture/sidelogao.jpg' );

    this.materialLog = new THREE.MeshPhongMaterial({ map: texture, normalMap: texture1, aoMap : texture2} );


    this.vAngle = 0;

    this.direction = dir;

    this.speed = speed;

    this.drawParts();
  }

  drawParts() {

    this.trunk = new THREE.Mesh( new THREE.BoxBufferGeometry( widthWood, highWood, depthWood ), this.materialLog );
    //this.trunk.castShadow = true;
    this.trunk.receiveShadow = true;
    this.group.add(this.trunk);

    this.sideX = 1.5*depthWood/2;
    this.sideZ = 1.5*widthWood/2;

    this.isWood = false;

  }

  goForward(referencePositionAnimal){
    this.group.position.z += this.direction*this.speed;
    if(Math.abs(this.group.position.z) > depthRoad/2) //I can use the abs because the position is relative to the Road (not global in world coords)
      this.group.position.z = -this.group.position.z;

    var referencePosition = new THREE.Vector3();
    this.trunk.getWorldPosition(referencePosition); //OCCHIO, il sistema di riferimento world e quello locale sono diversi!!! quindi dopo una rotazione cambiano x e z
    //cambiano anche tra position.x e getWorldPosition.x

    if( (Math.abs(referencePosition.z - referencePositionAnimal.z) <= this.sideZ) &&
        (Math.abs(referencePosition.x - referencePositionAnimal.x) <= this.sideX) ){
          this.isWood = true;
          if(referencePositionAnimal.y <= animal.restHeight)
            animal.group.position.x += 1.5*this.direction*this.speed;
    }
    else {
      this.isWood = false;
    }

  }
}

const treeHeights = [1.0,1.5,2.0,2.5,3.0];
//const treePositions = [1.0,1.2,1.4,1.6,1.8,-1.0,-1.2,-1.4,-1.6,-1.8,2.0,2.2,2.4,2.6,2.8,3.0,-2.0,-2.2,-2.4,-2.6,-2.8,-3.0];
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
    this.materialTree = [
        new THREE.MeshStandardMaterial({
            map: texture2,
            normalMap : texture2n
        }),
        new THREE.MeshStandardMaterial({
            map: texture2,
            normalMap : texture2n
        }),
        new THREE.MeshStandardMaterial({
            map: texture1,
            normalMap : texture1n
        }),
        new THREE.MeshStandardMaterial({
            map: texture1,
            normalMap : texture1n
        }),
        new THREE.MeshStandardMaterial({
            map: texture2,
            normalMap : texture2n
        }),
        new THREE.MeshStandardMaterial({
            map: texture2,
            normalMap : texture2n
        })
     ];

     texture1 = new THREE.TextureLoader().load( 'texture/bush.jpg' );
     texture1n = new THREE.TextureLoader().load( 'texture/bushnormal.jpg' );
     texture2 = new THREE.TextureLoader().load( 'texture/bush2.jpg' );
     texture2n = new THREE.TextureLoader().load( 'texture/bush2normal.jpg' );

     //load texture for the tree
     this.materialCrown = [
         new THREE.MeshStandardMaterial({
             map: texture2,
             normalMap : texture2n
         }),
         new THREE.MeshStandardMaterial({
             map: texture2,
             normalMap : texture2n
         }),
         new THREE.MeshStandardMaterial({
             map: texture1,
             normalMap : texture1n
         }),
         new THREE.MeshStandardMaterial({
             map: texture1,
             normalMap : texture1n
         }),
         new THREE.MeshStandardMaterial({
             map: texture2,
             normalMap : texture2n
         }),
         new THREE.MeshStandardMaterial({
             map: texture2,
             normalMap : texture2n
         })
      ];

    this.vAngle = 0;

    this.drawParts();
  }

  drawParts() {
    this.trunk = new THREE.Mesh( new THREE.BoxBufferGeometry( 1.0, 1.0, 1.0 ), this.materialTree );
    this.trunk.position.z = -1.0;
    this.trunk.castShadow = true;
    this.trunk.receiveShadow = true;
    this.group.add(this.trunk);

    this.sideX = 0.5*1.5; //lato box / 2
    this.sideZ = 0.5*1.5;

    this.height = treeHeights[Math.floor(Math.random()*treeHeights.length)];
    var i = 0;
    while(i < this.height){
      this.crown = new THREE.Mesh( new THREE.BoxBufferGeometry( 1.5, 1.5, 1.5), this.materialCrown);
      this.crown.position.z = i;
      this.crown.castShadow = true;
      this.crown.receiveShadow = false;
      this.group.add(this.crown);
      i+=1.5;
    }

    /*
    this.worldPosition = new THREE.Vector3();
    trees[j].trunk.getWorldPosition(this.worldPosition);
    */
  }
}

class PoleLight {

  constructor(){

    this.materialPole = new THREE.MeshPhongMaterial({
      color: 0x808080,
      flatShading: true
    });

    const heightPole = 5.0;
    const sidePole = 0.2;

    this.pole = new THREE.Mesh( new THREE.BoxBufferGeometry( sidePole, heightPole, sidePole ), this.materialPole );
    this.pole.position.set(-5, heightPole/2, -8);
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
    this.spotLight.target.position.set(-5, -2, 0);

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

    this.materialMiddle = new THREE.MeshPhongMaterial({
      color: 0xbaf455,
      flatShading: true
    });

    this.materialLeft = new THREE.MeshPhongMaterial({
      color: 0x99C846,
      flatShading: true
    });

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

    this.materialMiddle = new THREE.MeshPhongMaterial({
      color: 0x99C846,
      flatShading: true
    });

    this.vAngle = 0;

    this.drawParts();


    // load a texture, set wrap mode to repeat
    /*
     *   var texture = new THREE.TextureLoader().load( "grass.jpg" );
     *   texture.wrapS = THREE.RepeatWrapping;
     *   texture.wrapT = THREE.RepeatWrapping;
     *   texture.repeat.set( 4, 4 );*/

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
      /*if(i == 5){
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
      }*/
    }
  }

  doCheck(){

  }
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

class splashParticles{
  constructor(positionZ,positionX, signX, signZ) {
    this.group = new THREE.Group();

    this.group.position.y = Math.log(0.36);
    this.group.position.z = positionZ;
    this.group.position.x = positionX;
    this.mySpeed =Math.random() * 0.7 + 0.3;
    this.signX = signX ;
    this.signZ = signZ ;

    this.group.scale.set(1.5, 1.5, 1.5);
    this.materialRiver = new THREE.MeshPhongMaterial({
      color: 0xF7E7C,

      flatShading: true
    });

    this.drawParts();
  }

  drawParts() {
      const particleGeometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
      this.particle = new THREE.Mesh( particleGeometry, this.materialRiver );
      this.particle.position.z = this.signZ * Math.random()*3;
      this.particle.position.x = this.signX * Math.random()*3;
      this.particle.castShadow = true;
      this.particle.receiveShadow = true;
      this.group.add(this.particle);
    }


  animateParticles(){
      if(this.group.position.y > 5){
        this.mySpeed = -this.mySpeed;
      }
      this.group.position.y += this.mySpeed;
      this.group.position.x += 0.1*this.signX/3;
      this.group.position.z += 0.1*this.signZ/3;
    }
  }
