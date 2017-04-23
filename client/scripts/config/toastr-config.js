import toastr from 'toastr-lib';

toastr.options = {
    'closeButton': true,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-bottom-right',
    'preventDuplicates': false,
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '300',
    'timeOut': '3000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'slideDown',
    'hideMethod': 'slideUp'
};

function success(text) {
    toastr.success(text);
}

function error(text) {
    toastr.error(text);
}

export { success, error };