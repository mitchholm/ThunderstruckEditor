import React from 'react';
import './Waveform.css';


class Waveform extends React.Component {
    state = {
        isPanelVisible: true
    };

    togglePanel = () => {
        this.setState(prevState => ({ isPanelVisible: !prevState.isPanelVisible }));
    };

    parseSongId = (id) => {
        if (!id)
            return;
        else if (id.length === 22)
            return id;
        else if (id.includes('track'))
            return id.slice(-22);
    }

    requestWaveform = () => {
        let global = this.props.getState();
        console.log(global)

        fetch('https://api.spotify.com/v1/audio-analysis/' + (this.parseSongId(global.songId) || '57bgtoPSgt236HzfBOd8kj'), {
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

    requestPlayback = () => {
        this.playback('test')

    }

    playback = (data) => {
        console.log(data)

        var dataUrl = document.getElementById("display").toDataURL();
        var img = document.createElement('img');
        img.src = dataUrl;
        document.getElementById('ImageEditor').appendChild(img);


    }

    generateWaveform = (data) => {
        console.log(data)
        if (data.error) return;
        
        var c = document.getElementById("display");
        var ctx = c.getContext("2d");

        var heightInc = 10;

        c.height = data.track.duration * heightInc;
        console.log("Setting height to " + data.track.duration * heightInc)
        
        var width = c.width;

        ctx.beginPath();
        var i = 0;
        var amplitude;
        ctx.moveTo(width / 2, 0)

        data.segments.forEach((segment) => {
            amplitude = (width / 2) + (segment.loudness_start * 3);
            ctx.lineTo(Math.round(amplitude % width), (i += segment.duration * heightInc));
        })
        ctx.lineTo((width / 2), i);
        ctx.lineTo((width / 2), 0);

        ctx.fillStyle = "pink";
        ctx.fill();

        i = 0;
        ctx.beginPath();
        ctx.moveTo(width / 2, 0)
        data.segments.forEach((segment) => {
            amplitude = (width / 2) - (segment.loudness_start * 3);
            ctx.lineTo(Math.round(amplitude), (i += segment.duration * heightInc));
        })
        ctx.lineTo((width / 2), i);
        ctx.lineTo((width / 2), 0);

        ctx.fillStyle = "pink";
        ctx.fill();

    }

    render() {
        return (
            <div className={`WaveformPanel ${this.state.isPanelVisible ? "open" : "closed"}` }>
                <div className="leftHandle" onClick={this.togglePanel}></div>

                <div className="WaveFormBox">
                    <button onClick={this.requestWaveform}>Generate</button>
                    <button onClick={this.requestPlayback}>Playback</button>
                    <canvas id="display"/>
                </div>
            </div>
        );
    }
}

export default Waveform