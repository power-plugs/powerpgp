const { React, getModuleByDisplayName } = require('powercord/webpack');
const { TextInput } = require('powercord/components/settings');
const { Card, AsyncComponent } = require('powercord/components');
const TextArea = require("./TextArea")

module.exports = class Settings extends React.Component {
    constructor(props) {
        super();

        this.settings = props.settings;
    }

    render() {
        return (
            <div>
                <TextArea autoCorrect="off" value={this.settings.get("pubkey")}  rows={6} onChange={val => this.settings.set("pubkey" , val)}>Public Key</TextArea>
                <TextArea autoCorrect="off" value={this.settings.get("privkey")} rows={6} onChange={val => this.settings.set("privkey", val)} note={<><b style={{ color: 'rgb(240, 71, 71)' }}>WARNING:</b> Sharing this key will allow anyone to sign any message in your name.</>}>Private Key</TextArea>
                <TextInput type="password" autoCorrect="off" value={this.settings.get("passphrase")} onChange={val => this.settings.set("passphrase", val)} readonly={true}>Passphrase</TextInput>
            </div>
        );
    }
};