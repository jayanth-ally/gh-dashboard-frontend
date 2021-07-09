import DataCircle from "."
import { convertTimeToDays } from "../../../utils/time-conversion";

const DataCircles = ({current,previous,tooltipData}) => {

    const currentCycle = convertTimeToDays(current.prCycle.avg);
    const previousCycle = convertTimeToDays(previous.prCycle.avg);

    const currentResolved = current.count.closed + current.count.merged;
    const previousResolved = previous.count.closed + previous.count.merged;

    return <div className="container">
        <div className="flex-container row">
                <DataCircle 
                    title="PR Cycle"
                    previous={previousCycle}
                    current={currentCycle}
                    tooltipData={<p>
                        Average no of time to close a PR
                        <br/> ({tooltipData.previous} / {tooltipData.current})<br/>
                        <br/> Time taken to close a PR 
                        <br/> below 4hrs are not considered</p>}
                    prCycle={true}
                />
                <DataCircle 
                    title="Resolved"
                    previous={previousResolved}
                    current={currentResolved}
                    tooltipData={<p>
                        Average PR resolved
                        <br/> in {tooltipData.current}</p>}
                />
                <DataCircle 
                    title="PRs Merged"
                    previous={previous.count.merged}
                    current={current.count.merged}
                    tooltipData={<p>
                        Average PR merged
                        <br/> in {tooltipData.current}</p>}
                />
                <DataCircle 
                    title="Review Comments"
                    previous={previous.reviews.total}
                    current={current.reviews.total}
                    tooltipData={<p>
                        Average PR Review
                        <br/>Comments in {tooltipData.current}</p>}
                />
                <DataCircle 
                    title="PRs Reviewed"
                    previous={previous.reviews.count}
                    current={current.reviews.count}
                    tooltipData={<p>
                        Total no of PR 
                        <br/>reviewed in {tooltipData.current}</p>}
                />
                <DataCircle 
                    title="Commits Reverted"
                    previous={previous.commits.reverts}
                    current={current.commits.reverts}
                    tooltipData={<p>
                        Total reverts 
                        <br/>in {tooltipData.current}</p>}
                    reverse={true}
                />
                <DataCircle 
                    title="Additions"
                    previous={previous.files.additions}
                    current={current.files.additions}
                    tooltipData={<p>
                        Total no of lines
                        <br/>added in {tooltipData.current}</p>}
                />
                <DataCircle 
                    title="Deletions"
                    previous={previous.files.deletions}
                    current={current.files.deletions}
                    tooltipData={<p>
                        Total no of lines
                        <br/>deleted in {tooltipData.current}</p>}
                    reverse={true}
                />
        </div>
    </div>
}

export default DataCircles;