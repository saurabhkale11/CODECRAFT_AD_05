let video = document.getElementById('preview');
let resultElement = document.getElementById('result');
let actionLink = document.getElementById('actionLink');
let startButton = document.getElementById('startButton');

function startScanner() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // Required for iPhone
        video.play();
        requestAnimationFrame(scanQRCode);
    })
    .catch(function(error) {
        console.error("Error accessing camera: ", error);
        resultElement.textContent = "Error: Could not access camera.";
    });
}

function scanQRCode() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
            resultElement.textContent = `Scanned QR Code: ${code.data}`;
            actionLink.style.display = "block";
            actionLink.href = code.data;
            actionLink.textContent = "Open Link";
        }
    }

    requestAnimationFrame(scanQRCode);
}

startButton.addEventListener('click', function() {
    startButton.disabled = true;
    startButton.textContent = "Scanning...";
    startScanner();
});
