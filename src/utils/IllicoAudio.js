import addToCart from '../assets/sounds/hero_simple-celebration-03.wav';
import registerOrLogIn from '../assets/sounds/hero_decorative-celebration-03.wav';
import uiUnlock from '../assets/sounds/ui_unlock.wav';
import uiLock from '../assets/sounds/ui_lock.wav';
import navigationForward from '../assets/sounds/navigation_forward-selection-minimal.wav';
import navigationBackward from '../assets/sounds/navigation_backward-selection-minimal.wav';
import tap from '../assets/sounds/ui_tap-variant-03.wav';
import alert from '../assets/sounds/alert_high-intensity.wav';

const addToCartAudio = new Audio(addToCart);
const uiUnlockAudio = new Audio(uiUnlock);
const uiLockAudio = new Audio(uiLock);
const navigationForwardAudio = new Audio(navigationForward);
const navigationBackwardAudio = new Audio(navigationBackward);
const tapAudio = new Audio(tap);
const registerOrLogInAudio = new Audio(registerOrLogIn);
const alertAudio = new Audio(alert);

export default class IllicoAudio {

    static playAddToCartAudio() {
        addToCartAudio.play();
    }

    static playUiUnlockAudio() {
        uiUnlockAudio.play();
    }
    
    static playUiLockAudio() {
        uiLockAudio.play();
    }

    static playNavigationForwardAudio() {
        navigationForwardAudio.play();
    }

    static playNavigationBackwardAudio() {
        navigationBackwardAudio.play();
    }

    static playTapAudio() {
        tapAudio.play();
    }

    static playRegisterOrLogInAudio() {
        registerOrLogInAudio.play();
    }

    static playAlertAudio() {
        alertAudio.play();
    }
}