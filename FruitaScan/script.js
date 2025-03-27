




// Function to handle the file (from upload or drag & drop)
function handleFile(file) {
  const previewContainer = document.querySelector('.preview-container');

  // Check if there are already 5 images in the preview container
  if (previewContainer.children.length >= 5) {
    alert('You can only upload a maximum of 5 images.');
    return;
  }

  if (file) {
    const previewImage = document.createElement('img');
    previewImage.src = URL.createObjectURL(file);
    previewContainer.appendChild(previewImage); // Append the image to the container

    previewContainer.style.display = 'block';

    // Add double-click event to remove the image
    previewImage.addEventListener('dblclick', function() {
      previewImage.remove();
    });
  }
}

// Standard file input change event
document.getElementById('upload-input').addEventListener('change', function(event) {
  const file = event.target.files[0];
  handleFile(file);
});

// Drag & Drop functionality
const uploadLabel = document.querySelector('.upload-label');
const previewContainer = document.querySelector('.preview-container');

uploadLabel.addEventListener('dragover', function(e) {
  e.preventDefault(); // Prevent default behavior (Prevent file from being opened)
  uploadLabel.classList.add('dragover');
});

uploadLabel.addEventListener('dragleave', function(e) {
  e.preventDefault();
  uploadLabel.classList.remove('dragover');
});

uploadLabel.addEventListener('drop', function(e) {
  e.preventDefault();
  uploadLabel.classList.remove('dragover');
  const files = e.dataTransfer.files;
  
  // Loop through all dropped files
  for (let i = 0; i < files.length; i++) {
    if (previewContainer.children.length >= 5) {
      alert('You can only upload a maximum of 5 images.');
      break;
    }
    handleFile(files[i]);
  }
});

// Camera Capture: Open camera and capture photo
const openCameraBtn = document.getElementById('open-camera-btn');
const video = document.getElementById('video');
const captureBtn = document.getElementById('capture-btn');
const canvas = document.getElementById('canvas');
const capturedImagePreview = document.querySelector(".captured-image-preview");
const maxCaptures = 5;  
let captureCount = 0;

openCameraBtn.addEventListener('click', function() {
  // Request access to the camera when the "Open Camera" button is clicked
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(stream) {
        video.srcObject = stream;
        video.style.display = 'block';
        captureBtn.disabled = false; // Enable capture once camera is open
        openCameraBtn.disabled = true; // Prevent re-opening camera
      })
      .catch(function(err) {
        alert("Error accessing the camera: " + err);
      });
  } else {
    alert("Your browser does not support camera access.");
  }
});

captureBtn.addEventListener('click', function() {
  // Capture a snapshot from the video stream
  if (captureCount >= maxCaptures) {
    alert('You can only capture up to 5 photos.');
    return;
  }

  // Draw the video frame on canvas
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.style.display = 'block';
  captureCount++;

  // Optionally, you can save the image or display it in the page
  const capturedImage = canvas.toDataURL('image/png');
  const img = document.createElement('img');
  img.src = capturedImage;
  img.width = 160;
  img.height = 120;
  capturedImagePreview.appendChild(img); // Append captured image to the page

  // Add double-click event to remove the captured image
  img.addEventListener('dblclick', function() {
    img.remove();
    captureCount--;
    if (captureCount < maxCaptures) {
      captureBtn.disabled = false;
    }
  });

  // Optionally disable capture button if 5 images are reached
  if (captureCount >= maxCaptures) {
    captureBtn.disabled = true;
  }
});
