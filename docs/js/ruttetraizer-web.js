/**
 * RuttEtraIzer by Felix Turner - Web Version
 * www.airtight.cc
 * Modified for GitHub Pages deployment
 */

//VARS
var _stage,
_lineGroup,
_lineHolder,
_camera,
_scene,
_renderer,
_mouseX = 0,
_mouseY = 0,
_manualRotX = 0,
_manualRotY = 0,
_material,
_gui,
_inputImage,
_stageCenterX,
_stageCenterY,
_canvas,
_context,
_pixels,
_originalPixels,
_imageWidth,
_imageHeight,
_stageWidth,
_stageHeight,
_enableMouseMove = false,
_updateTimeout = null,
_colorTimeout = null,
_isUpdating = false,

//VARS ACCESSIBLE BY GUI
_guiOptions  = {
	stageSize:	 	0.8,
	scale:	 		2.0,
	scanStep: 		5,
	lineThickness:	3.0,
	opacity: 		1.0,
	depth: 			100,
	autoRotate: 	false,
	rotateSpeed:	0.005,
	rotationX:		0,
	rotationY:		0,
	cameraZ:		-1000,
	bgColor:		'#000000',
	colorMode:		'original',
	lineColorR:		255,
	lineColorG:		255,
	lineColorB:		255,
	brightness: 	0,
	exposure: 		0,
	contrast: 		0,
	highlights: 	0,
	shadows: 		0,
	vignette: 		0,
	color: 			0,
	saturation: 	0,
	warmth: 		0,
	tint: 			0,
	sharpness: 		0,
	depthInvert: 	false,
	brightMin: 		0,
	brightMax: 		255,
	depthFalloff: 	1.0,
	hue: 			0,
	gamma: 			1.0,
	rGain: 			1.0,
	gGain: 			1.0,
	bGain: 			1.0,
	invertImage: 	false
};

function saveImage() {
	try {
		render();
		window.open(_renderer.domElement.toDataURL("image/png"));
	} catch (error) {
		console.error('Chyba při ukládání obrázku:', error);
		alert('Nepodařilo se uložit obrázek. Ujistěte se, že jste načetli obrázek a vytvořili 3D scénu.');
	}
}

function resetRotation() {
	_guiOptions.rotationX = 0;
	_guiOptions.rotationY = 0;
	_manualRotX = 0;
	_manualRotY = 0;
	_mouseX = 0;
	_mouseY = 0;
	_gui.updateDisplay();
}

function resetEffect() {
	_guiOptions.stageSize = 0.8;
	_guiOptions.scale = 2.0;
	_guiOptions.scanStep = 5;
	_guiOptions.lineThickness = 3.0;
	_guiOptions.opacity = 1.0;
	_guiOptions.depth = 100;
	_guiOptions.depthInvert = false;
	_guiOptions.brightMin = 0;
	_guiOptions.brightMax = 255;
	_guiOptions.depthFalloff = 1.0;
	_gui.updateDisplay();
	updateImage();
}

function resetVisual() {
	_guiOptions.bgColor = '#000000';
	_guiOptions.colorMode = 'original';
	_guiOptions.lineColorR = 255;
	_guiOptions.lineColorG = 255;
	_guiOptions.lineColorB = 255;
	_gui.updateDisplay();
	updateBackground();
	updateImage();
}

function resetBasic() {
	_guiOptions.brightness = 0;
	_guiOptions.contrast = 0;
	_guiOptions.exposure = 0;
	_guiOptions.saturation = 0;
	_guiOptions.sharpness = 0;
	_gui.updateDisplay();
	updateImage();
}

function resetAdvanced() {
	_guiOptions.highlights = 0;
	_guiOptions.shadows = 0;
	_guiOptions.vignette = 0;
	_gui.updateDisplay();
	updateImage();
}

function resetColor() {
	_guiOptions.color = 0;
	_guiOptions.warmth = 0;
	_guiOptions.tint = 0;
	_guiOptions.hue = 0;
	_guiOptions.gamma = 1.0;
	_guiOptions.invertImage = false;
	_gui.updateDisplay();
	updateImage();
}

function resetRGB() {
	_guiOptions.rGain = 1.0;
	_guiOptions.gGain = 1.0;
	_guiOptions.bGain = 1.0;
	_gui.updateDisplay();
	updateImage();
}

