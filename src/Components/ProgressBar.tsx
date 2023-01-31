type props = {
    barWidth: string
}
export default ({barWidth}:props) => {
    return (
        <>
            <div className="progress">
                <div className="progress-bar" role="progressbar" aria-label="Example with label" style={{width: `${barWidth}%`}} >{barWidth}%</div>
            </div>
        </>
    )
}