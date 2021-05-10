import React from 'react'

const CodeStatement = ({ codeStatements, currCodeStatement, colors }) => {
    console.log(codeStatements.length);

    const formatPoints = (points) => {
        let coordPts = points.map(({x, y}) => `(${x/10},${y/10})`);
        return coordPts.join(' ');
    }
    return (
        <div className="codefont" id="code-output">
            {`\\usetikzlibrary{hobby} %excellent drawing algorithm`} <br />
            {`\\begin{tikzpicture}`} <br />
            {/* previous code statements */}
            {codeStatements.map((cs, ind) => (
                <div style={{color: colors[ind]}} key={ind}>
                    {`${cs.preamble} ${formatPoints(cs.points)} ${cs.end}`}
                </div>
            ))}
            {/* curr code statement */}
            <div style={{color: colors[codeStatements.length]}} key={codeStatements.length}>
                {`${currCodeStatement.preamble} ${formatPoints(currCodeStatement.points)} ${currCodeStatement.end}`}
            </div>
            {`\\end{tikzpicture}`}
            
        </div>
    )
}

export default CodeStatement
