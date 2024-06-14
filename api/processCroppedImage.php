<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Check if file was uploaded
//    if (isset($_FILES['croppedImage'])) {
//        $file = $_FILES['croppedImage'];
//
//        // You can now access details about the file
//        $fileTmpName = $file['tmp_name'];
//        $fileSize = $file['size'];
//        $fileError = $file['error'];
//        $fileType = $file['type'];
//
//        // Ensure the 'temp/' directory exists
//        $tempDir = '../temp/';
//        if (!is_dir($tempDir)) {
//            mkdir($tempDir, 0777, true);
//        }
//
//        // Move the uploaded file to the temp directory
//        $tempFileName = uniqid('temp_', true) . '.png';
//        $tempFileDestination = $tempDir . $tempFileName;
//        if (!move_uploaded_file($fileTmpName, $tempFileDestination)) {
//            echo "Failed to move file to temp directory";
//            return;
//        }
//
//        // Ensure the 'uploads/' directory exists
//        $uploadDir = '../uploads/';
//        if (!is_dir($uploadDir)) {
//            mkdir($uploadDir, 0777, true);
//        }
//
//        // Handle the uploaded file
//        // For example, move the file to a desired location
//        // Change the file extension to .png
//        $fileName = uniqid('cropped_', true) . '.png';
//        $fileDestination = $uploadDir . $fileName;
//
//        // Scale the image to 350px width while preserving the aspect ratio
//        try {
//            $image = new Imagick($tempFileDestination);
//            $image->scaleImage(350, 0);
//            $image->writeImage($fileDestination);
//            echo "File resized successfully";
//        } catch (ImagickException $e) {
//            echo "Failed to resize file";
//        }
//
//        // Delete the temp file
////        unlink($tempFileDestination);
//
//    } else {
//        echo "No file uploaded";
//    }
    // Example usage
    $directoryToDelete = '/var/www/html/temp/folderOne';
    $safeguardPath = '/var/www/html/temp/';
//    die(json_encode([realpath($directoryToDelete),realpath($safeguardPath)]));
    die( json_encode(strpos($directoryToDelete, $safeguardPath)));

    try {
        if (deleteDirectory($directoryToDelete, $safeguardPath)) {
            echo "Directory deleted successfully.";
        } else {
            echo "Failed to delete directory.";
        }
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
} else {
    echo "Invalid request";
}
function deleteDirectory($dir, $safeguard) {
    // Ensure the directory is within the safeguarded path
    $strPos = strpos($dir, $safeguard);
    if (!$strPos || $strPos > 0) {
        throw new Exception("The directory is outside the safeguard path.");
    }

    // Ensure the directory exists
    if (!is_dir($dir)) {
        return false;
    }

    // Recursively delete directory contents
    $items = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );

    foreach ($items as $item) {
        $itemPath = $item->getRealPath();
        if ($item->isDir()) {
            rmdir($itemPath);
        } else {
            unlink($itemPath);
        }
    }

    // Finally, delete the directory itself
    return rmdir($dir);
}