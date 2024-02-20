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
            nextBagAnimId : 0,
            bagAnimSeqPool : [],

            bagSpawnSpeed : 6000,
            bagPlayBackSpeed : 1,
            pressAnimIntervalDelay : 15600 / 1,

            isAutomaticPlaying : false,
            playAutoAnimInterval : null,
            playPressAnimInterval : null,
            playPressAnimTimeout : null,

            pressAnimSeqUUID : 'a626e0fe-cf59-4eec-8be3-b0c468081afa',
            bagAnimSeqPoolFolderId : '729ce2b4-076f-4f4d-b322-9ed5dc9a4079',

            error : ''
        };
    }

    //--------------------------------------------------------------------------
    componentDidMount() 
    { 
        try{
            this.getBagAnimSeqPool();
        } catch(error){
            this.setState({error:"Couldn't recover the bag animation sequences. (Check the folder UUID)"}); 
            console.error(error)
        } 
    }
    //--------------------------------------------------------------------------
    componentWillUnmount() {  }

    //--------------------------------------------------------------------------
    getBagAnimSeqPool = async () => 
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
            this.setState({bagAnimSeqPool : data.animation_sequences});
            console.log("Recovered Animation Sequences", data);
        }

        catch(error) {
            console.error('There was a problem with the fetch operation:', error);
       }
    }

    playPressAnim = async () =>
    {
        SDK3DVerse.engineAPI.playAnimationSequence(
            this.state.pressAnimSeqUUID, 
            {
                playbackSpeed: this.state.bagPlayBackSpeed,
            }
        );
        setTimeout(() => {
            SDK3DVerse.engineAPI.stopAnimationSequence(this.state.pressAnimSeqUUID);
        }, 3599 / this.state.bagPlayBackSpeed);
    }

    //--------------------------------------------------------------------------
    playSingleBagAnim = async () => 
    {
        const bagAnimUUID = this.state.bagAnimSeqPool[this.state.nextBagAnimId].asset_id;
        SDK3DVerse.engineAPI.playAnimationSequence(
            bagAnimUUID, 
            {
                playbackSpeed: this.state.bagPlayBackSpeed,
            }
        );
        setTimeout(() => {
            this.playPressAnim();
        }, 15600 / this.state.bagPlayBackSpeed);
        setTimeout(() => {
            SDK3DVerse.engineAPI.stopAnimationSequence(bagAnimUUID);
        }, 23000 / this.state.bagPlayBackSpeed);
        this.incrementNextBagAnim();
    }

    incrementNextBagAnim = () => 
    {
        this.setState(
            (prevState)=>
            {
                return {
                    nextBagAnimId : 
                    (prevState.nextBagAnimId + 1) % this.state.bagAnimSeqPool.length
                }
            })
    }

    //--------------------------------------------------------------------------
    startAutomaticBagAnim = async () => 
    {
        this.setState({isAutomaticPlaying : true});
        this.playSingleBagAnim();
        this.setState({playAutoAnimInterval : setInterval(() => { this.playSingleBagAnim(); }, this.state.bagSpawnSpeed)});        
    }

    //--------------------------------------------------------------------------
    pauseAutomaticBagAnim = async () =>
    {
        clearInterval(this.state.playAutoAnimInterval);
        clearInterval(this.state.playPressAnimInterval); 
        this.setState({isAutomaticPlaying : false});
        this.state.bagAnimSeqPool.forEach((bagAnimSeq) => {
            SDK3DVerse.engineAPI.pauseAnimationSequence(bagAnimSeq.asset_id);
        });
    }

    //-------------------------------------------------------------------------
    stopAllBagAnims = async () =>
    {
        clearInterval(this.state.playAutoAnimInterval);
        clearInterval(this.state.playPressAnimInterval);
        this.setState({isAutomaticPlaying : false});
        this.state.bagAnimSeqPool.forEach((bagAnimSeq) => {
            SDK3DVerse.engineAPI.stopAnimationSequence(bagAnimSeq.asset_id);
        });
        SDK3DVerse.engineAPI.stopAnimationSequence(this.state.pressAnimSeqUUID);
        // Should also clean the press anim timeouts
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
                        onChange={event => this.setState({
                            bagSpawnSpeed: Math.max(event.target.value, 23000 / this.state.bagPlayBackSpeed / this.state.bagAnimSeqPool.length)})}
                    />
                    <TextField
                        id="outlined-number"
                        label="Conveyor Belt Speed"
                        type="number"
                        InputLabelProps={{
                            shrink: true,//
                        }}
                        value={this.state.bagPlayBackSpeed}
                        onChange={event => this.setState({bagPlayBackSpeed: Math.max(event.target.value, 0.001)})}
                    />
                </Row>
                <Divider className="margin-bottom" />
                <Row className="margin-bottom">
                    <Button
                        color={this.state.isAutomaticPlaying ? "secondary" : "primary"}
                        variant={"contained"}
                        onClick={this.state.isAutomaticPlaying ? this.pauseAutomaticBagAnim : this.startAutomaticBagAnim}
                    >
                        {this.state.isAutomaticPlaying ? "PAUSE AUTO" : "PLAY AUTO"}
                    </Button>
                    <Button
                        color="secondary"
                        variant={"contained"}
                        onClick={this.stopAllBagAnims}
                    >
                        CANCEL ANIMS
                    </Button>
                </Row>
                <Row>
                    <Button
                            color="primary"
                            variant={"contained"}
                            onClick={this.playSingleBagAnim}
                        >
                        SPAWN SINGLE
                    </Button>
                </Row>
                <Row>
                    <Button
                        color="tertiary"
                        variant={"contained"}
                        onClick={this.playPressAnim}
                    >
                        RELOAD ANIM POOL
                    </Button>
                </Row>
                <Divider className="margin-bottom" />
                <Row>
                    <p className="fix-align red-text">{this.state.error}</p>
                </Row>
            </Column>
        );
    }
}

    //--------------------------------------------------------------------------
    /*spawnBag = async () => {
        const entityTemplate = new SDK3DVerse.EntityTemplate();
        entityTemplate.attachComponent('scene_ref', { value : bagSceneReferenceUUID});
        const entity = await entityTemplate.instantiateEntity(name, parentEntity)
    }*/
