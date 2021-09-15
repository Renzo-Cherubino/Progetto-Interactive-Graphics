//#######################
//SHEEP
//#######################
const dist = 0.095;
const speedSheepUp = 0.12;
const speedSheepDown = 0.16;
var last = 'z';
var sign = +1;
var angle = 0;
var inMotion = false;
var descending = false;
var currentScore = 0;
var highestScore = 0;
var oldPos = 0;
var crashSpeed = 0.2;
var goingFastSheep = 1.4;

var referencePosition = new THREE.Vector3();

class Sheep {
  constructor() {
    this.selected = 0;
    this.group = new THREE.Group();
    this.group.position.y = 0.4;
    this.group.position.z = -6;

    const boxReferenceWidth = 2.2;
    const boxReferenceHeight = 2.4;
    const boxReferenceDepth = 2.7;

    const boxReferenceGeometry = new THREE.BoxBufferGeometry(boxReferenceWidth, boxReferenceHeight, boxReferenceDepth);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    this.boxReference = new THREE.Mesh(boxReferenceGeometry, material);
    this.group.add(this.boxReference);

    this.boxReference.visible = false;

    this.sideX = boxReferenceWidth/2; //lato box / 2
    this.sideY = boxReferenceHeight/2;
    this.sideZ = boxReferenceDepth/2;

    this.woolMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      shading: THREE.FlatShading
    });
    this.skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xffaf8b,
      roughness: 1,
      shading: THREE.FlatShading
    });
    this.darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x4b4553,
      roughness: 1,
      shading: THREE.FlatShading
    });

    this.vAngle = 0;
    this.drawBody();
    this.drawHead();
    this.drawLegs();

    this.restHeight = this.group.position.y;

  }
  drawBody() {
    const bodyGeometry = new THREE.IcosahedronBufferGeometry(1.45, 1);
    const body = new THREE.Mesh(bodyGeometry, this.woolMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    this.group.add(body);
  }
  drawHead() {
    const head = new THREE.Group();
    head.position.set(0, 0.65, 1.3);
    head.rotation.x = rad(-30);
    this.group.add(head);

    const foreheadGeometry = new THREE.BoxBufferGeometry(0.7, 0.6, 0.7);
    const forehead = new THREE.Mesh(foreheadGeometry, this.skinMaterial);
    forehead.castShadow = true;
    forehead.receiveShadow = true;
    forehead.position.y = -0.15;
    head.add(forehead);

    const faceGeometry = new THREE.CylinderBufferGeometry(0.5, 0.15, 0.4, 4, 1);
    const face = new THREE.Mesh(faceGeometry, this.skinMaterial);
    face.castShadow = true;
    face.receiveShadow = true;
    face.position.y = -0.65;
    face.rotation.y = rad(45);
    head.add(face);

    const woolGeometry = new THREE.BoxBufferGeometry(0.80, 0.3, 0.9);
    const wool = new THREE.Mesh(woolGeometry, this.woolMaterial);
    wool.position.set(0, 0.12, 0.07);
    wool.rotation.x = rad(20);
    head.add(wool);

    const rightEyeGeometry = new THREE.CylinderBufferGeometry(0.08, 0.1, 0.06, 6);
    const rightEye = new THREE.Mesh(rightEyeGeometry, this.darkMaterial);
    //rightEye.castShadow = true;
    rightEye.receiveShadow = true;
    rightEye.position.set(0.35, -0.48, 0.35);
    rightEye.rotation.set(rad(130.8), 0, rad(-45));
    head.add(rightEye);

    const leftEye = rightEye.clone();
    leftEye.position.x = -rightEye.position.x;
    leftEye.rotation.z = -rightEye.rotation.z;
    head.add(leftEye);

    const rightEarGeometry = new THREE.BoxBufferGeometry(0.12, 0.5, 0.3);
    rightEarGeometry.translate(0, -0.25, 0);
    this.rightEar = new THREE.Mesh(rightEarGeometry, this.skinMaterial);
    //this.rightEar.castShadow = true;
    this.rightEar.receiveShadow = true;
    this.rightEar.position.set(0.35, -0.12, -0.07);
    this.rightEar.rotation.set(rad(20), 0, rad(50));
    head.add(this.rightEar);

    this.leftEar = this.rightEar.clone();
    this.leftEar.position.x = -this.rightEar.position.x;
    this.leftEar.rotation.z = -this.rightEar.rotation.z;
    head.add(this.leftEar);
  }
  drawLegs() {
    const legGeometry = new THREE.CylinderBufferGeometry(0.3, 0.15, 1, 6);
    legGeometry.translate(0, -0.40, 0);
    this.frontRightLeg = new THREE.Mesh(legGeometry, this.darkMaterial);
    this.frontRightLeg.castShadow = true;
    this.frontRightLeg.receiveShadow = true;
    this.frontRightLeg.position.set(0.7, -0.8, 0.5);
    this.frontRightLeg.rotation.x = rad(-12);
    this.group.add(this.frontRightLeg);

    this.frontLeftLeg = this.frontRightLeg.clone();
    this.frontLeftLeg.position.x = -this.frontRightLeg.position.x;
    this.frontLeftLeg.rotation.z = -this.frontRightLeg.rotation.z;
    this.group.add(this.frontLeftLeg);

    this.backRightLeg = this.frontRightLeg.clone();
    this.backRightLeg.position.z = -this.frontRightLeg.position.z;
    this.backRightLeg.rotation.x = -this.frontRightLeg.rotation.x;
    this.group.add(this.backRightLeg);

    this.backLeftLeg = this.frontLeftLeg.clone();
    this.backLeftLeg.position.z = -this.frontLeftLeg.position.z;
    this.backLeftLeg.rotation.x = -this.frontLeftLeg.rotation.x;
    this.group.add(this.backLeftLeg);
  }

  jump(speed, dist, gradi, asse) {
    this.group.rotation.y = rad(gradi);
    this.vAngle += speed*goingFastSheep;
    //check if i'm going up or down
    if(this.group.position.y >= 3 || descending){
      this.group.position.y-= Math.sin(speed)*1.5*goingFastSheep;
      descending = true;
    }
    else{
      this.group.position.y+= Math.sin(speed)*1.5*goingFastSheep;
    }

    const legRotation = Math.sin(this.vAngle) * Math.PI / 6 + 0.4;

    this.frontRightLeg.rotation.x = +legRotation;
    this.backRightLeg.rotation.x = +legRotation;
    this.frontLeftLeg.rotation.x = +legRotation;
    this.backLeftLeg.rotation.x = +legRotation;

    //had to speed up the movement since i'm using a different incremental function

    if(asse=='z') this.group.position.z = this.group.position.z + 1.6445*goingFastSheep*dist;

    if(asse=='x')this.group.position.x = this.group.position.x + 1.6445*goingFastSheep*dist;


    const earRotation = Math.sin(this.vAngle) * Math.PI / 3 + 1.5;
    this.rightEar.rotation.z = earRotation;
    this.leftEar.rotation.z = -earRotation;

    //I'm close to the terriain and i don't want to compenetrate, let's stop stalling the keyboard presses
    //and resetting to original height.
    if(this.group.position.y <= 0.4){
      inMotion = false;
      descending = false;
      this.group.position.y = 0.4;
      if(asse=='z') {
        if(sign == 1){
          this.group.position.z =oldPos + 3.75*sign;

          document.getElementById("cScore").innerHTML = currentScore;
          if(currentScore > highestScore){
            highestScore = currentScore;
            document.getElementById("hScore").innerHTML = highestScore;
          }
        }
        else{
          this.group.position.z =oldPos + 3.75*sign;
        }
      }
      if(asse=='x') {
        this.group.position.x =oldPos + 3.75*sign;
      }
    }
  }
  actionOnPressKey(referencePositionAnimal) {
    if(inMotion){
      this.jump(speedSheepDown, sign * dist, angle, last);
    }
    else{
      referencePosition.copy(referencePositionAnimal);
      if (keyWDown){
        //check su checkTrees
        referencePosition.z += 3.75;
        if( !checkTrees(referencePosition) ){

          currentScore++;

          //Resetting stuff and preparing s.t. when going to inMotion i can keep on doing what i was doing till i'm done (shish)
          inMotion = true;
          if(last != 'z'){
            var temp = this.sideX;
            this.sideX = this.sideZ;
            this.sideZ = temp;
          }
          last = 'z';
          sign = 1;
          angle = 0;
          this.vAngle = 0;
          oldPos = this.group.position.z;
          var t0 = performance.now();
          this.jump(speedSheepUp, dist, 0, 'z');
        }
      }
      else if (keySDown){
        //check su checkTrees

        referencePosition.z -= 3.75;
        if( !checkTrees(referencePosition) ){

          currentScore--;
          document.getElementById("cScore").innerHTML = currentScore;
          inMotion = true;
          if(last != 'z'){
            var temp = this.sideX;
            this.sideX = this.sideZ;
            this.sideZ = temp;
          }
          last = 'z';
          sign = -1;
          angle = 180;
          this.vAngle = 0;
          oldPos = this.group.position.z;
          this.jump(speedSheepUp, -dist, 180, 'z');
        }
      }
      else if (keyADown) {
        //check su checkTrees

        referencePosition.x += 3.75;
        if( !checkTrees(referencePosition) ){

          inMotion = true;
          if(last != 'x'){
            var temp = this.sideX;
            this.sideX = this.sideZ;
            this.sideZ = temp;
          }
          last = 'x';
          sign = 1;
          angle = 90;
          this.vAngle = 0;
          oldPos = this.group.position.x;
          this.jump(speedSheepUp, dist, 90, 'x');
        }
      }
      else if (keyDDown) {
        //check su checkTrees

        referencePosition.x -= 3.75;
        if( !checkTrees(referencePosition) ){


          inMotion = true;
          if(last != 'x'){
            var temp = this.sideX;
            this.sideX = this.sideZ;
            this.sideZ = temp;
          }
          last = 'x';
          sign = -1;
          angle = 270;
          this.vAngle = 0;
          oldPos = this.group.position.x;
          this.jump(speedSheepUp, -dist, 270, 'x');
        }
      }
    }
  }
  crashAnimation(){
    this.group.position.y+=3*crashSpeed;
    crashSpeed+=(1/8)*crashSpeed;
    this.group.rotation.y += rad(20);
    this.group.rotation.z += rad(25);
    if(this.group.position.y > 30){
      eventMsg("Hit by a car!\n GAME OVER!");
    }
  }
  sunkAnimation(){
    this.group.position.y-=4*crashSpeed;
    if(this.group.position.y < -35){
      eventMsg("Fallen in the river!\n GAME OVER!");
    }
  }

}
