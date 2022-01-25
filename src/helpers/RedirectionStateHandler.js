export default class RedirectionStateHandler {

    static getRedirectionStateWithSlideDownWithGivenPreviousPage(previousPage) {
        return {
            pathname: previousPage,
            state: {
                slideDirection:'down'
            }
        };
    }

    static getRedirectionStateWithGivenLocationAndSlideDirection(slideDirection, location) {
        let previousPage =  (location === null || location === undefined || location.state === null || location.state === undefined) ? '/' : location.state.backUrl;
        let category =  (location === null || location === undefined || location.state === null || location.state === undefined) ? 'Spiritueux' : location.state.category;
        if(previousPage === null || previousPage === undefined) {
            previousPage = '/home';
        }

        if(category === null || category === undefined) {
            category = 'Spiritueux';
        }
        return {
            pathname: previousPage,
            state: {
                slideDirection:slideDirection,
                category:category
            }
        };
    }

    static getRedirectionStateWithSlideDown(location) {
        return RedirectionStateHandler.getRedirectionStateWithGivenLocationAndSlideDirection('down', location);
    }

    static getRedirectionStateWithSlideLeft(location) {
        return RedirectionStateHandler.getRedirectionStateWithGivenLocationAndSlideDirection('left', location);
    }

    static getSlideDirection(defaultDirection, location) {
        return (location === null || location === undefined || location.state === null || location.state === undefined) ? defaultDirection : location.state.slideDirection
    }
}