class PreviewScene {
	constructor(id, data = 0) {
		PreviewScene.scenes[id] = this;
		this.id = id;
		this.loaded = false;

		this.name = tl(data.name || `preview_scene.${id}`);
		this.light_color = {r: 1, g: 1, b: 1};
		this.light_side = 0;
		this.condition;

		this.preview_models = [];

		if (data) this.extend(data);

		PreviewScene.select_options[id] = this.name;
	}
	extend(data) {
		this.loaded = data.lazy_load_from_web ? false : true;

		this.name = tl(data.name || `preview_scene.${this.id}`);
		if (data.description) {
			this.description = tl(data.description);
		} else {
			var key = `action.${this.id}.desc`;
			this.description = tl('action.'+this.id+'.desc')
			if (this.description == key) this.description = '';
		}
		if (data.light_color) this.light_color = data.light_color;
		if (data.light_sid) this.light_side = data.light_sid;
		this.condition = data.condition;

		this.cubemap = null;
		if (data.cubemap) {
			let urls = data.cubemap;
			let texture_cube = new THREE.CubeTextureLoader().load( urls );
			texture_cube.colorSpace = THREE.SRGBColorSpace;
			texture_cube.mapping = THREE.CubeRefractionMapping;
			this.cubemap = texture_cube;
		}

		this.fog = null;
		if (data.fog) {
			if (data.fog.type == 'linear') {
				this.fog = new THREE.Fog(data.fog.color, data.fog.near, data.fog.far);
			} else {
				this.fog = new THREE.FogExp2(data.fog.color, data.fog.density);
			}
		}

		this.preview_models = (!data.preview_models) ? [] : data.preview_models.map(model => {
			if (typeof model == 'string') return PreviewModel.models[model];
			if (model instanceof PreviewModel && typeof model == 'object') {
				model = new PreviewModel(model.id || this.id, model);
			}
			return model;
		})
	}
	async lazyLoadFromWeb() {
		this.loaded = true;
		let response = await fetch(`./minecraft_snowy_tundra.json`);
		if (!response.ok) {
			console.log(response)
			return;
		}
		let json = await response.json();
		this.extend(json);yy
	}
	async select() {
		if (!this.loaded) {
			await this.lazyLoadFromWeb()
		}
		if (PreviewScene.active) PreviewScene.active.unselect();
		this.preview_models.forEach(model => {
			model.enable();
		})

		Canvas.global_light_color.copy(this.light_color);
		Canvas.global_light_side = this.light_side;
		scene.background = this.cubemap;
		scene.fog = this.fog;
		PreviewScene.active = this;
		Blockbench.dispatchEvent('select_preview_scene', {scene: this});
		Canvas.updateShading();
	}
	unselect() {
		this.preview_models.forEach(model => {
			model.disable();
		})

		Canvas.global_light_color.set(0xffffff);
		Canvas.global_light_side = 0;
		if (this.cubemap) scene.background = null;
		if (this.fog) scene.fog = null;
		Blockbench.dispatchEvent('unselect_preview_scene', {scene: this});
		Canvas.updateShading();
	}
	delete() {
		delete PreviewScene.scenes[this.id];
		delete PreviewScene.select_options[this.id];
	}
}
PreviewScene.scenes = {};
PreviewScene.active = null;
PreviewScene.select_options = {
	none: tl('generic.none')
};

