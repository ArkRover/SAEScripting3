// Three.js variables
            let scene, camera, renderer, model, controls;
            let wireframeEnabled = false;
            
            // Initialize Three.js scene
            function initThreeJS() {
                // Create scene
                scene = new THREE.Scene();
                scene.background = new THREE.Color(0x1e1e1e);
                
                // Add lights
                const ambientLight = new THREE.AmbientLight(0x404040, 2);
                scene.add(ambientLight);
                
                const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
                directionalLight.position.set(1, 1, 1).normalize();
                scene.add(directionalLight);
                
                // Create camera
                const container = document.getElementById('model-viewer');
                const width = container.clientWidth;
                const height = container.clientHeight;
                
                camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
                camera.position.z = 5;
                
                // Create renderer
                renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.setSize(width, height);
                renderer.setPixelRatio(window.devicePixelRatio);
                
                // Add renderer to container
                container.prepend(renderer.domElement);
                
                // Add orbit controls
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.25;
                
                // Handle window resize
                window.addEventListener('resize', onWindowResize);
                
                // Start animation loop
                animate();
            }
            
            // Animation loop
            function animate() {
                requestAnimationFrame(animate);
                
                if (controls) {
                    controls.update();
                }
                
                renderer.render(scene, camera);
            }
            
            // Handle window resize
            function onWindowResize() {
                const container = document.getElementById('model-viewer');
                const width = container.clientWidth;
                const height = container.clientHeight;
                
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
            
            // Load a 3D model
            function loadModel(modelUrl, thumbnailElement = null) {
                const loadingOverlay = document.getElementById('loading-overlay');
                loadingOverlay.style.display = 'flex';
                
                // Clear previous model
                if (model) {
                    scene.remove(model);
                    // Dispose of resources if needed
                    if (model.geometry) model.geometry.dispose();
                    if (model.material) {
                        if (Array.isArray(model.material)) {
                            model.material.forEach(m => m.dispose());
                        } else {
                            model.material.dispose();
                        }
                    }
                }
                
                // Check file extension
                const extension = modelUrl.split('.').pop().toLowerCase();
                
                if (extension === 'fbx') {
                    // Load FBX model
                    const loader = new THREE.FBXLoader();
                    loader.load(modelUrl, 
                        function(object) {
                            model = object;
                            scene.add(model);
                            
                            // Center and scale model
                            const box = new THREE.Box3().setFromObject(model);
                            const center = box.getCenter(new THREE.Vector3());
                            const size = box.getSize(new THREE.Vector3());
                            
                            model.position.x += (model.position.x - center.x);
                            model.position.y += (model.position.y - center.y);
                            model.position.z += (model.position.z - center.z);
                            
                            // Scale model to fit view
                            const maxDim = Math.max(size.x, size.y, size.z);
                            const scale = 2 / maxDim;
                            model.scale.set(scale, scale, scale);
                            
                            loadingOverlay.style.display = 'none';
                            
                            // Update active thumbnail if provided
                            if (thumbnailElement) {
                                updateActiveThumbnail(thumbnailElement);
                            }
                        },
                        // Progress callback
                        function(xhr) {
                            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                        },
                        // Error callback
                        function(error) {
                            console.error('Error loading model:', error);
                            loadingOverlay.textContent = 'Error loading model';
                        }
                    );
                } else {
                    // For other formats or placeholder
                    console.log('Loading placeholder for:', modelUrl);
                    
                    // Create a simple placeholder geometry
                    const geometry = new THREE.BoxGeometry(1, 1, 1);
                    const material = new THREE.MeshStandardMaterial({ 
                        color: 0x00ff00,
                        wireframe: wireframeEnabled
                    });
                    model = new THREE.Mesh(geometry, material);
                    scene.add(model);
                    
                    loadingOverlay.style.display = 'none';
                    
                    if (thumbnailElement) {
                        updateActiveThumbnail(thumbnailElement);
                    }
                }
            }
            
            // Update active thumbnail
            function updateActiveThumbnail(element) {
                document.querySelectorAll('.thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                    thumb.setAttribute('aria-selected', 'false');
                });
                
                element.classList.add('active');
                element.setAttribute('aria-selected', 'true');
            }
            
            // Initialize when DOM is loaded
            document.addEventListener('DOMContentLoaded', () => {
                initThreeJS();
                
                // Set up control buttons
                document.getElementById('reset-view').addEventListener('click', () => {
                    if (controls) controls.reset();
                });
                
                document.getElementById('toggle-wireframe').addEventListener('click', () => {
                    wireframeEnabled = !wireframeEnabled;
                    if (model) {
                        if (model.material) {
                            if (Array.isArray(model.material)) {
                                model.material.forEach(m => m.wireframe = wireframeEnabled);
                            } else {
                                model.material.wireframe = wireframeEnabled;
                            }
                        }
                    }
                });
            });