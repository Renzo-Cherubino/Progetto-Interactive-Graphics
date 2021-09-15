//#######################
//FOX
//#######################

const size = 1;
var inMotion = false;
var descending = false;
var state = "ahead";
var counter = 0;
var currentScore = 0;
var highestScore = 0;
var legRotation = 0;
var oldPos = 0;
var goingFastFox = 2;

var referencePosition = new THREE.Vector3();

class Fox{
  constructor(){
    this.group = new THREE.Group();
    this.group.position.y = -0.31;
    this.group.position.z = -6;
    this.restHeight = this.group.position.y;

    const boxReferenceWidth = 0.6*size;
    const boxReferenceHeight = 1*size;
    const boxReferenceDepth = 2*size;

    const boxReferenceGeometry = new THREE.BoxBufferGeometry(boxReferenceWidth, boxReferenceHeight, boxReferenceDepth);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    this.boxReference = new THREE.Mesh(boxReferenceGeometry, material);
    this.boxReference.position.set(0, -0.2, 0);
    this.group.add(this.boxReference);

    this.boxReference.visible = false;

    this.sideX = boxReferenceWidth/2; //lato box / 2
    this.sideY = boxReferenceHeight/2;
    this.sideZ = boxReferenceDepth/2;

    this.skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4500,
      roughness: 1,
      shading: THREE.FlatShading
    });
    this.whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      shading: THREE.FlatShading
    });
    this.orangeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffa500,
      roughness: 1,
      shading: THREE.FlatShading
    });
    this.blackMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 1,
      shading: THREE.FlatShading
    });
    this.drawBody();
    this.drawHead();
    this.drawLegs();
  }
  drawBody() {
    const bodyGeometry = new THREE.BoxBufferGeometry(0.5*size, 0.5*size, 1.2  *size);
    this.body = new THREE.Mesh(bodyGeometry, this.skinMaterial);
    this.body.castShadow = true;
    this.body.receiveShadow = true;
    this.group.add(this.body);

    const tailGeometry = new THREE.BoxBufferGeometry(0.23*size, 0.23*size, 0.7*size);
    this.tail = new THREE.Mesh(tailGeometry, this.skinMaterial);
    this.tail.receiveShadow = true;
    this.tail.castShadow = true;

    this.tail.position.set(0*size, 0.035*size, -0.9*size);
    this.tail.rotation.set(rad(-15), 0, 0);
    this.group.add(this.tail);

    const tailEndGeometry = new THREE.BoxBufferGeometry(0.23*size, 0.23*size, 0.2*size);
    const tailEnd = new THREE.Mesh(tailEndGeometry, this.whiteMaterial);
    tailEnd.receiveShadow = true;
    tailEnd.castShadow = true;

    tailEnd.position.set(0, 0, -0.45*size);
    this.tail.add(tailEnd);

  }
  drawHead() {
    const headGeometry = new THREE.BoxBufferGeometry(0.6*size, 0.4*size, 0.4*size);
    const head = new THREE.Mesh(headGeometry, this.skinMaterial);
    head.receiveShadow = true;
    head.castShadow = true;

    head.position.set(0*size, 0.1*size,0.8*size);
    this.group.add(head);

    const noseGeometry = new THREE.BoxBufferGeometry(0.35*size, 0.15*size, 0.2*size);
    const nose = new THREE.Mesh(noseGeometry, this.skinMaterial);
    nose.receiveShadow = true;
    //nose.castShadow = true;
    nose.position.set(0*size, -0.1*size, 0.25*size);
    head.add(nose);

    const noseEndGeometry = new THREE.BoxBufferGeometry(0.2*size, 0.05*size, 0.01*size);
    const noseEnd = new THREE.Mesh(noseEndGeometry, this.blackMaterial);
    noseEnd.receiveShadow = true;
    noseEnd.position.set(0, 0.05*size, 0.1*size);
    nose.add(noseEnd);

    //Ears
    const leftEarGeometry = new THREE.BoxBufferGeometry(0.2*size, 0.2*size, 0.05*size);
    const leftEar = new THREE.Mesh(leftEarGeometry, this.whiteMaterial);
    leftEar.receiveShadow = true;
    //leftEar.castShadow = true;
    leftEar.position.set(0.15*size, 0.3*size, 0.1*size);
    leftEar.rotation.set(0, rad(15), 0);
    head.add(leftEar);

    const additionalLeftEarGeometry = new THREE.BoxBufferGeometry(0.06*size, 0.24*size, 0.06*size);
    const additionalLeftEar = new THREE.Mesh(additionalLeftEarGeometry, this.skinMaterial);
    additionalLeftEar.receiveShadow = true;
    //additionalLeftEar.castShadow = true;
    additionalLeftEar.position.set(-0.08*size, 0*size, 0);
    leftEar.add(additionalLeftEar);

    const additionalLeftEar2Geometry = new THREE.BoxBufferGeometry(0.05*size, 0.2*size, 0.05*size);
    const additionalLeftEar2 = new THREE.Mesh(additionalLeftEar2Geometry, this.skinMaterial);
    additionalLeftEar2.receiveShadow = true;
    //additionalLeftEar2.castShadow = true;
    additionalLeftEar2.position.set(0.09*size, 0.12*size, 0);
    additionalLeftEar2.rotation.set(0, 0, rad(90));
    additionalLeftEar.add(additionalLeftEar2);

    const rightEarGeometry = new THREE.BoxBufferGeometry(0.2*size, 0.2*size, 0.05*size);
    const rightEar = new THREE.Mesh(rightEarGeometry, this.whiteMaterial);
    rightEar.receiveShadow = true;
    //rightEar.castShadow = true;
    rightEar.position.set(-0.15*size, 0.3*size, 0.1*size);
    rightEar.rotation.set(0, rad(-15), 0);
    head.add(rightEar);

    const additionalRightEarGeometry = new THREE.BoxBufferGeometry(0.06*size, 0.24*size, 0.06*size);
    const additionalRightEar = new THREE.Mesh(additionalRightEarGeometry, this.skinMaterial);
    additionalRightEar.receiveShadow = true;
    //additionalRightEar.castShadow = true;
    additionalRightEar.position.set(+0.08*size, 0.0*size, 0);
    rightEar.add(additionalRightEar);

    const additionalRightEar2Geometry = new THREE.BoxBufferGeometry(0.06*size, 0.2*size, 0.06*size);
    const additionalRightEar2 = new THREE.Mesh(additionalRightEar2Geometry, this.skinMaterial);
    additionalRightEar2.receiveShadow = true;
    //additionalRightEar2.castShadow = true;
    additionalRightEar2.position.set(-0.09*size, 0.12*size, 0);
    additionalRightEar2.rotation.set(0, 0, rad(90));
    additionalRightEar.add(additionalRightEar2);

    //Eyes
    const leftEyeGeometry =new THREE.BoxBufferGeometry(0.05*size, 0.05*size, 0.05*size);
    const leftEye = new THREE.Mesh(leftEyeGeometry, this.blackMaterial);
    leftEye.receiveShadow = true;
    leftEye.position.set(0.15*size, 0.1*size, 0.2*size);
    head.add(leftEye);

    const rightEyeGeometry = new THREE.BoxBufferGeometry(0.05*size, 0.05*size, 0.05*size)
    const rightEye = new THREE.Mesh(rightEyeGeometry, this.blackMaterial);
    rightEye.receiveShadow = true;
    rightEye.position.set(-0.15*size, 0.1*size, 0.2*size);
    head.add(rightEye);
  }
  drawLegs() {

    //Right Front Leg
    const rightBackLegGeometry = new THREE.BoxBufferGeometry(0.2*size, 0.4*size, 0.2*size);
    this.rightBackLeg = new THREE.Mesh(rightBackLegGeometry, this.skinMaterial);
    this.rightBackLeg.receiveShadow = true;
    this.rightBackLeg.castShadow = true;
    this.rightBackLeg.position.set(-0.25*size, -0.3*size, -0.45*size);
    this.group.add(this.rightBackLeg);

    const rightBackDownLegGeometry = new THREE.BoxBufferGeometry(0.2*size, 0.4*size, 0.2*size);
    this.rightBackDownLeg = new THREE.Mesh(rightBackDownLegGeometry, this.blackMaterial);
    this.rightBackDownLeg.receiveShadow = true;
    this.rightBackDownLeg.castShadow = true;
    this.rightBackDownLeg.position.set(0, -0.4*size, 0);
    this.rightBackLeg.add(this.rightBackDownLeg);

    const rightBackPawGeometry = new THREE.BoxBufferGeometry(0.2*size, 0.1*size, 0.2*size);
    const rightBackPaw = new THREE.Mesh(rightBackPawGeometry, this.whiteMaterial);
    rightBackPaw.receiveShadow = true;
    //rightBackPaw.castShadow = true;
    rightBackPaw.position.set(0, -0.25*size, 0);
    this.rightBackDownLeg.add(rightBackPaw);

    //rightFrontLeg
    const rightFrontLegGeometry = new THREE.BoxBufferGeometry(0.2*size, 0.4*size, 0.2*size);
    this.rightFrontLeg = new THREE.Mesh(rightFrontLegGeometry, this.skinMaterial);
    this.rightFrontLeg.receiveShadow = true;
    this.rightFrontLeg.castShadow = true;
    this.rightFrontLeg.position.set(-0.25*size, -0.3*size, +0.45*size);
    this.group.add(this.rightFrontLeg);

    const rightFrontDownLegGeometry = new THREE.BoxBufferGeometry(0.2*size, 0.4*size, 0.2*size);
    this.rightFrontDownLeg = new THREE.Mesh(rightFrontDownLegGeometry, this.blackMaterial);
    this.rightFrontDownLeg.receiveShadow = true;
    this.rightFrontDownLeg.castShadow = true;
    this.rightFrontDownLeg.position.set(0.0*size, -0.4*size, 0.0*size);
    this.rightFrontLeg.add(this.rightFrontDownLeg);

    const rightFrontPawGeometry = new THREE.BoxBufferGeometry(0.2*size, 0.1*size, 0.2*size);
    const rightFrontPaw = new THREE.Mesh(rightFrontPawGeometry, this.whiteMaterial);
    rightFrontPaw.receiveShadow = true;
    //rightFrontPaw.castShadow = true;
    rightFrontPaw.position.set(0, -0.25*size, 0);
    this.rightFrontDownLeg.add(rightFrontPaw);

    //Left Back Leg
    const leftBackLegGeometry = new THREE.BoxBufferGeometry(0.2*size, 0.4*size, 0.2*size);
    this.leftBackLeg = new THREE.Mesh(leftBackLegGeometry, this.skinMaterial);
    this.leftBackLeg.receiveShadow = true;
    this.leftBackLeg.castShadow = true;
    this.leftBackLeg.position.set(0.25*size, -0.3*size, -0.45*size);
    this.group.add(this.leftBackLeg);

    const leftBackDownLegGeometry = new THREE.BoxBufferGeometry(0.2*size, 0.4*size, 0.2*size);
    this.leftBackDownLeg = new THREE.Mesh(leftBackDownLegGeometry, this.blackMaterial);
    this.leftBackDownLeg.receiveShadow = true;
    this.leftBackDownLeg.castShadow = true;
    this.leftBackDownLeg.position.set(0*size, -0.4*size, -0.0*size);
    this.leftBackLeg.add(this.leftBackDownLeg);

    const leftBackPawGeometry = new THREE.BoxBufferGeometry(0.2*size, 0.1*size, 0.2*size);
    const leftBackPaw = new THREE.Mesh(leftBackPawGeometry, this.whiteMaterial);
    leftBackPaw.receiveShadow = true;
    //leftBackPaw.castShadow = true;
    leftBackPaw.position.set(0, -0.25*size, 0);
    this.leftBackDownLeg.add(leftBackPaw);

    //Left Front Leg
    const leftFrontLegGeometry = new THREE.BoxBufferGeometry(0.2*size, 0.4*size, 0.2*size);
    this.leftFrontLeg = new THREE.Mesh(leftFrontLegGeometry, this.skinMaterial);
    this.leftFrontLeg.receiveShadow = true;
    this.leftFrontLeg.castShadow = true;
    this.leftFrontLeg.position.set(0.25*size, -0.3*size, +0.45*size);
    this.group.add(this.leftFrontLeg);

    const leftFrontDownLegGeometry = new THREE.BoxBufferGeometry(0.2*size, 0.4*size, 0.2*size);
    this.leftFrontDownLeg = new THREE.Mesh(leftFrontDownLegGeometry, this.blackMaterial);
    this.leftFrontDownLeg.receiveShadow = true;
    this.leftFrontDownLeg.castShadow = true;
    this.leftFrontDownLeg.position.set(0.0*size, -0.4*size, 0.0*size);
    this.leftFrontLeg.add(this.leftFrontDownLeg);

    const leftFrontPawGeometry = new THREE.BoxBufferGeometry(0.2*size, 0.1*size, 0.2*size);
    const leftFrontPaw = new THREE.Mesh(leftFrontPawGeometry, this.whiteMaterial);
    leftFrontPaw.receiveShadow = true;
    //leftFrontPaw.castShadow = true;
    leftFrontPaw.position.set(0, -0.25*size, 0);
    this.leftFrontDownLeg.add(leftFrontPaw);
}

