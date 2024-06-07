// initialize jquery-cropperjs
$(document).ready(function() {
// Import image
    let uploadedImageName;
    let uploadedImageURL;
    let uploadedImageType;
    let $inputImage = $('#inputImage');

    if (URL) {
        $inputImage.change(function () {
            let files = $(this)[0].files;
            let file;

            // if (!$image.data('cropper')) {
            //     return;
            // }

            if (files && files.length) {
                file = files[0];

                if (/^image\/\w+$/.test(file.type)) {
                    uploadedImageName = file.name;
                    uploadedImageType = file.type;

                    if (uploadedImageURL) {
                        URL.revokeObjectURL(uploadedImageURL);
                    }

                    uploadedImageURL = URL.createObjectURL(file);
                    // $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
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

