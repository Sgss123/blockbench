if(!self.define){let e,s={};const i=(i,a)=>(i=new URL(i+".js",a).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(a,r)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let b={};const d=e=>i(e,c),f={module:{uri:c},exports:b,require:d};s[c]=Promise.all(a.map((e=>f[e]||d(e)))).then((e=>(r(...e),b)))}}define(["./workbox-e791b4c4"],(function(e){"use strict";e.setCacheNameDetails({prefix:"blockbench"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"index.html",revision:"5514a45a857b9c555541367ba7ddc95d"},{url:"favicon.png",revision:"bb17c5c284076fc17e3399860df472d7"},{url:"js/animations/animation_controllers.js",revision:"15b942d58d75be3bca6789b67bf46663"},{url:"js/animations/animation.js",revision:"04503dcdbda04a30672e6d5bf2474bd5"},{url:"js/animations/keyframe.js",revision:"0fd285eba940ecec2c507caf7e860703"},{url:"js/animations/molang.js",revision:"c12c65acbf67ed7649f8446b427abe17"},{url:"js/animations/timeline_animators.js",revision:"c6b4d455cada996369038ef420d255d1"},{url:"js/animations/timeline.js",revision:"1fdd02bd2a5a280e1f4040c7afb65103"},{url:"js/api.js",revision:"eea9c795f4f3336d8917ff19b20580c7"},{url:"js/boot_loader.js",revision:"e559dcc55214a39a7e50b40b83ee3f49"},{url:"js/copy_paste.js",revision:"aaaf2625c3dc0d79674d874c51cb3916"},{url:"js/desktop.js",revision:"dff6a7fa27f9213f0bb9e75a3e87fda6"},{url:"js/display_mode.js",revision:"9d497f8afde5a20dfb9e92c082adcd2b"},{url:"js/edit_sessions.js",revision:"68656b1508c2bb76c3613c0af520ab44"},{url:"js/file_system.js",revision:"20cc3ef28fb09ec68af14c9b67b12e64"},{url:"js/globals.js",revision:"442493e3975da7568905d8286a1ce8ba"},{url:"js/interface/about.js",revision:"00206dad48b49451f1b8f1c5070663f7"},{url:"js/interface/action_control.js",revision:"5cc732c6f06f8f3cd9da4ee350d96661"},{url:"js/interface/actions.js",revision:"e4ba5cd7b956f6361e32f7884ea2ee79"},{url:"js/interface/dialog.js",revision:"d09cccee21b20632fc1b58efb27057db"},{url:"js/interface/interface.js",revision:"0a10bea04583d67bbbf68a2a4337d4df"},{url:"js/interface/keyboard.js",revision:"740ad30b8dc8e87c8c3f07579888a0e7"},{url:"js/interface/menu_bar.js",revision:"06b145eedc3a2627d7ce0055f7f498b0"},{url:"js/interface/menu.js",revision:"b80c379535ab3c8e4baf3a60d73a194b"},{url:"js/interface/panels.js",revision:"4bbe8b49119bc2e061e7d5088b20a987"},{url:"js/interface/settings.js",revision:"21721b7c339c1cf51650be87f21c8e17"},{url:"js/interface/start_screen.js",revision:"d253445d2ddae5f04a9ebe1c6ba5eceb"},{url:"js/interface/themes.js",revision:"7d7b546ba5ca1f58c2232d5a986b7a61"},{url:"js/interface/vue_components.js",revision:"32ccde4b55ab213ea70ed716bc2464c6"},{url:"js/io/codec.js",revision:"a050a214b4d0dc405a7e058aa0ce0ce1"},{url:"js/io/format.js",revision:"9949d3fac30f3a8412350fdec514fda4"},{url:"js/io/formats/bbmodel.js",revision:"d3c2ee5fce9c7e439e5e6f151f631375"},{url:"js/io/formats/bedrock_old.js",revision:"86ed0967a292a58aa8b707e463d94c83"},{url:"js/io/formats/bedrock.js",revision:"337a6976a9cc928d4e351f43ce92828f"},{url:"js/io/formats/collada.js",revision:"c28787f79d929bbfce7654dbd93a3af2"},{url:"js/io/formats/fbx.js",revision:"eaf6cfef90f42bc9f30a1a5ee7917e4a"},{url:"js/io/formats/generic.js",revision:"7064ced3120d1345c09d9830571bb5e5"},{url:"js/io/formats/gltf.js",revision:"444aab58f4719f555d7fdd23b84ea21a"},{url:"js/io/formats/image.js",revision:"dfa538983e92d5df2e9425dbe9885381"},{url:"js/io/formats/java_block.js",revision:"21e856f5258cb4a530e5a2413b5866d3"},{url:"js/io/formats/modded_entity.js",revision:"69a8c5343c8cb924dbf496c231b0a814"},{url:"js/io/formats/obj.js",revision:"db5bc4b405ad407b6b1fb8ff8c4cb8d3"},{url:"js/io/formats/optifine_jem.js",revision:"551a69bdffecb0edfbbf0f38f5d75dfc"},{url:"js/io/formats/optifine_jpm.js",revision:"7902a08955db9db9df5499c03e71b9a7"},{url:"js/io/formats/skin.js",revision:"9086cf067db9ff748faaadd1ef493867"},{url:"js/io/io.js",revision:"95f3405900ebf610afdd3eb420f7d4f1"},{url:"js/io/project.js",revision:"0279c81d5fac843c369a1d5b6d43c5a6"},{url:"js/io/share.js",revision:"6ce4b5c40cdf0fb11099dc91499c9059"},{url:"js/misc.js",revision:"3c20af80589edb4a1f3548d646dddc57"},{url:"js/modeling/mesh_editing.js",revision:"6e8ba60915eb95dbf36aae979f7ce5e7"},{url:"js/modeling/mirror_modeling.js",revision:"59051e591f69dc43d1eebc349486ba1d"},{url:"js/modeling/scale.js",revision:"272523a2b1bedf87e78acdade131f234"},{url:"js/modeling/transform_gizmo.js",revision:"5b794f0632eba19b997280879eb53852"},{url:"js/modeling/transform.js",revision:"437b2f78f1feb88d13668cdf544e5988"},{url:"js/modes.js",revision:"525abaeb666829556690ccc96c80cae9"},{url:"js/outliner/cube.js",revision:"50267ce6cf5550417677222a337b306b"},{url:"js/outliner/group.js",revision:"1fbd276e377cf4787874921a9922e5a1"},{url:"js/outliner/locator.js",revision:"3063941e0e4839e657361ea7568b16c4"},{url:"js/outliner/mesh.js",revision:"6ebab409065e6af6c3c37b5753154107"},{url:"js/outliner/null_object.js",revision:"318ab6c15c2fa0e243897662bd9bd41c"},{url:"js/outliner/outliner.js",revision:"84c76054832c638d740f6da697222015"},{url:"js/outliner/texture_mesh.js",revision:"e0a0df7795b9463ce9dcff21d62a164e"},{url:"js/plugin_loader.js",revision:"3becc1b667d8e893fcb402a843ffab76"},{url:"js/predicate_editor.js",revision:"1d4e3d9f6094a7409220495f4cf97f20"},{url:"js/preview/canvas.js",revision:"dbb61dbea34c1bd99008ebfa2d4ef7cf"},{url:"js/preview/OrbitControls.js",revision:"7ddda0ca2bc697d8a6c97c64bb6294aa"},{url:"js/preview/preview_scenes.js",revision:"32f4513f2e3ee80a40cc1423cbea82e0"},{url:"js/preview/preview.js",revision:"ec54e8ba1707c103638edc886d17edc6"},{url:"js/preview/reference_images.js",revision:"18a5bb96845b5f263497236d9b24cefc"},{url:"js/preview/screenshot.js",revision:"030e0e685762e6fb08381b4566cb9468"},{url:"js/texturing/color.js",revision:"868d4e855ae82be65822eb976edb2ec7"},{url:"js/texturing/edit_texture.js",revision:"0746ca3db3e666194db7fd85d137cbad"},{url:"js/texturing/painter.js",revision:"b7cc4a857bd645695d17eed5d2bb053a"},{url:"js/texturing/texture_generator.js",revision:"60e2420da3f1570d6d448178e4135fca"},{url:"js/texturing/textures.js",revision:"678dfa1855af05fe78e1fabf63f4db46"},{url:"js/texturing/uv.js",revision:"600badee31efff5c7eb33ceaf00237e4"},{url:"js/undo.js",revision:"6b9a81016b498c4553cc92ae4ac621eb"},{url:"js/util/array_util.js",revision:"655f788b4c2b2f3eb834f4c68d03437f"},{url:"js/util/event_system.js",revision:"65cc10b478b9ab25a38f31473ba15673"},{url:"js/util/math_util.js",revision:"b0fd22aef99eb65706f9da63b801665c"},{url:"js/util/property.js",revision:"c0176313a64ba965e5b58b513203af2e"},{url:"js/util/util.js",revision:"7d825fbbaa23506370ba6413b3cd1fbb"},{url:"js/validator.js",revision:"3021eddb2a0d83ab7342feb713762e5a"},{url:"js/web.js",revision:"997d3f01a7d8f59ddb975d8536f66c62"},{url:"js/webpack/bundle.js",revision:"a72a8b9b4a8aa13b9c5f1c9e086b45d6"},{url:"lib/canvas2apng.js",revision:"51d5d0955625d02625cf1d5fd72cc37d"},{url:"lib/CanvasFrame.js",revision:"2b5bb3135ca6065f352ec4a56ed2f7e3"},{url:"lib/color-picker.min.js",revision:"1725de455ed2f45daafb69dd90413104"},{url:"lib/fik.min.js",revision:"9985a46a1107966f2375d0c61241c689"},{url:"lib/FileSaver.js",revision:"547422b2d7a739f14eefa1fc1c59c658"},{url:"lib/gif.js",revision:"6760f4c06414ceb8b3d30e14d3a59c69"},{url:"lib/gif.worker.js",revision:"d8cc71ca8334b5002e4481497802c2ac"},{url:"lib/GLTFExporter.js",revision:"d7e7eb8edb4e4e54da61163c8d2501a3"},{url:"lib/jquery-ui.min.js",revision:"f7275ece7d6dea2aec3c23457415695c"},{url:"lib/jquery.js",revision:"3e4bb227fb55271bfe9c9d4a09147bd8"},{url:"lib/jszip.min.js",revision:"5ab88d8028258f8c1d0ae2ab85d1e2bd"},{url:"lib/lzutf8.js",revision:"079e1fb0ed75a7a0b78c41704425bb60"},{url:"lib/marked.min.js",revision:"f12d4a87973b8b958222aca5fdb84394"},{url:"lib/molang-prism-syntax.js",revision:"4b9be48b3e6e9205517a7ff077c2a63e"},{url:"lib/molang.umd.js",revision:"9bc6d7cd9b6b5ce4a3904dd094f29e29"},{url:"lib/peer.min.js",revision:"da4b6c59e67068a4da26ebfc6b52f7c5"},{url:"lib/prism.js",revision:"8b9de8b28b26a713474c0a6e612a85ba"},{url:"lib/purify.min.js",revision:"73b8be8a1f049413506c1578a0cebaaa"},{url:"lib/spectrum.js",revision:"a2be6576c3b44bdb4ffce313816e5a65"},{url:"lib/targa.js",revision:"17c5ce65af686baa97294748f929541e"},{url:"lib/three_custom.js",revision:"546b2bfa3c20ab60cfdb8873ba20666b"},{url:"lib/three.min.js",revision:"0a8a3113f4c503210e9a8de577025ff4"},{url:"lib/vue_sortable.js",revision:"87cfedd91d600fb8d44668a0e83d4101"},{url:"lib/vue.min.js",revision:"996550c3ce1487d0f314c0da35a2bba6"},{url:"lib/VuePrismEditor.min.js",revision:"df9e00aa94964cb5b215c1b53ab90484"},{url:"lib/wintersky.umd.js",revision:"fe4d2e3ae49084fe2afa544ecdadd65c"},{url:"css/dialogs.css",revision:"26d47f22dad623e2b3f2b88ab1637de4"},{url:"css/fontawesome.css",revision:"1cd088b35b0d3fac7265a75875471484"},{url:"css/general.css",revision:"50e01687cc4c3bcd44f575b956cf5f2b"},{url:"css/jquery-ui.min.css",revision:"db778110650dea1e4533cd09f75533a2"},{url:"css/panels.css",revision:"c91df9c2751285e5a0db3b35d38217c2"},{url:"css/prism.css",revision:"e6a2c692b28dbb89c1a06154a868bb5c"},{url:"css/setup.css",revision:"186bcfd549c42621f21606fe50d44809"},{url:"css/spectrum.css",revision:"26eb76904b2526a48710e091b211c021"},{url:"css/start_screen.css",revision:"d4803f53a6cbec300fad8bf535c4648c"},{url:"css/w3.css",revision:"04db708c100ea3937a3a5bf138cfcbf3"},{url:"css/window.css",revision:"c0ed7e522813a5d026b05b5d6c944e3a"},{url:"assets/armor_stand.png",revision:"d936b2d5fe33f45fc3b67ebace503bf6"},{url:"assets/brush_outline_circle.png",revision:"3a5945dc2a6e095515232e0f2fe7797c"},{url:"assets/brush_outline.png",revision:"751713355b9a3bc8d75b613dff571253"},{url:"assets/brush.png",revision:"b6a28bb79f9dea063d7a2ac620a3236a"},{url:"assets/hud.png",revision:"049320fa871e4fbe54978dd6043acd8c"},{url:"assets/inventory_full.png",revision:"430fc3c0627f04302d457eead5e1fa16"},{url:"assets/inventory_nine.png",revision:"28cc307e3f2ee4570532fe6ee01a6131"},{url:"assets/item_frame.png",revision:"08eaa797bfb1ceb3784b6fa04ce77387"},{url:"assets/locator.png",revision:"8448be12d087adfc0aea285af26ecbe8"},{url:"assets/logo_cutout.svg",revision:"c0588aa5cc8b0d757f6b0065d49268da"},{url:"assets/logo_text_white.svg",revision:"021abc358f6fd915b2ad77d548bb1954"},{url:"assets/missing_blend.png",revision:"5d055c1476e74bcdfd987ab62045b8a6"},{url:"assets/missing.png",revision:"7769bccdd08fde7afc1962cdb836d99a"},{url:"assets/north.png",revision:"d6c44f75fe7a6dd16927b9b8d8d0e9c2"},{url:"assets/null_object.png",revision:"298d80b3ba99198a3688e8c558dda065"},{url:"assets/player_skin.png",revision:"bd60891dc6eacb8f038556dfdb1dadcc"},{url:"assets/plugins.png",revision:"5838610c04e3b5f912344f8c46b73fec"},{url:"assets/poses/aiming.svg",revision:"99cc4acebde8bf10e5578a6ff0c4d418"},{url:"assets/poses/crouching.svg",revision:"ea45f7a8485078ac9fc50bf6cf032542"},{url:"assets/poses/jumping.svg",revision:"268a1a6966abb5b8eef0fc783017b980"},{url:"assets/poses/natural.svg",revision:"1bc79dd4c044a9fd330745699db6d721"},{url:"assets/poses/none.svg",revision:"38929100bfd2f391c3650fdde20b0e03"},{url:"assets/poses/sitting.svg",revision:"23eab940f7e9729a6e24438487553e7d"},{url:"assets/poses/walking.svg",revision:"eee91b6c25b42f5901961d39d35854d5"},{url:"assets/preview_scenes/studio.png",revision:"116be6e8296015a2653fe5a8c6e23ffe"},{url:"assets/rotate_cursor.png",revision:"092b9000c5901c27d4bee37236f6407c"},{url:"assets/splash_art.png",revision:"c7217e28768f89c102003545e4331b5d"},{url:"assets/splash_art/1.png",revision:"49c1500f5a36c96501ac7b114c45c4c2"},{url:"assets/splash_art/2.png",revision:"942aef095e8d39a91e478a429c91d1c4"},{url:"assets/splash_art/3.png",revision:"b59fb43a33aca6cc485b6d99457c99fe"},{url:"assets/splash_art/4.png",revision:"f40fd0fd9410e1602771add4cecba2b0"},{url:"assets/splash_art/5.png",revision:"b9eb3949c12eafdb7dd85434739626d6"},{url:"assets/uv_preview.png",revision:"9171cd9bbc6a55858b4504a11c069f63"},{url:"assets/vertex.png",revision:"6b314afc9e5a153db6798cf8c0a93918"},{url:"assets/zombie.png",revision:"a5fd9124b9eab1bc7880fea5f1b26e4c"},{url:"font/Assistant-Bold.ttf",revision:"d582391da9a68daf10a2ed2514c33826"},{url:"font/Assistant-ExtraBold.ttf",revision:"f2bbc6bae2ee3ce641adc1bb1a655371"},{url:"font/Assistant-ExtraLight.ttf",revision:"5e4d348ae3eca48143c0274a3124a9c0"},{url:"font/Assistant-Light.ttf",revision:"5415f395c1567a5c19efc1dc2892927a"},{url:"font/Assistant-Regular.ttf",revision:"e2b46dd69f54e57767ceef1d5fc8e688"},{url:"font/Assistant-SemiBold.ttf",revision:"d6759edb35ac7f29a029caa1192c010d"},{url:"font/fa-brands-400.woff2",revision:"a9afdb72826cde196ddf29eb8f9d0f8f"},{url:"font/fa-regular-400.woff2",revision:"f817938f131b0cabee81e59a96f9c2a6"},{url:"font/fa-solid-900.woff2",revision:"297973a488f688271dd223d542ba2697"},{url:"font/icomoon.ttf",revision:"e41af0d7e74154a711fc444d30b79e80"},{url:"font/icomoon.woff",revision:"86f5286db61fca481661deb53c4cfd3a"},{url:"font/MaterialIcons-Regular.ttf",revision:"4e85bc9ebe07e0340c9c4fc2f6c38908"}],{})}));
