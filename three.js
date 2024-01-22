//import bg1 from './assets/images/png/bg1.png';

var skyScene = new THREE.Scene();
var skyCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var skyRenderer = new THREE.WebGLRenderer();

skyScene.background = new THREE.Color(0x030012);
skyRenderer.setSize(window.innerWidth, window.innerHeight);
var skyBackground = document.getElementById("background-page");
skyBackground.appendChild(skyRenderer.domElement);

var stars = [];

for (let i = 0; i < 2000; i++) {
    var geometry = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    var color = new THREE.Color(Math.random(), Math.random(), Math.random());
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var star = new THREE.Mesh(geometry, material);
    star.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
    );
    skyScene.add(star);
    stars.push(star);
}


skyCamera.position.z = 2;

function animateStars() {
    stars.forEach(star => {
        if (Math.random() > 0.98) {
            star.visible = !star.visible;
        }
    });
}

function animate() {
    requestAnimationFrame(animate);

    skyScene.rotation.x += 0.001;
    skyScene.rotation.y += 0.001;

    animateStars();

    skyRenderer.render(skyScene, skyCamera);
}

animate();
