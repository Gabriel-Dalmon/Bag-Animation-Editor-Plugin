const newAnimUUID = "";

const referenceAnimUUID = "1ca66035-cd81-4e76-8a77-f10524525777"

const apiURL = (SDK3DVerse.webAPI.apiURL).replace("http", "ws");
const token = SDK3DVerse.webAPI.apiToken;
const assetType = "animationSequence"


var socket = new WebSocket(`${apiURL}/asset/edit?token=${token}&assetType=${assetType}&assetUUID=${newAnimUUID}`);
socket.binaryType	= 'arraybuffer';
socket.onmessage = (message) => {const payload = JSON.parse(message.data);const error     = (payload.type === "error" && payload.message) || (payload.errorNum && payload); console.log(payload, error) }


const newAnim = await SDK3DVerse.webAPI.getAssetDescription('animationSequence', newAnimUUID);

const referenceAnim = await SDK3DVerse.webAPI.getAssetDescription('animationSequence', referenceAnimUUID);

const updatedTracks = referenceAnim.tracks.map(track => ({...track, "slotName":newAnim.tracks[0].slotName}));

const updatedAssetDescription = {...newAnim, tracks:updatedTracks};

socket.send(JSON.stringify({type: "update-asset", data:{description:updatedAssetDescription, doCommit:true, reloadAsset:false}}));

socket.close();