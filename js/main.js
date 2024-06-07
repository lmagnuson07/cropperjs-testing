$(document).ready(function() {
// Import image
    const URL = window.URL || window.webkitURL;
    let uploadedImageName;
    let uploadedImageURL;
    let uploadedImageType;
    let $inputImage = $('#inputImage');
    let $image = $('#image');
    let originalImageURL = $image.attr('src')

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
    // $image.on({
    //     ready: function (e) {
    //         console.log(e.type);
    //     },
    //     cropstart: function (e) {
    //         console.log(e.type, e.detail.action);
    //     },
    //     cropmove: function (e) {
    //
    //     },
    //     cropend: function (e) {
    //         console.log(e.type, e.detail.action);
    //     },
    //     crop: function (e) {
    //         console.log(e.type);
    //     },
    //     zoom: function (e) {
    //         console.log(e.type, e.detail.ratio);
    //     }
    // }).cropper(options);
    $image.cropper(options);

    // console.log($image);

    // Methods (control events)
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
            console.log(data);
            cropped = cropper.cropped;

            switch (data.method) {
                // case 'rotate':
                //     if (cropped && options.viewMode > 0) {
                //         $image.cropper('clear');
                //     }
                //
                //     break;

                case 'getCroppedCanvas':
                    // Check for file types.
                    if (uploadedImageType === 'image/jpeg') {

                    }

                    if (!data.option) {
                        data.option = {};
                    }

                    $image.cropper('getCroppedCanvas', {
                        // width: 350,
                        // height: 120,
                        fillColor: '#fff',
                        imageSmoothingEnabled: true,
                        imageSmoothingQuality: 'high',
                    }).toBlob((blob) => {
                        const formData = new FormData();

                        // Pass the image file name as the third parameter if necessary.
                        formData.append('croppedImage', blob/*, 'example.png' */);

                        // Use `jQuery.ajax` method for example
                        $.ajax('/api/processCroppedImage.php', {
                            method: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,
                            success() {
                                alert('Upload success');
                            },
                            error() {
                                alert('Upload error');
                            },
                        });
                    });

                    break;
            }

            result = $image.cropper(data.method, data.option, data.secondOption);

            switch (data.method) {
            //     case 'rotate':
            //         if (cropped && options.viewMode > 0) {
            //             $image.cropper('crop');
            //         }
            //
            //         break;
            //
            //     case 'scaleX':
            //     case 'scaleY':
            //         $(this).data('option', -data.option);
            //         break;
            //
                case 'getCroppedCanvas':
                    if (result) {
                        // Bootstrap's Modal
                        $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

                        // if (!$download.hasClass('disabled')) {
                        //     download.download = uploadedImageName;
                        //     $download.attr('href', result.toDataURL(uploadedImageType));
                        // }
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
