import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const models = {};
export default models;
async function loadModel(name){
	let model = await loader.loadAsync(`./models/${name}.glb`);
	models[name] = model.scene;
}
export function loadModels(){
	return Promise.all([
		loadModel("Cross Ball"),
		loadModel("Arrow"),
		loadModel("Vote Box"),
	])
}
