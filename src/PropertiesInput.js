import React from 'react';
import './PropertiesInput.css';


class PropertiesInput extends React.Component {
    state = {
        isPanelVisible: true,
        spotifyLogin: null,
        accessToken: null
    };

    togglePanel = () => {
        this.setState(prevState => ({ isPanelVisible: !prevState.isPanelVisible }));
    };

    handleChange(key, event) {
        let val = {};
        val[key] = event.target.value;
        this.setState(val);
    }

    handleGlobalChange(key, event) {
        let val = {};
        val[key] = event.target.value;
        this.setState(val);
        this.props.mergeState(val);
    }

    SpotifyAuthenticate = async () => {
        let clientId = this.state.clientId;
        let clientSecret = this.state.clientSecret;

        if (!clientId || !clientSecret){
            clientId = document.cookie.split(':')[0];
            clientSecret = document.cookie.split(':')[1];
        }

        let url = 'https://accounts.spotify.com/api/token?grant_type=client_credentials';
        fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            }
        })
        .then(response => response.json())
        .then((response) => {
            if(response.error) return;
            this.state.access_token = response.access_token;
            if (this.state.clientId && this.state.clientSecret)
                document.cookie = this.state.clientId + ':' + this.state.clientSecret + ":" + response.access_token;
            this.setState({
                accessToken: response.access_token,
                spotifyLogin: 'valid'
            });
            this.props.mergeState({ accessToken: response.access_token })
        })
        .catch(error => {
            this.setState({spotifyLogin: 'invalid'});
            console.log(error)
        });
    }

    render() {
        return (
            <div className={`PropertiesInputPanel ${this.state.isPanelVisible ? " open" : "closed"}` }>
                <div className="rightHandle" onClick={this.togglePanel}></div>
                <div className="inputArea">
                    <input type="text" className={this.state.spotifyLogin} onChange={(e) => this.handleChange('clientId', e)}  placeholder="Spotify Client ID" />
                    <input type="text" className={this.state.spotifyLogin} onChange={(e) => this.handleChange('clientSecret', e)}  placeholder="Spotify Client Secret" />
                    <input type="text" onChange={(e) => this.handleGlobalChange('songId', e)} placeholder="Song ID" />
                    <input type="text" onChange={(e) => this.handleGlobalChange('width', e)} placeholder="Lights on the Strip" />
                    <input type="text" onChange={(e) => this.handleGlobalChange('resolution', e)} placeholder="Lights per pixel" />
                    <input type="text" onChange={(e) => this.handleGlobalChange('refreshRate', e)} placeholder="Light Refresh Rate (Hz)" />

                    <button onClick={() => this.SpotifyAuthenticate()}>Authenticate</button>
                </div>
            </div>
        );
    }
}

export default PropertiesInput