function setFrontalView() {
	_guiOptions.rotationX = 0;
	_guiOptions.rotationY = 0;
	_guiOptions.autoRotate = false;
	_manualRotX = 0;
	_manualRotY = 0;
	_mouseX = 0;
	_mouseY = 0;
	_guiOptions.scale = 2.0;
	_guiOptions.cameraZ = -1000;
	if (_camera) {
		_camera.position.z = _guiOptions.cameraZ;
	}
	_gui.updateDisplay();
}

function updateRotation() {
	// Auto-rotace je řešena v render() funkci
}

function updateCamera() {
	if (_camera) {
		_camera.position.z = _guiOptions.cameraZ;
	}
}

function updateBackground() {
	if (_renderer) {
		_renderer.setClearColor(_guiOptions.bgColor, 1);
	}
}

function updateLineColor() {
	clearTimeout(_colorTimeout);
	_colorTimeout = setTimeout(function() {
		if (_guiOptions.colorMode === 'monochrome' || _guiOptions.colorMode === 'gradient') {
			createLines();
		}
	}, 300);
}

function initGUI() {
	
	// Init GUI - Web version uses dat.GUI from CDN
	_gui = new dat.GUI({ width: 280 });
	document.getElementById('controls-container').appendChild( _gui.domElement );

	// 3D Efekt složka
	var effectFolder = _gui.addFolder('⚙️ 3D Efekt');
	effectFolder.add(_guiOptions, 'stageSize',.2,1,.1).onChange(doLayout).name('Velikost scény');
	effectFolder.add(_guiOptions, 'scale', 0.1, 10,0.1).listen().name('Přiblížení');
	effectFolder.add(_guiOptions, 'scanStep', 1, 20,1).onChange( updateImage ).name('Rozestup čar');
	effectFolder.add(_guiOptions, 'lineThickness', 0.1, 10,0.1).onChange( updateMaterial ).name('Tloušťka čar');
	effectFolder.add(_guiOptions, 'depth', 0, 300,1).name('Hloubka efektu');
	effectFolder.add(_guiOptions, 'opacity', 0, 1,0.1).onChange( updateMaterial ).name('Průhlednost');
	effectFolder.add(_guiOptions, 'depthInvert').name('⚡ Invertovat hloubku').onChange( updateImage );
	effectFolder.add(_guiOptions, 'brightMin', 0, 255, 1).name('Min. jas (ořez)').onChange( updateImage );
	effectFolder.add(_guiOptions, 'brightMax', 0, 255, 1).name('Max. jas (ořez)').onChange( updateImage );
	effectFolder.add(_guiOptions, 'depthFalloff', 0.1, 5.0, 0.1).name('Kontrast hloubky').onChange( updateImage );
	effectFolder.add({ fn: resetEffect }, 'fn').name('🔄 Reset efektu');
	effectFolder.open();

	// 3D Rotace a kamera složka
	var rotationFolder = _gui.addFolder('🔄 Rotace a Kamera');
	rotationFolder.add(_guiOptions, 'autoRotate').name('Auto-rotace').onChange(updateRotation);
	rotationFolder.add(_guiOptions, 'rotateSpeed', 0.001, 0.05, 0.001).name('Rychlost rotace');
	rotationFolder.add(_guiOptions, 'rotationX', -Math.PI, Math.PI, 0.1).name('Rotace X (↕)').listen();
	rotationFolder.add(_guiOptions, 'rotationY', -Math.PI, Math.PI, 0.1).name('Rotace Y (↔)').listen();
	rotationFolder.add(_guiOptions, 'cameraZ', -3000, -100, 10).onChange(updateCamera).name('Vzdálenost kamery');
	rotationFolder.add({ fn: resetRotation }, 'fn').name('🔄 Reset rotace');
	rotationFolder.add({ fn: setFrontalView }, 'fn').name('👁️ Frontální pohled');
	rotationFolder.open();

	// Barvy a režimy složka
	var visualFolder = _gui.addFolder('🎨 Vizuální režimy');
	visualFolder.addColor(_guiOptions, 'bgColor').onChange(updateBackground).name('Barva pozadí');
	visualFolder.add(_guiOptions, 'colorMode', ['original', 'monochrome', 'rainbow', 'gradient']).onChange(updateImage).name('Barevný režim');
	visualFolder.add(_guiOptions, 'lineColorR', 0, 255, 1).onChange(updateLineColor).name('Barva čar - R');
	visualFolder.add(_guiOptions, 'lineColorG', 0, 255, 1).onChange(updateLineColor).name('Barva čar - G');
	visualFolder.add(_guiOptions, 'lineColorB', 0, 255, 1).onChange(updateLineColor).name('Barva čar - B');
	visualFolder.add({ fn: resetVisual }, 'fn').name('🔄 Reset vizualizace');
	visualFolder.open();

	// Základní úpravy složka
	var basicFolder = _gui.addFolder('🎨 Základní úpravy');
	basicFolder.add(_guiOptions, 'brightness', -100, 100, 1).onChange( updateImage ).name('Jas');
	basicFolder.add(_guiOptions, 'contrast', -100, 100, 1).onChange( updateImage ).name('Kontrast');
	basicFolder.add(_guiOptions, 'exposure', -100, 100, 1).onChange( updateImage ).name('Expozice');
	basicFolder.add(_guiOptions, 'saturation', -100, 100, 1).onChange( updateImage ).name('Sytost');
	basicFolder.add(_guiOptions, 'sharpness', 0, 100, 1).onChange( updateImage ).name('Ostrost');
	basicFolder.add({ fn: resetBasic }, 'fn').name('🔄 Reset základu');
	basicFolder.open();

	// Pokročilé úpravy složka
	var advancedFolder = _gui.addFolder('✨ Pokročilé úpravy');
	advancedFolder.add(_guiOptions, 'highlights', -100, 100, 1).onChange( updateImage ).name('Světlá místa');
	advancedFolder.add(_guiOptions, 'shadows', -100, 100, 1).onChange( updateImage ).name('Stíny');
	advancedFolder.add(_guiOptions, 'vignette', 0, 100, 1).onChange( updateImage ).name('Vinětace');
	advancedFolder.add({ fn: resetAdvanced }, 'fn').name('🔄 Reset pokročilých');
	advancedFolder.open();

	// Barvy složka
	var colorFolder = _gui.addFolder('🌈 Barevné úpravy');
	colorFolder.add(_guiOptions, 'color', -100, 100, 1).onChange( updateImage ).name('Barevný posun');
	colorFolder.add(_guiOptions, 'warmth', -100, 100, 1).onChange( updateImage ).name('Teplota');
	colorFolder.add(_guiOptions, 'tint', -100, 100, 1).onChange( updateImage ).name('Nádech');
	colorFolder.add(_guiOptions, 'hue', -180, 180, 1).onChange( updateImage ).name('Barevný odstín');
	colorFolder.add(_guiOptions, 'gamma', 0.1, 3.0, 0.1).onChange( updateImage ).name('Gamma korekce');
	colorFolder.add(_guiOptions, 'invertImage').onChange( updateImage ).name('Invertovat barvy');
	colorFolder.add({ fn: resetColor }, 'fn').name('🔄 Reset barev');
	colorFolder.open();

	// RGB Kanály složka
	var rgbFolder = _gui.addFolder('🔴🟢🔵 RGB Kanály');
	rgbFolder.add(_guiOptions, 'rGain', 0, 2.0, 0.1).onChange( updateImage ).name('Zesílení R (Červená)');
	rgbFolder.add(_guiOptions, 'gGain', 0, 2.0, 0.1).onChange( updateImage ).name('Zesílení G (zelená)');
	rgbFolder.add(_guiOptions, 'bGain', 0, 2.0, 0.1).onChange( updateImage ).name('Zesílení B (modrá)');
	rgbFolder.add({ fn: resetRGB }, 'fn').name('🔄 Reset RGB');

	// Akce
	_gui.add({ fn: resetFilters }, 'fn').name('🔄 Resetovat filtry');
	_gui.add({ fn: saveImage }, 'fn').name('💾 Uložit obrázek');
	
}

