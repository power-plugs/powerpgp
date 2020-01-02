const { React } = require('powercord/webpack');
const { TextInput } = require('powercord/components/settings');
const TextArea = require("./TextArea")

module.exports = class Settings extends React.Component {
    constructor(props) {
        super();

        this.settings = props.settings;
    }

    render() {
        return (
            <div>
                <TextArea autoCorrect="off" note="Public Key" value={this.settings.get("pubkey")} rows={6} onChange={val => this.settings.set("pubkey", val)}></TextArea>
                <TextArea autoCorrect="off" note="Private Key" value={this.settings.get("privkey")} rows={6} onChange={val => this.settings.set("privkey", val)}></TextArea>
                <TextInput autoCorrect="off" note="Passphrase" value={this.settings.get("passphrase")} onChange={val => this.settings.set("passphrase", val)} readonly={true}></TextInput>
            </div>
        );
    }
};