document.getElementById('generateBtn').addEventListener('click', generateVisualization);

function generateVisualization() {
    const jsonInput = document.getElementById('jsonInput').value;
    const visualizationContainer = document.getElementById('visualization');
    visualizationContainer.innerHTML = ''; // Clear previous visualization

    try {
        const patchData = JSON.parse(jsonInput);
        const boxes = patchData.boxes;
        const lines = patchData.lines;

        // Render boxes
        boxes.forEach(boxData => {
            const box = document.createElement('div');
            box.classList.add('box');
            box.style.position = 'absolute';
            box.style.left = boxData.box.patching_rect[0] + 'px';
            box.style.top = boxData.box.patching_rect[1] + 'px';
            box.style.width = boxData.box.patching_rect[2] + 'px';
            box.style.height = boxData.box.patching_rect[3] + 'px';
            box.style.backgroundColor = 'lightblue';
            box.innerHTML = boxData.box.text;
            visualizationContainer.appendChild(box);
        });

        // Render lines
        lines.forEach(lineData => {
            const line = document.createElement('div');
            line.classList.add('line');
            // Add logic to calculate line position and size based on source and destination objects
            visualizationContainer.appendChild(line);
        });
    } catch (error) {
        console.error('Invalid JSON:', error);
        alert('Invalid JSON patch data. Please check the format and try again.');
    }
}