/**
 * Init page
 */
$(document).ready( function() {

	// Inicializuj GUI až po načtení DOM
	initGUI();

	// Ovládání help panelu
	$("#toggle-help").click(function() {
		$("#help-panel").toggleClass("collapsed");
	});

	// Ovládání postranního panelu
	$("#toggle-panel").click(function() {
		$("#controls-panel").toggleClass("collapsed");
	});

	$(window).bind('resize', doLayout);

	//init image drag and drop
	if (typeof(FileReader) != "undefined") {

		window.addEventListener('dragover', function(event) {
			event.preventDefault();
		}, false);
		window.addEventListener('drop', function(event) {
			event.preventDefault();

			var file = event.dataTransfer.files[0];
			var fileType = file.type;
			if (!fileType.match(/image\/\w+/)) {
				alert("Podporovány jsou pouze obrázkové soubory.");
				return;
			}

			var reader = new FileReader();
			reader.onload = function() {

				// Vyčisti starý obrázek před načtením nového
				if (_inputImage) {
					_inputImage.onload = null;
					_inputImage.onerror = null;
					_inputImage.src = '';
					_inputImage = null;
				}

				_inputImage = new Image();
				_inputImage.src = reader.result;

				_inputImage.onload = function() {
					onImageLoaded();
				};
			};
			reader.readAsDataURL(file);
		}, false);
	} else {
	}

	// stop the user getting a text cursor
	document.onselectstart = function() {
		return false;
	};
	_stage = document.getElementById("stage");

	$("#loadSample").click( function() {
		loadSample();
	});
	
	// Web version: Use HTML file input instead of Electron IPC
	$("#fileInput").change(function(event) {
		var file = event.target.files[0];
		if (file) {
			
			if (!file.type.match(/image\/\w+/)) {
				alert("Podporovány jsou pouze obrázkové soubory.");
				return;
			}

			var reader = new FileReader();
			reader.onload = function() {
				// Vyčisti starý obrázek před načtením nového
				if (_inputImage) {
					_inputImage.onload = null;
					_inputImage.onerror = null;
					_inputImage.src = '';
					_inputImage = null;
				}

				_inputImage = new Image();
				_inputImage.src = reader.result;
				_inputImage.onload = function() {
					onImageLoaded();
				};
			};
			reader.readAsDataURL(file);
		}
	});

	//init mouse listeners
	$("#stage").mousemove( onMouseMove);
	$("#stage").mousewheel( onMouseWheel); // Scroll jen nad 3D scénou
	$(window).keydown(onKeyDown);
	$(window).mousedown( function() {
		_enableMouseMove = true;
	});
	$(window).mouseup( function() {
		_enableMouseMove = false;
	});

	doLayout();

	if (!Detector.webgl) {
		$("#overlay").empty();
		Detector.addGetWebGLMessage({
			parent: document.getElementById("overlay")
		});
	} else {
		initWebGL();
	}

});

