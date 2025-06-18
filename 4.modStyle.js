// Variables for Sketchfab viewer
let sketchfabViewer = null;
let currentModelId = 'c327e50e5ae54c059e8bd28ce382d0bf'; 

// Initialize Sketchfab viewer
function initSketchfabViewer() {
    const iframe = document.getElementById('sketchfab-iframe');
    
    iframe.addEventListener('load', () => {
        const client = new Sketchfab(iframe);
        
        client.init(() => {
            client.start(() => {
                client.getViewerUI((api) => {
                    sketchfabViewer = api;
                    api.setCameraLookAt([0, 0, 0], [0, 0, 1], 1);
                });
            });
        });
    });
}

// Load a Sketchfab model
function loadSketchfabModel(modelId, thumbnailElement = null) {
    const iframe = document.getElementById('sketchfab-iframe');
    currentModelId = modelId;
    
    // Show loading state
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'flex';
    
    // Update the iframe src
    iframe.src = `https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_controls=1&ui_infos=0&ui_stop=0&ui_watermark=0`;
    
    // When model is loaded, hide loading overlay
    iframe.onload = () => {
        loadingOverlay.style.display = 'none';
        
        // Adjust the iframe's internal viewer size
        setTimeout(() => {
            const viewer = iframe.contentDocument.querySelector('.viewer');
            if (viewer) {
                viewer.style.width = '100%';
                viewer.style.height = '100%';
            }
        }, 1000);
    };
    
    if (thumbnailElement) {
        updateActiveThumbnail(thumbnailElement);
    }
}

// Reset view
function resetView() {
    if (sketchfabViewer) {
        sketchfabViewer.setCameraLookAt([0, 0, 0], [0, 0, 1], 1);
    }
}

function toggleWireframe() {
    if (sketchfabViewer) {
        sketchfabViewer.getMaterialList((err, materials) => {
            if (!err && materials && materials.length > 0) {
                // Toggle between shaded and wireframe rendering
                sketchfabViewer.setRenderMode('shaded');
            }
        });
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
    // Initialize the viewer with default model
    initSketchfabViewer();
    
    // Set up control buttons
    document.getElementById('reset-view').addEventListener('click', resetView);
    
    document.getElementById('toggle-wireframe').addEventListener('click', () => {
        if (sketchfabViewer) {
            sketchfabViewer.getRenderMode((err, mode) => {
                if (!err) {
                    const modes = ['shaded', 'normals', 'rendered'];
                    const currentIndex = modes.indexOf(mode);
                    const nextIndex = (currentIndex + 1) % modes.length;
                    sketchfabViewer.setRenderMode(modes[nextIndex]);
                }
            });
        }
    });
    
    // Load default model
    loadSketchfabModel(currentModelId);
});