jump(speed, direction) {
    if(this.group.position.y >= 1.2 || descending){
      this.group.position.y-= Math.sin(speed)*1.5*goingFastFox;
      descending = true;
    }
    else{
      this.group.position.y+= Math.sin(speed)*1.5*goingFastFox;
    }

    if(direction == "ahead"){
      if(counter == 0|| counter == 34){
        this.group.rotation.x = 0;
        this.group.rotation.z = 0;
        legRotation = 0;
      }
      else if (counter <=16){
        this.group.rotation.x-=Math.PI*(goingFastFox/8)*(1/16) ;
      }
      else if(this.group.rotation.x < 0) {
        this.group.rotation.x+=Math.PI*(goingFastFox/8) *(1/16);
      }
    }
    else if (direction == "behind"){
      if(counter == 0|| counter == 34){
        this.group.rotation.x = 0;
        this.group.rotation.z = 0;

        legRotation = 0;
      }
      else if (counter <=16){
        this.group.rotation.x+=Math.PI*(goingFastFox/8)*(1/16) ;
      }
      else if(this.group.rotation.x > 0) {
        this.group.rotation.x-=Math.PI*(goingFastFox/8) *(1/16);
      }
    }
    else if (direction == "right" || direction == "left"){
      if(counter == 0|| counter == 34){
        this.group.rotation.z = 0;
        this.group.rotation.x = 0;
        legRotation = 0;
      }
      else if (counter <=16){
        this.group.rotateOnAxis(new THREE.Vector3(1,0,0) , -Math.PI*(goingFastFox/8)*(1/16));
      }
      else if(this.group.rotation.x < 0) {
        this.group.rotateOnAxis(new THREE.Vector3(1,0,0) , +Math.PI*(goingFastFox/8)*(1/16))
      }
    }

    if(counter == 0 || counter >=33){
      legRotation = 0;
      //Since javascript despites floats, gotta reset manually
      this.leftFrontLeg.rotation.x = 0;
      this.leftFrontDownLeg.rotation.x = 0;

      this.rightFrontLeg.rotation.x = 0;
      this.rightFrontDownLeg.rotation.x = 0;

      this.rightBackLeg.rotation.x = 0;
      this.rightBackDownLeg.rotation.x = 0;

      this.leftBackLeg.rotation.x = 0;
      this.leftBackDownLeg.rotation.x = 0;
    }
    else if(counter <=16){
      legRotation = Math.PI*(1/4)*(1/16) * goingFastFox;
    }
    else{
      legRotation = (-1)*Math.PI*(1/4)*(1/16) * goingFastFox;
    }

    counter+=2;

    this.leftFrontLeg.rotation.x += legRotation;
    this.leftFrontDownLeg.rotation.x += legRotation;

    this.rightFrontLeg.rotation.x += legRotation;
    this.rightFrontDownLeg.rotation.x += legRotation;

    this.rightBackLeg.rotation.x += legRotation;
    this.rightBackDownLeg.rotation.x += legRotation;

    this.leftBackLeg.rotation.x += legRotation;
    this.leftBackDownLeg.rotation.x += legRotation;

    if(direction == "ahead"){
      this.group.position.z = this.group.position.z + 0.11*goingFastFox;
    }
    else if (direction == "behind"){
      this.group.position.z = this.group.position.z - 0.11*goingFastFox;
    }
    else if(direction == "right"){
      this.group.position.x = this.group.position.x - 0.11*goingFastFox;
    }
    else if (direction == "left"){
      this.group.position.x = this.group.position.x + 0.11*goingFastFox;
    }

    //resets the postion, since js and floats are not great friends
    if(this.group.position.y <= -0.31){
      this.group.position.y = -0.31;
      if(direction == "ahead"){
        this.group.position.z = oldPos + 3.75;
        document.getElementById("cScore").innerHTML = currentScore;
        if(currentScore > highestScore){
          highestScore = currentScore;
          document.getElementById("hScore").innerHTML = highestScore;}
      }
      else if (direction == "behind"){
        this.group.position.z = oldPos - 3.75;
      }
      else if(direction == "right"){
        this.group.position.x = oldPos - 3.75;
      }
      else if (direction == "left"){
        this.group.position.x = oldPos + 3.75;
      }

      inMotion = false;
      descending = false;
    }
  }