function initWebGL() {
	_camera = new THREE.Camera(75, 16/9, 1, 3000);
	_camera.position.z = -1000;
	_scene = new THREE.Scene();

	_renderer = new THREE.WebGLRenderer({
		antialias: true,
		clearAlpha: 1,
		sortObjects: false,
		sortElements: false
	});
	
	_renderer.setClearColor(_guiOptions.bgColor, 1);
	_lineHolder = new THREE.Object3D();
	_scene.addObject(_lineHolder);

	doLayout();
	animate();
}

function onImageLoaded() {
	
	disposeLineGroup();
	
	if (_canvas) {
		_canvas.width = 1;
		_canvas.height = 1;
		_canvas = null;
	}
	if (_context) {
		_context = null;
	}
	if (_pixels) {
		_pixels = null;
	}
	if (_originalPixels) {
		_originalPixels = null;
	}
	

	_imageWidth = _inputImage.width;
	_imageHeight = _inputImage.height;

	if (_imageWidth > 6000 || _imageHeight > 6000) {
		alert('Obrázek je příliš velký (max 6000x6000 px). Zmenšete ho nebo použijte menší obrázek.');
		// Vyčisti obrázek z paměti
		_inputImage.onload = null;
		_inputImage.onerror = null;
		_inputImage.src = '';
		_inputImage = null;
		return;
	}
	
	if (_imageWidth === 0 || _imageHeight === 0) {
		alert('Chyba: Obrázek se nepodařilo načíst správně.');
		// Vyčisti obrázek z paměti
		_inputImage.onload = null;
		_inputImage.onerror = null;
		_inputImage.src = '';
		_inputImage = null;
		return;
	}

	try {
		_canvas	= document.createElement('canvas');
		_canvas.width = _imageWidth;
		_canvas.height = _imageHeight;
		_context = _canvas.getContext('2d');
		
		_context.drawImage(_inputImage, 0, 0);
		
		var imageData = _context.getImageData(0, 0, _imageWidth, _imageHeight);
		_pixels	= imageData.data;
		_originalPixels = new Uint8ClampedArray(_pixels);
		
		
		applyFilters();
		createLines();
	} catch (error) {
		console.error('Chyba při zpracování obrázku:', error);
		console.error('Stack trace:', error.stack);
		alert('Nepodařilo se zpracovat obrázek: ' + error.message);
	}
}

