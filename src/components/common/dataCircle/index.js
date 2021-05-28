import { info } from "../../../assets/svg"
import { comparePrCycle } from "../../../utils/pr-calculations";
import HtmlTooltip from "../htmlTooltip"

const DataCircle = ({title,previous,current,tooltipData,reverse=false,prCycle=false}) => {
    return <div className="col-md-3">
        <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer">
            <div className="info">
                <HtmlTooltip
                    placement="top-end"
                    title={tooltipData}
                    arrow>
                    <img src={info} alt={"info"}/>
                </HtmlTooltip>
            </div>
            <div className="card-body" style={{padding:'11px'}}>
                <div className={prCycle ? (comparePrCycle(previous,current) ? "row pr-cycle red" : "row pr-cycle green") : (previous > current && !reverse) ? "row pr-cycle red" : "row pr-cycle green"}>
                    <div className="pr-cycle-circle">
                        <div className="old-data">
                            {previous}
                        </div>
                        <div className="new-data">
                            {current}
                        </div>
                    </div>
                    <div className="pr-cycle-title">
                        {title}
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default DataCircle;