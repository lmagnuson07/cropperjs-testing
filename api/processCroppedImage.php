<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Check if file was uploaded
    if (isset($_FILES['croppedImage'])) {
        $file = $_FILES['croppedImage'];

        // You can now access details about the file
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];
        $fileType = $file['type'];

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
        if (move_uploaded_file($fileTmpName, $fileDestination)) {
            echo "File uploaded successfully";
        } else {
            echo "Failed to upload file";
        }
    } else {
        echo "No file uploaded";
    }
} else {
    echo "Invalid request";
}