function createLines() {
	// Kontrola, jestli je WebGL inicializovaný
	if (!_renderer) {
		return;
	}
	
	$("#overlay").hide();
	_stage.appendChild(_renderer.domElement);

	var x = 0, y = 0;

	disposeLineGroup();

	_lineGroup = new THREE.Object3D();

	if (!_material) {
		_material = new THREE.LineBasicMaterial({
			color: 0xffffff,
			opacity: _guiOptions.opacity,
			linewidth: _guiOptions.lineThickness,
			blending: THREE.NormalBlending,
			depthTest: false,
			vertexColors: true
		});
	} else {
		_material.opacity = _guiOptions.opacity;
		_material.linewidth = _guiOptions.lineThickness;
	}

	try {
		for(y = 0; y < _imageHeight; y+= _guiOptions.scanStep) {
			var geometry = new THREE.Geometry();
			for(x = 0; x < _imageWidth ; x+= _guiOptions.scanStep) {
				var color;
				
				switch(_guiOptions.colorMode) {
					case 'monochrome':
						var brightness = getBrightness(new THREE.Color(getColor(x, y)));
						color = new THREE.Color(
							_guiOptions.lineColorR / 255 * brightness,
							_guiOptions.lineColorG / 255 * brightness,
							_guiOptions.lineColorB / 255 * brightness
						);
						break;
					case 'rainbow':
						var hue = (x / _imageWidth + y / _imageHeight) / 2;
						color = new THREE.Color().setHSL(hue, 1, 0.5);
						break;
					case 'gradient':
						var ratio = y / _imageHeight;
						color = new THREE.Color(
							_guiOptions.lineColorR / 255 * (1 - ratio) + ratio,
							_guiOptions.lineColorG / 255 * ratio,
							_guiOptions.lineColorB / 255 * (1 - ratio)
						);
						break;
					case 'original':
					default:
						color = new THREE.Color(getColor(x, y));
						break;
				}
				
				var brightness = getBrightness(color);
				var pixelBrightness = brightness * 255;
				var activeBrightness = pixelBrightness;
				
				if (activeBrightness < _guiOptions.brightMin || activeBrightness > _guiOptions.brightMax) {
					activeBrightness = _guiOptions.brightMin;
				}
				
				var normalizedBrightness = (activeBrightness - _guiOptions.brightMin) / 
				                          Math.max(1, _guiOptions.brightMax - _guiOptions.brightMin);
				normalizedBrightness = Math.max(0, Math.min(1, normalizedBrightness));
				
				if (_guiOptions.depthInvert) {
					normalizedBrightness = 1.0 - normalizedBrightness;
				}
				
				var zDepth = Math.pow(normalizedBrightness, _guiOptions.depthFalloff);
				
				var posn = new THREE.Vector3(x -_imageWidth/2, y - _imageHeight/2, -zDepth * 100);
				geometry.vertices.push(new THREE.Vertex(posn));
				geometry.colors.push(color);
			}
			var line = new THREE.Line(geometry, _material );
			_lineGroup.addChild(line);
		}

	_lineHolder.addChild(_lineGroup);
	
	} catch (error) {
		console.error('Chyba při vytváření 3D čar:', error);
		alert('Chyba při generování 3D efektu. Zkuste snížit velikost obrázku nebo zvýšit rozestup čar.');
	}
}

function updateMaterial() {
	if (_material) {
		_material.opacity = _guiOptions.opacity;
		_material.linewidth = _guiOptions.lineThickness;
	}
}

function updateImage() {
	if (_isUpdating) return;
	
	clearTimeout(_updateTimeout);
	_updateTimeout = setTimeout(function() {
		_isUpdating = true;
		try {
			applyFilters();
			createLines();
		} finally {
			_isUpdating = false;
		}
	}, 300);
}

