import { TimeBlock } from './parseFile'
const getIdleTime = (schedule: TimeBlock[], totalTime: number): number => {
    if(!Number.isFinite(totalTime) || totalTime <= 0){
        return 0
    }
    let totalPlannedTime: number = 0
    let currStart = 0
    let reach = 0
    for(const timeblock of schedule){
        // Reach variable to handle overlapping time intervals
        if(timeblock.startTime<reach){
            reach = Math.max(reach, timeblock.endTime)
        }
        else{
            totalPlannedTime += reach -currStart
            currStart = timeblock.startTime
            reach = timeblock.endTime
        }
    }
    totalPlannedTime +=reach-currStart
    return Math.max(0, totalTime - totalPlannedTime)
}

export default getIdleTime