//------------------------------------------------------------------------------
import React                from "react";

//------------------------------------------------------------------------------
// Our custom styled components
import { Row, Column }  from './style';

//------------------------------------------------------------------------------
// Modules already loaded by the 3dverse-editor app
// @material-ui/core
const MaterialCore   = window.MaterialCore;
// @material-ui/core/styles
const MaterialStyles = window.MaterialStyles;
// @material-ui/core/utils
const MaterialUtils  = window.MaterialUtils;

//------------------------------------------------------------------------------
const {
    TextField,
    Button, Radio, FormControlLabel, RadioGroup, Divider
} = MaterialCore;


//------------------------------------------------------------------------------
export default class App extends React.Component
{
    //--------------------------------------------------------------------------
    constructor(props)
    {
        super(props);

        this.state = {
            nextActivatedBag : 0,
            bagAnimSeqPool : [],
            bagSpawnSpeed : 5000,
            isAutomaticPlaying : false,
            bagPlayBackSpeed : 1,
            pressAnimSeqUUID : '',
            bagAnimSeqPoolFolderId : '729ce2b4-076f-4f4d-b322-9ed5dc9a4079',
        };
    }

    //--------------------------------------------------------------------------
    componentDidMount() {  }
    //--------------------------------------------------------------------------
    componentWillUnmount() {  }

    //--------------------------------------------------------------------------
    getBagAnimationSequencePool = async () => 
    {
        const url = `https://api.3dverse.com/app/v1/folders/${this.state.bagAnimSeqPoolFolderId}/assets`;
        const headers = {
        'Content-Type': 'application/json',
        'user_token': SDK3DVerse.webAPI.apiToken,
        };
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
            });
            const data = await response.json();
            this.setState({bagAnimationSequencesPool : data.animation_sequences});
            console.log("Recovered Animation Sequences", data);
        }

        catch(error) {
            console.error('There was a problem with the fetch operation:', error);
       }
    }

    //--------------------------------------------------------------------------
    /*spawnBag = async () => {
        const entityTemplate = new SDK3DVerse.EntityTemplate();
        entityTemplate.attachComponent('scene_ref', { value : bagSceneReferenceUUID});
        const entity = await entityTemplate.instantiateEntity(name, parentEntity)
    }*/

    //--------------------------------------------------------------------------
    activateBag = async () => 
    {
        SDK3DVerse.engineAPI.playAnimationSequence(
            this.state.bagAnimSeqPool[this.state.nextActivatedBag].asset_id, 
            {
                playbackSpeed: this.state.bagPlayBackSpeed,
            }
        );
    }

    //--------------------------------------------------------------------------
    startAutomaticBagAnimation = async () => 
    {
        this.setState({isAutomaticPlaying : true});
        setInterval(() => { this.activateBag() }, this.state.bagSpawnSpeed);
        setTimeout(() => {
            setInterval(() => {
                this.activatePress();
            }, this.state.bagSpawnSpeed);
        }, this.state.bagSpawnSpeed);
    }
    //--------------------------------------------------------------------------
    render()
    {
        return (
            <Column>
                <Row className="margin-bottom">
                    <TextField
                        id="outlined-number"
                        label="Bag Animation Sequence Pool Folder ID"
                        type="text"
                        className="string-field"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={this.state.bagAnimSeqPoolFolderId}
                        onChange={event => this.setState({bagAnimSeqPoolFolderId: event.target.value})}
                    />
                </Row>
                <Divider className="margin-bottom"/>
                <Row className="margin-bottom">
                    <p className="fix-align">Timings:</p>
                    <TextField
                        id="outlined-number"
                        label="Spawn Speed"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={this.state.bagSpawnSpeed}
                        onChange={event => this.setState({bagSpawnSpeed: event.target.value})}
                    />
                    <TextField
                        id="outlined-number"
                        label="Conveyor Belt Speed"
                        type="number"
                        InputLabelProps={{
                            shrink: true,//
                        }}
                        value={this.state.bagPlayBackSpeed}
                        onChange={event => this.setState({bagPlayBackSpeed: event.target.value})}
                    />
                </Row>
                <Divider className="margin-bottom" />
                <Row className="margin-bottom">
                    <Button
                        color={this.state.isAutomaticPlaying ? "secondary" : "primary"}
                        variant={"contained"}
                        onClick={this.state.isAutomaticPlaying ? this.pauseAutomaticBagAnimation : this.startAutomaticBagAnimation}
                    >
                        {this.state.isAutomaticPlaying ? "PAUSE AUTO" : "PLAY AUTO"}
                    </Button>
                    <Button
                        color="secondary"
                        variant={"contained"}
                        onClick={this.activateBag}
                    >
                        CANCEL AUTO
                    </Button>
                </Row>
                <Row>
                    <Button
                            color="primary"
                            variant={"contained"}
                            onClick={this.activateBag}
                        >
                        SPAWN SINGLE
                    </Button>
                </Row>
                <Row>
                    <Button
                        color="tertiary"
                        variant={"contained"}
                        onClick={this.activateBag}
                    >
                        RELOAD ANIM POOL
                    </Button>
                </Row>
            </Column>
        );
    }
}

/*
//------------------------------------------------------------------------------
import React                from "react";

//------------------------------------------------------------------------------
import { quat, vec3 }             from 'gl-matrix';

//------------------------------------------------------------------------------
// Our custom styled components
import { Row, Column }  from './style';

//------------------------------------------------------------------------------
// Modules already loaded by the 3dverse-editor app
// @material-ui/core
const MaterialCore   = window.MaterialCore;
// @material-ui/core/styles
const MaterialStyles = window.MaterialStyles;
// @material-ui/core/utils
const MaterialUtils  = window.MaterialUtils;

//------------------------------------------------------------------------------
const {
    TextField,
    Button, Radio, FormControlLabel, RadioGroup, Divider
} = MaterialCore;


//------------------------------------------------------------------------------
export default class App extends React.Component
{
    //--------------------------------------------------------------------------
    constructor(props)
    {
        super(props);

        this.state = {
            sceneReferenceUUID: SDK3DVerse.invalidUUID,

            axis: 1,
            
            orientation : [0,0,0],
            scale : [1,1,1],
            circleCenterPosition : [0,0,0],

            radius: 10,
            amount: 10,
            angleOffset: 0,

            entity              : null,
            entityStartTransform: null
        };

        this.sdk        = SDK3DVerse;
        this.engineAPI  = SDK3DVerse.engineAPI;
        this.cameraAPI  = SDK3DVerse.engineAPI.cameraAPI;
        this.editorAPI  = SDK3DVerse.engineAPI.editorAPI;
        this.notifier   = SDK3DVerse.notifier;
    }

    //--------------------------------------------------------------------------
    componentDidMount() { this.notifier.on('onEntitySelectionChanged', this.handleEntitySelectionEvent); }
    //--------------------------------------------------------------------------
    componentWillUnmount() { this.notifier.on('onEntitySelectionChanged', this.handleEntitySelectionEvent); }


    //--------------------------------------------------------------------------
    spawnBag = async () => {
        const entityTemplate = new SDK3DVerse.EntityTemplate();
        entityTemplate.attachComponent('scene_ref', { value : bagSceneReferenceUUID});
        const entity = await entityTemplate.instantiateEntity(name, parentEntity)
    }


    //--------------------------------------------------------------------------
    render()
    {
        return (
            <Column>
                <Row>
                    <Button
                        variant={"contained"}
                        onClick={this.spawnBag}
                    >
                        SPAWN BAG
                    </Button>
                </Row>
            </Column>
        );
    }
}
*/