function disposeLineGroup() {
	if (_lineGroup) {
		try {
			for (var i = _lineGroup.children.length - 1; i >= 0; i--) {
				var line = _lineGroup.children[i];
				if (line.geometry) {
					line.geometry.dispose();
				}
				if (line.material && line.material !== _material) {
					line.material.dispose();
				}
			}
			if (_lineHolder && _lineGroup.parent) {
				_lineHolder.removeChild(_lineGroup);
			}
			_lineGroup = null;
		} catch (e) {
			console.warn('Varování při čištění lineGroup:', e);
			_lineGroup = null;
		}
	}
}

function resetFilters() {
	_guiOptions.brightness = 0;
	_guiOptions.exposure = 0;
	_guiOptions.contrast = 0;
	_guiOptions.highlights = 0;
	_guiOptions.shadows = 0;
	_guiOptions.vignette = 0;
	_guiOptions.color = 0;
	_guiOptions.saturation = 0;
	_guiOptions.warmth = 0;
	_guiOptions.tint = 0;
	_guiOptions.sharpness = 0;
	_guiOptions.hue = 0;
	_guiOptions.gamma = 1.0;
	_guiOptions.rGain = 1.0;
	_guiOptions.gGain = 1.0;
	_guiOptions.bGain = 1.0;
	_guiOptions.invertImage = false;
	_gui.updateDisplay();
	updateImage();
}

