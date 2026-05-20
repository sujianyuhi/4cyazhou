import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class ModelViewer {
    constructor() {
        this.container = document.getElementById('model-viewer');
        this.loadingEl = document.getElementById('model-loading');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.autoRotate = true;
        this.animationId = null;
        this.lights = [];

        if (!this.container) return;

        this.init();
        this.loadModel();
        this.bindEvents();
    }

    init() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        // 场景
        this.scene = new THREE.Scene();
        this.scene.background = null;

        // 相机
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(4, 3.2, 4);

        // 渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.container.appendChild(this.renderer.domElement);

        // 控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1.0;
        this.controls.minDistance = 1.5;
        this.controls.maxDistance = 10;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
        this.controls.target.set(0, 0.5, 0);

        // 灯光系统
        this.setupLights();

        // 地面
        this.setupGround();

        // 开始渲染循环
        this.animate();
    }

    setupLights() {
        // 环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // 主光源（柔和自然光）
        const mainLight = new THREE.DirectionalLight(0xfff8f0, 1.2);
        mainLight.position.set(5, 10, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -10;
        mainLight.shadow.camera.right = 10;
        mainLight.shadow.camera.top = 10;
        mainLight.shadow.camera.bottom = -10;
        this.scene.add(mainLight);
        this.lights.push(mainLight);

        // 补光（暖色调）
        const fillLight = new THREE.DirectionalLight(0xf5e6d3, 0.4);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);

        // 轮廓光
        const rimLight = new THREE.DirectionalLight(0xffeedd, 0.5);
        rimLight.position.set(-3, 8, 3);
        this.scene.add(rimLight);
    }

    setupGround() {
        // 获取页面背景色，与CSS变量 --color-paper (#F5F0E8) 统一
        const pageBgColor = new THREE.Color(0xF5F0E8);
        
        // 圆形地面，与页面背景色完全一致
        const groundGeometry = new THREE.CircleGeometry(15, 64);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: pageBgColor,
            roughness: 1.0,
            metalness: 0.0
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.01;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // 极淡的网格辅助线，仅作为微妙的参考
        const gridHelper = new THREE.GridHelper(20, 40, 0xE8E0D0, 0xE8E0D0);
        gridHelper.position.y = 0.001;
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.15;
        this.scene.add(gridHelper);
    }

    loadModel() {
        const loader = new GLTFLoader();
        const modelPath = 'Model/model1.glb';

        loader.load(
            modelPath,
            (gltf) => {
                this.model = gltf.scene;

                // 计算模型边界框
                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                // 缩放模型以适应场景
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 4 / maxDim;
                this.model.scale.setScalar(scale);

                // 重新计算边界并居中
                this.model.updateMatrixWorld();
                const newBox = new THREE.Box3().setFromObject(this.model);
                const newCenter = newBox.getCenter(new THREE.Vector3());
                const newSize = newBox.getSize(new THREE.Vector3());

                this.model.position.x = -newCenter.x;
                this.model.position.z = -newCenter.z;
                this.model.position.y = -newBox.min.y;

                // 启用阴影
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        if (child.material) {
                            child.material.needsUpdate = true;
                        }
                    }
                });

                this.scene.add(this.model);

                // 调整相机目标
                this.controls.target.set(0, newSize.y * 0.3, 0);

                // 隐藏加载动画
                if (this.loadingEl) {
                    this.loadingEl.style.display = 'none';
                }
            },
            (progress) => {
                // 加载进度
                const percent = (progress.loaded / progress.total * 100).toFixed(0);
                if (this.loadingEl) {
                    const span = this.loadingEl.querySelector('span');
                    if (span) span.textContent = `模型加载中... ${percent}%`;
                }
            },
            (error) => {
                console.error('模型加载失败:', error);
                if (this.loadingEl) {
                    const span = this.loadingEl.querySelector('span');
                    if (span) span.textContent = '模型加载失败，请刷新重试';
                }
            }
        );
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (this.controls) {
            this.controls.update();
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onResize() {
        if (!this.container || !this.camera || !this.renderer) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    resetView() {
        if (!this.camera || !this.controls) return;

        this.camera.position.set(4, 3.2, 4);
        this.controls.target.set(0, 0.5, 0);
        this.controls.update();
    }

    toggleAutoRotate() {
        this.autoRotate = !this.autoRotate;
        if (this.controls) {
            this.controls.autoRotate = this.autoRotate;
        }
        return this.autoRotate;
    }

    bindEvents() {
        // 窗口大小变化
        window.addEventListener('resize', () => this.onResize());

        // 重置视角按钮
        const resetBtn = document.getElementById('model-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetView());
        }

        // 自动旋转按钮
        const rotateBtn = document.getElementById('model-rotate');
        if (rotateBtn) {
            rotateBtn.addEventListener('click', () => {
                const isActive = this.toggleAutoRotate();
                rotateBtn.classList.toggle('active', isActive);
            });
        }

        // 使用 Intersection Observer 检测模型区域是否可见
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.controls.autoRotate = this.autoRotate;
                    } else {
                        this.controls.autoRotate = false;
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (this.container) {
            observer.observe(this.container);
        }
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

// 初始化
let viewer = null;

document.addEventListener('DOMContentLoaded', () => {
    // 延迟初始化，确保页面其他元素已加载
    setTimeout(() => {
        viewer = new ModelViewer();
    }, 100);
});
