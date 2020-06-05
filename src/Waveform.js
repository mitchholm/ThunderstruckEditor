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

    findValue = (segment) => {
        return (segment.loudness_max + segment.loudness_start + segment.loudness_end + 60);
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
        var songLow = 0, songHigh = 0;
        ctx.moveTo(width / 2, 0)
        data.segments.forEach((segment) => {
            if(segment.loudness_max > songHigh)
                songHigh = segment.loudness_max
            if (segment.loudness > songHigh)
                songHigh = segment.loudness
            if (segment.loudness_max < songLow)
                songLow = segment.loudness_max;
            if (segment.loudness < songLow)
                songLow = segment.loudness;
        })

        var exp = 5;
        var max = Math.pow(songHigh-songLow, exp);
        var center = width / 2;
        var scalar = center/max;

        data.segments.forEach((segment) => {
            ctx.lineTo(center - scalar * Math.pow(segment.loudness_start-songLow, exp), (i += segment.duration * heightInc));
            ctx.lineTo(center - scalar * Math.pow(segment.loudness_max-songLow, exp), (i + segment.loudness_max_time * heightInc));

        })

        ctx.lineTo((width / 2), i);
        ctx.lineTo((width / 2), 0);
        ctx.fillStyle = "grey";
        ctx.fill();

        ctx.beginPath();
        i=0;

        data.segments.forEach((segment) => {
            ctx.lineTo(center + scalar * Math.pow(segment.loudness_start - songLow, exp), (i += segment.duration * heightInc));
            ctx.lineTo(center + scalar * Math.pow(segment.loudness_max - songLow, exp), (i + segment.loudness_max_time * heightInc));

        })

        ctx.lineTo((width / 2), i);
        ctx.lineTo((width / 2), 0);
        ctx.fillStyle = "grey";
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