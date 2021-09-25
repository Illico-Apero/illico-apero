export default class Utils {

    static timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }
}