import CountUp from 'react-countup';

import './common.css';

const CircleIndicator = ({text,background,size,end}) => {
    return <div className="circular-div">
        <div className="circle align-center white-text" style={{backgroundColor:background,width:size,height:size}}>
            <CountUp end={end}/>
            <hr/>
            <span className="circular-text-below">{text}</span>
        </div>
    </div>
}

export default CircleIndicator;