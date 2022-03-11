import { LogsViewerDriver } from './LogsViewer.driver';

describe('LogsViewer', () => {
    let driver: LogsViewerDriver;

    beforeAll(() => {
        driver = new LogsViewerDriver();
    });

    it('should render component', () => {
        const containerClassName = driver.given //
            .props({})
            .when.rendered()
            .get.containerClassName();

        expect(containerClassName).toBe('LogsViewer-container');
    });
});

describe('LogsViewer snapshots', () => {
    let driver: LogsViewerDriver;

    beforeAll(() => {
        driver = new LogsViewerDriver();
    });

    it('should render component', () => {
        expect(driver.when.snapshot()).toMatchSnapshot();
    });
});