function applyFilters() {
	if (!_originalPixels) return;
	
	var hasFilters = _guiOptions.brightness !== 0 || _guiOptions.exposure !== 0 || 
	                 _guiOptions.contrast !== 0 || _guiOptions.highlights !== 0 || 
	                 _guiOptions.shadows !== 0 || _guiOptions.vignette > 0 || 
	                 _guiOptions.color !== 0 || _guiOptions.saturation !== 0 || 
	                 _guiOptions.warmth !== 0 || _guiOptions.tint !== 0 || 
	                 _guiOptions.sharpness > 0 || _guiOptions.hue !== 0 ||
	                 _guiOptions.gamma !== 1.0 || _guiOptions.rGain !== 1.0 ||
	                 _guiOptions.gGain !== 1.0 || _guiOptions.bGain !== 1.0 ||
	                 _guiOptions.invertImage;
	
	if (!hasFilters) {
		_pixels.set(_originalPixels);
		return;
	}
	
	_pixels.set(_originalPixels);
	
	var data = _pixels;
	var len = data.length;
	
	var br = _guiOptions.brightness * 2.55;
	var con = (_guiOptions.contrast + 100) / 100;
	con = con * con;
	var exp = _guiOptions.exposure !== 0 ? Math.pow(2, _guiOptions.exposure / 50) : 1;
	var sat = _guiOptions.saturation / 100;
	var warm = _guiOptions.warmth / 100;
	var tnt = _guiOptions.tint / 100;
	
	for (var i = 0; i < len; i += 4) {
		var r = data[i], g = data[i+1], b = data[i+2];
		
		// 1. Exposure & Gamma
		if (_guiOptions.exposure !== 0 || _guiOptions.gamma !== 1.0) {
			r = 255 * Math.pow((r/255) * exp, 1/_guiOptions.gamma);
			g = 255 * Math.pow((g/255) * exp, 1/_guiOptions.gamma);
			b = 255 * Math.pow((b/255) * exp, 1/_guiOptions.gamma);
		}
		
		// 2. Brightness & Contrast
		if (_guiOptions.brightness !== 0 || _guiOptions.contrast !== 0) {
			r = (r - 128) * con + 128 + br;
			g = (g - 128) * con + 128 + br;
			b = (b - 128) * con + 128 + br;
		}
		
		// 3. Warmth & Tint
		if (_guiOptions.warmth !== 0) {
			r += warm * 30;
			b -= warm * 30;
		}
		if (_guiOptions.tint !== 0) {
			g += tnt * 30;
		}
		
		// 4. RGB Gains
		if (_guiOptions.rGain !== 1.0) r *= _guiOptions.rGain;
		if (_guiOptions.gGain !== 1.0) g *= _guiOptions.gGain;
		if (_guiOptions.bGain !== 1.0) b *= _guiOptions.bGain;
		
		// 5. Highlights & Shadows
		if (_guiOptions.highlights !== 0 || _guiOptions.shadows !== 0) {
			var lum = 0.299 * r + 0.587 * g + 0.114 * b;
			var factor = 1;
			if (lum > 180) {
				factor = 1 + _guiOptions.highlights / 200;
			} else if (lum < 80) {
				factor = 1 + _guiOptions.shadows / 200;
			}
			r *= factor;
			g *= factor;
			b *= factor;
		}
		
		// 6. Saturation
		if (_guiOptions.saturation !== 0) {
			var gray = 0.299 * r + 0.587 * g + 0.114 * b;
			r = gray + (r - gray) * (1 + sat);
			g = gray + (g - gray) * (1 + sat);
			b = gray + (b - gray) * (1 + sat);
		}
		
		// 7. Hue Shift (HSL)
		if (_guiOptions.hue !== 0) {
			var max = Math.max(r, g, b) / 255;
			var min = Math.min(r, g, b) / 255;
			var h, s, l = (max + min) / 2;
			
			if (max !== min) {
				var d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				
				if (max === r/255) h = (g/255 - b/255) / d + (g < b ? 6 : 0);
				else if (max === g/255) h = (b/255 - r/255) / d + 2;
				else h = (r/255 - g/255) / d + 4;
				h /= 6;
				
				h = (h + _guiOptions.hue / 360) % 1;
				if (h < 0) h += 1;
				
				var hue2rgb = function(p, q, t) {
					if (t < 0) t += 1;
					if (t > 1) t -= 1;
					if (t < 1/6) return p + (q - p) * 6 * t;
					if (t < 1/2) return q;
					if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
					return p;
				};
				
				var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				var p = 2 * l - q;
				r = hue2rgb(p, q, h + 1/3) * 255;
				g = hue2rgb(p, q, h) * 255;
				b = hue2rgb(p, q, h - 1/3) * 255;
			}
		}
		
		// 8. Color shift
		if (_guiOptions.color !== 0) {
			var tint = _guiOptions.color / 100;
			r += tint * 50;
			b -= tint * 50;
		}
		
		// 9. Invert
		if (_guiOptions.invertImage) {
			r = 255 - r;
			g = 255 - g;
			b = 255 - b;
		}
		
		// Clamping
		data[i] = Math.max(0, Math.min(255, r));
		data[i+1] = Math.max(0, Math.min(255, g));
		data[i+2] = Math.max(0, Math.min(255, b));
	}
	
	// 10. Vignette
	if (_guiOptions.vignette > 0) {
		applyVignette(data);
	}
	
	// 11. Sharpness
	if (_guiOptions.sharpness > 0) {
		applySharpness(data);
	}
}

function applyVignette(data) {
	var v = _guiOptions.vignette / 100;
	for (var y = 0; y < _imageHeight; y++) {
		for (var x = 0; x < _imageWidth; x++) {
			var dx = (x / _imageWidth) - 0.5;
			var dy = (y / _imageHeight) - 0.5;
			var dist = Math.sqrt(dx*dx + dy*dy);
			var factor = Math.max(0, 1 - dist * v * 1.5);
			var idx = (y * _imageWidth + x) * 4;
			data[idx] *= factor;
			data[idx+1] *= factor;
			data[idx+2] *= factor;
		}
	}
}

function applySharpness(data) {
	var sharp = _guiOptions.sharpness / 100;
	var temp = new Uint8ClampedArray(data);
	for (var y = 1; y < _imageHeight - 1; y++) {
		for (var x = 1; x < _imageWidth - 1; x++) {
			var idx = (y * _imageWidth + x) * 4;
			for (var c = 0; c < 3; c++) {
				var center = temp[idx + c];
				var neighbors = (temp[idx - 4 + c] + temp[idx + 4 + c] + 
				                temp[idx - _imageWidth*4 + c] + temp[idx + _imageWidth*4 + c]) / 4;
				data[idx + c] = Math.max(0, Math.min(255, center + (center - neighbors) * sharp * 2));
			}
		}
	}
}

function onMouseMove(event) {
	if (_enableMouseMove) {
		_mouseX = event.pageX - _stageCenterX;
		_mouseY = event.pageY - _stageCenterY;
	}
}

