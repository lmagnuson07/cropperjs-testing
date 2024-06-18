$(document).ready(function() {
// Import image
    const URL = window.URL || window.webkitURL;
    let uploadedImageName;
    let uploadedImageURL;
    let uploadedImageType;
    let $inputImage = $('#inputImage');
    let $image = $('#image');
    var $download = $('#download');
    let uploaded = false;

    var options = {
        dragMode: 'move',
        aspectRatio: 350 / 120,
        autoCropArea: 0.85,
        // wheelZoomRation: 0.05,
        restore: false,
        guides: false,

        //////// Sizes //////////////
        ///// Prevents zooming out all the way (probably don't want this) /////
        // minCanvasWidth: 350,
        // minCanvasHeight: 120,

        // minCropBoxWidth: 350,
        // minCropBoxHeight: 120,
        // minContainerWidth: 320,
        // minContainerHeight: 180,
        /////////////////////////////

        // center: false, // crosshair
        // highlight: false, // makes croparea more obvious

        ////// Fixed Cropbox //////////////
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
        /////////////////////////////////

        preview: '.img-preview',

        ///////// Makes the background checkered image less dark
        // modal: false,
        ///////// Removes the checkered image.
        // background: false,
    };

    // Cropper
    $image.on({
        ///////// Callbacks used with a fixed cropbox ///
        ready: function (e) {
            // Disable until image is uploaded
            if (!uploaded) {
                $image.cropper('disable');
            }
            console.log(e.type);
        },
        // cropmove: function (e) {
        //     console.log(e.type, e.detail.action)
        //     console.log(e.detail);
        // },
        crop: function (e) {
            console.log(e.type);
            console.log(e.detail);
        },
        zoom: function (e) {
            // Can compare e.detail.oldRatio and e.detail.ratio to see if zooming in or out.
            console.log(e.type, e.detail.ratio);
            console.log(e.detail);
        }
    }).cropper(options);
    // console.log($image);

    if (typeof document.createElement('cropper').style.transition === 'undefined') {
        $('button[data-method="rotate"]').prop('disabled', true);
        $('button[data-method="scale"]').prop('disabled', true);
    }

    // Download
    if (typeof $download[0].download === 'undefined') {
        $download.addClass('disabled');
    }

    // Methods (control events for buttons)
    $('.cropper-console').on('click', '[data-method]', function () {
        var $this = $(this);
        var data = $this.data();
        var cropper = $image.data('cropper');
        var cropped;
        var $target;
        var result;

        if ($this.prop('disabled') || $this.hasClass('disabled')) {
            return;
        }

        if (cropper && data.method) {
            data = $.extend({}, data); // Clone a new one

            if (typeof data.target !== 'undefined') {
                $target = $(data.target);

                if (typeof data.option === 'undefined') {
                    try {
                        data.option = JSON.parse($target.val());
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            }
            // console.log(data);
            cropped = cropper.cropped;

            switch (data.method) {
                case 'rotate':
                    if (cropped && options.viewMode > 0) {
                        $image.cropper('clear');
                    }

                    break;

                case 'getCroppedCanvas':
                    // Check for file types.
                    if (uploadedImageType === 'image/jpeg') {

                    }

                    if (!data.option) {
                        data.option = {};
                    }
/*

                    /////////// Data fetching ////////////////
                    let getdata = $image.cropper('getData');
                    // Output the final cropped area position and size data (based on the natural size of the original image).
                    // x and y are based off the top left corner.
                    console.log("getdata");
                    console.log(getdata);

                    let getContainerData = $image.cropper('getContainerData');
                    // Just the width and height of the container set in CSS.
                    console.log("getContainerData");
                    console.log(getContainerData);

                    let getImageData = $image.cropper('getImageData');
                    // Data of image before cropping.
                    console.log("getImageData");
                    console.log(getImageData);

                    let getCanvasData = $image.cropper('getCanvasData');
                    // Output the canvas (image wrapper) position and size data.
                    console.log("getCanvasData");
                    console.log(getCanvasData);

                    let getCropBoxData = $image.cropper('getCropBoxData');
                    // Output the crop box position and size data.
                    console.log("getCropBoxData");
                    console.log(getCropBoxData);
                    ////////////////////////////////////////
*/

                    $image.cropper('getCroppedCanvas', {
                        // width: 350,
                        // height: 120,
                        // fillColor: '#fff',
                        imageSmoothingEnabled: true,
                        imageSmoothingQuality: 'high',
                    }).toBlob((blob) => {
                        const formData = new FormData();

                        // Pass the image file name as the third parameter if necessary.
                        formData.append('croppedImage', blob/*, 'example.png' */);

                        $.ajax('/api/processCroppedImage.php', {
                            method: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,
                            success() {
                                // Need to replace uploadedImageName and uploadedImageType variables after processing image for download.
                                console.log('Upload success');
                            },
                            error() {
                                console.log('Upload error');
                            },
                        });
                    });

                    break;

                case 'moveTo':
                    if (!data.option) {
                        data.option = {};
                    }

                    // Get the crop box data and the canvas data
                    let cropBoxData = $image.cropper('getCropBoxData');
                    let canvasData = $image.cropper('getCanvasData');

                    // Calculate the center point of the crop box
                    let centerX = cropBoxData.left + cropBoxData.width / 2;
                    let centerY = cropBoxData.top + cropBoxData.height / 2;

                    // Calculate the center point
                    data.option = centerX - canvasData.width / 2;
                    data.secondOption = centerY - canvasData.height / 2;
                    break;
            }

            result = $image.cropper(data.method, data.option, data.secondOption);

            switch (data.method) {
                case 'rotate':
                    if (cropped && options.viewMode > 0) {
                        $image.cropper('crop');
                    }

                    break;

                case 'scaleX':
                case 'scaleY':
                    $(this).data('option', -data.option);
                    break;

                case 'getCroppedCanvas':
                    if (result) {
                        // Bootstrap's Modal
                        $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

                        if (!$download.hasClass('disabled')) {
                            // console.log(uploadedImageName);
                            // console.log(result.toDataURL(uploadedImageType));
                            download.download = uploadedImageName;
                            $download.attr('href', result.toDataURL(uploadedImageType));
                        }
                    }

                    break;
            //
            //     case 'destroy':
            //         if (uploadedImageURL) {
            //             URL.revokeObjectURL(uploadedImageURL);
            //             uploadedImageURL = '';
            //             $image.attr('src', originalImageURL);
            //         }
            //
            //         break;
            }

            if ($.isPlainObject(result) && $target) {
                try {
                    $target.val(JSON.stringify(result));
                } catch (e) {
                    console.log(e.message);
                }
            }
        }
    });

    // Image upload
    if (URL) {
        $inputImage.change(function () {
            let files = $(this)[0].files;
            let file;

            if (!$image.data('cropper')) {
                return;
            }

            if (files && files.length) {
                file = files[0];

                if (/^image\/\w+$/.test(file.type)) {
                    uploadedImageName = file.name;
                    uploadedImageType = file.type;

                    if (uploadedImageType === 'image/tiff') {
                        console.log("Do separate Ajax call to convert TIFF file");
                    }

                    if (uploadedImageURL) {
                        URL.revokeObjectURL(uploadedImageURL);
                    }
                    uploadedImageURL = URL.createObjectURL(file);
                    $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
                    $inputImage.val('');
                    uploaded = true;

                } else if (file.type === 'application/postscript') {
                    uploadedImageURL = URL.createObjectURL(file);

                    let formData = new FormData();
                    formData.append('method', 'convertEPS');
                    formData.append('file', uploadedImageURL);

                    // console.log("Do separate Ajax call to convert EPS file");
                    // console.log(file);
                    // Could fetch image data and pass that.
                    $.ajax('/api/processCroppedImage.php', {
                        method: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success() {
                            // Need to replace uploadedImageName and uploadedImageType variables after processing image for download.
                            console.log('EPS Upload success');
                        },
                        error() {
                            console.log('Upload error');
                        },
                    });
                } else {
                    window.alert('Please choose an image file.');
                }
            }
            console.log(uploadedImageURL)
        });
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled');
    }
    $('#url').click(function() {
        $.ajax('/api/processCroppedImage.php', {
            method: 'POST',
            data:
            {
                url: $('#url').val(),
            },
            success() {
                // Need to replace uploadedImageName and uploadedImageType variables after processing image for download.
                console.log('EPS Upload success');
            },
            error() {
                console.log('Upload error');
            },
        });
    });
});
