import * as React from 'react';
import devtoolsTheme from '../../theme/devtoolsTheme';
import OverlayManager from '../OverlayManager/OverlayManager';
import { loadPanelsArrangement } from '../../utils/localStorage';
import { ThemeProvider } from '@fluentui/react';
import { useKey, useToggle } from 'react-use';
import cssPrefix from '../prefix';

type DevToolsProps = {};

export function DevTools(_props: DevToolsProps) {
    const [showDevtools, toggleDevtools] = useToggle(false);

    useKey('`', (ev) => {
        if (ev.ctrlKey && ev.shiftKey) {
            loadPanelsArrangement();
        }

        if (ev.ctrlKey) {
            toggleDevtools();
        }
    });

    if (!showDevtools) {
        return null;
    }

    return (
        <ThemeProvider theme={devtoolsTheme}>
            <div className={`${cssPrefix}DevTools-container`}>
                <OverlayManager onClose={toggleDevtools} />
            </div>
        </ThemeProvider>
    );
}

export default DevTools;
