<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Check if file was uploaded
    echo "<pre>";
    var_dump($_FILES);
    echo "</pre>";
    die();
    if (isset($_FILES['croppedImage'])) {
        if ($_POST['method'] == 'processEps') {
            // Convert EPS to png.

        } else if ($_POST['method'] == 'processTif') {
            // Convert TIF to png.

        } else {

        }

        $file = $_FILES['croppedImage'];

        // You can now access details about the file
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];
        $fileType = $file['type'];

        // Ensure the 'temp/' directory exists
        $tempDir = '../temp/';
        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0777, true);
        }

        // Move the uploaded file to the temp directory
        $tempFileName = uniqid('temp_', true) . '.png';
        $tempFileDestination = $tempDir . $tempFileName;
        if (!move_uploaded_file($fileTmpName, $tempFileDestination)) {
            echo "Failed to move file to temp directory";
            return;
        }

        // Ensure the 'uploads/' directory exists
        $uploadDir = '../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Handle the uploaded file
        // For example, move the file to a desired location
        // Change the file extension to .png
        $fileName = uniqid('cropped_', true) . '.png';
        $fileDestination = $uploadDir . $fileName;

        // Scale the image to 350px width while preserving the aspect ratio
        try {
            $image = new Imagick($tempFileDestination);
            $image->scaleImage(350, 0);
            $image->writeImage($fileDestination);
            echo "File resized successfully";
        } catch (ImagickException $e) {
            echo "Failed to resize file";
        }

        // Delete the temp file
        unlink($tempFileDestination);

    } else {
        echo "No file uploaded";
    }
} else {
    echo "Invalid request";
}