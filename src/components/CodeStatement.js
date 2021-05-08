import React from 'react'

const CodeStatement = ({ coordinates }) => {
    return (
        <div className="codefont" id="code-output">
            {`\\usetikzlibrary{hobby} %excellent drawing algorithm`} <br />
            {`\\begin{tikzpicture}`} <br />
            {coordinates}
            {`\\end{tikzpicture}`}
            
        </div>
    )
}

export default CodeStatement
