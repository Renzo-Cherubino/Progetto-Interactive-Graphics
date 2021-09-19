import { GLTFLoader } from 'GLTFLoader.js';

const dist = 0.095;
const sharkSheepUp = 0.12;
const sharkSheepDown = 0.16;
var last = 'z';
var sign = +1;
var angle = 0;
var inMotion = false;
var descending = false;
var currentScore = 0;
var highestScore = 0;
var oldPos = 0;
var crashSpeed = 0.2;
var goingFastShark = 1.4;

var referencePosition = new THREE.Vector3();


class shark{
    constructor(){


    const loader = new GLTFLoader();
    loader.load('./models/shark.glb',
	
	function ( gltf ) {

		scene.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
	
	function ( xhr ) {console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );},
	
	function ( error ) {console.log( 'An error happened' );}
    );

    this.selected = 0;
    this.group = new THREE.Group();
    this.group.position.y = 0.4;
    this.group.position.z = -6;

    const boxReferenceWidth = 2.2;
    const boxReferenceHeight = 2.4;
    const boxReferenceDepth = 2.7;

    const boxReferenceGeometry = new THREE.BoxBufferGeometry(boxReferenceWidth, boxReferenceHeight, boxReferenceDepth);

    this.group.add(this.boxReference);

    this.boxReference.visible = false;

    this.sideX = boxReferenceWidth/2; //lato box / 2
    this.sideY = boxReferenceHeight/2;
    this.sideZ = boxReferenceDepth/2;

    
    }

    jump(speed, dist, gradi, asse) {
        this.group.rotation.y = rad(gradi);
        this.vAngle += speed*goingFastShark;
        //check if i'm going up or down
        if(this.group.position.y >= 3 || descending){
          this.group.position.y-= Math.sin(speed)*1.5*goingFastShark;
          descending = true;
        }
        else{
          this.group.position.y+= Math.sin(speed)*1.5*goingFastShark;
        }
    
    
        //had to speed up the movement since i'm using a different incremental function
    
        if(asse=='z') this.group.position.z = this.group.position.z + 1.6445*goingFastShark*dist;
    
        if(asse=='x')this.group.position.x = this.group.position.x + 1.6445*goingFastShark*dist;
    
    
    
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
          this.jump(speedSharkDown, sign * dist, angle, last);
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
              this.jump(speedSharkUp, dist, 0, 'z');
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
              this.jump(speedSharkUp, -dist, 180, 'z');
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
              this.jump(speedSharkUp, dist, 90, 'x');
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
              this.jump(speedSharkUp, -dist, 270, 'x');
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