actionOnPressKey(referencePositionAnimal) {

    if(inMotion){
      this.jump(0.06, state);  //keep it going till the jump is complete, we don't want the animation to stop mid-air, neither the user to press too many buttons together
    }
    else{
      referencePosition.copy(referencePositionAnimal);

      if (keyWDown){
        referencePosition.z += 3.75;
        if( !checkTrees(referencePosition) ){

        currentScore++;

        inMotion = true;
        this.group.rotation.y = 0;
        if(state != 'ahead' && state != 'behind'){
          var temp = this.sideX;
          this.sideX = this.sideZ;
          this.sideZ = temp;
        }
        state = "ahead";
        counter = 0;
        oldPos = this.group.position.z;
        this.jump(0.06, state);
        }
      }
      else if (keyDDown){
        referencePosition.x -= 3.75;
        if( !checkTrees(referencePosition) ){
          if(state != 'left' && state != 'right'){
            var temp = this.sideX;
            this.sideX = this.sideZ;
            this.sideZ = temp;
          }
          state = "right";
          inMotion = true;
          this.group.rotation.y = Math.PI*3/2;
          counter = 0;
          oldPos = this.group.position.x;
          this.jump(0.06, state);
        }
      }
      else if (keyADown){
        referencePosition.x += 3.75;
        if( !checkTrees(referencePosition) ){
          inMotion = true;
          if(state != 'left' && state != 'right'){
            var temp = this.sideX;
            this.sideX = this.sideZ;
            this.sideZ = temp;
          }
          state = "left";
          this.group.rotation.y = Math.PI/2;
          counter = 0;
          oldPos = this.group.position.x;
          this.jump(0.06, state);
        }
      }
    else if (keySDown){
      referencePosition.z -= 3.75;
      if( !checkTrees(referencePosition) ){
        currentScore--;
        document.getElementById("cScore").innerHTML = currentScore;
        inMotion = true;
        this.group.rotation.y = Math.PI;
        if(state != 'ahead' && state != 'behind'){
          var temp = this.sideX;
          this.sideX = this.sideZ;
          this.sideZ = temp;
        }
        state = "behind";
        counter = 0;
        oldPos = this.group.position.z;
        this.jump(0.06, state);
      }
    }
  }
}
crashAnimation(){
  this.group.position.y+=3*crashSpeed;
  crashSpeed+=(1/8)*crashSpeed;
  this.group.rotation.y += rad(15 );
  this.group.rotation.z += rad(10);
  if(this.group.position.y > 20){
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
