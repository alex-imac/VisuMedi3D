function start() {
  var canvas = document.getElementById("glcanvas");

    
  initWebGL(canvas);      // Initialise le contexte WebGL

      
  // Continue seulement si le WebGL est disponible et est en train de fonctionner
      
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Met la couleur d'effacement au noir et complétement opaque
    gl.enable(gl.DEPTH_TEST);                               // Active le test de profondeur
    gl.depthFunc(gl.LEQUAL);                                // Les objets proches cachent les objets lointains
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Efface les couleurs et le buffer de profondeur.
  }
} 


function initWebGL(canvas) { 
  // Initialise la variable gloable gl à null
  gl = null; 

  try { 
    // Essaye de récupérer le contexte standard. En cas d'échec, il teste l'appel experimental
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl"); 
  } 
  catch(e) {} 

   // Si le contexte GL n'est pas récupéré, on l'indique à l'utilisateur.
    if (!gl) { 
      alert("Impossible d'initialiser le WebGL. Il est possible que votre navigateur ne supporte pas cette fonctionnalité."); 
  } 
}  

function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");
  
  // Créer le programme shader
  
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  
  // Faire une alerte si le chargement du shader échoue
  
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Impossible d'initialiser le shader.");
  }
  
  gl.useProgram(shaderProgram);
  
  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);
}


function getShader(gl, id) {
    var shaderScript, theSource, currentChild, shader;
    
    shaderScript = document.getElementById(id);
    
    if (!shaderScript) {
        return null;
    }
    
    theSource = "";
    currentChild = shaderScript.firstChild;
    
    while(currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
            theSource += currentChild.textContent;
        }
        
        currentChild = currentChild.nextSibling;
    }

     if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
     // type de shader inconnu
     return null;
  }

    gl.shaderSource(shader, theSource);
    
  // Compile le programme shader
  gl.compileShader(shader);  
    
  // Vérifie si la compilation s'est bien déroulée
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
      alert("Une erreur est survenue au cours de la compilation des shaders: " + gl.getShaderInfoLog(shader));
      return null;  
  }
    
  return shader;
}

//----------------------------------------------------------
//
//						Init Buffers
//
//
function initBuffers() {
  squareVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  
  var vertices = [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

//----------------------------------------------------------
//
//						Draw Scene
//
//
function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
  
  loadIdentity();
  mvTranslate([-0.0, 0.0, -6.0]);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}



