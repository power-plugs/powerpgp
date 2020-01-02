const React = require('powercord/webpack').React;
const getModule = require('powercord/webpack').getModule;
const Plugin = require('powercord/entities').Plugin;
const nw = require("./lib/niceware");
const kbpgp = require("./lib/kbpgp");
const Settings = require("./components/Settings.jsx");

module.exports = class PowerPGP extends Plugin {
    generating = false;

    startPlugin() {
        this.registerSettings('pc-powerpgp', 'PGP Config', () => React.createElement(Settings, {
            settings: this.settings
        }));

        this.registerCommand('sign', [], 'Sign text using PGP', '', (args) => {
            var c = require('powercord/webpack').channels.getChannelId();
            if (!this.settings.get("privkey") && !this.settings.get("pubkey") && !this.generating) return this.genKeys();
            if (!this.settings.get("privkey") && !this.settings.get("pubkey") && this.generating) return;
            var sendMessage = text => {
                const upload = getModule(['instantBatchUpload'], false).upload;
                const final = new File([this.settings.get("pubkey")], 'public.key');
                upload(c, final, {
                    content: text,
                    invalidEmojis: [],
                    tts: false
                }, false);
            }
            this.sign(args.join(" "), sendMessage);
        });
    }

    genKeys() {
        this.generating = true;

        const user = getModule(['getCurrentUser'], false).getCurrentUser();

        this.settings.set("passphrase", nw.generatePassphrase(18).join(" "));
        var opts = {
            userid: `${user.tag} (${user.id})`,
            primary: {
                nbits: 2048,
                flags: 2,
                expire_in: 0
            },
            subkeys: []
        };
        kbpgp.KeyManager.generate(opts, (err, keys) => {
            if (!err) {
                keys.sign({}, (err) => {
                    keys.export_pgp_private({
                        passphrase: this.settings.get("passphrase")
                    }, (err, privkey) => {
                        this.settings.set("privkey", privkey.trim());
                    });
                    keys.export_pgp_public({}, (err, pubkey) => {
                        this.settings.set("pubkey", pubkey.trim());
                    });
                });
            }
        });
    }

    sign(text, callback) {
        var settings = this.settings;
        kbpgp.KeyManager.import_from_armored_pgp({
            armored: settings.get("privkey")
        }, function (err, key) {
            if (!err) {
                if (key.is_pgp_locked()) {
                    key.unlock_pgp({
                        passphrase: settings.get("passphrase")
                    }, function (err) {
                        if (!err) {
                            var params = {
                                msg: text,
                                signing_key: key.find_signing_pgp_key(),
                            };

                            kbpgp.clearsign(params, function (err, msg) {
                                callback("```" + msg + "```");
                            });
                        } else {
                            console.error(err);
                        }
                    });
                }
            } else {
                console.error(err);
            }
        });
    };
};