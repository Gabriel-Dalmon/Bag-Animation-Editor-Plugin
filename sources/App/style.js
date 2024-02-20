//------------------------------------------------------------------------------
// Module already loaded by the 3dverse-editor app and known as a webpack
// external global by the plugin-registry builder
import styled           from 'styled-components';

//------------------------------------------------------------------------------
const { Box } = window.MaterialCore;

//------------------------------------------------------------------------------
export const Row = styled(Box)`
    padding: .5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;

    .MuiFormControl-root {
        padding: 0.25rem;
    }

    .MuiInputBase-input {
        color: white
    }


    
`;
//------------------------------------------------------------------------------
export const Column = styled(Box)`
    padding: .5rem;
    display: flex;
    flex-direction: column;

    /* Custom style for h2 */
    h2 {
        width:100%;
        text-align: left;
        font-size: 1.2rem; /* Change the font size to your desired value */
    /* Add more styles as needed */
    }

    .string-field {
        width: 100%;
    }

    p {
        padding-left: 15px;
        min-width:110px;
        font-size: 1.05rem;
    }

        /* Custom style for h2 */
    p.fix-align {
        margin-top: 20px;    /* Add more styles as needed */
    }

    p.red-text {
        color: red;
    }

    .margin-bottom {
        margin-bottom: 2rem;
    }

    .margin-top {
        margin-top: 1rem;
    }

    .row-padding-left {
        padding-left: 25px;
    }

`;

