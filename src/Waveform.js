import React from 'react';
import './Waveform.css';


class Waveform extends React.Component {
    state = {
        isPanelVisible: true
    };

    togglePanel = () => {
        this.setState(prevState => ({ isPanelVisible: !prevState.isPanelVisible }));
    };

    requestWaveform = () => {
        let global = this.props.getState();
        console.log(global)

        fetch('https://api.spotify.com/v1/audio-analysis/' + global.songId, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer ' + (global.accessToken || document.cookie.split(':')[2])
            }
        })
        .then(value => value.json())
        .then(data => this.generateWaveform(data))
        .catch(error => console.log(error))
    }

    generateWaveform = (data) => {
        console.log(data)
    }



    render() {
        return (
            <div className={`WaveformPanel ${this.state.isPanelVisible ? "open" : "closed"}` }>
                <div className="leftHandle" onClick={this.togglePanel}></div>

                <div className="WaveFormBox">
                    <button onClick={this.requestWaveform}>Generate</button>
                </div>
            </div>
        );
    }
}

export default Waveform