class PreviewModel {
	constructor(id, data) {
		PreviewModel.models[id] = this;
		this.id = id;
		this.condition = data.condition;
		this.model_3d = new THREE.Object3D();
		this.onUpdate = data.onUpdate;

		this.cubes = data.cubes || [];
		this.texture = data.texture;
		this.color = data.color || '#ffffff';
		this.shading = data.shading !== false;
		this.render_side = data.render_side == undefined ? THREE.DoubleSide : data.render_side;
		this.texture_size = data.texture_size || [16, 16];

		this.buildModel();
	}
	enable() {
		Canvas.scene.add(this.model_3d);
		this.update();
	}
	disable() {
		Canvas.scene.remove(this.model_3d);
	}
	update() {
		if (typeof this.onUpdate == 'function') {
			this.onUpdate();
		}
		this.model_3d.position.x = this.model_3d.position.z = Format.centered_grid ? 0 : 8;
		this.model_3d.visible = !!Condition(this.condition);
	}
	buildModel() {
		let tex;
		if (this.texture) {
			let img = new Image();
			img.src = this.texture;
			tex = new THREE.Texture(img);
			tex.magFilter = THREE.NearestFilter;
			tex.minFilter = THREE.NearestFilter;
			img.crossOrigin = '';
			img.onload = function() {
				tex.needsUpdate = true;
			}
		}
		this.material = new (this.shading ? THREE.MeshLambertMaterial : THREE.MeshBasicMaterial)({
			color: this.color,
			map: tex,
			side: this.render_side,
			alphaTest: 0.05
		});

		this.cubes.forEach(cube => {
			let mesh = new THREE.Mesh(new THREE.BoxGeometry(cube.size[0], cube.size[1], cube.size[2]), this.material)
			if (cube.origin) {
				mesh.position.set(cube.origin[0], cube.origin[1], cube.origin[2])
				mesh.geometry.translate(-cube.origin[0], -cube.origin[1], -cube.origin[2])
			}
			mesh.geometry.translate(cube.position[0] + cube.size[0]/2, cube.position[1] + cube.size[1]/2, cube.position[2] + cube.size[2]/2)
			if (cube.rotation) {
				mesh.rotation.setFromDegreeArray(cube.rotation)
			}

			let getUVArray = (face) => {
				let arr = [
					[face.uv[0]/this.texture_size[0], 1-(face.uv[1]/this.texture_size[1])],
					[face.uv[2]/this.texture_size[0], 1-(face.uv[1]/this.texture_size[1])],
					[face.uv[0]/this.texture_size[0], 1-(face.uv[3]/this.texture_size[1])],
					[face.uv[2]/this.texture_size[0], 1-(face.uv[3]/this.texture_size[1])]
				]
				let rot = (face.rotation+0)
				while (rot > 0) {
					let a = arr[0];
					arr[0] = arr[2];
					arr[2] = arr[3];
					arr[3] = arr[1];
					arr[1] = a;
					rot = rot-90;
				}
				return arr;
			}

			let indices = [];
			let j = 0;
			mesh.geometry.faces = [];
			mesh.geometry.clearGroups();
			Canvas.face_order.forEach((fkey, i) => {
				if (cube.faces[fkey]) {
					indices.push(0 + i*4, 2 + i*4, 1 + i*4, 2 + i*4, 3 + i*4, 1 + i*4);
					mesh.geometry.faces.push(fkey)
					j++;
				}
			})
			mesh.geometry.setIndex(indices)

			for (let face in cube.faces) {
				let uv_array = getUVArray(cube.faces[face]);
				let fIndex = 0;
				switch(face) {
					case 'north':   fIndex = 10;	break;
					case 'east':	fIndex = 0;		break;
					case 'south':   fIndex = 8;		break;
					case 'west':	fIndex = 2;		break;
					case 'up':		fIndex = 4;		break;
					case 'down':	fIndex = 6;		break;
				}
				mesh.geometry.attributes.uv.array.set(uv_array[0], fIndex*4 + 0);  //0,1
				mesh.geometry.attributes.uv.array.set(uv_array[1], fIndex*4 + 2);  //1,1
				mesh.geometry.attributes.uv.array.set(uv_array[2], fIndex*4 + 4);  //0,0
				mesh.geometry.attributes.uv.array.set(uv_array[3], fIndex*4 + 6);  //1,0
				mesh.geometry.attributes.uv.needsUpdate = true;
			}

			this.model_3d.add(mesh);
		})
		return this;
	}
	delete() {
		delete PreviewModel.models[id];
	}
}
PreviewModel.models = {};
PreviewModel.getActiveModels = function() {
	if (PreviewScene.active) {
		return PreviewScene.active.preview_models.filter(model => Condition(model.condition));
	}
	return [];
}


