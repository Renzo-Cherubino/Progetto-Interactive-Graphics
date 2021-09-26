//#######################
//OldLady
//#######################
const speedUp = 0.12;
const speedDown = 0.16;
var last = 'z';
var sign = +1;
var inMotion = false;
var descending = false;
var currentScore = 0;
var highestScore = 0;
var contatore = 0;
var tot = 0;
var legRotation = 0;
var leftArmRotation = 0;
var rightArmRotation = 0;
var oldPos = 0;
var goingFastOldLady = 1.4; 
var step = 0;
var step_iter = 0;

var referencePosition = new THREE.Vector3();

class OldLady{

  constructor(){
    this.group = new THREE.Group();
    this.group.position.y = -0.55; //x++ right with respect of the camera, y++ height to the high, z++ front closer to the camera (x, y, z)
    this.group.position.z = -6;

    const boxReferenceWidth = 0.8;
    const boxReferenceHeight = 1.2;
    const boxReferenceDepth = 1;

    const boxReferenceGeometry = new THREE.BoxBufferGeometry(boxReferenceWidth, boxReferenceHeight, boxReferenceDepth);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    this.boxReference = new THREE.Mesh(boxReferenceGeometry, material);
    this.group.add(this.boxReference);

    this.boxReference.visible = false;

    this.sideX = boxReferenceWidth/2;
    this.sideY = boxReferenceHeight/2;
    this.sideZ = boxReferenceDepth/2;

    this.skinMaterial = new THREE.MeshStandardMaterial({color: 0xf9d9ae, roughness: 1, shading: THREE.FlatShading});
    this.pinkMaterial = new THREE.MeshStandardMaterial({color: 0xff66ff, roughness: 1, shading: THREE.FlatShading});
    this.blackMaterial = new THREE.MeshStandardMaterial({color: 0x1a1a1a, roughness: 1, shading: THREE.FlatShading});
    this.redMaterial = new THREE.MeshStandardMaterial({color: 0xff0000, roughness: 1, shading: THREE.FlatShading});
    this.orangeMaterial = new THREE.MeshStandardMaterial({color: 0xffa500, roughness: 1, shading: THREE.FlatShading});
    this.eyeMaterial = new THREE.MeshStandardMaterial({color: 0x4b4553, roughness: 1, shading: THREE.FlatShading});
    this.hairMaterial = new THREE.MeshStandardMaterial({color: 0xbdb8af, roughness: 1, shading: THREE.FlatShading});

    this.vAngle = 0;
    this.restHeight = this.group.position.y;

    this.drawBody();
    this.drawHead();
    this.drawLegs();
  }

  drawBody() {
    const bodyGeometry = new THREE.BoxBufferGeometry(1.4, 1.2, 1.1);
    const body = new THREE.Mesh(bodyGeometry, this.pinkMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.set(0, 1.5, 0);
    this.group.add(body);

    const skirtGeometry = new THREE.BoxBufferGeometry(1.39, 0.85, 1.09);
    this.skirt = new THREE.Mesh(skirtGeometry, this.redMaterial);
    //this.skirt.castShadow = true;
    this.skirt.receiveShadow = true;
    this.skirt.position.set(0, -1, 0);
    body.add(this.skirt);

    /////////////////// DA RINOMINARE
    const leftWingGeometry = new THREE.BoxBufferGeometry(0.2, 1, 0.2);
    leftWingGeometry.applyMatrix( new THREE.Matrix4().makeTranslation(0.8, -0.6, 0.2) );
    this.leftWing = new THREE.Mesh(leftWingGeometry, this.pinkMaterial);
    //this.leftArm.castShadow = true;
    this.leftWing.receiveShadow = true;
    this.leftWing.position.set(0, 0.3, 0);
    //body.add(this.leftWing);
    ///////////this.leftWing.applyMatrix(new THREE.Matrix4().makeTranslation( 0, 1, 0 ));
    ///////////this.leftArmMesh = new THREE.Mesh(this.leftWing, this.pinkMaterial);
    body.add(this.leftWing);
    ///////////body.add(this.leftArmMesh);  

    const rightWingGeometry = new THREE.BoxBufferGeometry(0.2, 1, 0.2);
    this.rightWing = new THREE.Mesh(rightWingGeometry, this.pinkMaterial);
    //this.rightArm.castShadow = true;
    this.rightWing.receiveShadow = true;
    this.rightWing.position.set(-0.8, -0.1, 0.7);
    this.rightWing.rotation.x = -240;
    body.add(this.rightWing);

    const leftHandGeometry = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2);
    this.leftHand = new THREE.Mesh(leftHandGeometry, this.skinMaterial);
    //this.leftArm.castShadow = true;
    this.leftHand.receiveShadow = true;
    this.leftHand.position.set(0.8, -1.2, 0.2);
    this.leftWing.add(this.leftHand);

    const rightHandGeometry = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2);
    this.rightHand = new THREE.Mesh(rightHandGeometry, this.skinMaterial);
    //this.rightArm.castShadow = true;
    this.rightHand.receiveShadow = true;
    this.rightHand.position.set(0, -0.6, 0);
    this.rightWing.add(this.rightHand);

