import ReactPlayer from 'react-player'

export const VideoPlayer = (props) => {
    return (
        <>
            <ReactPlayer playing={props.play} playbackRate={props.playBackRate} url="https://www.youtube.com/watch?v=Eu_DeFKc0oc"></ReactPlayer>
        </>
    )
}