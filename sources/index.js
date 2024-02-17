//------------------------------------------------------------------------------
import React                from 'react';
import ReactDOM             from 'react-dom';
//import EventEmitter         from 'events';

//------------------------------------------------------------------------------
import App                  from './App';

//------------------------------------------------------------------------------
const { ThemeProvider, createMuiTheme } = window.MaterialStyles;
const { CssBaseline }                   = window.MaterialCore;


//------------------------------------------------------------------------------
//const eventEmitter          = new EventEmitter();

const theme = createMuiTheme({
    palette: {
        type: "dark",
    }
});

//------------------------------------------------------------------------------
export const render = (container, props) =>
{
    ReactDOM.render(
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App
                {...props}
                // eventEmitter to be used to listen on events emitted by the 3dverse-editor
                // through the above exported eventHandler function
                /*eventEmitter={eventEmitter}*/
            />
        </ThemeProvider>
        , container
    );
};

//------------------------------------------------------------------------------
export const release = (container) =>
{
    ReactDOM.unmountComponentAtNode(container);
};

//------------------------------------------------------------------------------
// Allow the 3dverse-editor to emit events from the current plugin event emitter
/*
export const eventHandler = (eventName, eventArgs) =>
{
    return eventEmitter.emit(eventName, ...eventArgs);
};
*/