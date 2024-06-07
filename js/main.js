// // initialize jquery-cropperjs
$(document).ready(function() {
// Import image
    const console = window.console || { log: function () {} };
    const URL = window.URL || window.webkitURL;
    let uploadedImageName;
    let uploadedImageURL;
    let uploadedImageType;
    let $inputImage = $('#inputImage');
    let $image = $('#image');

    var options = {
        dragMode: 'move',
        aspectRatio: 350 / 120,
        autoCropArea: 0.85,
        restore: false,
        guides: false,
        center: false,
        highlight: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
        preview: '.img-preview',
    };

    // Cropper
    $image.on({
        ready: function (e) {
            console.log(e.type);
        },
        cropstart: function (e) {
            console.log(e.type, e.detail.action);
        },
        cropmove: function (e) {

        },
        cropend: function (e) {
            console.log(e.type, e.detail.action);
        },
        crop: function (e) {
            console.log(e.type);
        },
        zoom: function (e) {
            console.log(e.type, e.detail.ratio);
        }
    }).cropper(options);

    console.log($image);

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

                    if (uploadedImageURL) {
                        URL.revokeObjectURL(uploadedImageURL);
                    }
                    uploadedImageURL = URL.createObjectURL(file);
                    $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
                    $inputImage.val('');
                } else {
                    window.alert('Please choose an image file.');
                }
            }
            console.log(uploadedImageURL)
        });
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled');
    }
});
