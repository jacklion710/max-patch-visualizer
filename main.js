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
        const boxElements = {};
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

            // Render inlets
            const inlets = [];
            for (let i = 0; i < boxData.box.numinlets; i++) {
                const inlet = document.createElement('div');
                inlet.classList.add('inlet');
                inlet.style.position = 'absolute';
                inlet.style.left = '0';
                inlet.style.top = `${i * 20}px`;
                inlet.style.width = '10px';
                inlet.style.height = '10px';
                inlet.style.backgroundColor = 'black';
                box.appendChild(inlet);
                inlets.push(inlet);
            }

            // Render outlets
            const outlets = [];
            for (let i = 0; i < boxData.box.numoutlets; i++) {
                const outlet = document.createElement('div');
                outlet.classList.add('outlet');
                outlet.style.position = 'absolute';
                outlet.style.right = '0';
                outlet.style.top = `${i * 20}px`;
                outlet.style.width = '10px';
                outlet.style.height = '10px';
                outlet.style.backgroundColor = 'black';
                box.appendChild(outlet);
                outlets.push(outlet);
            }

            visualizationContainer.appendChild(box);
            boxElements[boxData.box.id] = { box, inlets, outlets };
        });

        // Render connections
        lines.forEach(lineData => {
            const sourceBox = boxElements[lineData.patchline.source[0]];
            const destinationBox = boxElements[lineData.patchline.destination[0]];
            const sourceOutlet = sourceBox.outlets[lineData.patchline.source[1]];
            const destinationInlet = destinationBox.inlets[lineData.patchline.destination[1]];

            if (sourceOutlet && destinationInlet) {
                const connection = document.createElement('div');
                connection.classList.add('connection');
                connection.style.position = 'absolute';
                connection.style.backgroundColor = 'black';
                connection.style.zIndex = '-1';

                const sourceRect = sourceOutlet.getBoundingClientRect();
                const destinationRect = destinationInlet.getBoundingClientRect();
                const visualizationRect = visualizationContainer.getBoundingClientRect();

                const startX = sourceRect.left - visualizationRect.left + sourceRect.width / 2;
                const startY = sourceRect.top - visualizationRect.top + sourceRect.height / 2;
                const endX = destinationRect.left - visualizationRect.left + destinationRect.width / 2;
                const endY = destinationRect.top - visualizationRect.top + destinationRect.height / 2;

                const dx = endX - startX;
                const dy = endY - startY;
                const length = Math.sqrt(dx * dx + dy * dy);

                const angle = Math.atan2(dy, dx);
                const transform = `rotate(${angle}rad)`;

                connection.style.left = startX + 'px';
                connection.style.top = startY + 'px';
                connection.style.width = length + 'px';
                connection.style.height = '2px';
                connection.style.transformOrigin = 'left center';
                connection.style.transform = transform;

                visualizationContainer.appendChild(connection);
            }
        });
    } catch (error) {
        console.error('Invalid JSON:', error);
        alert('Invalid JSON patch data. Please check the format and try again.');
    }
}