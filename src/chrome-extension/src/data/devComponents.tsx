import JsonViewerContainer from '../containers/JsonViewerContainer';
import LifecycleContainer from '../containers/LifecycleContainer';
import LogsViewerContainer from '../containers/LogsViewerContainer';
import StateViewerContainer from '../containers/StateViewerContainer';

type DevComponents = Record<string, React.FC<any>>;

export const routes: DevComponents = {
    Lifecycle: LifecycleContainer,
    jsonViewer: JsonViewerContainer,
    stateViewer: StateViewerContainer,
    logsViewer: LogsViewerContainer,
};