function onMouseWheel(e,delta) {
	_guiOptions.scale += delta * 0.1;
	_guiOptions.scale = Math.max(_guiOptions.scale, .1);
	_guiOptions.scale = Math.min(_guiOptions.scale, 10);
}

function onKeyDown(evt) {
	if (event.keyCode == '83') {
		saveImage();
	}
	switch(event.keyCode) {
		case 37:
			_manualRotY -= 0.1;
			break;
		case 38:
			_manualRotX -= 0.1;
			break;
		case 39:
			_manualRotY += 0.1;
			break;
		case 40:
			_manualRotX += 0.1;
			break;
	}
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	if (!_lineHolder) return;

	var depthScale = _guiOptions.depth / 100;
	_lineHolder.scale = new THREE.Vector3(_guiOptions.scale, _guiOptions.scale, _guiOptions.scale * depthScale);

	if (_guiOptions.autoRotate) {
		_guiOptions.rotationY += _guiOptions.rotateSpeed;
		_lineHolder.rotation.y = _guiOptions.rotationY;
		_lineHolder.rotation.x = _guiOptions.rotationX;
	} else {
		var xrot = _mouseX / _stageWidth * Math.PI * 2 + Math.PI;
		var yrot = _mouseY / _stageHeight * Math.PI * 2 + Math.PI;

		var targetX = -yrot + _manualRotX + _guiOptions.rotationX;
		var targetY = xrot + _manualRotY + _guiOptions.rotationY;
		
		_lineHolder.rotation.x += (targetX - _lineHolder.rotation.x) * 0.3;
		_lineHolder.rotation.y += (targetY - _lineHolder.rotation.y) * 0.3;
	}

	if (_renderer && _scene && _camera) {
		_renderer.render(_scene, _camera);
	}
}

function doLayout() {
	var winHeight, winWidth, controlsWidth, containerWidth;

	winHeight = window.innerHeight ? window.innerHeight : $(window).height();
	winWidth = window.innerWidth ? window.innerWidth : $(window).width();
	controlsWidth = $('#controls').outerWidth();

	$('#container').height(parseInt(winHeight));
	$('#container').width(parseInt(winWidth) - parseInt(controlsWidth));
	containerWidth = $('#container').outerWidth();

	_stageWidth = containerWidth * _guiOptions.stageSize;
	_stageHeight = containerWidth * _guiOptions.stageSize * 9 / 16;

	if (_guiOptions.stageSize === 1) {
		_stageHeight = $('#container').outerHeight();
	}
	$('#stage').width(_stageWidth);
	$('#stage').height(_stageHeight);

	$('#stage').css({
		left: Math.max((containerWidth - _stageWidth)/2 + controlsWidth,controlsWidth),
		top: (winHeight -_stageHeight)/2,
		visibility:"visible"
	});

	if (_renderer) {
		_renderer.setSize(_stageWidth, _stageHeight);
		_camera.aspect = _stageWidth / _stageHeight;
		_camera.updateProjectionMatrix();
	}

	_stageCenterX = $('#stage').offset().left +_stageWidth / 2;
	_stageCenterY = window.innerHeight / 2
}

function getColor(x, y) {
	var base = (Math.floor(y) * _imageWidth + Math.floor(x)) * 4;
	var c = {
		r: _pixels[base + 0],
		g: _pixels[base + 1],
		b: _pixels[base + 2],
		a: _pixels[base + 3]
	};
	return (c.r << 16) + (c.g << 8) + c.b;
};

function getBrightness(c) {
	return ( 0.34 * c.r + 0.5 * c.g + 0.16 * c.b );
};

function loadSample() {
	try {
		
		if (_inputImage) {
			_inputImage.onload = null;
			_inputImage.onerror = null;
			_inputImage.src = '';
			_inputImage = null;
		}

		_inputImage = new Image();
		_inputImage.src = ("img/vermeer.jpg");

		_inputImage.onload = function() {
			onImageLoaded();
		};
		
		_inputImage.onerror = function() {
			console.error('Nepodařilo se načíst ukázkový obrázek');
			alert('Ukázkový obrázek nebyl nalezen. Použijte prosím vlastní obrázek.');
		};
	} catch (error) {
		console.error('Chyba při načítání ukázky:', error);
	}
}
