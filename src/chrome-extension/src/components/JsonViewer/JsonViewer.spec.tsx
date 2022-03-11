import { JsonViewerDriver } from './JsonViewer.driver';

describe('JsonViewer', () => {
    let driver: JsonViewerDriver;

    beforeAll(() => {
        driver = new JsonViewerDriver();
    });

    it('should render component', () => {
        const containerClassName = driver.given //
            .props({})
            .when.rendered()
            .get.containerClassName();

        expect(containerClassName).toBe('JsonViewer-container');
    });
});

describe('JsonViewer snapshots', () => {
    let driver: JsonViewerDriver;

    beforeAll(() => {
        driver = new JsonViewerDriver();
    });

    it('should render component', () => {
        expect(driver.when.snapshot()).toMatchSnapshot();
    });
});
