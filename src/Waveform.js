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

        fetch('https://api.spotify.com/v1/audio-analysis/' + (global.songId || '2EEinN4Zk8MUv4OQuLsTBj'), {
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
        if (data.error) return;
        
        var c = document.getElementById("display");
        var ctx = c.getContext("2d");
        c.setAttribute('height', window.getComputedStyle(c, null).getPropertyValue("height"));
        var width = c.width;
        var height = c.height;
        var duration = data.track.duration;
        var heightInc = height/duration;
        ctx.beginPath();
        ctx.moveTo(width/2, 0)
        var i = 0;
        var amplitude;
        //
        data.segments.forEach((segment) => {
            amplitude = (width / 2) + (segment.loudness_max * 5);
            ctx.lineTo(Math.round(amplitude % width), (i += segment.duration * heightInc));
        })
        ctx.stroke();

    }



    render() {
        return (
            <div className={`WaveformPanel ${this.state.isPanelVisible ? "open" : "closed"}` }>
                <div className="leftHandle" onClick={this.togglePanel}></div>

                <div className="WaveFormBox">
                    <button onClick={this.requestWaveform}>Generate</button>
                    <canvas id="display"/>
                </div>
            </div>
        );
    }
}

export default Waveform