new PreviewModel('minecraft_overworld', {
	texture: './assets/preview_scenes/mc_overworld.png',
	texture_size: [32, 32],
	cubes: [
		{
			position: [-24, 0, 0],
			size: [16, 16, 0],
			origin: [-16, 0, 0],
			rotation: [0, 45, 0],
			faces: {
				north: {uv: [16, 0, 32, 16]}
			}
		},
		{
			position: [-24, 0, 0],
			size: [16, 16, 0],
			origin: [-16, 0, 0],
			rotation: [0, -45, 0],
			faces: {
				north: {uv: [16, 0, 32, 16]}
			}
		},
		{
			position: [-24, -16, -8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [-8, -16, -8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [8, -16, 8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [8, -16, -8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [-8, -16, 8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [-24, -16, -24],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [-24, -16, -8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [-8, -16, -24],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [-24, -32, 8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [8, -32, -24],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [8, -32, -40],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [-8, -32, -40],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [-24, -32, -40],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [8, -32, 24],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [-8, -32, 24],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [-24, -32, 24],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [-40, -32, -24],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [-40, -32, -8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [-40, -32, 8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [24, -32, -24],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [24, -32, -8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
		{
			position: [24, -32, 8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [16, 16, 32, 32]},
			}
		},
	]
})
new PreviewModel('minecraft_nether', {
	texture: './assets/preview_scenes/mc_nether.png',
	texture_size: [32, 32],
	color: '#ad9c7d',
	cubes: [
		{
			position: [-24, 0, 0],
			size: [16, 16, 0],
			origin: [-16, 0, 0],
			rotation: [0, 45, 0],
			faces: {
				north: {uv: [16, 0, 32, 16]}
			}
		},
		{
			position: [-24, 0, 0],
			size: [16, 16, 0],
			origin: [-16, 0, 0],
			rotation: [0, -45, 0],
			faces: {
				north: {uv: [16, 0, 32, 16]}
			}
		},
		{
			position: [-24, -16, -8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [-8, -16, -8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [8, -16, 8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [8, -16, -8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [-8, -16, 8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [-24, -16, -24],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [-24, -16, -8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [-8, -16, -24],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [-24, -32, 8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [8, -32, -24],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [8, -32, -40],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 16, 16, 32]},
				down: {uv: [0, 16, 16, 32]},
			}
		},
		{
			position: [-8, -32, -40],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [-24, -32, -40],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [8, -32, 24],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [-8, -32, 24],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [-24, -32, 24],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 16, 16, 32]},
				south: {uv: [0, 16, 16, 32]},
				east: {uv: [0, 16, 16, 32]},
				west: {uv: [0, 16, 16, 32]},
				up: {uv: [0, 16, 16, 32]},
				down: {uv: [0, 16, 16, 32]},
			}
		},
		{
			position: [-40, -32, -24],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [-40, -32, -8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [-40, -32, 8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [24, -32, -24],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [24, -32, -8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
		{
			position: [24, -32, 8],
			size: [16, 16, 16],
			faces: {
				north: {uv: [0, 0, 16, 16]},
				south: {uv: [0, 0, 16, 16]},
				east: {uv: [0, 0, 16, 16]},
				west: {uv: [0, 0, 16, 16]},
				up: {uv: [0, 0, 16, 16]},
				down: {uv: [0, 0, 16, 16]},
			}
		},
	]
})
let solid_uv = {
	north: {uv: [0, 0, 16, 16]},
	south: {uv: [0, 0, 16, 16]},
	east: {uv: [0, 0, 16, 16]},
	west: {uv: [0, 0, 16, 16]},
	up: {uv: [0, 0, 16, 16]},
	down: {uv: [0, 0, 16, 16]},
}
new PreviewModel('minecraft_end', {
	texture: './assets/preview_scenes/mc_end.png',
	texture_size: [16, 16],
	color: '#6f8377',
	cubes: [
		{position: [-8, -16, -8], size: [16, 16, 16], faces: solid_uv},
		{position: [8, -16, 8], size: [16, 16, 16], faces: solid_uv},
		{position: [8, -16, -8], size: [16, 16, 16], faces: solid_uv},
		{position: [-8, -16, 8], size: [16, 16, 16], faces: solid_uv},
		{position: [-24, -16, -24], size: [16, 16, 16], faces: solid_uv},
		{position: [-24, -16, -8], size: [16, 16, 16], faces: solid_uv},
		{position: [-8, -16, -24], size: [16, 16, 16], faces: solid_uv},

		{position: [-24, -32, 8], size: [16, 16, 16], faces: solid_uv},
		{position: [8, -32, -24], size: [16, 16, 16], faces: solid_uv},

		{position: [8, -32, -40], size: [16, 16, 16], faces: solid_uv},
		{position: [-8, -32, -40], size: [16, 16, 16], faces: solid_uv},
		{position: [-24, -32, -40], size: [16, 16, 16], faces: solid_uv},
		{position: [8, -32, 24], size: [16, 16, 16], faces: solid_uv},
		{position: [-8, -32, 24], size: [16, 16, 16], faces: solid_uv},
		{position: [-24, -32, 24], size: [16, 16, 16], faces: solid_uv},

		{position: [-40, -32, -24], size: [16, 16, 16], faces: solid_uv},
		{position: [-40, -32, -8], size: [16, 16, 16], faces: solid_uv},
		{position: [-40, -32, 8], size: [16, 16, 16], faces: solid_uv},
		{position: [24, -32, -24], size: [16, 16, 16], faces: solid_uv},
		{position: [24, -32, -8], size: [16, 16, 16], faces: solid_uv},
		{position: [24, -32, 8], size: [16, 16, 16], faces: solid_uv},
	]
})
new PreviewModel('studio', {
	texture: './assets/preview_scenes/studio.png',
	texture_size: [64, 64],
	shading: false,
	render_side: THREE.BackSide,
	cubes: [
		{position: [-240, 0, -240], size: [480, 128, 480], faces: {
			up: {uv: [0, 16.04, 15.96, 31.96]},
			down: {uv: [0, 0, 16, 16]},
		}},
		{position: [48, 0, -240], size: [96, 128, 480], faces: {
			south: {uv: [16.06, 0, 64, 64]},
			north: {uv: [16.06, 0, 64, 64]}
		}},
		{position: [-48, 0, -240], size: [96, 128, 480], faces: {
			south: {uv: [16.06, 0, 64, 64]},
			north: {uv: [16.06, 0, 64, 64]}
		}},
		{position: [-144, 0, -240], size: [96, 128, 480], faces: {
			south: {uv: [16.06, 0, 64, 64]},
			north: {uv: [16.06, 0, 64, 64]}
		}},
		{position: [144, 0, -240], size: [96, 128, 480], faces: {
			south: {uv: [16.06, 0, 64, 64]},
			north: {uv: [16.06, 0, 64, 64]}
		}},
		{position: [-240, 0, -240], size: [96, 128, 480], faces: {
			south: {uv: [16.06, 0, 64, 64]},
			north: {uv: [16.06, 0, 64, 64]}
		}},

		{position: [-240, 0, 48], size: [480, 128, 96], faces: {
			east: {uv: [16.06, 0, 64, 64]},
			west: {uv: [16.06, 0, 64, 64]}
		}},
		{position: [-240, 0, -48], size: [480, 128, 96], faces: {
			east: {uv: [16.06, 0, 64, 64]},
			west: {uv: [16.06, 0, 64, 64]}
		}},
		{position: [-240, 0, -144], size: [480, 128, 96], faces: {
			east: {uv: [16.06, 0, 64, 64]},
			west: {uv: [16.06, 0, 64, 64]}
		}},
		{position: [-240, 0, 144], size: [480, 128, 96], faces: {
			east: {uv: [16.06, 0, 64, 64]},
			west: {uv: [16.06, 0, 64, 64]}
		}},
		{position: [-240, 0, -240], size: [480, 128, 96], faces: {
			east: {uv: [16.06, 0, 64, 64]},
			west: {uv: [16.06, 0, 64, 64]}
		}},
	]
})
new PreviewScene('studio', {
	light_color: {r: 1.04, g: 1.03, b: 1.1},
	light_side: 1,
	preview_models: ['studio']
});
new PreviewScene('landscape', {
	light_color: {r: 1, g: 1, b: 1}
});
new PreviewScene('minecraft_overworld', {
	preview_models: ['minecraft_overworld'],
	fog: {color: '#bbe9fc', density: 0.002},
	cubemap: [
		'assets/preview_scenes/overworld_panorama/panorama_1.png',
		'assets/preview_scenes/overworld_panorama/panorama_3.png',
		'assets/preview_scenes/overworld_panorama/panorama_4.png',
		'assets/preview_scenes/overworld_panorama/panorama_5.png',
		'assets/preview_scenes/overworld_panorama/panorama_0.png',
		'assets/preview_scenes/overworld_panorama/panorama_2.png',
	]
});
new PreviewScene('minecraft_nether', {
	light_color: {r: 0.68, g: 0.61, b: 0.49},
	light_side: 1,
	preview_models: ['minecraft_nether']
});
new PreviewScene('minecraft_end', {
	light_color: {r: 0.45, g: 0.52, b: 0.48},
	preview_models: ['minecraft_end']
});


new PreviewScene('minecraft_snowy_tundra').lazyLoadFromWeb();


BARS.defineActions(function() {
	new Action('preview_scene', {
		category: 'view',
		icon: 'nature_people',
		click(event) {
			new Menu(this.children).show(event.target);
		},
		/*onChange() {
			let scene = PreviewScene.scenes[this.value];
			if (scene) {
				scene.select();
			} else if (PreviewScene.active) {
				PreviewScene.active.unselect();
			}
		},*/
		children: [
			{name: 'Studio'},
			{name: 'Landscape'},
			'_',
			{name: 'Minecraft Player', icon: 'check_box_outline_blank'},
			{name: 'Overworld'},
			{name: 'Snowy Tundra'},
			{name: 'Lush Caves'},
			{name: 'Deep Dark'},
			{name: 'Nether'},
			{name: 'Basalt Deltas'},
			{name: 'Soul Sand Valley'},
			{name: 'The End'},
			{name: 'Overworld'},
		]
	})
})
