import { App, TFile } from "obsidian"
import getIdleTime from "./getIdleTime"
                          
export interface TimeBlock {
    name: string,
    startTime: number,
    endTime: number,
    completed: boolean,
    priority: boolean,
}

const parseFile = async (app: App, file: TFile) => {
    
    const schedule: TimeBlock[] = []
    
    function getTime(val: string, ind: number): { time: number, newInd: number, star: boolean} {
        try{
            while(ind < val.length && val[ind] === ' '){
                ind++;
            }

            const tokenStart = ind;
            let token = '';
            while(ind < val.length && val[ind] !== ' ' && val[ind] !== '-'){
                token += val[ind];
                ind++;
            }

            token = token.trim().toLowerCase();
            if(token === ''){
                return {
                    time: -1,
                    newInd: -1,
                    star: false
                }
            }

            let star = false;
            if(token.endsWith('*')){
                star = true;
                token = token.slice(0, -1);
            }

            let hour = -1;
            let minute = 0;

            // 12h/24h with optional minutes: 2pm, 2:30pm, 14, 14:30
            const commonMatch = token.match(/^(\d{1,2})(?::(\d{1,2}))?(am|pm)?$/);
            if(commonMatch){
                hour = Number(commonMatch[1]);
                minute = commonMatch[2] ? Number(commonMatch[2]) : 0;
                const meridiem = commonMatch[3];

                if(!Number.isInteger(hour) || !Number.isInteger(minute) || minute < 0 || minute >= 60){
                    return { time: -1, newInd: -1, star: false };
                }

                if(meridiem){
                    if(hour < 1 || hour > 12){
                        return { time: -1, newInd: -1, star: false };
                    }
                    if(meridiem === 'am'){
                        if(hour === 12) hour = 0;
                    } else {
                        if(hour !== 12) hour += 12;
                    }
                } else {
                    if(hour < 0 || hour > 23){
                        return { time: -1, newInd: -1, star: false };
                    }
                }
            } else {
                // Compact military format: 930 => 09:30, 1430 => 14:30
                const compactMatch = token.match(/^(\d{3,4})$/);
                if(!compactMatch){
                    return { time: -1, newInd: -1, star: false };
                }
                const digits = token;
                if(digits.length === 3){
                    hour = Number(digits.slice(0, 1));
                    minute = Number(digits.slice(1));
                } else {
                    hour = Number(digits.slice(0, 2));
                    minute = Number(digits.slice(2));
                }
                if(!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute >= 60){
                    return { time: -1, newInd: -1, star: false };
                }
            }

            const time = hour * 60 + minute;
            if(!Number.isFinite(time)){
                return { time: -1, newInd: -1, star: false };
            }

            return {
                time,
                newInd: ind > tokenStart ? ind : -1,
                star
            }
        }
        catch {
            return {
                time: -1,
                newInd: -1,
                star: false
            }
        } 
    }

    function addToSchedule(val: string): boolean{
        val = val.trim();
        // Accept both "9:30pm" and shorthand like "9pm", so don't require colons.
        if(!val.includes('-') || val===''){
            return false;
        }
        //console.log(val)
        let startTime;
        let endTime;
        let name;
        
        let ind = 0;
        const len = val.length
        let completed = false
        while(ind<len && val[ind] !== '['){
            ind++
        }
        while(ind<len && val[ind] !== ']'){
            if(val[ind] === 'x'){
                completed = true
            }
            ind++
        }
        while(ind<len && (val[ind] === ' ' || isNaN(Number(val[ind])))){
            ind++;
        }
        if( ind ===len ) return false;
        let ret = getTime(val, ind);
        if(ret.newInd === -1) return false;
        startTime = ret.time;
        if(!Number.isFinite(startTime)) return false;
        ind = ret.newInd;
        //console.log(startTime)
        while(ind<len && (val[ind] === ' ' || isNaN(Number(val[ind])))){
            ind++;
        }
        if( ind ===len ) return false;
        ret = getTime(val, ind);
        if(ret.newInd === -1) return false;
        endTime = ret.time;
        if(!Number.isFinite(endTime)) return false;
        if(endTime<=startTime){
            endTime+=1440
        }
        if(!Number.isFinite(endTime)) return false;
        ind = ret.newInd;
        //console.log(endTime)
        while(val[ind]===' '){
            ind++;
        }
        let end = ind;
        while(end<len){
            if(val[end] == '/' && val[end-1] == '/'){
                end-=1;
                break;
            }
            end++;
        }
        name = val.substring(ind, end)
        //console.log(name)
        schedule.push({
            name: name,
            startTime: startTime,
            endTime: endTime,
            completed: completed, //placeholder,
            priority: ret.star //placeholder
        })
        return true;
    }

    async function parse() {
        const contents: string = await app.vault.read(file);
        let lines: string[] = contents.split(/\r?\n/)
        let minTime = 1440;
        let maxTime = 0;
        let hasValidTimes = false;
        lines.forEach(val => {
            if(addToSchedule(val)){
                const latestEntry = schedule[schedule.length-1]!;
                if(Number.isFinite(latestEntry.startTime) && Number.isFinite(latestEntry.endTime)){
                    minTime = Math.min(minTime, latestEntry.startTime)
                    maxTime = Math.max(maxTime, latestEntry.endTime)
                    hasValidTimes = true;
                }
            }
        });
        return {
            minTime: hasValidTimes ? minTime : Number.NaN,
            maxTime: hasValidTimes ? maxTime : Number.NaN
        }
    }
    const criticalTimes = await parse();
    schedule.sort((a, b) => a.startTime - b.startTime)
    const date = file.basename
    return {
        schedule,
        date,
        earliest: criticalTimes.minTime,
        latest: criticalTimes.maxTime,
        idle: getIdleTime(schedule, criticalTimes.maxTime - criticalTimes.minTime)
    }
}

export default parseFile