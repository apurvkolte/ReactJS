import Parser from 'html-react-parser';
var thisIsMyCopy = '<p>copy copy copy <strong>strong copy</strong></p>';


return (
    <div className="content">{Parser(thisIsMyCopy)}</div>
);