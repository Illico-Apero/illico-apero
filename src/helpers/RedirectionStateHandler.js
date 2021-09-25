export default class RedirectionStateHandler {

    static getRedirectionStateWithSlideDown(location) {

        const previousPage =  (location.state === undefined) ? '/' : location.state.backUrl;

        return {
            pathname: previousPage,
            state: {
                slideDirection:'down'
            }
        };
    }

    static getSlideDirection(defaultDirection, location) {
        return (location.state === undefined) ? defaultDirection : location.state.slideDirection
    }
}