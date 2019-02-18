import swal from 'sweetalert';
import Noty from 'noty';

Noty.overrideDefaults({
    layout           : 'topRight',
    theme            : 'sunset',
    timeout          : 1500,
    type             : 'error',
    closeWith        : ['click'],
    'animation.close': 'noty_effects_close',
    'animation.open' : 'noty_effects_open',
    progressBar      : true,
});

export {swal, Noty}