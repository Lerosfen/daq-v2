/**
 * 登录页面js
 */
$package("login");
login={
	/**
	 * 初始化方法
	 */
	initLoginPage:function() {
		this.obj = {
            loginForm:$('#loginForm'),
            loginResetBtn:$('#loginResetBtn'),
            loginSubmitBtn:$('#loginSubmitBtn'),
            pwdInput: $("input[name='password']")
		};
        this.initEvent();//index页面事件初始化
	},
	/**
	* 页面事件绑定
	*/
	initEvent:function() {
        var self = this;
        //登录按钮事件
        self.obj.loginSubmitBtn.unbind().bind('click', function () {
            window.location.href = wwwroot + "/tpl/index.html";
        });
        self.obj.pwdInput.keyup(function(event){
            if(event.keyCode == 13){
                window.location.href = wwwroot + "/tpl/index.html";
            }
        })
        //重置按钮事件
        self.obj.loginResetBtn.unbind().bind('click', function () {
            self.obj.loginForm.setform({username:'',password:''});
        });
    },

    initWave:function(){
        var SEPARATION = 40,
            AMOUNTX = 100,
            AMOUNTY = 100;
        var container;
        var camera, scene, renderer;
        var count = 0;
        var particles, particle;
        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;

        var cont = document.getElementsByClassName('container')[0];
        container = document.createElement("div");
        cont.appendChild(container);
        camera = new THREE.PerspectiveCamera(
            100,
            window.innerWidth / window.innerHeight,
            1,
            10000
        );
        container.style.cssText = "position:fixed;top:330px;left:0;opacity: 0.9;z-index: 99";
        camera.position.z = 1000;
        scene = new THREE.Scene();
        particles = new Array();
        var PI2 = Math.PI * 2;
        var material = new THREE.ParticleCanvasMaterial({
            color: 0x02ffff,
            program: function (context) {
                context.beginPath();
                context.arc(0, 0, 1, 0, PI2, true);
                context.fill();
            }
        });
        var i = 0;
        for (var ix = 0; ix < AMOUNTX; ix++) {
            for (var iy = 0; iy < AMOUNTY; iy++) {
                particle = particles[i++] = new THREE.Particle(material);
                particle.position.x = ix * SEPARATION - AMOUNTX * SEPARATION / 2;
                particle.position.z = iy * SEPARATION - AMOUNTY * SEPARATION / 2;
                scene.add(particle);
            }
        }
        renderer = new THREE.CanvasRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        window.addEventListener("resize", function(){
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
        var animate = function() {
            requestAnimationFrame(animate);
            camera.position.x += (85 - camera.position.x) * 0.05;
            camera.position.y += (200 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            var i = 0;
            for (var ix = 0; ix < AMOUNTX; ix++) {
                for (var iy = 0; iy < AMOUNTY; iy++) {
                    particle = particles[i++];
                    particle.position.y =
                        Math.sin((ix + count) * 0.3) * 50 +
                        Math.sin((iy + count) * 0.5) * 50;
                    particle.scale.x = particle.scale.y =
                        (Math.sin((ix + count) * 0.3) + 1) * 2 +
                        (Math.sin((iy + count) * 0.5) + 1) * 2;
                }
            }
            renderer.render(scene, camera);
            count += 0.1;
        }
        animate();
    }
};
$(function(){
	login.initLoginPage();
	login.initWave();
});