    const stickGeometry = new THREE.BoxBufferGeometry(0.19, 1.8, 0.19);
    this.stick = new THREE.Mesh(stickGeometry, this.blackMaterial);
    //this.rightArm.castShadow = true;
    this.stick.receiveShadow = true;
    this.stick.position.set(0, -0.3, -0.8);
    this.stick.rotation.x = -1.9;
    this.rightHand.add(this.stick);
  }

  drawHead() {
    const headGeometry = new THREE.BoxBufferGeometry(0.65, 0.65, 0.65);
    const head = new THREE.Mesh(headGeometry, this.skinMaterial);
    head.castShadow = true;
    head.receiveShadow = true;
    head.position.set(0, 2.2, 0.5);
    this.group.add(head);

    const hair1Geometry = new THREE.BoxBufferGeometry(0.7, 0.2, 0.85);
    const hair1 = new THREE.Mesh(hair1Geometry, this.hairMaterial);
    hair1.castShadow = true;
    hair1.receiveShadow = true;
    hair1.position.set(0, 0.4, -0.1);
    head.add(hair1);

    const hair2Geometry = new THREE.BoxBufferGeometry(0.7, 1, 0.2);
    const hair2 = new THREE.Mesh(hair2Geometry, this.hairMaterial);
    hair2.castShadow = true;
    hair2.receiveShadow = true;
    hair2.position.set(0, 0, -0.45);
    head.add(hair2);

    const onionGeometry = new THREE.BoxBufferGeometry(0.3, 0.3, 0.3);
    const onion = new THREE.Mesh(onionGeometry, this.hairMaterial);
    onion.castShadow = true;
    onion.receiveShadow = true;
    onion.position.set(0, 0.7, -0.4);
    head.add(onion);

    const leftEyeGeometry = new THREE.BoxBufferGeometry(0.05, 0.05, 0.05);
    const leftEye = new THREE.Mesh(leftEyeGeometry, this.eyeMaterial);
    //leftEye.castShadow = true;
    leftEye.receiveShadow = true;
    leftEye.position.set(0.17, 0.1, 0.35);
    head.add(leftEye);

    const rightEyeGeometry = new THREE.BoxBufferGeometry(0.05, 0.05, 0.05);
    const rightEye = new THREE.Mesh(rightEyeGeometry, this.eyeMaterial);
    //rightEye.castShadow = true;
    rightEye.receiveShadow = true;
    rightEye.position.set(-0.17, 0.1, 0.35);
    head.add(rightEye);

  }

  drawLegs() {
    const leftLegGeometry = new THREE.BoxBufferGeometry(0.2, 1.5, 0.35);
    this.leftLeg = new THREE.Mesh(leftLegGeometry, this.blackMaterial);
    this.leftLeg.castShadow = true;
    this.leftLeg.receiveShadow = true;
    this.leftLeg.position.set(0.4, 0, 0);
    this.group.add(this.leftLeg);

    const rightLegGeometry = new THREE.BoxBufferGeometry(0.2, 1.5, 0.35);
    this.rightLeg = new THREE.Mesh(rightLegGeometry, this.blackMaterial);
    this.rightLeg.castShadow = true;
    this.rightLeg.receiveShadow = true;
    this.rightLeg.position.set(-0.4, 0, 0);   
    this.group.add(this.rightLeg);

  }

  jump(speed, dist, asse) {
    this.vAngle += speed * goingFastOldLady;

    //check if i'm going up or down
    if(this.group.position.y >= 3 || descending){
      this.group.position.y-= Math.sin(speed)*1.2 * goingFastOldLady;
      descending = true;
      legRotation = (-33 * Math.PI / 180 /19 ) * goingFastOldLady;
      leftArmRotation = (-63 * Math.PI / 180 /19 ) * goingFastOldLady;
      //rightArmRotation = (-33 * Math.PI / 180 /19 ) * goingFastOldLady;
    }
    else{
      legRotation  = (33 * Math.PI / 180 /19 ) * goingFastOldLady;
      leftArmRotation = (63 * Math.PI / 180 /19 ) * goingFastOldLady ;
      //rightArmRotation = (-33 * Math.PI / 180 /19 ) * goingFastOldLady;
      this.group.position.y+= Math.sin(speed)*1.2 * goingFastOldLady;
    }

    if(step) {
      this.rightLeg.rotation.x += legRotation;
      this.leftLeg.rotation.x -= legRotation;
      this.leftWing.rotation.x += leftArmRotation;
    }
    else {
      this.rightLeg.rotation.x -= legRotation;
      this.leftLeg.rotation.x += legRotation;
      this.leftWing.rotation.x -= leftArmRotation;
    }

    step_iter = step_iter + 1;
    console.log(step_iter);
    if (step_iter==28) {
      step = !step;
      step_iter = 0;
    }

    //had to speed up the movement since i'm using a different incremental function
    if(asse=='z') this.group.position.z = this.group.position.z + 1.0387*dist*goingFastOldLady;

    if(asse=='x') this.group.position.x = this.group.position.x + 1.0387*dist*goingFastOldLady;

    //////////////// DA ELIMINARE
    /////////////const wingRotation = Math.sin(this.vAngle) * Math.PI / 3 + 1.5;
    /////////////this.leftWing.rotation.z = -wingRotation;

    //I'm close to the terriain and i don't want to compenetrate, let's stop stalling the keyboard presses
    //and resetting to original height.
    if(this.group.position.y <= -0.55){
      inMotion = false;
      descending = false;
      this.group.position.y = -0.55;
      this.rightWing.rotation.z = 0;
      this.leftWing.rotation.z = 0;
      this.rightLeg.rotation.x = 0;
      this.leftLeg.rotation.x = 0;
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
      if(asse=='x') this.group.position.x =oldPos + 3.75*sign;
    }
  }

  actionOnPressKey(referencePositionAnimal) {
    if(inMotion){
      this.jump(speedDown, sign * dist, last);
    }
    else{
      referencePosition.copy(referencePositionAnimal);

      if (keyWDown){
        //check su checkTrees

        referencePosition.z += 3.75;
        if( !checkTrees(referencePosition) ){
          currentScore++;
          document.getElementById("cScore").innerHTML = currentScore;
          if(currentScore > highestScore){
            highestScore = currentScore;
            document.getElementById("hScore").innerHTML = highestScore;
          }
          //Resetting stuff and preparing s.t. when going to inMotion i can keep on doing what i was doing till i'm done (shish)
          inMotion = true;
          if(last != 'z'){
            var temp = this.sideX;
            this.sideX = this.sideZ;
            this.sideZ = temp;
          }
          last = 'z';
          sign = 1;
          this.vAngle = 0;
          this.group.rotation.y = rad(0);
          oldPos = this.group.position.z;
          this.jump(speedUp, dist, 'z');
          
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
          this.vAngle = 0;
          this.group.rotation.y = rad(180);
          oldPos = this.group.position.z;
          this.jump(speedUp, -dist, 'z');
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
          this.vAngle = 0;
          this.group.rotation.y = rad(90);
          oldPos = this.group.position.x;
          this.jump(speedUp, dist, 'x');
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
          this.vAngle = 0;
          this.group.rotation.y = rad(270);
          oldPos = this.group.position.x;
          this.jump(speedUp, -dist, 'x');
        }
      }
    }
  }

  crashAnimation(){
    this.group.position.y+=crashSpeed;
    crashSpeed+=(1/8)*crashSpeed;
    this.group.rotation.y += rad(15 );
    this.group.rotation.z += rad(10);
    if(this.group.position.y > 20){
      eventMsg("Hit by a car!\n GAME OVER!");
    }
  }
}
