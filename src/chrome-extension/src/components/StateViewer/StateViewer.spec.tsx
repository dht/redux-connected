import { StateViewerDriver } from './StateViewer.driver';

describe('StateViewer', () => {
    let driver: StateViewerDriver;

    beforeAll(() => {
        driver = new StateViewerDriver();
    });

    it('should render component', () => {
        const containerClassName = driver.given //
            .props({})
            .when.rendered()
            .get.containerClassName();

        expect(containerClassName).toBe('StateViewer-container');
    });
});

describe('StateViewer snapshots', () => {
    let driver: StateViewerDriver;

    beforeAll(() => {
        driver = new StateViewerDriver();
    });

    it('should render component', () => {
        expect(driver.when.snapshot()).toMatchSnapshot();
    });
});
