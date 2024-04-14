import * as t from 'three';
import renderer from "dvijcock/single/renderer.js"
import Resizer from "dvijcock/Resizer.js"
import ammoTmp from 'dvijcock/ammoTmp.js';

export default class {
	constructor(){ 
		this.renderer = renderer;
		this.scene = new t.Scene();
		this.initPhysicsWorld();
	}
	setDomElement(domEl){
		domEl.appendChild(this.renderer.domElement);
		this.domEl = domEl;
	}
	setLogic(gameLogic){
		gameLogic.dcWorld = this;
		gameLogic.init();

		this.resizer = new Resizer(this);
		this.renderer.render(this.scene, this.camera); 

		let clock = new t.Clock();
		let tickDispayFps =()=>{
			if(this.destroyed) return;
			let deltaTime = clock.getDelta();
			if(gameLogic.tickDispayFps)gameLogic.tickDispayFps(deltaTime);
			this.tickDispayFps(deltaTime);
			this.updateDynamic(deltaTime);
			this.renderer.render( this.scene, this.camera );
			requestAnimationFrame(tickDispayFps);
		};
		tickDispayFps();
	}
	initPhysicsWorld(){
		this.collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration();
		this.dispatcher              = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
		this.overlappingPairCache    = new Ammo.btDbvtBroadphase();
		this.solver                  = new Ammo.btSequentialImpulseConstraintSolver();
		this.physicsWorld           = new Ammo.btDiscreteDynamicsWorld(
			this.dispatcher, this.overlappingPairCache,
			this.solver, this.collisionConfiguration
		);
	}
	addObjToPhysicsWorld(objThree){
		let pos = new t.Vector3();
		objThree.getWorldPosition(pos);
		let quat = new t.Quaternion();
		objThree.getWorldQuaternion(quat);
		let transform = ammoTmp.transform();
		transform.setOrigin(ammoTmp.vec(pos.x, pos.y, pos.z));
		transform.setRotation(ammoTmp.quat(quat.x, quat.y, quat.z, quat.w));
		let motionState = new Ammo.btDefaultMotionState(transform);
		let localInertia = ammoTmp.vec(0, 0, 0);
		objThree.dcData.btShape.calculateLocalInertia(objThree.dcData.mass ?? 0, localInertia);
		let rbInfo = new Ammo.btRigidBodyConstructionInfo(
			objThree.dcData.mass ?? 0, motionState, objThree.dcData.btShape, localInertia
		);
		let rbody = new Ammo.btRigidBody(rbInfo);
		rbInfo.__destroy__();

		rbody.setFriction(objThree.dcData.setFriction);
		rbody.setRestitution(objThree.dcData.setRestitution);
		if(objThree.dcData.kinematic){
			rbody.setActivationState(4);
			rbody.setCollisionFlags(2);
		}
		rbody.objThree = objThree;
		objThree.dcData.rbody = rbody;
		this.physicsWorld.addRigidBody(rbody);
	}
	addObj(objThree){
		if(!objThree.parent)this.scene.add(objThree);
		let addRecursion =(objThree)=>{
			if(objThree?.dcData?.btShape){
				this.addObjToPhysicsWorld(objThree)
			}else if(objThree?.children?.length){
				for(let i=0; i<objThree.children.length; i++){
					addRecursion(objThree.children[i]);
				}
			}
		}
		addRecursion(objThree);
	}
	tickDispayFps(deltaTime){
		let arr = [];
		this.scene.traverse((objThree)=>{
			if(objThree?.dcData?.tickDispayFps)arr.push(objThree);
		});
		for(let el of arr){
			if(typeof el.dcData.tickDispayFps == 'function'){
				el.dcData.tickDispayFps(deltaTime);
			}else{
				for(let func of el.dcData.tickDispayFps){
					func(deltaTime);
				}
			}
		}
	}
	updateDynamic(deltaTime){
		this.physicsWorld.stepSimulation(deltaTime, 10);
		let tmpTrans = new Ammo.btTransform();
		this.scene.traverse((objThree)=>{
			if(!objThree.dcData?.rbody)return;
			if(objThree.dcData.kinematic)return;
			let rigidBody = objThree.dcData.rbody;
			let ms = rigidBody.getMotionState();
			if(!ms)return;
			ms.getWorldTransform(tmpTrans);
			let p = tmpTrans.getOrigin();
			let q = tmpTrans.getRotation();
			objThree.position.set(p.x(), p.y(), p.z());
			objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());

			objThree.parent.updateWorldMatrix(true, false);
			const m = new t.Matrix4();
			m.copy(objThree.parent.matrixWorld).invert();
			objThree.applyMatrix4(m);
			objThree.updateWorldMatrix(false, true);
		});
		tmpTrans.__destroy__();
	}
	destroyObj(objThree){
		if(objThree?.geometry?.dispose) objThree.geometry.dispose();
		if(objThree?.material?.dispose) objThree.material.dispose();
		//in future add TEXTURE dispose;
		if(objThree?.dcData?.onDestroy)objThree.dcData.onDestroy();
		if(!objThree.dcData?.rbody)return;
		let rigidBody = objThree.dcData.rbody;
		this.physicsWorld.removeRigidBody(rigidBody);
		rigidBody.getMotionState().__destroy__();
		rigidBody.getCollisionShape().__destroy__();
		rigidBody.__destroy__();
	}
	destroy(){
		if(this.destroyed) return;
		this.destroyed = true;
		this.resizer.destory();
		//clearInterval(this.updatePhysicsInterval);
		this.scene.traverse((objThree)=>{
			let notDestroy = false;
			if(objThree.dcData?.notDestroy)notDestroy=true;
			objThree.traverseAncestors((someParent)=>{
				if(someParent.dcData?.notDestroy)notDestroy=true;
			});
			if(notDestroy) return;
			this.destroyObj(objThree);
		});
		this.collisionConfiguration.__destroy__();
		this.dispatcher.__destroy__();
		this.overlappingPairCache.__destroy__();
		this.solver.__destroy__();
		this.physicsWorld.__destroy__();
	}
};
